import express from "express";
import { json } from "express";
import dotenv from "dotenv";
import { Initialize } from "./DataSource/DataSource.js";
import bodyParser from "body-parser";
import cors from "cors";
import quizRoutes from "./Routes/quizRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/", quizRoutes);

Initialize.then(() => {
  console.log("db connected");
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
