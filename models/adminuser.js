const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
    isAdmin: {
      type: Boolean,
      default: true
    }
  }, 
  {timestamps: true},
  {collection: 'adminuser'},
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


module.exports = mongoose.model('adminuser', adminSchema)