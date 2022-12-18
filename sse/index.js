const SSE = require("express-sse");
const stream = new SSE(["test event"]);

module.exports = stream