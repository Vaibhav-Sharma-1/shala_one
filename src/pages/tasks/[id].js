import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Form, Button, Spinner } from 'react-bootstrap';

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/tasks?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTask(data);
          setLoading(false);
        });
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...task }),
    });
    router.push('/');
  };

  const handleCompleteToggle = async () => {
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !task.completed }),
    });
    setTask({ ...task, completed: !task.completed });
    router.push('/');
  };

  if (loading) return <Container className="mt-4 text-center"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4">
      <h2>Edit Task</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Due Date</Form.Label>
          <Form.Control type="date" value={task.dueDate?.split('T')[0] || ''} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} />
        </Form.Group>

        <Button type="submit" variant="primary" className="me-2">Update Task</Button>
        <Button variant={task.completed ? "secondary" : "success"} onClick={handleCompleteToggle}>
          {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
        </Button>
      </Form>
    </Container>
  );
}
