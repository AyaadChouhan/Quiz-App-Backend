import QuizService from "../Services/quizService.js";
import jwt from "jsonwebtoken";
export default class QuizController {
  constructor() {
    this.quizService = new QuizService();
  }

  addUser = async (req, res) => {
    // console.log("hello world");
    try {
      const user = await this.quizService.addUser(req.body, res);
      console.log(user);
      const token = jwt.sign(
        { id: user.id, name: `${user.firstname} ${user.lastname}` },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      res.json({ success: true, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  authenticate = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
      const { isValidUser, error } = await this.quizService.authenticateUser(
        email,
        password
      );
      if (!isValidUser) return res.status(401).json({ error });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const users = await this.quizService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
