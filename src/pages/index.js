import { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import Link from 'next/link';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        if (data) {

          setTasks(data);
        }
        setLoading(false);
      }).catch(()=>{
        setLoading(false);
      }).finally(()=>setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task._id !== id));
  };

  return (
    <Container className="mt-4 ">
      <h2 className="mb-3">Task Manager</h2>
      <Link href="/tasks/new" className="btn btn-primary mb-3">+ Add Task</Link>

      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 && tasks?.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
                <td>{task.completed ? '✅ Completed' : '❌ Pending'}</td>
                <td>
                  <Link href={`/tasks/${task._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(task._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
