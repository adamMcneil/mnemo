const express = require('express');
const app = express();
const port = 3000;

app.get('/api/message', (req, res) => {
	res.json({ message: 'Hello, World!' });
});

app.post('/api/movement', (req, res) => {
	console.log("here")
	res.json({ message: 'recieved' });

});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
