import express from 'express'
import dotenv from 'dotenv'
import http from "http";
import { Server } from "socket.io";

import quizRoutes from "../routes/quiz.routes.js";
import studentQuizRoutes from "../routes/studentQuiz.routes.js"
import analyticsRoutes from "../routes/analytics.routes.js";

app.use("/api/quiz/analytics", analyticsRoutes);
dotenv.config()

export const app = express()

app.use(express.json())
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);

    socket.on("joinQuizRoom", (quizId) => {
        socket.join(quizId);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

});

app.use("/api/quiz", quizRoutes);
app.use("/api/student/quiz", studentQuizRoutes);
app.use("/api/quiz/analytics", analyticsRoutes);