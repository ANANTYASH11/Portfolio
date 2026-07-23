import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'messages.json');

const ADMIN_PASSCODE = 'yashadmin2026';

// Ensure data folder and messages JSON file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Helper methods to read/write safely
const readMessages = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages database:', error);
    return [];
  }
};

const writeMessages = (messages) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to messages database:', error);
  }
};

// POST Endpoint to submit a message query
app.post('/api/messages', (req, res) => {
  const { name, email, company, message } = req.body;

  // Validation
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message body cannot be empty.' });
  }

  const messages = readMessages();
  
  const newMessage = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    name: name.trim(),
    email: email.trim(),
    company: company ? company.trim() : '',
    message: message.trim(),
    timestamp: new Date().toISOString(),
    read: false
  };

  messages.push(newMessage);
  writeMessages(messages);

  res.status(201).json({ success: true, message: 'Message sent successfully!', data: newMessage });
});

// Auth Middleware for Admin endpoints
const adminAuth = (req, res, next) => {
  const passcode = req.headers['x-admin-passcode'];
  if (passcode === ADMIN_PASSCODE) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing passcode.' });
  }
};

// GET Endpoint to fetch all messages (Admin Only)
app.get('/api/messages', adminAuth, (req, res) => {
  const messages = readMessages();
  // Return sorted by most recent first
  const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.status(200).json({ data: sortedMessages });
});

// DELETE Endpoint to delete a message (Admin Only)
app.delete('/api/messages/:id', adminAuth, (req, res) => {
  const { id } = req.params;
  const messages = readMessages();
  
  const index = messages.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  messages.splice(index, 1);
  writeMessages(messages);

  res.status(200).json({ success: true, message: 'Message deleted successfully.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Portfolio query backend is running on port ${PORT}`);
});
