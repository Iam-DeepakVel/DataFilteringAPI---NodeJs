const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const productRoute = require('./routes/products')
const routeNotFound = require('./middleware/not-found')

require('dotenv').config()
app.use(express.json())
app.use('/api/v2/products',productRoute)
app.use(routeNotFound)


const port = process.env.PORT || 4000

const start = async()=>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port,()=> console.log(`Server is listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
} 


start()