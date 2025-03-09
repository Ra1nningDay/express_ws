import express from "express";
import taskRouter from "./routes/task.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000", // Domain that can access server
        method: ["POST", "GET", "PUT", "DELETE"], // Set Methods that allowed
        allowedHeaders: ["Content-Type", "Authorization"], // headers that allowed
        credentials: true, // Set access for cookie and headers
    })
);

app.use("/api", taskRouter);

app.listen(3001, () => {
    console.log("Server running at Port 3000");
});
