require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/authRouter')
const applicationRouter = require('./routes/applicationRouter')

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/application', applicationRouter)

app.listen(3000, () => console.log('Server running on port 3000'))