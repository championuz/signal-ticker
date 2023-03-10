const router = require('express').Router()
const User = require('../models/user')
const Admin = require('../models/adminuser')
const session = require('express-session')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
// const { sendVerificationEmail, sendResetPasswordEmail } = require('../handlebars')
const { verifyTokenAndAuthorization } = require('./verifyToken')

const validateCredentials = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, password} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!password || typeof password !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid password'})
  }
  else if(password.length < 5){
    return res.json({status: 'error', message:'Password too short. Should be at least 6 characters'})
  }
  else{
    next()
  }
}

const validateResetPasswordCred = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {email} = req.body

  if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else{
    next()
  }
}

const validatePassword = (req, res, next) => {

  const {password1, password2} = req.body

  if(!password1 || typeof password1 !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid password'})
  }
  else if(password1 !== password2){
    return res.status(401).json({status: 'error', message: 'Password does not match'})
  }
  else if(password1.length < 5){
    return res.json({status: 'error', message:'Password too short. Should be at least 6 characters'})
  }
  else{
    next()
  }
}

// Register
router.post('/register', validateCredentials, async (req, res) => {
  const {name, email, password, phone, country} = req.body
  const encryptedPass = CryptoJS.AES.encrypt(password, process.env.PASS_ENC_SECT).toString()

  try{
    const savedUser = await User.create({
      name,
      email,
      password: encryptedPass,
      phone,
      country
    })
    const {password, ...others} = savedUser._doc
    // const token = savedUser.generateVerificationToken()
    res.status(200).json({status:'ok', data: {...others}})
  }catch(err){
    // duplicate key error
    if(err.code === 11000){
      return res.status(409).json({status: 'error', message: 'Email already exists'})
    }
    // if(err.code === 11000 && err.keyPattern.name){
    //   return res.status(500).json({status: 'error', message: 'name already exists'})
    // }
    if(err.code === 11000 && err.keyPattern.email){
      return res.status(500).json({status: 'error', message: 'Email already exists'})
    }
    throw err
  }
})

//Admin Auth
router.post('/admin/register', async (req, res) => {
  const {name, email, password} = req.body
  const encryptedPass = CryptoJS.AES.encrypt(password, process.env.PASS_ENC_SECT).toString()

  try{
    const savedAdmin = await Admin.create({
      name,
      email,
      password: encryptedPass
    })
    const {password, ...others} = savedAdmin._doc
    const adminReg = await Admin.findOne({email: email})
    const accessToken = jwt.sign({
      id: adminReg._id,
      isAdmin: adminReg.isAdmin
    }, process.env.JWT_SECT,
      {expiresIn: '1d'}
    )
    res.status(200).json({status:'ok', data: {...others, accessToken}})
  }catch(err){
    // duplicate key error
    if(err.code === 11000){
      return res.status(409).json({status: 'error', message: 'Email already exists'})
    }
    // if(err.code === 11000 && err.keyPattern.name){
    //   return res.status(500).json({status: 'error', message: 'name already exists'})
    // }
    if(err.code === 11000 && err.keyPattern.email){
      return res.status(500).json({status: 'error', message: 'Email already exists'})
    }
    throw err
  }
})

// LOGIN
router.post('/login', async(req, res) => {
  try{
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(401).json({status: 'error', message: 'Invalid Email/Password'})

    const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_ENC_SECT)
    const Originalpassword = hashPassword.toString(CryptoJS.enc.Utf8)
    if (Originalpassword !== req.body.password) return res.status(401).json({status: 'error', message: 'Invalid Email/Password'})

    const {password, ...others} = user._doc

    // if (user.emailVerified !== true) {
    //   const token = user.generateVerificationToken()
    //   return res.status(401).json({
    //     status:'error', message: "Unverified Account. Please Verify Your Email!", data: {...others, verificationCode: token}
    //   })
    // }
    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECT,
      {expiresIn: '1d'}
    )

    res.status(200).json({status:'ok', data: {...others, accessToken}})
  }catch(err){  
    res.status(500).json({status: 'error', message: 'An error occured while trying to login'}) 
  }
})

//Admin Login
router.post('/admin/login', async(req, res) => {
  try{
    const adminMain = await Admin.findOne({email: req.body.email})
    if(!adminMain) return res.status(401).json({status: 'error', message: 'Invalid Email/Password'})

    const hashPassword = CryptoJS.AES.decrypt(adminMain.password, process.env.PASS_ENC_SECT)
    const Originalpassword = hashPassword.toString(CryptoJS.enc.Utf8)
    if (Originalpassword !== req.body.password) {
      return res.status(401).json({status: 'error', message: 'Invalid Email/Password'})
    } else {
    const {password, ...others} = adminMain._doc

    // if (user.emailVerified !== true) {
    //   const token = user.generateVerificationToken()
    //   return res.status(401).json({
    //     status:'error', message: "Unverified Account. Please Verify Your Email!", data: {...others, verificationCode: token}
    //   })
    // }
    // const adminid = adminMain._id
    // req.session.admin = adminid
    // console.log(req.session.admin)
    // res.status(200).json({status:'ok', data: {...others}})
    const accessToken = jwt.sign({
      id: adminMain._id,
      isAdmin: adminMain.isAdmin
    }, process.env.JWT_SECT,
      {expiresIn: '1d'}
    )
    
    res.status(200).json({status:'ok', data: {...others, accessToken}})
  }
  }catch(err){  
    res.status(500).json({status: 'error', message: 'An error occured while trying to login'}) 
  }
})

//Getting User
router.get('/users', async(req, res) => {
  try{
      const findUsers = await User.find({emailVerified: false})
      if(findUsers !== null){
      return res.status(200).json({status: 'ok', data: findUsers})
      }
        return res.status(401).json({status: 'error', message: 'Unable to fetch Requested Users'})
  }catch(err){
    res.status(404).json({status:'error', message: "Failed to get users"})
  }
})

module.exports = router