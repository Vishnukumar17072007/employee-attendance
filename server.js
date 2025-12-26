const https = require("https");
const fs = require("fs");
const selfsigned = require("selfsigned");
const app = require("./src/app");
const open = require("open").default;

const PORT = 3000;

// Generate certificate
const attrs = [{ name: "commonName", value: "localhost" }];
const pems = selfsigned.generate(attrs, { days: 365 });

https.createServer(
  {
    key: pems.private,
    cert: pems.cert,
  },
  app
).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
  open(`https://localhost:${PORT}`);
});
