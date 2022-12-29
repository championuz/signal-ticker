const router = require('express').Router();
const sse = require('../sse');


router.get("/stream", (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    sse.init(req, res);
});

module.exports = router;