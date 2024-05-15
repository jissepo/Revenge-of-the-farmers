const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package


const app = express();
dotenv.config({ path: __dirname + '/.env' });

app.use(cors()); // Use cors as a middleware
app.use(express.json());

let db;

// Connect to MongoDB
MongoClient.connect(process.env.MONGODB_URI)
  .then((client) => {
    db = client.db('admin');
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(err);
  });

// POST endpoint to save a StartedGameState
app.post('/gamestate', (req, res) => {
  console.log("Post gamestate");
  const gameState = req.body;
  if (!gameState || !gameState.battleStats || !gameState.battleStats.currentRound || gameState.battleStats.currentRound <= 0 || gameState.status !== 'STARTED') {
    res.status(400).send({ error: 'Invalid request' });
    return;
  }
  db.collection('gamestates').insertOne(gameState)
    .then((result) => {
      res.send(null);
    })
    .catch((err) => {
      res.status(500).send({ error: 'An error has occurred' });
    });
});

// GET endpoint to retrieve a random StartedGameState with the same currentRound
app.get('/gamestate', (req, res) => {
  console.log("Get gamestate");
  const round = parseInt(req.query.round);
  db.collection('gamestates').aggregate([
    { $match: { 'battleStats.currentRound': round } },
    { $sample: { size: 1 } },
  ]).toArray()
    .then((result) => {
      res.send(result[0]);
    })
    .catch((err) => {
      res.status(500).send({ error: 'An error has occurred' });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
