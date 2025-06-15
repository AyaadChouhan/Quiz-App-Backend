import express from "express";
import { json } from "express";
import dotenv from "dotenv";
import User from "./DataSource/Entities.js";
import { repository, Initialize } from "./DataSource/DataSource.js";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
// dotenv.config();
const app = express();
const PORT = 3000;
const _context = repository(User);
app.use(json());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
Initialize.then(() => {
  console.log("db connected");

  app.post("/add", async (req, res) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      const bcryptPass = await bcrypt.hash(password, 8);
      console.log(password);
      const newUser = _context.create({
        firstname,
        lastname,
        email,
        password: bcryptPass,
      });
      await _context.save(newUser);
      res.json({ success: true, user: newUser });
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  app.post("/authentication", async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }
      const user = await _context.findOne({ where: { email: email } });
      console.log(user);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }

      const isValidUser = await bcrypt.compare(password, user.password);
      res.json({ success: true, isValidUser });

      // console.log(user)
      // res.json({ success: true, user: isValidUser });
    } catch (error) {
      // res.send(error)
      console.log(error);
      res.status(500).json({ error });
    }
  });

  app.get("/getAll", async (req, res) => {
    const users = await _context.find();

    console.log(users);
    res.json(users);
  });

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
