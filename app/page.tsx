'use client';
import { useEffect, useState } from 'react';
import { Container, Form, Button, Table, Badge } from 'react-bootstrap';

interface Task {
  id: number;
  title: string;
  status: 'TODO' | 'DOING' | 'DONE';
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    setTasks(await res.json());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    setNewTitle('');
    fetchTasks();
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 700 }}>
      <h3 className="mb-3 text-center">📝 TODO 管理アプリ</h3>

      <Form
        className="d-flex mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <Form.Control
          placeholder="新しいタスクを入力"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          size='sm'
        />
        <Button variant="primary" type="submit" className="text-nowrap ms-2" size='sm'>
          追加
        </Button>
      </Form>

      <div className="d-flex justify-content-around mb-3">
        <Badge bg="secondary">TODO: {tasks.filter((t) => t.status === 'TODO').length}</Badge>
        <Badge bg="warning">DOING: {tasks.filter((t) => t.status === 'DOING').length}</Badge>
        <Badge bg="success">DONE: {tasks.filter((t) => t.status === 'DONE').length}</Badge>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>タイトル</th>
            <th>ステータス</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td className="text-center">{t.id}</td>
              <td>
                {editingId === t.id ? (
                  <Form.Control
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => {
                      updateTask(t.id, { title: editingTitle });
                      setEditingId(null);
                    }}
                    size='sm'
                  />
                ) : (
                  <span
                    onDoubleClick={() => {
                      setEditingId(t.id);
                      setEditingTitle(t.title);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {t.title}
                  </span>
                )}
              </td>
              <td className="text-center" style={{width: "8rem"}}>
                <Form.Select
                  value={t.status}
                  onChange={(e) => updateTask(t.id, { status: e.target.value as Task['status'] })}
                  size='sm'
                >
                  <option value="TODO">TODO</option>
                  <option value="DOING">DOING</option>
                  <option value="DONE">DONE</option>
                </Form.Select>
              </td>
              <td className="text-center">
                <Button variant="danger" className="text-nowrap" size="sm" onClick={() => deleteTask(t.id)}>
                  削除
                </Button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-muted">
                タスクはありません
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
