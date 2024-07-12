import { NextResponse } from "next/server";
import { translate } from "@vitalets/google-translate-api";

export async function POST(request) {
  const { text, language } = await request.json();
  const translatedText = await translate(text, {
    to: language,
  });
  return NextResponse.json({ text: translatedText.text });
}
