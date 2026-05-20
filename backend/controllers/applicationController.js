const prisma = require('../prisma/client')

const createApplication = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getApplications = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const editApplication = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteApplication = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { createApplication, getApplications, editApplication, deleteApplication };