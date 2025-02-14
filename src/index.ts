import { Request, Response } from "express";
import app from "./app"; // Import the configured app
import http from "http";
const PORT = process.env.PORT;

// Create a server
const server = http.createServer(app);

// Define a route
app.get("/", (req: Request, res: Response) => {
    res.send("💪 Server health ok! 💪");
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
