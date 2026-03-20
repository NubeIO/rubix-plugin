/**
 * Task List Widget (Type B - Backend)
 *
 * Shows tasks with status updates via REST API.
 */

import { useEffect, useState } from 'react';
import { listAllTasks, updateTask } from './api';
import type { Task } from './types';

interface TaskListWidgetProps {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
  config?: Record<string, unknown>;
}

const STATUS_COLORS = {
  todo: '#94a3b8',
  in_progress: '#3b82f6',
  done: '#10b981',
};

const PRIORITY_COLORS = {
  low: '#94a3b8',
  medium: '#f59e0b',
  high: '#ef4444',
};

export default function TaskListWidget({
  orgId,
  deviceId,
  token,
  baseUrl = '/api/v1',
  config,
}: TaskListWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(10);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await listAllTasks(baseUrl, orgId, deviceId, token, limit);
      setTasks(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [orgId, deviceId, token, baseUrl, limit]);

  const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
    try {
      await updateTask(baseUrl, orgId, deviceId, token, taskId, { status: newStatus });
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const containerStyle: React.CSSProperties = {
    fontFamily: 'sans-serif',
    padding: '1rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontSize: 12,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: '#3b82f6',
  };

  const taskStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#fff',
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.125rem 0.5rem',
    borderRadius: '4px',
    fontSize: 10,
    fontWeight: 500,
  };

  if (loading && tasks.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ color: '#888' }}>Loading tasks...</div>
      </div>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ color: '#ef4444' }}>{error}</div>
        <button onClick={loadTasks} style={{ padding: '0.5rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        Recent Tasks ({tasks.length})
      </div>

      {error && (
        <div style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: 11 }}>
          {error}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
            No tasks found
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} style={taskStyle}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    ...badgeStyle,
                    backgroundColor: STATUS_COLORS[task.status] + '20',
                    color: STATUS_COLORS[task.status],
                  }}
                >
                  {task.status.replace('_', ' ')}
                </span>
                <span
                  style={{
                    ...badgeStyle,
                    backgroundColor: PRIORITY_COLORS[task.priority] + '20',
                    color: PRIORITY_COLORS[task.priority],
                  }}
                >
                  {task.priority}
                </span>
              </div>

              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                {task.title}
              </div>

              {task.description && (
                <div style={{ fontSize: 11, color: '#666', marginBottom: '0.5rem' }}>
                  {task.description.substring(0, 100)}
                  {task.description.length > 100 && '...'}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ fontSize: 10, color: '#888' }}>
                  {task.assigned_user_name || 'Unassigned'}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {task.status !== 'todo' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'todo')}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: 10,
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                      }}
                    >
                      To Do
                    </button>
                  )}
                  {task.status !== 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'in_progress')}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: 10,
                        border: '1px solid #3b82f6',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: '#eff6ff',
                        color: '#3b82f6',
                      }}
                    >
                      In Progress
                    </button>
                  )}
                  {task.status !== 'done' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'done')}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: 10,
                        border: '1px solid #10b981',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: '#ecfdf5',
                        color: '#10b981',
                      }}
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
