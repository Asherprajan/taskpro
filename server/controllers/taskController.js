import Task from '../models/Task.js';
import Company from '../models/Company.js';

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  console.log('Received task creation request with body:', req.body);
  console.log('CompanyId from request:', req.body.companyId);
  
  try {
    const { title, description, status, priority, dueDate, companyId } = req.body;
    
    if (!title || !description || !companyId) {
      console.log('Validation failed:', { title, description, companyId });
      return res.status(400).json({ 
        message: 'Title, description, and companyId are required',
        received: { title, description, companyId }
      });
    }

    console.log('Finding company with ID:', companyId); // Debug log
    const company = await Company.findById(companyId);
    if (!company) {
      console.log('Company not found for ID:', companyId); // Debug log
      return res.status(404).json({ message: 'Company not found' });
    }

    console.log('Creating new task with data:', {
      title, description, status, priority, dueDate, companyId
    }); // Debug log
    
    const newTask = new Task({
      title,
      description,
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate,
      companyId
    });

    console.log('Saving new task'); // Debug log
    const savedTask = await newTask.save();
    console.log('Task saved:', savedTask); // Debug log

    console.log('Updating company tasks array'); // Debug log
    company.tasks.push(savedTask._id);
    await company.save();
    console.log('Company updated'); // Debug log

    console.log('Finding populated task'); // Debug log
    const populatedTask = await Task.findById(savedTask._id);
    console.log('Sending response with populated task:', populatedTask); // Debug log
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error in createTask:', {
      error,
      message: error.message,
      stack: error.stack
    }); // Detailed error log
    res.status(500).json({ 
      message: 'Error creating task',
      error: error.message 
    });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    console.log('Update task request:', {
      taskId: req.params.id,
      updates: req.body
    });

    const { title, description, status, priority, dueDate } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    const updatedTask = await task.save();
    console.log('Task updated successfully:', updatedTask);

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    console.log('Delete task request:', req.params.id);
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove task from company's tasks array
    const company = await Company.findById(task.companyId);
    if (company) {
      company.tasks = company.tasks.filter(t => t.toString() !== req.params.id);
      await company.save();
    }

    await task.deleteOne();
    console.log('Task deleted successfully');

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
}; 