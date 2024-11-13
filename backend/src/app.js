import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const MONGO_CONN_URI = process.env.MONGO_URI;

if (!MONGO_CONN_URI) {
  console.error('MONGO_URI is not set in the environment variables');
  process.exit(1); 
}

console.log(MONGO_CONN_URI, 'Is mongoUri');

async function main() {
  try {
    await mongoose.connect(`${MONGO_CONN_URI}/trollo`);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  
  }
}

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
  process.exit(0);
});
