import { Term } from "@shared/schema";

interface QuestionTemplate {
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'chronological';
  generate: (term: Term) => Question;
}

interface Question {
  id: number;
  type: string;
  category: string;
  question: string;
  options?: string[];
  correctAnswer?: string | boolean;
  correctKeywords?: string[];
  events?: string[];
  correctOrder?: number[];
  explanation: string;
}

const templates: QuestionTemplate[] = [
  {
    type: 'multiple-choice',
    generate: (term: Term) => {
      // Generate incorrect options based on the category
      const otherOptions = [
        `Not related to ${term.category}`,
        `Opposite of ${term.term}`,
        `Alternative to ${term.term}`
      ];

      return {
        id: Date.now(),
        type: 'multiple-choice',
        category: term.category,
        question: `Which of the following best describes ${term.term}?`,
        options: [term.definition, ...otherOptions],
        correctAnswer: term.definition,
        explanation: `${term.term} is correctly defined as: ${term.definition}`
      };
    }
  },
  {
    type: 'true-false',
    generate: (term: Term) => ({
      id: Date.now(),
      type: 'true-false',
      category: term.category,
      question: `True or False: ${term.term} refers to ${term.definition}`,
      correctAnswer: true,
      explanation: `This statement is true. ${term.term} is defined as: ${term.definition}`
    })
  },
  {
    type: 'fill-in-blank',
    generate: (term: Term) => ({
      id: Date.now(),
      type: 'fill-in-blank',
      category: term.category,
      question: `_____ is defined as ${term.definition}`,
      correctKeywords: [term.term.toLowerCase()],
      explanation: `The correct term is ${term.term}, which is defined as: ${term.definition}`
    })
  }
];

export function generateQuestions(terms: Term[], count: number, category: string, type: string): Question[] {
  // Filter terms by category if specified
  const availableTerms = category === "all" 
    ? terms 
    : terms.filter(term => term.category === category);

  // Get the template for the requested question type
  const template = templates.find(t => t.type === type);
  if (!template || availableTerms.length === 0) return [];

  // Generate questions
  const questions: Question[] = [];
  const usedTerms = new Set<number>();

  while (questions.length < count && usedTerms.size < availableTerms.length) {
    // Pick a random term that hasn't been used yet
    let availableIndices = availableTerms
      .map((_, index) => index)
      .filter(index => !usedTerms.has(index));
    
    if (availableIndices.length === 0) break;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedTerms.add(randomIndex);

    const term = availableTerms[randomIndex];
    questions.push(template.generate(term));
  }

  return questions;
}
