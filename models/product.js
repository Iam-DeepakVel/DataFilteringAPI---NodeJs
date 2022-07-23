const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Product name must be provided']
  },
  company:{
    type:String,
    enum:{
    values:["ikea","marcos","liddy","caressa"],
    message: "{VALUE} is not Supported"
    }
  },
  rating:{
    type:Number,
    default:4.5,
  },
  price:{
    type:Number,
    required:[true,'Product Price must be provided'],
  },
  featured:{
    type:Boolean,
    default:false
  },
  createdAt:{
    type:Date,
    default:Date.now(),
  },
})

module.exports = mongoose.model('Product',productSchema)
