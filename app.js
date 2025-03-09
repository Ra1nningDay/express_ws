import express from "express";
import taskRouter from "./routes/task.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Test");
});

app.use(taskRouter);

app.listen(3000, () => {
    console.log("Server running at Port 3000");
});
