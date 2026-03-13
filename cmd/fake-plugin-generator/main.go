package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/common-nighthawk/go-figure"
)

type stage int

const (
	stageForm stage = iota
	stageConfirm
	stageGenerating
	stageDone
	stageError
)

var (
	bannerStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("99")).Bold(true)
	appTitleStyle  = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("205"))
	helpStyle      = lipgloss.NewStyle().Foreground(lipgloss.Color("240"))
	labelStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("69")).Bold(true)
	valueStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("252"))
	focusRowStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("255")).Bold(true)
	focusMarkStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("45")).Bold(true)
	idleMarkStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("238"))
	cardStyle      = lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("63")).Padding(1, 2)
	sectionStyle   = lipgloss.NewStyle().Border(lipgloss.RoundedBorder()).BorderForeground(lipgloss.Color("62")).Padding(0, 1)
	errorStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("196")).Bold(true)
	okStyle        = lipgloss.NewStyle().Foreground(lipgloss.Color("42")).Bold(true)
	mutedStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("244"))
	inputTextStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("252"))
	inputHintStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("244"))
	inputFocusText = lipgloss.NewStyle().Foreground(lipgloss.Color("230")).Bold(true)
	typePillStyle  = lipgloss.NewStyle().Foreground(lipgloss.Color("230")).Background(lipgloss.Color("57")).Padding(0, 1)
)

type field struct {
	label       string
	key         string
	value       string
	placeholder string
}

type model struct {
	stage      stage
	fields     []field
	inputs     []textinput.Model
	focus      int
	typeIndex  int
	types      []string
	width      int
	height     int
	err        error
	createdDir string
	created    []string
	startedAt  time.Time
	banner     string
}

type generatedMsg struct {
	path  string
	files []string
	err   error
}

func initialModel() model {
	fields := []field{
		{label: "Plugin Slug", key: "slug", placeholder: "awesome-plugin"},
		{label: "Display Name", key: "name", placeholder: "Awesome Plugin"},
		{label: "Author", key: "author", placeholder: "Dev Team"},
		{label: "Description", key: "description", placeholder: "Generated plugin demo."},
		{label: "Plugin Type", key: "type", placeholder: "driver"},
		{label: "Output Dir", key: "output", placeholder: "./generated-plugins"},
	}

	inputs := make([]textinput.Model, len(fields))
	defaults := map[string]string{
		"slug":        "awesome-plugin",
		"name":        "Awesome Plugin",
		"author":      "Dev Team",
		"description": "Generated plugin demo.",
		"output":      "./generated-plugins",
	}

	for i, f := range fields {
		if f.key == "type" {
			continue
		}
		ti := textinput.New()
		ti.Prompt = ""
		ti.Placeholder = f.placeholder
		ti.SetValue(defaults[f.key])
		ti.CharLimit = 240
		ti.Cursor.Style = lipgloss.NewStyle().Foreground(lipgloss.Color("205"))
		ti.TextStyle = inputTextStyle
		ti.PlaceholderStyle = inputHintStyle
		inputs[i] = ti
	}

	m := model{
		stage:     stageForm,
		fields:    fields,
		inputs:    inputs,
		types:     []string{"driver", "service", "utility", "widget"},
		typeIndex: 0,
		startedAt: time.Now(),
		banner:    figure.NewFigure("RUBIX", "small", true).String(),
	}
	m.applyFocus()
	return m
}

func (m model) Init() tea.Cmd {
	return textinput.Blink
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		m.resizeInputs()
		return m, nil

	case tea.KeyMsg:
		switch m.stage {
		case stageForm:
			return m.updateForm(msg)
		case stageConfirm:
			return m.updateConfirm(msg)
		case stageDone, stageError:
			if keyMatches(msg, "q", "ctrl+c", "esc", "enter") {
				return m, tea.Quit
			}
		}

	case generatedMsg:
		if msg.err != nil {
			m.err = msg.err
			m.stage = stageError
			return m, nil
		}
		m.createdDir = msg.path
		m.created = msg.files
		m.stage = stageDone
		return m, nil
	}

	if m.stage == stageForm && m.fields[m.focus].key != "type" {
		var cmd tea.Cmd
		m.inputs[m.focus], cmd = m.inputs[m.focus].Update(msg)
		return m, cmd
	}

	return m, nil
}

