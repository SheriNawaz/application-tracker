const jwt = require('jsonwebtoken')
const prisma = require('../prisma/client')

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.token  // fallback for any existing cookie sessions

        if (!token)
            return res.status(401).json({ message: 'Not authorised, token failed' })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true }
        })

        if (!user)
            return res.status(401).json({ message: 'Not authorised, user not found' })

        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Not authorised, token failed' })
    }
}

module.exports = { protect }