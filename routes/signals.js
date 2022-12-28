const router = require('express').Router()
const signalPost = require('../models/signals')
const Admin = require('../models/adminuser')
const User = require('../models/user')
const session = require('express-session')
const sse = require('../sse')
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require('./verifyToken')
// const { sendBuyCryptoAdminEmail, sendBuyCryptoUserEmail } = require('../services')

const validateSignalPost = (req, res, next) => {
  const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const {name, email, crypto} = req.body

  if(!name || typeof name !== 'string'){
    return res.status(401).json({status: 'error', message: 'Invalid name'})
  }
  else if(!email.match(emailValidator)){
    return res.status(401).json({status: 'error', message: 'Invalid email'})
  }
  else if(!crypto || typeof crypto !== 'string'){
    return res.status(401).json({status: 'error', message: 'Cryptocurrency Invalid'})
  }
  else{
    next()
  }
}

// CREATE
router.post('/post-signal', verifyTokenAndAdmin, verifyToken, async(req, res) => {
  const {orderType, signalType, note, Pair, entryPrice,  targetPrice, stopLoss} = req.body
  try{
      const signalPostCreated = await signalPost.create({
        signalType,
       orderType,
       note, 
       Pair,
       entryPrice, 
        targetPrice, 
     stopLoss  })
      sse.send(signalPostCreated, "post")
      return res.status(200).json({status: 'ok', message: 'Signal Post Created Successfully!'})
  }catch(err){
    res.status(500).json({status:'error', message: err+'Failed to Create Signal Post'})
  }
})

// GET
router.get('/get-post-signal', verifyToken,  async(req, res) => {

  try{
    const findsignals = await signalPost.find({status: 'ongoing'})
      return res.status(200).json({status: 'ok', data: findsignals})
  }catch(err){
    res.status(404).json({status:'error', message: err + "Unable to Get Signal"})
  }
})

// Admin GET
router.get('/admin/get-post-signals', verifyToken, verifyTokenAndAdmin, async(req, res) => {

  try{
    const findsignals = await signalPost.find({status: 'ongoing'})
      return res.status(200).json({status: 'ok', data: findsignals})
  }catch(err){
    res.status(404).json({status:'error', message: err + "Unable to Get Signal"})
  }
})

//Getting Single Signals
router.get('/post-signal/:id', verifyTokenAndAdmin, verifyToken, async(req, res) => {
  try{
      const findSingleSignal = await signalPost.findById(req.params.id)
      if(findSingleSignal !== null){
      return res.status(200).json({status: 'ok', data: findSingleSignal})
      }
        return res.status(401).json({status: 'error', message: 'Unable to Requested Signal'})
  }catch(err){
    res.status(404).json({status:'error', message: "Failed to get Requested Signal"})
  }
})




module.exports = router