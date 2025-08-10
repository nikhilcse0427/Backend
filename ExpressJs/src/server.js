import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
  path: path.resolve(__dirname, '../.env')
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