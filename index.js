const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔐 CONFIG
const VERIFY_TOKEN = "123456";
const PAGE_ACCESS_TOKEN = "IGAARLSLuhPWBBZAGJoZAjhqZAGxuVFZAaWk9EOWtjRjVWSEtLbUYxM0RiLVpTR3pfb3lGcnBzMmFVYXhhVEl3UzFyUUk1bG9FdlpSbGN5Ri1iZA3c0bFhhNVZAUQThrYjMwa0JWZAG9lWXJzWDFyZAVhzQnBTS1BqY3VhWkJicXpJY0ZAuRQZDZD";

// ✅ Webhook Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// 📩 Receive Messages
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry;

    if (entry && entry[0].messaging) {
      const messaging = entry[0].messaging[0];
      const senderId = messaging.sender.id;

      await axios.post(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        {
          recipient: { id: senderId },
          message: {
            text: "🔥 Hi! I'm Flyora AI ✈️ Tell me where you want to travel!"
          }
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running...");
});
