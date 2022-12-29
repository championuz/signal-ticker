const router = require('express').Router();
const SSE = require("express-sse");

const sse = new SSE(["New Text Event"]);

router.get("/stream", (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    sse.init(req, res);
});

module.exports = router;