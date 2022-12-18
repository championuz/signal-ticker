const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


const signalsSchema = new mongoose.Schema(
  {
    Pair: {
      type: String,
      required: true,
    },
    signalType: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      required: true,
    },
    entryPrice: {
      type: Number,
      required: true,
    },
    stopLoss: {
      type: Number,
      required: true,
    },
    takeProfit: {
      type: Number,
      required: true,
    },
    status: {
      type: String, 
      enum: ['ongoing', 'completed', 'cancalled' ],
      default: 'ongoing'
    },
    note: {
      type: String, 
      default: 'none'
    },
  }, 
  {timestamps: true},
  {collection: 'signals'},
)


module.exports = mongoose.model('signals', signalsSchema)