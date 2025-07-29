// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Replace this with your encrypted or sensitive payload
const securePayload = `
U2FsdGVkX1+f4FakeEncryptedStringHereToBeReplaced==
`;

app.get('/', (req, res) => {
    const referer = req.get('referer') || req.get('origin') || '';

    if (referer.includes('https://timezone-tc99.onrender.com')) {
        res.setHeader('Content-Type', 'text/plain');
        res.send(securePayload);
    } else {
        res.setHeader('Content-Type', 'text/plain');
        res.send('how are you');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
