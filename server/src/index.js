require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const moviesRouter = require('./routes/movies');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/movies', moviesRouter);

app.listen(PORT, () => {
  console.log(`Movie Explorer server running on http://localhost:${PORT}`);
});
