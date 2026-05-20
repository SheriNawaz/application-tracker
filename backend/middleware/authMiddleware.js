const jwt = require('jsonwebtoken')
const prisma = require('../prisma/client')

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token
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