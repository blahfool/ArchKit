import { Term } from "@shared/schema";

interface BaseQuestion {
  id: number;
  type: string;
  category: string;
  question: string;
  explanation: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion;

function generateMultipleChoiceQuestion(term: Term, allTerms: Term[]): MultipleChoiceQuestion {
  // Question templates for variety
  const questionTemplates = [
    `Which of the following best describes ${term.term}?`,
    `In architectural practice, how is ${term.term} best defined?`,
    `What is the primary function of ${term.term}?`,
    `How would you correctly describe ${term.term}?`
  ];

  // Get terms from the same category for more relevant distractors
  const sameCategoryTerms = allTerms.filter(t => 
    t.category === term.category && 
    t.id !== term.id
  );

  // Get terms from related categories for additional options if needed
  const relatedCategories = [
    'Design Principles',
    'Construction',
    'Environmental Design',
    'Sustainability'
  ];

  const relatedTerms = allTerms.filter(t => 
    t.id !== term.id && 
    t.category !== term.category &&
    relatedCategories.includes(t.category)
  );

  // Generate incorrect options
  let incorrectOptions: string[] = [];

  // Try to get at least 2 options from same category
  if (sameCategoryTerms.length > 0) {
    incorrectOptions = sameCategoryTerms
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, sameCategoryTerms.length))
      .map(t => t.definition);
  }

  // Fill remaining options from related terms
  if (incorrectOptions.length < 3) {
    const additionalOptions = relatedTerms
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 - incorrectOptions.length)
      .map(t => t.definition);
    incorrectOptions = [...incorrectOptions, ...additionalOptions];
  }

  // Ensure we have unique options
  incorrectOptions = Array.from(new Set(incorrectOptions));

  // If we still don't have enough options, add some generic plausible options
  while (incorrectOptions.length < 3) {
    incorrectOptions.push(`A different aspect of ${term.category.toLowerCase()}`);
  }

  return {
    id: Date.now() + Math.random(),
    type: 'multiple-choice',
    category: term.category,
    question: questionTemplates[Math.floor(Math.random() * questionTemplates.length)],
    options: [term.definition, ...incorrectOptions].sort(() => Math.random() - 0.5),
    correctAnswer: term.definition,
    explanation: `${term.term} is ${term.definition}. This concept is important in ${term.category} for architectural design and implementation.`
  };
}

function generateTrueFalseQuestion(term: Term, allTerms: Term[]): TrueFalseQuestion {
  const templates = [
    {
      statement: term.definition,
      isTrue: true,
      explanation: `This is correct. ${term.term} is indeed ${term.definition}.`
    },
    {
      statement: `${term.term} is primarily used in ${
        allTerms.find(t => t.category !== term.category)?.category || 'unrelated fields'
      }`,
      isTrue: false,
      explanation: `This is incorrect. ${term.term} is primarily used in ${term.category} and is defined as: ${term.definition}`
    }
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: Date.now() + Math.random(),
    type: 'true-false',
    category: term.category,
    question: `True or False: ${template.statement}`,
    correctAnswer: template.isTrue,
    explanation: template.explanation
  };
}

export async function generateQuestions(terms: Term[], count: number, category: string, type: string): Promise<Question[]> {
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

      // Determine question type
      const questionType = type === 'all'
        ? i % 2 === 0 ? 'multiple-choice' : 'true-false'
        : type;

      const question = questionType === 'multiple-choice'
        ? generateMultipleChoiceQuestion(term, availableTerms)
        : generateTrueFalseQuestion(term, availableTerms);

      questions.push(question);
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}