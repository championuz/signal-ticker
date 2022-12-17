const express = require('express');
const sse = require('../sse').default;

const router = express.Router();

router.get("/streams", sse.init)

module.exports = router;