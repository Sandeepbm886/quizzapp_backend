import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setIo } from "./socket.js";

import quizRoutes from "../routes/quiz.routes.js";
import studentQuizRoutes from "../routes/studentQuiz.routes.js";
import analyticsRoutes from "../routes/analytics.routes.js";

export const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isOriginAllowed = (origin) =>
    allowedOrigins.includes("*") || allowedOrigins.includes(origin);

const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;

    if (origin && isOriginAllowed(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    } else if (!origin && allowedOrigins.includes("*")) {
        res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, userid, userrole"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
};

app.use(corsMiddleware);
app.use(express.json());
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || isOriginAllowed(origin)) {
                return callback(null, true);
            }

            callback(new Error("Socket.IO origin not allowed"));
        }
    }
});

setIo(io);

io.on("connection", (socket) => {
    
    console.log("Client connected:", socket.id);
    
    socket.on("joinQuizRoom", (quizId) => {
        socket.join(quizId);
    });
    
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "ok"
    });
});
app.get("/", (req,res)=>{
  res.send("Quiz API running.....");
});

app.use("/api/quiz", quizRoutes);
app.use("/api/student/quiz", studentQuizRoutes);
app.use("/api/quiz/analytics", analyticsRoutes);

export { server };