func (m model) updateForm(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if keyMatches(msg, "ctrl+c", "q") {
		return m, tea.Quit
	}

	if keyMatches(msg, "up", "shift+tab") {
		if m.focus > 0 {
			m.focus--
			m.applyFocus()
		}
		return m, nil
	}

	if keyMatches(msg, "down", "tab") {
		if m.focus < len(m.fields)-1 {
			m.focus++
			m.applyFocus()
		}
		return m, nil
	}

	if keyMatches(msg, "enter") {
		if m.focus == len(m.fields)-1 {
			m.stage = stageConfirm
			return m, nil
		}
		m.focus++
		m.applyFocus()
		return m, nil
	}

	if m.fields[m.focus].key == "type" {
		if keyMatches(msg, "left", "h") {
			if m.typeIndex > 0 {
				m.typeIndex--
			} else {
				m.typeIndex = len(m.types) - 1
			}
			return m, nil
		}
		if keyMatches(msg, "right", "l") {
			m.typeIndex = (m.typeIndex + 1) % len(m.types)
			return m, nil
		}
		return m, nil
	}

	if keyMatches(msg, "ctrl+u") {
		m.inputs[m.focus].SetValue("")
		return m, nil
	}

	var cmd tea.Cmd
	m.inputs[m.focus], cmd = m.inputs[m.focus].Update(msg)
	return m, cmd
}

func (m model) updateConfirm(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	if keyMatches(msg, "ctrl+c", "q", "esc") {
		return m, tea.Quit
	}

	if keyMatches(msg, "e", "backspace") {
		m.stage = stageForm
		m.focus = 0
		m.applyFocus()
		return m, nil
	}

	if keyMatches(msg, "g", "enter") {
		plugin, err := m.toPluginSpec()
		if err != nil {
			m.err = err
			m.stage = stageError
			return m, nil
		}

		m.stage = stageGenerating
		return m, generatePluginCmd(plugin)
	}

	return m, nil
}

func (m model) View() string {
	header := appTitleStyle.Render("⚡ Fake Plugin Generator")
	sub := mutedStyle.Render("Bubble Tea + Lip Gloss demo for plugin developers")
	banner := bannerStyle.Render(strings.TrimRight(m.banner, "\n"))

	var body string
	switch m.stage {
	case stageForm:
		body = m.renderForm()
	case stageConfirm:
		body = m.renderConfirm()
	case stageGenerating:
		body = m.renderGenerating()
	case stageDone:
		body = m.renderDone()
	case stageError:
		body = m.renderError()
	}

	content := lipgloss.JoinVertical(lipgloss.Left, banner, "", header, sub, "", body)
	return cardStyle.Render(content)
}

func (m model) renderForm() string {
	var lines []string
	lines = append(lines, labelStyle.Render("Step 1/2 · Configure your fake plugin"))
	lines = append(lines, "")

	for i, f := range m.fields {
		left := fmt.Sprintf("%s:", f.label)

		var value string
		if f.key == "type" {
			value = typePillStyle.Render(m.types[m.typeIndex])
		} else {
			value = m.inputs[i].View()
		}

		prefix := idleMarkStyle.Render("  ")
		line := fmt.Sprintf("%s %-14s %s", prefix, left, value)
		if i == m.focus {
			prefix = focusMarkStyle.Render("› ")
			line = fmt.Sprintf("%s %-14s %s", prefix, left, value)
			line = focusRowStyle.Render(line)
		}
		lines = append(lines, line)
	}
	formBlock := sectionStyle.Render(strings.Join(lines, "\n"))
	controls := lipgloss.JoinVertical(
		lipgloss.Left,
		helpStyle.Render("Tab/Shift+Tab move · Enter next · Ctrl+U clear field · q quit"),
		helpStyle.Render("On Plugin Type: ←/→ (or h/l) to cycle options"),
	)
	return lipgloss.JoinVertical(lipgloss.Left, formBlock, "", controls)
}

