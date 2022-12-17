const SSE = require("express-sse");
const sse = new SSE(["test event"]);

module.exports = sse