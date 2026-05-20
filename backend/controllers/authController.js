const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ message: 'Please provide all required fields' })

        const user = await prisma.users.findUnique({ where: { email } })

        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' })

        const token = generateToken(user.id)
        res.cookie('token', token, cookieOptions)
        res.json({ user: { id: user.id, email: user.email, username: user.username } })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        if (!email || !username || !password)
            return res.status(400).json({ message: 'Please provide all required fields' })

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.users.create({
            data: { email, username, password: hashedPassword },
            select: { id: true, email: true, username: true }
        })

        const token = generateToken(newUser.id)
        res.cookie('token', token, cookieOptions)
        return res.status(201).json({ user: newUser })
    } catch (error) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0]
            return res.status(400).json({ message: `${field} already exists` })
        }
        res.status(500).json({ error: error.message })
    }
}

const getCurrentUser = async (req, res) => {
    res.json(req.user)
}

const getUserById = async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(req.params.id) },
            select: { id: true, email: true, username: true }
        })

        if (!user) return res.status(404).json({ error: 'User not found' })
        res.json({ user })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const logoutUser = async (req, res) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 })
    res.json({ message: 'Logged out successfully' })
}

module.exports = { loginUser, registerUser, getCurrentUser, getUserById, logoutUser }