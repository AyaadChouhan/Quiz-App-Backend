import QuizController from "../Controller/quizController.js";
import express from "express";
import { VerifyToken } from "../Auth/auth.js";

const router = express.Router();
const quizController = new QuizController();

router.post("/signup", quizController.addUser);
router.post("/login", quizController.authenticate);
router.get("/getAll", quizController.getAllUsers);

export default router;