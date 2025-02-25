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

type Question = MultipleChoiceQuestion | TrueFalseQuestion;

function generateMultipleChoiceQuestion(term: Term, allTerms: Term[]): MultipleChoiceQuestion {
  // Find related terms in the same category for more challenging options
  const relatedTerms = allTerms.filter(t => 
    t.category === term.category && t.id !== term.id
  );

  // Question templates for variety
  const questionTemplates = [
    `What is ${term.term}?`,
    `Which of the following best describes ${term.term}?`,
    `In architectural design, what is ${term.term}?`,
    `How would you define ${term.term}?`
  ];

  // Create plausible but incorrect options
  let incorrectOptions = relatedTerms
    .map(t => t.definition)
    .filter(def => def !== term.definition)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // If we don't have enough related terms, use terms from other categories
  if (incorrectOptions.length < 3) {
    const otherTerms = allTerms
      .filter(t => t.category !== term.category && t.id !== term.id)
      .map(t => t.definition)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 - incorrectOptions.length);

    incorrectOptions = [...incorrectOptions, ...otherTerms];
  }

  return {
    id: Date.now() + Math.random(),
    type: 'multiple-choice',
    category: term.category,
    question: questionTemplates[Math.floor(Math.random() * questionTemplates.length)],
    options: [term.definition, ...incorrectOptions].sort(() => Math.random() - 0.5),
    correctAnswer: term.definition,
    explanation: `${term.term} is ${term.definition}. This concept is important in ${term.category.toLowerCase()}.`
  };
}

function generateTrueFalseQuestion(term: Term, allTerms: Term[]): TrueFalseQuestion {
  const trueFalseTemplates = [
    {
      statement: term.definition,
      isTrue: true,
      explanation: `This is correct. ${term.term} is indeed ${term.definition}.`
    },
    {
      statement: `${term.term} is ${allTerms.find(t => t.category !== term.category)?.definition}`,
      isTrue: false,
      explanation: `This is incorrect. ${term.term} actually refers to ${term.definition}.`
    },
    {
      statement: `${term.term} is a concept primarily used in ${term.category}`,
      isTrue: true,
      explanation: `This is correct. ${term.term} is a key concept in ${term.category}.`
    }
  ];

  const template = trueFalseTemplates[Math.floor(Math.random() * trueFalseTemplates.length)];

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
    // Use fallback terms if no terms are provided
    const allTerms = terms.length > 0 ? terms : await import('@shared/schema').then(m => m.fallbackTerms);

    // Filter terms by category if specified
    const availableTerms = category === "all" 
      ? allTerms 
      : allTerms.filter(term => term.category === category);

    if (availableTerms.length === 0) {
      throw new Error('No terms available for question generation');
    }

    const questions: Question[] = [];

    // Create a copy of terms that we can shuffle and reuse if needed
    let termPool = [...availableTerms];

    while (questions.length < count) {
      // If we've used all terms, reset the pool
      if (termPool.length === 0) {
        termPool = [...availableTerms];
      }

      // Get a random term from the pool
      const randomIndex = Math.floor(Math.random() * termPool.length);
      const term = termPool[randomIndex];

      // Remove the used term from the pool
      termPool.splice(randomIndex, 1);

      // Generate either multiple choice or true/false question
      const questionType = type === 'all'
        ? Math.random() > 0.5 ? 'multiple-choice' : 'true-false'
        : type;

      const question = questionType === 'multiple-choice'
        ? generateMultipleChoiceQuestion(term, availableTerms)
        : generateTrueFalseQuestion(term, availableTerms);

      questions.push(question);
    }

    console.log(`Generated ${questions.length} questions successfully`);
    return questions;

  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}