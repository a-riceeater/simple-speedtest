const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(require("serve-favicon")(path.join(__dirname, 'public', 'favicon.png')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
})

app.post('/upload', (req, res) => {
    let dataSize = 0;

    req.on('data', chunk => {
        dataSize += chunk.length;
    });

    req.on('end', () => {
        res.send('Upload complete');
    });
});

app.get('/ping', (req, res) => {
    res.send('pong');
});

const port = 7070;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});