require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/authRouter')
const applicationRouter = require('./routes/applicationRouter')

const app = express()

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        const isLocalhost = origin.startsWith('http://localhost')
        const isVercel = /^https:\/\/application-tracker[a-z0-9-]*\.vercel\.app$/.test(origin)
        const isCustomOrigin = process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN
        if (isLocalhost || isVercel || isCustomOrigin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/application', applicationRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))