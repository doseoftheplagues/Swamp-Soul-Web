import path from 'node:path';
import express from 'express';
import { fileURLToPath } from 'node:url'; // Required for ESM

// --- THE FIX ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------

const app = express();

// 1. Tell Express where the 'dist' files are
// This now uses the __dirname we manually defined above
app.use(express.static(path.join(__dirname, '../dist')));

// 2. Tell Express to send index.html for ANY route (to support React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// IMPORTANT: Make sure you are actually starting the server at the bottom
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

