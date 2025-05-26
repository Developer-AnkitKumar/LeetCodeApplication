import express from 'express';
import authMiddleware, { CheckAdmin } from '../middleware/auth.middleware.js';
import { 
    createProblem, 
    getAllProblems, 
    getProblemById, 
    updateProblem, 
    deleteProblem, 
    getSolvedProblems } from '../controllers/problem.controllers.js';


const problemRoutes = express.Router();

problemRoutes.post('/create-problem', authMiddleware, CheckAdmin, createProblem);

problemRoutes.get('/get-all-problems', authMiddleware, getAllProblems);

problemRoutes.get('/get-problem/:id', authMiddleware, getProblemById);

problemRoutes.put('/update-problem/:id', authMiddleware, CheckAdmin, updateProblem);

problemRoutes.delete('/delete-problem/:id', authMiddleware, CheckAdmin, deleteProblem);

problemRoutes.get('/get-solved-problem', authMiddleware, getSolvedProblems);

export default problemRoutes;
