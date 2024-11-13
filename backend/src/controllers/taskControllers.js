import Task from "../models/task.js";

// Create Task
export const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      status,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Task creation failed" });
  }
};

// Get Tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: "Task update failed" });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Task deletion failed" });
  }
};
