import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "./Entities.js";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  port: process.env.DB_PORT,
  host: process.env.DB_HOST, //"localhost",
  username: process.env.DB_USER, // "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, //"quiz",
  entities: [User],
  synchronize: false,
});

export const Initialize = AppDataSource.initialize()
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });

export const repository = (entity) => AppDataSource.getRepository(entity);
