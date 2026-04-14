import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// example schema
const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

export async function GET() {
  await dbConnect();
  const docs = await Test.find();
  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const doc = await Test.create({ name: body.name });
  return new Response(JSON.stringify(doc), {
    headers: { 'Content-Type': 'application/json' },
  });
}

