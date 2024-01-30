import express from 'express';
import cors from "cors";
import { config } from 'dotenv';
import router from './router';
import mongoose from 'mongoose';

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

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(router);