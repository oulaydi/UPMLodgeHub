import express from 'express';
import cookieParser from 'cookie-parser';
import postRoute from './routes/postRoute.js';
import authRoute from './routes/authRoute.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoute);

app.listen(2024, () => {
  console.log('Server is running on port 2024');
});