import bcrypt from "bcrypt";
import { repository } from "../DataSource/DataSource.js";
import User from "../DataSource/Entities.js";
import { VerifyToken } from "../Auth/auth.js";
export default class QuizService {
  constructor() {
    this._context = repository(User);
  }

  async addUser({ firstname, lastname, email, password }, res) {
    const userExist = await this._context.findOne({ where: { email: email } });
    // console.log(userExist);
    if (userExist)
      return res.status(400).json({ message: "User already exists" });

    const hashedPass = await bcrypt.hash(password, 8);
    const newUser = this._context.create({
      firstname,
      lastname,
      email,
      password: hashedPass,
    });
    return await this._context.save(newUser);
  }

  async getAllUsers() {
    return await this._context.find();
  }

  async authenticateUser(email, password) {
    const user = await this._context.findOne({ where: { email: email } });
    console.log(user);
    if (!user) return { error: "User not found", isValidUser: false };

    const isValidUser = await bcrypt.compare(password, user.password);
    return { user, isValidUser };
  }
}
