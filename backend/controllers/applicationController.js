const prisma = require('../prisma/client')

const createApplication = async (req, res) => {
    try {
        const { company_name, job_role, location, company_website, applied_date, status } = req.body;

        if (!company_name || !job_role) {
            return res.status(400).json({ error: 'Company name and job role are required' });
        }

        const application = await prisma.applications.create({
            data: {
                user_id: req.user.id,
                company_name,
                job_role,
                location,
                company_website,
                applied_date: applied_date ? new Date(applied_date) : null,
                status: status || 'Applied'
            }
        })

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getApplications = async (req,res) => {
    try {
        const application = await prisma.applications.findMany({
            where: {user_id: req.user.id}
        })

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const editApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, job_role, location, company_website, applied_date, status } = req.body;

        const existing = await prisma.applications.findFirst({
            where: { id: parseInt(id), user_id: req.user.id }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const application = await prisma.applications.update({
            where: { id: parseInt(id) },
            data: {
                company_name,
                job_role,
                location,
                company_website,
                applied_date: applied_date ? new Date(applied_date) : null,
                status,
                updated_at: new Date()
            }
        })

        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const { count } = await prisma.applications.deleteMany({
            where: { id: parseInt(id), user_id: req.user.id }
        });

        if (count === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createApplication, getApplications, editApplication, deleteApplication };