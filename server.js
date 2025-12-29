const https = require("https");
const fs = require("fs");
require("dotenv").config();
const app = require("./src/app");
const open = require("open").default;

const PORT = 3000;

// HTTPS options (self-signed cert)
const options = {
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
};

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  const url = `https://localhost:${PORT}`;
  console.log(`HTTPS Server running on ${url}`);

  // Auto open browser
  open(url);
});
