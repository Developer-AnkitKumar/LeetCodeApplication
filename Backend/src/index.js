import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import executionRoute from './routes/executeCode.routes.js';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('/', (req, res) => {
  res.send('Hello friends is to welcome LeedRun Application!🔥');
});

app.use("/api/v1/auth", authRouter); 
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/excute-code", executionRoute);

