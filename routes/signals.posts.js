const router = require('express').Router()
const signalPost = require('../models/signals')
const User = require('../models/user')
// const {verifyTokenAndAuthorization, verifyToken} = require('./verifyToken')
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
router.post('/post-signal', async(req, res) => {
  try{
    if(req.session.admin){
    const admin_details = await Admin.findOne({_id: req.session.admin})
    // const {signalType, orderType, entryPrice, stopLoss, takeProfit, note} = req.body
    if (admin_details.isAdmin === true) {
        const signalPostCreated = await signalPost.create(req.body)
      const {...others} = signalPostCreated._doc
      return res.status(200).json({status: 'ok', message: 'Signal Post Created Successfully!', data: {...others}})
    } else {
        return res.status(401).json({status: 'error', message: 'Unauthorized Access'})
    }
     
    } else {
    return res.status(401).json({status: 'error', message: 'Login Expired'})
    }
  }catch(err){
    res.status(500).json({status:'error', message:'Failed to Create Signal Post'})
  }
})

// GET
router.get('/post-signal', async(req, res) => {

  try{
    if(req.session.user){
    const findsignals = await signalPost.find({status: 'ongoing'})
      return res.status(200).json({status: 'ok', data: findsignals})
    } else {
      return res.status(401).json({status: 'error', message: 'Login Expired'})
    }
  }catch(err){
    res.status(404).json({status:'error', message: "Unable to Get Signal"})
  }
})

//Getting Single Buy Orders
router.get('/post-signal/:id', async(req, res) => {
  try{
    if(req.session.user){
      const findSingleSignal = await signalPost.findById(req.params.id)
      if(findSingleSignal !== null){
      return res.status(200).json({status: 'ok', data: findSingleSignal})
      }
        return res.status(401).json({status: 'error', message: 'Unable to Requested Signal'})
    } else {
      return res.status(401).json({status: 'error', message: 'Login Expired'})
    }
  }catch(err){
    res.status(404).json({status:'error', message: "Failed to get Requested Signal"})
  }
})




module.exports = router