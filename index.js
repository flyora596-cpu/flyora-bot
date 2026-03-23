const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Verify webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "mytoken";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Receive messages
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry;

  if (entry) {
    const messaging = entry[0].messaging;
    const sender = messaging[0].sender.id;

    await axios.post(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        recipient: { id: sender },
        message: {
          text: "👋 Hi! I'm Flyora AI ✈️\nTell me where you want to travel and I’ll find the best price!"
        }
      }
    );
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running"));
