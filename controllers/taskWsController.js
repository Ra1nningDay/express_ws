// taskWsController.js
const pool = require("../config/db.js");

const taskWsController = (io, socket) => {
    console.log("Client connected:", socket.id);

    // ดึง tasks และเรียงตาม priority
    socket.on("getTasks", async () => {
        try {
            const result = await pool.query(
                "SELECT * FROM tasks ORDER BY priority ASC"
            );
            socket.emit("tasks", result.rows);
        } catch (err) {
            socket.emit("error", {
                message: "Error Fetching Tasks",
                error: err,
            });
        }
    });

    // เพิ่ม task พร้อม priority
    socket.on("addTask", async ({ name, priority = 0 }) => {
        if (!name) {
            socket.emit("error", { message: "Task is required" });
            return;
        }
        try {
            const result = await pool.query(
                "INSERT INTO tasks (name, priority) VALUES ($1, $2) RETURNING *",
                [name, priority]
            );
            socket.emit("taskAdded", result.rows[0]);
            io.emit("tasksUpdated", result.rows[0]);
        } catch (err) {
            socket.emit("error", {
                message: "Error Adding a Task",
                error: err,
            });
        }
    });

    // อัปเดต task (รวมถึง priority)
    socket.on("updateTask", async ({ id, name, completed, priority }) => {
        try {
            const result = await pool.query(
                "UPDATE tasks SET name = COALESCE($1, name), completed = COALESCE($2, completed), priority = COALESCE($3, priority) WHERE id=$4 RETURNING *",
                [name, completed, priority, id]
            );
            socket.emit("taskUpdated", result.rows[0]);
            io.emit("tasksUpdated", result.rows[0]);
        } catch (err) {
            socket.emit("error", {
                message: "Error Updating a Task",
                error: err,
            });
        }
    });

    // ลบ task
    socket.on("deleteTask", async ({ id }) => {
        try {
            const result = await pool.query(
                "DELETE FROM tasks WHERE id=$1 RETURNING *",
                [id]
            );
            socket.emit("taskDeleted", result.rows[0]);
            io.emit("tasksUpdated", { id, deleted: true });
        } catch (err) {
            socket.emit("error", {
                message: "Error Deleting a Task",
                error: err,
            });
        }
    });

    // จัดการ disconnect
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
};

module.exports = taskWsController;
