import express from 'express';
import { createCompany, getCompanies } from '../controllers/companyController.js';

const router = express.Router();

router.route('/').post(createCompany).get(getCompanies);

export default router; 