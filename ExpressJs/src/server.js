import dotenv from 'dotenv'
dotenv.config({
  path: './.env'
})

import app from './app.js'
import connectDB from './config/db.js'

const port = process.env.PORT || 3000


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ app is running on port number: ${port}`)
    })
  }).catch((error) => {
    console.log("❌ Database connection failed", error)
  })