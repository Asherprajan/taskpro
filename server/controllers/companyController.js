import Company from '../models/Company.js';

// @desc    Create a new company
// @route   POST /api/companies
export const createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const company = await Company.create({ name });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('tasks');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 