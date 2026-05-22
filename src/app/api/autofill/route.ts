import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { question, context, section } = await req.json();

    // Context summary for the LLM
    const contextSummary = Object.entries(context)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompt = `
      You are an expert software architect. Provide a professional, concise answer for an SRS document section.
      
      SECTION: ${section}
      QUESTION: ${question}
      PROJECT CONTEXT: ${JSON.stringify(context)}
      
      STRICT RULES:
      1. Provide ONLY the text for the section.
      2. NO brackets [], NO labels like "(functional)".
      3. DO NOT include the section name or field ID (e.g., NO "{${section}}").
      4. NO technical tags or sentence categorizations.
      5. Write in professional, complete sentences.
    `;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3',
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    let suggestion = data.response.trim();

    // Clean up any remaining artifacts like {Section} or [(label)]
    suggestion = suggestion.replace(/\[\([\w-]+\)\]/g, '')
                           .replace(/\[[\w-]+\]:?/g, '')
                           .replace(/\{[\w-\s.()]+\}:?/g, '')
                           .replace(/\(non-functional\)/gi, '')
                           .replace(/\(functional\)/gi, '')
                           .replace(/\[object Object\]/g, '')
                           .replace(/^["']|["']$/g, '') 
                           .trim();

    return NextResponse.json({ suggestion });
  } catch (error: any) {
    console.error('Ollama API Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: 'Ollama is not running. Please start Ollama (ollama serve) to use Smart Autofill.',
        suggestion: 'Error: Ollama connection failed. Please ensure Ollama is running locally.'
      }, { status: 503 });
    }

    return NextResponse.json({ error: 'Failed to connect to Ollama' }, { status: 500 });
  }
}
