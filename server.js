require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jsforce = require('jsforce');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// SSL setup
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
};

// Salesforce Contact submission route
app.post('/submit-contact', async (req, res) => {
  const conn = new jsforce.Connection();

  try {
    await conn.login(
      "hemant@panse4.com",
      "Tlspn@603Z4rE1frUx6KGhw7i6bQsJAkn"
    );

    const contact = req.body;
    const result = await conn.sobject("Contact").create(contact);

    if (result.success) {
      res.status(200).send({ message: "Contact created", id: result.id });
    } else {
      res.status(400).send({ message: "Contact creation failed", errors: result.errors });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// Start HTTPS server on port 3000
https.createServer(sslOptions, app).listen(3000, () => {
  console.log('🔒 HTTPS server running at https://localhost:3000');
});
