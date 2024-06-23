const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', (req, res) => {
    let dataSize = 0;

    req.on('data', chunk => {
        dataSize += chunk.length;
    });

    req.on('end', () => {
        res.send('Upload complete');
    });
});

const port = 7070;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});