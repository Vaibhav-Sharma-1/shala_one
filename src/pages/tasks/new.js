import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button } from 'react-bootstrap';

export default function NewTask() {
  const router = useRouter();
  const [task, setTask] = useState({ title: '', description: '', dueDate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    router.push('/');
  };

  return (
    <Container className="mt-4">
      <h2>Add New Task</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" required value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date</Form.Label>
          <Form.Control type="date" value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} />
        </Form.Group>

        <Button type="submit" variant="primary">Create Task</Button>
      </Form>
    </Container>
  );
}
