const db = require('../config/db');

const STATUSES = ['pending', 'in_progress', 'done'];

// GET /api/tasks?status=done&page=1&limit=10
exports.list = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const { status } = req.query;

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
    }

    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.id];
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);
    res.json({ page, limit, count: rows.length, tasks: rows });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description = null, status = 'pending', due_date = null } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title is required' });
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
    }
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, description, status, due_date]
    );
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'status', 'due_date'];
    const fields = [];
    const values = [];
    for (const key of allowed) {
      if (req.body && req.body[key] !== undefined) {
        if (key === 'status' && !STATUSES.includes(req.body.status)) {
          return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` });
        }
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No valid fields to update' });

    values.push(req.params.id, req.user.id);
    const [result] = await db.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    if (!result.affectedRows) return res.status(404).json({ error: 'Task not found' });

    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
