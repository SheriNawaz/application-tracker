const prisma = require('../prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

const isProd = process.env.NODE_ENV === 'production'

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax',
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ message: 'Email is required' })

        const user = await prisma.users.findUnique({ where: { email } })

        // Always return success to avoid exposing whether an email exists
        if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' })

        const token = crypto.randomBytes(32).toString('hex')
        const expiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

        await prisma.users.update({
            where: { email },
            data: { reset_token: token, reset_token_expiry: expiry }
        })

        const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password?token=${token}`

        await transporter.sendMail({
            from: `"Application Tracker" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f172a;color:#fff;border-radius:16px;">
                    <h2 style="margin-bottom:8px;">Reset your password</h2>
                    <p style="color:#94a3b8;margin-bottom:24px;">Click the button below to reset your password. This link expires in 1 hour.</p>
                    <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:#fff;color:#0f172a;font-weight:700;border-radius:999px;text-decoration:none;">Reset Password</a>
                    <p style="color:#475569;margin-top:24px;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        })

        res.json({ message: 'If that email exists, a reset link has been sent.' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body
        if (!token || !password) return res.status(400).json({ message: 'Token and password are required' })

        const user = await prisma.users.findFirst({
            where: {
                reset_token: token,
                reset_token_expiry: { gt: new Date() }
            }
        })

        if (!user) return res.status(400).json({ message: 'Reset link is invalid or has expired' })

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.users.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                reset_token: null,
                reset_token_expiry: null
            }
        })

        res.json({ message: 'Password reset successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { loginUser, registerUser, getCurrentUser, getUserById, logoutUser, forgotPassword, resetPassword }