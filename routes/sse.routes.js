const express = require('express');
const sseStream = require('../sse');

const router = express.Router();

// router.get("/stream", sseStream.init)

module.exports = router;