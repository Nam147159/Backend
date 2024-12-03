const express = require('express');
const app = express();
const port = 2204;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});