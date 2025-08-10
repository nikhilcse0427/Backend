import express from 'express'
const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'

// Import error handlers

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//import router
import userRouter from './routes/user.route.js'

//router
app.use('/api/v1/users', userRouter)

app.get('/', (req, res) => {
  res.send('API is working 🚀');
});


export default app