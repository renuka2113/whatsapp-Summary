import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import insertRoute from './routes/messageInsert.js';
import memberRoutes from "./routes/memberRoute.js";
import taskRoutes from './routes/taskRoute.js';
import translateRoute from './routes/translateRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true                
}));
app.use(express.json());
// app.use('/api', insertRoute);
// app.use('/api/users', userRoutes);
app.use('/api', memberRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api', memberRoutes);
app.use('/api', translateRoute)
mongoose
  .connect(process.env.MONGO_URI, 
//     {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
