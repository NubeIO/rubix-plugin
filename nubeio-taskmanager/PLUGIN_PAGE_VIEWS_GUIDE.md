# Task Manager Plugin - Page Views Guide

This guide shows how to add and configure page views for the Task Manager plugin so they appear in the rubix "Page Views" dropdown when users right-click on a task manager node.

## Current State

### ✅ What's Already Working

**1. Frontend Page Component**
- [frontend/src/Page.tsx](frontend/src/Page.tsx) - Full-featured task management UI
- Two-panel layout: projects on left, tasks on right
- CRUD operations for projects and tasks
- Uses rubix plugindata REST API

**2. Module Federation Setup**
- [frontend/vite.config.ts](frontend/vite.config.ts) - Exposes `./Page` and `./Widget`
- Module name: `nube_taskmanager`
- Builds to `dist-frontend/` directory

**3. Plugin Metadata**
- [plugin.json:12-22](plugin.json#L12-L22) - Declares page view:
  ```json
  "pages": [
    {
      "pageId": "taskmanager-ui",
      "title": "Task Manager",
      "icon": "check-square",         // Optional (NEW - model supports it)
      "description": "Manage tasks",   // Optional (NEW - model supports it)
      "enabled": true,
      "isDefault": true,               // Optional (NEW - model supports it)
      "order": 10,
      "props": {
        "exposedPath": "./Page"
      }
    }
  ]
  ```

**Note**: The PluginPageDef model now supports `icon`, `description`, and `isDefault` fields. You can add these to plugin.json for better UX.

### ❌ What's NOT Working

**Plugin pages don't appear in the "Page Views" dropdown** because:

1. ❌ Backend `DiscoverNodePages()` doesn't include plugin metadata
2. ❌ Plugin manager isn't wired into page discovery
3. ❌ Frontend receives empty page list for `nube.taskmanager` nodes

**Expected vs Actual**:

```bash
# Expected when right-clicking a taskmanager node:
Page Views
  ├─ Task Manager ✅ (default)  ← Should appear from plugin.json
  ├─ Properties                 ← Built-in
  └─ Wiresheet                  ← Built-in

# Actual (current):
Page Views
  ├─ Properties ✅ (default)
  └─ Wiresheet
  # Task Manager page is MISSING!
```

## Architecture Flow

### How Plugin Pages SHOULD Work

```
1. User right-clicks nube.taskmanager node
   ↓
2. Frontend calls GET /api/v1/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/pages
   ↓
3. Backend HandleGetNodePages()
   ↓
4. DiscoverNodePages() aggregates:
   - Pallet pages from GetUICapabilities() (if any)
   - Custom pages via pageRef refs
   - Plugin pages from plugin.json ← MISSING!
   ↓
5. Returns: [
     { pageId: "taskmanager-ui", title: "Task Manager", source: "module", module: "nube.taskmanager", ... },
     { pageId: "properties", title: "Properties", source: "builtin", ... },
     { pageId: "wiresheet", title: "Wiresheet", source: "builtin", ... }
   ]
   ↓
6. Frontend node-page.tsx detects source: "module"
   ↓
7. Renders PluginPageView component
   ↓
8. PluginPageView loads module via Module Federation
   ↓
9. Displays Page.tsx from plugin
```

## Fix Required (Backend)

See [PLUGIN_PAGES_REVIEW.md](../../rubix/PLUGIN_PAGES_REVIEW.md) in main rubix repo for detailed implementation steps.

**Quick Summary**:
- ✅ **DONE**: PluginPageDef model updated (Icon, Description, IsDefault fields added)
- ✅ **DONE**: PageResponse model updated (Module, Props fields added)
- ⚠️ **TODO**: Add `GetPlugin()` to IPluginManager interface
- ⚠️ **TODO**: Add `pluginManager` parameter to `pages.Service`
- ⚠️ **TODO**: Add `getPluginPages()` method to `discovery.go`
- ⚠️ **TODO**: Wire plugin manager into page handlers

**Estimated effort**: 2-3 hours (models already done, just need backend wiring)

## Verification Steps

Once the backend fix is deployed, verify it works:

### 1. Build Plugin

```bash
cd /home/user/code/go/nube/rubix-plugin/nubeio-taskmanager

# Build frontend
cd frontend
npm install
npm run build
# Output → dist-frontend/remoteEntry.js

# Build backend
cd ..
go build -o taskmanager ./cmd
```

### 2. Deploy to Rubix

```bash
# Copy to rubix plugin directory
ORG_ID="test"
PLUGIN_DIR="/home/user/code/go/nube/rubix/bin/orgs/${ORG_ID}/plugins/taskmanager"

mkdir -p "${PLUGIN_DIR}"
cp taskmanager "${PLUGIN_DIR}/"
cp plugin.json "${PLUGIN_DIR}/"
cp migrations.json "${PLUGIN_DIR}/"
cp -r dist-frontend "${PLUGIN_DIR}/"
```

### 3. Restart Rubix

```bash
cd /home/user/code/go/nube/rubix
./rubix server

# Check logs for:
# "Plugin loaded: nube.taskmanager"
```

### 4. Test Page Discovery

```bash
# Create a taskmanager node
curl -X POST http://localhost:9000/api/v1/orgs/test/devices/device-1/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "task-mgr-1",
    "type": "nube.taskmanager",
    "name": "My Task Manager"
  }'

# Get pages for the node
curl http://localhost:9000/api/v1/orgs/test/devices/device-1/nodes/task-mgr-1/pages

# Expected response (after backend fix):
{
  "data": [
    {
      "pageId": "taskmanager-ui",
      "title": "Task Manager",
      "icon": "",
      "source": "module",
      "module": "nube.taskmanager",
      "props": {
        "exposedPath": "./Page"
      },
      "isDefault": false,
      "order": 10,
      "enabled": true
    },
    {
      "pageId": "properties",
      "title": "Properties",
      "source": "builtin",
      "isDefault": true,
      "order": 1
    },
    {
      "pageId": "wiresheet",
      "title": "Wiresheet",
      "source": "builtin",
      "order": 2
    }
  ],
  "meta": {
    "count": 3,
    "nodeId": "task-mgr-1",
    "nodeType": "nube.taskmanager"
  }
}
```

### 5. Test in Frontend

1. Navigate to rubix UI
2. Find taskmanager node in tree
3. Right-click → "Page Views" dropdown
4. Should see "Task Manager" option
5. Click it → loads Page.tsx via Module Federation
6. Should display two-panel project/task UI

## Adding More Page Views

Want to add additional pages to the plugin? Here's how:

### Example: Add a "Statistics" Page

**1. Create Stats Component**

```bash
cd frontend/src
touch Stats.tsx
```

**frontend/src/Stats.tsx**:
```tsx
import { useEffect, useState } from 'react';
import { aggregate } from './api';

interface StatsProps {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
}

export default function Stats({ orgId, deviceId, token, baseUrl = '/api/v1' }: StatsProps) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const [projRows, taskRows] = await Promise.all([
        aggregate(baseUrl, orgId, deviceId, token, 'projects',
          [{ fn: 'count', col: '*', alias: 'total' }],
          ['status']),
        aggregate(baseUrl, orgId, deviceId, token, 'tasks',
          [{ fn: 'count', col: '*', alias: 'total' }],
          ['status', 'priority']),
      ]);
      setStats({ projects: projRows, tasks: taskRows });
    }
    load();
  }, [orgId, deviceId, token, baseUrl]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Task Manager Statistics</h1>

      <section>
        <h2>Projects by Status</h2>
        <table border={1} style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Status</th><th>Count</th></tr>
          </thead>
          <tbody>
            {stats.projects.map((row: any, i: number) => (
              <tr key={i}>
                <td>{row.status}</td>
                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Tasks by Status & Priority</h2>
        <table border={1} style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Status</th><th>Priority</th><th>Count</th></tr>
          </thead>
          <tbody>
            {stats.tasks.map((row: any, i: number) => (
              <tr key={i}>
                <td>{row.status}</td>
                <td>{row.priority}</td>
                <td>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
```

**2. Expose via Module Federation**

Update **frontend/vite.config.ts**:
```typescript
federation({
  name: 'nube_taskmanager',
  filename: 'remoteEntry.js',
  exposes: {
    './Page':   './src/Page.tsx',
    './Widget': './src/Widget.tsx',
    './Stats':  './src/Stats.tsx',  // NEW
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

**3. Add to plugin.json**

Update **plugin.json**:
```json
{
  "pages": [
    {
      "pageId": "taskmanager-ui",
      "title": "Task Manager",
      "icon": "check-square",
      "description": "Manage projects and tasks",
      "enabled": true,
      "isDefault": true,
      "order": 10,
      "props": {
        "exposedPath": "./Page"
      }
    },
    {
      "pageId": "taskmanager-stats",
      "title": "Statistics",
      "icon": "bar-chart",
      "description": "View task statistics",
      "enabled": true,
      "order": 20,
      "props": {
        "exposedPath": "./Stats"
      }
    }
  ]
}
```

Note: All fields (icon, description, isDefault) are now supported by the model!

**4. Rebuild**

```bash
cd frontend
npm run build

# Redeploy to rubix plugin directory
cd ..
cp -r dist-frontend /home/user/code/go/nube/rubix/bin/orgs/test/plugins/taskmanager/
```

**5. Test**

Right-click taskmanager node → Page Views dropdown now shows:
- Task Manager (default)
- Statistics
- Properties
- Wiresheet

## Dynamic Page Assignment (Advanced)

For **per-instance pages** (e.g., one page per task), use the NATS `pluginpages` service:

### Example: Assign Page to Specific Task Node

**Go code in plugin**:
```go
import (
    "encoding/json"
    "fmt"
    "time"
    "github.com/NubeDev/rubix-plugin/natslib"
)

func assignTaskPage(nc *natslib.Client, taskNodeID string, taskID int) error {
    subject := fmt.Sprintf("%s.%s.%s.pluginpages.%s.%s.create-and-assign",
        prefix, orgId, deviceId, "nube", "taskmanager")

    request := map[string]interface{}{
        "targetNodeId": taskNodeID,
        "pageId":       fmt.Sprintf("task-%d", taskID),
        "title":        fmt.Sprintf("Task #%d Details", taskID),
        "icon":         "check-square",
        "route":        fmt.Sprintf("/tasks/%d", taskID),
        "order":        1,
        "isDefault":    false,
    }

    payload, _ := json.Marshal(request)
    response, err := nc.Request(subject, payload, 10*time.Second)
    if err != nil {
        return err
    }

    var resp struct {
        Success bool   `json:"success"`
        Error   string `json:"error,omitempty"`
    }
    json.Unmarshal(response, &resp)

    if !resp.Success {
        return fmt.Errorf("page assignment failed: %s", resp.Error)
    }
    return nil
}
```

This creates a `ui.page` node in the database and attaches it via `pageRef`.

**Use cases**:
- Custom dashboard per task
- Per-project detail pages
- Dynamic reports

## Common Issues

### 1. Page Not Appearing in Dropdown

**Check**:
```bash
# Verify plugin.json is in plugin directory
ls -la /home/user/code/go/nube/rubix/bin/orgs/test/plugins/taskmanager/plugin.json

# Check backend loaded it
curl http://localhost:9000/api/v1/orgs/test/devices/device-1/nodes/task-mgr-1/pages
# Should include "source": "module" page
```

**Fix**:
- Ensure backend fix is deployed (see PLUGIN_PAGES_REVIEW.md)
- Check plugin metadata loaded: logs should show "Plugin loaded: nube.taskmanager"
- Verify `pages` array in plugin.json is valid JSON

### 2. Module Federation Load Error

**Error**: `Plugin error (nube.taskmanager): Failed to load plugin page`

**Check**:
```bash
# Verify remoteEntry.js exists
curl http://localhost:9000/api/v1/ext/nube.taskmanager/remoteEntry.js
# Should return JavaScript bundle

# Check browser console for CORS or 404 errors
```

**Fix**:
- Rebuild frontend: `npm run build`
- Copy dist-frontend to plugin directory
- Restart rubix server
- Clear browser cache

### 3. Component Not Found

**Error**: `Cannot read properties of undefined (reading 'default')`

**Fix**:
- Verify exposed path in plugin.json matches vite.config.ts
- Check module name: `nube_taskmanager` (not `nube.taskmanager`)
- Ensure component exported as default: `export default function Page(...)`

### 4. Props Not Passed Correctly

**Issue**: Component receives undefined props

**Fix**:
- Check `props` field in plugin.json passes `exposedPath`
- Verify component signature matches `PluginProps` interface:
  ```tsx
  interface PluginProps {
    orgId: string;
    deviceId: string;
    token?: string;
    baseUrl: string;
  }
  ```

## Best Practices

### 1. Page Component Design

✅ **Do**:
- Accept standard props: `orgId`, `deviceId`, `token`, `baseUrl`
- Use plugindata REST API (not direct NATS calls)
- Handle loading and error states gracefully
- Use inline styles or CSS-in-JS (no external CSS imports)
- Make components responsive (sidebar can resize)

❌ **Don't**:
- Import external CSS files (breaks isolation)
- Use global styles (affects host app)
- Make assumptions about screen size
- Use browser localStorage without org/device namespacing

### 2. Module Federation

✅ **Do**:
- Use singleton React/ReactDOM
- Keep bundle size small (< 500KB)
- Test in both dev and production builds
- Handle missing dependencies gracefully

❌ **Don't**:
- Duplicate dependencies (use `shared` config)
- Expose internal components (only expose public pages)
- Use different React versions than host

### 3. Plugin Metadata

✅ **Do**:
- Use descriptive page IDs: `taskmanager-stats` (not `stats`)
- Set meaningful titles and icons
- Use `order` to control display sequence
- Mark one page as `isDefault: true`
- Set `enabled: true` for active pages

❌ **Don't**:
- Use duplicate page IDs
- Omit `exposedPath` in props
- Use special characters in page IDs

## Summary

**Current Status**:
- ✅ Frontend page component exists and works
- ✅ Module Federation configured correctly
- ✅ Plugin metadata declares page view
- ❌ Backend doesn't discover plugin pages

**Required Fix**:
- Backend integration (see [PLUGIN_PAGES_REVIEW.md](../../rubix/PLUGIN_PAGES_REVIEW.md))
- Estimated: 1-2 hours

**After Fix**:
- Plugin pages appear in "Page Views" dropdown automatically
- No frontend changes needed
- Works with all plugins that declare pages in plugin.json

**Adding More Pages**:
1. Create React component
2. Expose in vite.config.ts
3. Add to plugin.json pages array
4. Rebuild and redeploy

**Reference**:
- Main review: [/home/user/code/go/nube/rubix/PLUGIN_PAGES_REVIEW.md](../../rubix/PLUGIN_PAGES_REVIEW.md)
- Plugin backend docs: [docs/system/v1/plugins/BACKEND.md](../../rubix/docs/system/v1/plugins/BACKEND.md)
- Plugin frontend docs: [docs/system/v1/plugins/FRONTEND.md](../../rubix/docs/system/v1/plugins/FRONTEND.md)
- Page views docs: [docs/system/v1/ui-nodes/PAGE-VIEWS.md](../../rubix/docs/system/v1/ui-nodes/PAGE-VIEWS.md)
