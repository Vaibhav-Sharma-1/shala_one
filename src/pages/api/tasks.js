import dbConnect from '../../utils/db';
import Task from '../../models/Task';

export default async function handler(req, res) {
  await dbConnect();

  try {
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          // Fetch a single task by ID
          const task = await Task.findById(req.query.id);
          if (!task) return res.status(404).json({ error: 'Task not found' });
          return res.status(200).json(task);
        } else {
          // Fetch all tasks
          const tasks = await Task.find({});
          return res.status(200).json(tasks);
        }

      case 'POST':
        const newTask = await Task.create(req.body);
        return res.status(201).json(newTask);

      case 'PUT':
        const { id, ...updates } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
        return res.status(200).json(updatedTask);

      case 'DELETE':
        await Task.findByIdAndDelete(req.query.id);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
