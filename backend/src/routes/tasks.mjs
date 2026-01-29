// In-memory task storage (replace with database in production)
const tasks = [
  { id: '1', title: 'Plant crops', completed: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Water fields', completed: true, createdAt: new Date().toISOString() },
  { id: '3', title: 'Check livestock', completed: false, createdAt: new Date().toISOString() }
];

/**
 * GET /api/tasks
 * Get all tasks for current user
 */
export async function getAllTasks(req, res, next) {
  try {
    const { profileId } = req.userContext;

    // In production, filter by profileId from database
    res.json({
      tasks,
      total: tasks.length,
      userId: profileId
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/tasks
 * Create new task
 */
export async function createTask(req, res, next) {
  try {
    const { title } = req.body;
    const { profileId } = req.userContext;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: profileId
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/tasks/:id
 * Update task
 */
export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) tasks[taskIndex].title = title;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    res.json(tasks[taskIndex]);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete task
 */
export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/stats
 * Get statistics (admin only)
 */
export async function getStats(req, res, next) {
  try {
    res.json({
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.completed).length,
      pendingTasks: tasks.filter((t) => !t.completed).length
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /widgets/task-summary
 * Get task summary for widget
 */
export async function getTaskSummary(req, res, next) {
  try {
    const { profileId } = req.userContext;

    const summary = {
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
      recentTasks: tasks.slice(-3).reverse(),
      userId: profileId
    };

    res.json(summary);
  } catch (error) {
    next(error);
  }
}
