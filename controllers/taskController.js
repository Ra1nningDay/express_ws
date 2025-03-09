import pool from "../config/db.js";

const getTasks = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Error Fetching Tasks", error: err });
    }
};

const addTask = async (req, res) => {
    const name = req.body;

    if (!name) return res.json({ message: "Task is required" });

    try {
        const result = await pool.query(
            "INSERT INTO tasks (name) VALUES ($1) RETURNING *",
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error Adding a Task", error: err });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, completed } = req.body;
    try {
        const result = await pool.query(
            "UPDATE tasks SET name = COALESCE($1, name), completed = COALESCE($2, completed) WHERE id=$3 RETURNING *",
            [name, completed, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error Updating a Task", error: err });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id=$1 RETURNING *",
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error Deleting a Task", error: err });
    }
};

export default [getTasks, addTask, updateTask, deleteTask];
