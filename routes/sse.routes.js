const express = require('express');
const stream = require('../sse');

const router = express.Router();

router.get("/streams", stream.init)

module.exports = router;