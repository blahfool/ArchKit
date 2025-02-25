import { Term } from "@shared/schema";

export interface Question {
  id: number;
  term: string;
  question: string;
  correctAnswer: string;
  explanation: string;
  category: string;
}

export async function generateQuestions(terms: Term[], count: number, category: string): Promise<Question[]> {
  try {
    // Use fallback terms if no terms provided
    const allTerms = terms.length > 0 ? terms : await import('@shared/schema').then(m => m.fallbackTerms);

    // Filter terms by category if specified
    const availableTerms = category === "all" 
      ? allTerms 
      : allTerms.filter(term => term.category === category);

    if (availableTerms.length === 0) {
      throw new Error('No terms available for question generation');
    }

    const questions: Question[] = [];
    let termPool = [...availableTerms];

    // Generate exactly the requested number of questions
    for (let i = 0; i < count; i++) {
      // Replenish term pool if needed
      if (termPool.length === 0) {
        termPool = [...availableTerms];
      }

      // Get random term
      const randomIndex = Math.floor(Math.random() * termPool.length);
      const term = termPool[randomIndex];
      termPool.splice(randomIndex, 1);

      // Question templates for variety
      const questionTemplates = [
        `What is ${term.term}?`,
        `Define ${term.term}.`,
        `How would you describe ${term.term}?`,
        `Explain the concept of ${term.term}.`
      ];

      const question = {
        id: Date.now() + Math.random(),
        term: term.term,
        category: term.category,
        question: questionTemplates[Math.floor(Math.random() * questionTemplates.length)],
        correctAnswer: term.definition,
        explanation: `${term.term} is ${term.definition}. This concept is important in ${term.category}.`
      };

      questions.push(question);
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}