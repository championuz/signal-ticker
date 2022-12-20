const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const subscribedSchema = new mongoose.Schema({
    forex: {
      type: Boolean,
      required: true,
      default: false
    },
    indices: {
      type: Boolean,
      required: true,
      default: false
    }
  });

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    emailVerified: {
      type: Boolean, 
      enum: [false, true],
      default: false
    },
    subscribed: {
      type: subscribedSchema,
      default: {
        forex: '',
        indices: ''
      }
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }, 
  {timestamps: true},
  {collection: 'users'},
)

UserSchema.methods.generateVerificationToken = function () {
  const user = this
  const verificationToken = jwt.sign(
    { id: user._id },
    process.env.VERIFICATION_TOKEN_SECRET,
    { expiresIn: "900s" }
)
  return verificationToken
}

UserSchema.methods.generateResetToken = function () {
  const user = this
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.VERIFICATION_TOKEN_SECRET,
    { expiresIn: "600s" }
)
  return resetToken
}


module.exports = mongoose.model('users', UserSchema)