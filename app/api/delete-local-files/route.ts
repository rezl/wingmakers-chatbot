import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const folderPath = path.join(process.cwd(), 'data');

    // Delete all files in the folder
    fs.readdirSync(folderPath).forEach((file) => {
      fs.unlinkSync(path.join(folderPath, file));
    });

    return NextResponse.json({ message: 'All files deleted successfully' });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json({ message: 'Failed to delete files' });
  }
}
