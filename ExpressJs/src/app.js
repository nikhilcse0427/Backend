import express from 'express'
const app = express()

import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.get('/api', (req, res)=>{
  res.send('<h1>Welcome to server</h1>')
})


export default app