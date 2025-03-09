import pool from "../config/db.js";

const getTasks = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    } catch (err) {
        res.status(400).json({ message: "Error Fetching Tasks", error: err });
    }
};

export default getTasks;
