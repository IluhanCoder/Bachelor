import express from 'express';
import cors from "cors";
import { config } from 'dotenv';
import router from './router';
import mongoose from 'mongoose';
import authMiddleware from './auth/auth-middleware';
import authController from './auth/auth-controller';

config();

const app = express();
const port = 5001;

const conn = process.env.DB_CONN;
const clientUrl = process.env.CLIENT_URL;

mongoose.connect(conn);

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin:clientUrl,
  })
);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/login", authController.login);
app.post("/registration", authController.registration);
app.post("/verify", authController.verifyToken)

app.use(authMiddleware);

app.use(router);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});