func (m model) renderConfirm() string {
	var lines []string
	lines = append(lines, labelStyle.Render("Step 2/2 · Review"))
	lines = append(lines, "")
	for _, f := range m.fields {
		v := m.getFieldValue(f)
		lines = append(lines, fmt.Sprintf("%-14s %s", f.label+":", valueStyle.Render(v)))
	}
	lines = append(lines, "")
	lines = append(lines, helpStyle.Render("Press g (or Enter) to generate · e to edit · q to quit"))
	return strings.Join(lines, "\n")
}

func (m model) renderGenerating() string {
	elapsed := time.Since(m.startedAt).Round(time.Millisecond)
	spinnerFrames := []string{"⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"}
	idx := int(time.Now().UnixNano()/1e8) % len(spinnerFrames)
	return strings.Join([]string{
		labelStyle.Render("Generating fake plugin scaffold..."),
		"",
		fmt.Sprintf("%s Writing files and folders", spinnerFrames[idx]),
		mutedStyle.Render(fmt.Sprintf("session: %s", elapsed)),
	}, "\n")
}

func (m model) renderDone() string {
	var lines []string
	lines = append(lines, okStyle.Render("✔ Plugin scaffold generated"))
	lines = append(lines, "")
	lines = append(lines, fmt.Sprintf("Output: %s", valueStyle.Render(m.createdDir)))
	lines = append(lines, "")
	lines = append(lines, labelStyle.Render("Created files:"))
	for _, f := range m.created {
		lines = append(lines, "  • "+f)
	}
	lines = append(lines, "")
	lines = append(lines, helpStyle.Render("Press Enter or q to exit"))
	return strings.Join(lines, "\n")
}

func (m model) renderError() string {
	msg := "unknown error"
	if m.err != nil {
		msg = m.err.Error()
	}
	return strings.Join([]string{
		errorStyle.Render("✖ Generation failed"),
		"",
		msg,
		"",
		helpStyle.Render("Press Enter or q to exit"),
	}, "\n")
}

type pluginSpec struct {
	Slug        string
	Name        string
	Author      string
	Description string
	Type        string
	OutputDir   string
}

func (m model) toPluginSpec() (pluginSpec, error) {
	values := map[string]string{}
	for _, f := range m.fields {
		values[f.key] = strings.TrimSpace(m.getFieldValue(f))
	}

	slug := sanitizeSlug(values["slug"])
	if slug == "" {
		return pluginSpec{}, errors.New("plugin slug is required and must contain letters or numbers")
	}

	if values["name"] == "" {
		return pluginSpec{}, errors.New("display name is required")
	}

	out := values["output"]
	if out == "" {
		out = "./generated-plugins"
	}

	return pluginSpec{
		Slug:        slug,
		Name:        values["name"],
		Author:      fallback(values["author"], "Dev Team"),
		Description: fallback(values["description"], "Generated plugin scaffold"),
		Type:        fallback(values["type"], "driver"),
		OutputDir:   out,
	}, nil
}

func generatePluginCmd(spec pluginSpec) tea.Cmd {
	return func() tea.Msg {
		path, files, err := generatePlugin(spec)
		return generatedMsg{path: path, files: files, err: err}
	}
}

