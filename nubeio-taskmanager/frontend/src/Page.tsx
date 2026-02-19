/**
 * Task Manager Page — exposed via Module Federation as './Page'
 *
 * Two-panel layout: projects on the left, tasks for the selected project on the right.
 * All data goes through the rubix plugindata REST API — no direct plugin HTTP calls.
 */

import { useEffect, useState, useCallback } from 'react';
import type { Project, Task } from './types';
import {
  listProjects, createProject, updateProject, deleteProject,
  listTasks, createTask, updateTask, deleteTask,
} from './api';

interface PageProps {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const S = {
  page: { display: 'flex', height: '100%', fontFamily: 'sans-serif', fontSize: 13, color: '#222' } as React.CSSProperties,
  panel: { padding: '1rem', overflowY: 'auto' as const, borderRight: '1px solid #e0e0e0', width: 260, flexShrink: 0 },
  main: { flex: 1, padding: '1rem', overflowY: 'auto' as const },
  sectionTitle: { fontWeight: 700, fontSize: 14, marginBottom: 8, color: '#333' } as React.CSSProperties,
  item: (selected: boolean): React.CSSProperties => ({
    padding: '6px 10px',
    marginBottom: 4,
    borderRadius: 4,
    cursor: 'pointer',
    background: selected ? '#e8f0fe' : '#f5f5f5',
    fontWeight: selected ? 600 : 400,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  badge: (status: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '1px 6px',
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 600,
    background: status === 'done' ? '#c8f5c8' : status === 'in_progress' ? '#fff3cd' : '#e0e0e0',
    color: status === 'done' ? '#1a6b1a' : status === 'in_progress' ? '#856404' : '#555',
  }),
  btn: (variant: 'primary' | 'danger' | 'ghost'): React.CSSProperties => ({
    padding: '4px 10px',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    background: variant === 'primary' ? '#1a73e8' : variant === 'danger' ? '#d93025' : '#f0f0f0',
    color: variant === 'ghost' ? '#333' : '#fff',
  }),
  input: { width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 13, boxSizing: 'border-box' as const },
  label: { display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 12, color: '#555' } as React.CSSProperties,
  form: { background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 6, padding: '1rem', marginBottom: 12 } as React.CSSProperties,
  error: { color: '#c00', fontSize: 12, margin: '8px 0' } as React.CSSProperties,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page({ orgId, deviceId, token, baseUrl = '/api/v1' }: PageProps) {
  const ctx = { baseUrl, orgId, deviceId, token };

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'todo' });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Load projects ──
  const loadProjects = useCallback(async () => {
    try {
      const rows = await listProjects(baseUrl, orgId, deviceId, token);
      setProjects((rows ?? []) as Project[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [baseUrl, orgId, deviceId, token]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  // ── Load tasks when project changes ──
  useEffect(() => {
    if (!selectedProject) { setTasks([]); return; }
    listTasks(baseUrl, orgId, deviceId, token, selectedProject.id)
      .then(rows => setTasks((rows ?? []) as Task[]))
      .catch(e => setError(e instanceof Error ? e.message : String(e)));
  }, [selectedProject, baseUrl, orgId, deviceId, token]);

  // ── Project actions ──
  async function handleCreateProject() {
    if (!newProjectName.trim()) return;
    setLoading(true);
    try {
      await createProject(baseUrl, orgId, deviceId, token, { name: newProjectName, description: newProjectDesc });
      setNewProjectName(''); setNewProjectDesc(''); setShowNewProject(false);
      await loadProjects();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }

  async function handleDeleteProject(p: Project) {
    if (!confirm(`Delete project "${p.name}"?`)) return;
    try {
      await deleteProject(baseUrl, orgId, deviceId, token, p.id);
      if (selectedProject?.id === p.id) setSelectedProject(null);
      await loadProjects();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }

  // ── Task actions ──
  async function handleCreateTask() {
    if (!selectedProject || !newTask.title.trim()) return;
    setLoading(true);
    try {
      await createTask(baseUrl, orgId, deviceId, token, { ...newTask, project_id: selectedProject.id });
      setNewTask({ title: '', description: '', priority: 'medium', status: 'todo' });
      setShowNewTask(false);
      const rows = await listTasks(baseUrl, orgId, deviceId, token, selectedProject.id);
      setTasks((rows ?? []) as Task[]);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }

  async function handleUpdateTaskStatus(t: Task, status: string) {
    try {
      await updateTask(baseUrl, orgId, deviceId, token, t.id, { status });
      setTasks(prev => prev.map(x => x.id === t.id ? { ...x, status: status as Task['status'] } : x));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }

  async function handleDeleteTask(t: Task) {
    if (!confirm(`Delete task "${t.title}"?`)) return;
    try {
      await deleteTask(baseUrl, orgId, deviceId, token, t.id);
      setTasks(prev => prev.filter(x => x.id !== t.id));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }

  return (
    <div style={S.page}>
      {/* ── Left panel: Projects ── */}
      <div style={S.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={S.sectionTitle}>Projects</span>
          <button style={S.btn('primary')} onClick={() => setShowNewProject(v => !v)}>+ New</button>
        </div>

        {showNewProject && (
          <div style={S.form}>
            <Field label="Name">
              <input style={S.input} value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
                placeholder="Project name" autoFocus />
            </Field>
            <Field label="Description">
              <input style={S.input} value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)}
                placeholder="Optional description" />
            </Field>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={S.btn('primary')} onClick={handleCreateProject} disabled={loading}>Create</button>
              <button style={S.btn('ghost')} onClick={() => setShowNewProject(false)}>Cancel</button>
            </div>
          </div>
        )}

        {projects.map(p => (
          <div key={p.id} style={S.item(selectedProject?.id === p.id)} onClick={() => setSelectedProject(p)}>
            <span>{p.name}</span>
            <button
              style={{ ...S.btn('danger'), fontSize: 10, padding: '2px 6px' }}
              onClick={e => { e.stopPropagation(); handleDeleteProject(p); }}
            >✕</button>
          </div>
        ))}

        {projects.length === 0 && (
          <div style={{ color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            No projects yet
          </div>
        )}
      </div>

      {/* ── Right panel: Tasks ── */}
      <div style={S.main}>
        {error && (
          <div style={S.error}>
            {error}{' '}
            <button style={{ ...S.btn('ghost'), fontSize: 11 }} onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {!selectedProject ? (
          <div style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>
            Select a project to view tasks
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={S.sectionTitle}>{selectedProject.name} — Tasks ({tasks.length})</span>
              <button style={S.btn('primary')} onClick={() => setShowNewTask(v => !v)}>+ New Task</button>
            </div>

            {showNewTask && (
              <div style={S.form}>
                <Field label="Title">
                  <input style={S.input} value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
                    placeholder="Task title" autoFocus />
                </Field>
                <Field label="Description">
                  <input style={S.input} value={newTask.description} onChange={e => setNewTask(t => ({ ...t, description: e.target.value }))}
                    placeholder="Optional description" />
                </Field>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Field label="Priority">
                    <select style={S.input} value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value }))}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select style={S.input} value={newTask.status} onChange={e => setNewTask(t => ({ ...t, status: e.target.value }))}>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </Field>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={S.btn('primary')} onClick={handleCreateTask} disabled={loading}>Create</button>
                  <button style={S.btn('ghost')} onClick={() => setShowNewTask(false)}>Cancel</button>
                </div>
              </div>
            )}

            {tasks.length === 0 && (
              <div style={{ color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
                No tasks yet — click "+ New Task" to create one
              </div>
            )}

            {tasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{t.title}</div>
                  {t.description && <div style={{ color: '#777', fontSize: 11, marginTop: 2 }}>{t.description}</div>}
                  <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={S.badge(t.status)}>{t.status.replace('_', ' ')}</span>
                    <span style={{ fontSize: 10, color: '#999' }}>priority: {t.priority}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {t.status !== 'done' && (
                    <button style={S.btn('primary')}
                      onClick={() => handleUpdateTaskStatus(t, t.status === 'todo' ? 'in_progress' : 'done')}>
                      {t.status === 'todo' ? '▶ Start' : '✓ Done'}
                    </button>
                  )}
                  <button style={S.btn('danger')} onClick={() => handleDeleteTask(t)}>✕</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
