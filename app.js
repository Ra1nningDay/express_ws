import express from "express";

import taskRouter from "./routes/task.js";
import cors from "cors";
import http from "http";

import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Domain that can access server
        method: ["POST", "GET", "PUT", "DELETE"], // Set Methods that allowed
        allowedHeaders: ["Content-Type", "Authorization"], // headers that allowed
        credentials: true, // Set access for cookie and headers
    },
});

app.use(
    cors({
        origin: "http://localhost:3000", // Domain that can access server
        method: ["POST", "GET", "PUT", "DELETE"], // Set Methods that allowed
        allowedHeaders: ["Content-Type", "Authorization"], // headers that allowed
        credentials: true, // Set access for cookie and headers
    })
);

app.use(express.json());

app.use("/api", taskRouter);

io.on("connection", (socket) => {
    console.log("a user connect");

    socket.on("disconnect", () => {
        console.log("a user disconnect");
    });
});

server.listen(3001, () => {
    console.log("Server running at Port 3000");
});
