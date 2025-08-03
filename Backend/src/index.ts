import express, { RequestHandler } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors';
import { Trie } from "./tries/Tries.js";
import config from '../config.js';

const app = express();
const trie = new Trie();
app.use(cors({
  origin: 'https://suggestrix.vercel.app'
}))

fs.createReadStream('./src/db/ngram_freq_dict_top_80.csv')
  .pipe(csv())
  .on('data', (row: { word: string; count: string }) => {
    trie.insert(row.word, parseInt(row.count, 10));
  })
  .on('end', () => {
    console.log('CSV file processed and Trie built');
    app.listen(config.port ?? 5000, () => {
      console.log(`Server running on port ${config.port ?? 5000}`);
    });
  });

const suggestionHandler: RequestHandler = (req, res) => {
  const wordParam = req.query.word;
  const maxDistanceParam = req.query.maxDistance;

  const word = typeof wordParam === 'string' ? wordParam : '';
  const maxDistance = typeof maxDistanceParam === 'string' ? parseInt(maxDistanceParam, 10) : 2;

  if (word.trim() === '') {
    const top = trie.getTopSuggestions('');
    res.json({ type: 'autosuggestion', suggestions: top });
    return;
  }

  if (trie.isValidPrefix(word)) {
    if (trie.isEndWord(word)) {
      trie.searchUpdate(word); 
    }
    const suggestions = trie.getTopSuggestions(word);
    res.json({ type: 'autosuggestion', suggestions });
    return;
  } else {
    const corrections = trie.getCorrect(word, maxDistance);
    res.json({ type: 'autocorrect', suggestions: corrections });
    return;
  }
};


app.get('/suggestion', suggestionHandler);
