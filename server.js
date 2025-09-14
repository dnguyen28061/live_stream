const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Stubbed REST API
app.get('/streams', (req, res) => {
    res.json({ status: 'ok', message: 'REST API is not yet implemented' });
});

app.post('/streams', (req, res) => {
    res.json({ status: 'ok', message: 'REST API is not yet implemented' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});