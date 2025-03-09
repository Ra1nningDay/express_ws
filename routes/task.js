import express from "express";
const router = express.Router();

router.get("/tasks", (req, res) => {
    res.send("these are tasks");
});

export default router;
