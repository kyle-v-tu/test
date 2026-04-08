// server.js  (at project root, NOT inside my-app/)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.join(__dirname, 'my-app/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-app/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));