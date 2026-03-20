/**
 * Project List Widget (Type B - Backend)
 *
 * Shows list of projects with create/edit/delete actions via REST API.
 */

import { useEffect, useState } from 'react';
import { listProjects, createProject, deleteProject } from './api';
import type { Project } from './types';

interface ProjectListWidgetProps {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
  config?: Record<string, unknown>;
}

export default function ProjectListWidget({
  orgId,
  deviceId,
  token,
  baseUrl = '/api/v1',
  config,
}: ProjectListWidgetProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await listProjects(baseUrl, orgId, deviceId, token);
      setProjects(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [orgId, deviceId, token, baseUrl]);

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;

    try {
      setCreating(true);
      await createProject(baseUrl, orgId, deviceId, token, {
        name: newProjectName,
        description: '',
      });
      setNewProjectName('');
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    try {
      await deleteProject(baseUrl, orgId, deviceId, token, projectId);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const containerStyle: React.CSSProperties = {
    fontFamily: 'sans-serif',
    padding: '1rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontSize: 13,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: '#10B981',
  };

  const projectStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.25rem 0.5rem',
    fontSize: 11,
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#fff',
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: '#ef4444',
    borderColor: '#fee2e2',
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: 13,
    flex: 1,
  };

  if (loading && projects.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ color: '#888' }}>Loading projects...</div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ color: '#ef4444' }}>{error}</div>
        <button onClick={loadProjects} style={buttonStyle}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        Projects ({projects.length})
      </div>

      {error && (
        <div style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: 11 }}>
          {error}
        </div>
      )}

      {/* Create new project */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name..."
          style={inputStyle}
          disabled={creating}
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newProjectName.trim()}
          style={{
            ...buttonStyle,
            backgroundColor: '#10B981',
            color: '#fff',
            borderColor: '#10B981',
            opacity: creating || !newProjectName.trim() ? 0.5 : 1,
          }}
        >
          {creating ? 'Creating...' : 'Create'}
        </button>
      </div>

      {/* Project list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
            No projects yet. Create one above!
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} style={projectStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{project.name}</div>
                {project.description && (
                  <div style={{ fontSize: 11, color: '#888', marginTop: '0.25rem' }}>
                    {project.description}
                  </div>
                )}
                <div style={{ fontSize: 10, color: '#888', marginTop: '0.25rem' }}>
                  Status: {project.status}
                </div>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                style={deleteButtonStyle}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