func generatePlugin(spec pluginSpec) (string, []string, error) {
	root := filepath.Join(spec.OutputDir, spec.Slug)
	if _, err := os.Stat(root); err == nil {
		return "", nil, fmt.Errorf("target already exists: %s", root)
	} else if !errors.Is(err, os.ErrNotExist) {
		return "", nil, err
	}

	dirs := []string{
		root,
		filepath.Join(root, "cmd"),
		filepath.Join(root, "internal", "node"),
		filepath.Join(root, "frontend", "src"),
	}

	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return "", nil, err
		}
	}

	pluginJSON, err := json.MarshalIndent(map[string]any{
		"name":        spec.Name,
		"id":          spec.Slug,
		"version":     "0.1.0",
		"author":      spec.Author,
		"description": spec.Description,
		"entrypoint":  "./" + spec.Slug,
		"plugin_type": spec.Type,
		"api_version": "v1",
	}, "", "  ")
	if err != nil {
		return "", nil, err
	}

	moduleName := "github.com/example/" + spec.Slug

	files := map[string]string{
		filepath.Join(root, "plugin.json"): string(pluginJSON) + "\n",
		filepath.Join(root, "README.md"):   fmt.Sprintf("# %s\n\n%s\n\n## Run\n\n```bash\ngo run ./cmd\n```\n", spec.Name, spec.Description),
		filepath.Join(root, "go.mod"):      fmt.Sprintf("module %s\n\ngo 1.24.0\n", moduleName),
		filepath.Join(root, "cmd", "main.go"): fmt.Sprintf(`package main

import "fmt"

func main() {
	fmt.Println("%s plugin booting up 🚀")
}
`, spec.Name),
		filepath.Join(root, "internal", "node", "node.go"): fmt.Sprintf(`package node

type Config struct {
	Name string
	Type string
}

func DefaultConfig() Config {
	return Config{Name: %q, Type: %q}
}
`, spec.Name, spec.Type),
		filepath.Join(root, "frontend", "src", "main.tsx"): fmt.Sprintf(`export function bootstrapPlugin() {
	console.log("%s frontend loaded")
}
`, spec.Name),
	}

	created := make([]string, 0, len(files))
	for filePath, content := range files {
		if err := os.WriteFile(filePath, []byte(content), 0o644); err != nil {
			return "", nil, err
		}
		rel, _ := filepath.Rel(root, filePath)
		created = append(created, rel)
	}

	sort.Strings(created)
	return root, created, nil
}

func sanitizeSlug(v string) string {
	v = strings.ToLower(strings.TrimSpace(v))
	v = strings.ReplaceAll(v, " ", "-")
	re := regexp.MustCompile(`[^a-z0-9-]`)
	v = re.ReplaceAllString(v, "")
	v = strings.Trim(v, "-")
	for strings.Contains(v, "--") {
		v = strings.ReplaceAll(v, "--", "-")
	}
	return v
}

func fallback(v, d string) string {
	if strings.TrimSpace(v) == "" {
		return d
	}
	return v
}

func keyMatches(msg tea.KeyMsg, keys ...string) bool {
	for _, key := range keys {
		if msg.String() == key {
			return true
		}
	}
	return false
}

func (m *model) applyFocus() {
	for i := range m.inputs {
		if m.fields[i].key == "type" {
			continue
		}
		if i == m.focus {
			m.inputs[i].Focus()
			continue
		}
		m.inputs[i].Blur()
	}
}

func (m *model) resizeInputs() {
	width := 48
	if m.width > 0 {
		width = max(24, min(72, m.width-28))
	}
	for i := range m.inputs {
		if m.fields[i].key == "type" {
			continue
		}
		m.inputs[i].Width = width
	}
}

func (m model) getFieldValue(f field) string {
	if f.key == "type" {
		return m.types[m.typeIndex]
	}
	for i := range m.fields {
		if m.fields[i].key == f.key {
			return m.inputs[i].Value()
		}
	}
	return ""
}

func main() {
	p := tea.NewProgram(initialModel(), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Println("error:", err)
		os.Exit(1)
	}
}
