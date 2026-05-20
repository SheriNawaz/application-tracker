const { PrismaClient } = require('../generated/prisma')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DB_URL })
const prisma = new PrismaClient({ adapter })

module.exports = prisma