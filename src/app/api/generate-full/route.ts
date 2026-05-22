import { NextResponse } from 'next/server';
import { SRS_TEMPLATE } from '@/constants/srs-template';

export async function POST(req: Request) {
  try {
    const { projectName, projectDescription, version, author } = await req.json();

    const expectedKeys = SRS_TEMPLATE.flatMap(s => s.questions.map(q => q.id));
    
    const prompt = `
      You are an expert technical writer and software architect. Generate a complete, professional IEEE 830 standard Software Requirements Specification (SRS) document draft.
      
      PROJECT: ${projectName}
      DESCRIPTION: ${projectDescription}
      VERSION: ${version}
      AUTHOR: ${author}
      
      STRICT FORMATTING RULES:
      1. Your response MUST be a valid JSON object.
      2. The JSON object must contain EXACTLY the fields listed below as keys.
      3. The values for each key must be the plain-text professional content for that section.
      4. DO NOT add markdown inside the values. DO NOT include any text outside the JSON object.
      5. CRITICAL: DO NOT echo the "PROJECT:", "DESCRIPTION:", "AUTHOR:", or "VERSION:" labels in your generated values. Start immediately with the content.
      
      FIELDS REQUIRED (JSON KEYS):
      ${expectedKeys.map(k => `"${k}"`).join(', ')}
    `;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3',
        prompt: prompt,
        stream: false,
        format: 'json',
      }),
    });

    const data = await response.json();
    let answers: Record<string, any>;
    
    try {
      answers = JSON.parse(data.response);
    } catch (e) {
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        answers = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('AI failed to generate valid JSON');
      }
    }
    
    const flattenValue = (v: any): string => {
      if (typeof v === 'string') return v;
      if (Array.isArray(v)) return v.map(item => flattenValue(item)).join(', ');
      if (typeof v === 'object' && v !== null) {
        return Object.entries(v)
          .map(([key, value]) => `${key}: ${flattenValue(value)}`)
          .join('. ');
      }
      return String(v);
    };
    
    const cleanAnswers: Record<string, string> = {};

    Object.keys(answers).forEach(key => {
      let val = flattenValue(answers[key]);

      // Remove common LLM artifacts like [(label)] or {Section}
      val = val.replace(/\[\([\w-]+\)\]/g, '')
               .replace(/\[[\w-]+\]:?/g, '')
               .replace(/\{[\w-\s.()]+\}:?/g, '') 
               .replace(/\(non-functional\)/gi, '')
               .replace(/\(functional\)/gi, '')
               .replace(/\[object Object\]/g, '')
               // Strip contextual exact echoes
               .replace(new RegExp(`^${projectName}:?\\s*`, 'i'), '')
               .replace(/^(PROJECT|DESCRIPTION|VERSION|AUTHOR):\s*/i, '')
               .replace(/^(TEST(ING)?|SUMMARY):\s*/i, '')
               .replace(/\s+/g, ' ')
               .trim();
      
      cleanAnswers[key] = val;
    });

    return NextResponse.json({ answers: cleanAnswers });
  } catch (error: any) {
    console.error('Magic Generate API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate full draft. Ensure Ollama is running.',
      details: error.message 
    }, { status: 500 });
  }
}
