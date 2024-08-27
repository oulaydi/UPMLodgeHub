import express from 'express';
import postRoute from './routes/postRoute.js';
import authRoute from './routes/authRoute.js';

const app = express();;


app.use(express.json());
app.use('/api/auth/', authRoute);

app.listen(2024, () => {
  console.log('Server is running on port 2024');
});