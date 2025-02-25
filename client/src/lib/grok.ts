import OpenAI from "openai";

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.VITE_XAI_API_KEY 
});

export async function generateQuestions(count: number, category: string, type: string) {
  const prompt = `Generate ${count} architectural questions for the ${category} category in ${type} format. 
Each question should be challenging and suitable for architecture licensure exam preparation.
The questions should test understanding of architectural principles, building codes, design concepts, and professional practice.

Response format should be an array of questions, each with:
{
  type: '${type}',
  category: '${category}',
  question: string,
  ${type === 'multiple-choice' ? 'options: string[], correctAnswer: string' : 
    type === 'true-false' ? 'correctAnswer: boolean' :
    type === 'fill-in-blank' ? 'correctKeywords: string[]' :
    'events: string[], correctOrder: number[]'},
  explanation: string
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.questions.map((q: any, index: number) => ({
      id: Date.now() + index,
      ...q
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}
