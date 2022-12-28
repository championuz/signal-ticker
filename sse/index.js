const SSE = require("express-sse");
const sse = new SSE(["New Text Event"]);

module.exports = sse