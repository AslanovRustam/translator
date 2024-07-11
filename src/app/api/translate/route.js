import { NextResponse } from "next/server";

export async function POST(request) {
  const { text, language } = await request.json();

  const data = `${text} на ${language} языке`;

  return NextResponse.json({ text: data });
}
