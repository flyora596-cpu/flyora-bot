const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔑 Change these
const VERIFY_TOKEN = "flyora123";
const PAGE_ACCESS_TOKEN = "PUT_YOUR_META_ACCESS_TOKEN_HERE";

// ✅ Webhook Verification (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// ✅ Receive Messages (POST)
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
            text: "🔥 Hi! I'm Flyora AI ✈️ Tell me where you want to travel!",
          },
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
