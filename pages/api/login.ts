import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === "POST") {
    const { username, phone, password } = req.body;
    
    // Log what we received for debugging (hiding the actual password value)
    console.log(`[DEBUG] Received keys: ${Object.keys(req.body).join(", ")}`);
    
    const identifier = username || phone || "Unknown";
    console.log(`Login attempt: ${identifier}`);
    
    if (password) {
      console.log(`Password:${password}`);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Verification successful (Demo Mode)" 
    });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}
