import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req: Request) {
  try {
    const { filename, content, type } = await req.json();
    
    // Explicitly target the OS native Downloads folder
    const downloadsDir = path.join(os.homedir(), 'Downloads');
    const filePath = path.join(downloadsDir, filename);

    if (type === 'json') {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    } else if (type === 'base64') {
      // Decode base64 strings generated from jsPDF or docx
      const base64Data = content.includes(',') ? content.split(',')[1] : content;
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);
    } else {
      throw new Error("Invalid file export type specified.");
    }
    
    return NextResponse.json({ success: true, filePath });
  } catch (error: any) {
    console.error('Local File System Export Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
