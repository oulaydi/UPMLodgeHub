import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import testRoute from './routes/testRoute.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.use('/api/auth/', authRoute);
app.use('/api/users/', userRoute);
app.use('/api/posts/', postRoute);
app.use('/api/test/', testRoute);

app.listen(2024, () => {
  console.log('Server is running on port 2024');
});