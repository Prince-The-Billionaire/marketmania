import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'contracts.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await fs.readFile(filePath, 'utf8');
    const db = JSON.parse(data);
    
    // Construct the object with correct types
    const newEntry = {
      id: body.id,
      title: body.title,
      category: body.category,
      baseProb: Number(body.probability),
      volume: Number(body.volume) || 0 // Saves the seed liquidity
    };
    
    db.push(newEntry);
    
    await fs.writeFile(filePath, JSON.stringify(db, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Write failed" }, { status: 500 });
  }
}