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
  // Find related terms in the same category
  const relatedTerms = allTerms.filter(t => 
    t.category === term.category && t.id !== term.id
  );

  // More sophisticated question templates
  const questionTemplates = [
    // Basic definition
    `Which of the following best describes ${term.term}?`,
    // Application-focused
    `In architectural practice, how is ${term.term} typically implemented?`,
    // Relationship-focused
    `How does ${term.term} contribute to ${term.category}?`,
    // Purpose-focused
    `What is the primary purpose of ${term.term} in architectural design?`,
    // Characteristic-focused
    `Which characteristic best defines ${term.term}?`
  ];

  // Select challenging incorrect options
  let incorrectOptions: string[] = [];

  // First, try to get related terms from the same category
  if (relatedTerms.length >= 3) {
    // Sort related terms by similarity to create challenging options
    incorrectOptions = relatedTerms
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(t => t.definition);
  } else {
    // If we don't have enough related terms, get some from related categories
    const relatedCategories = new Set([
      term.category,
      'Design Principles',
      'Construction',
      'Environmental Design',
      'Sustainability'
    ]);

    const similarTerms = allTerms.filter(t => 
      t.id !== term.id && 
      relatedCategories.has(t.category)
    );

    incorrectOptions = similarTerms
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(t => t.definition);
  }

  // Generate detailed explanation
  const explanation = `${term.term} is ${term.definition}. This concept is crucial in ${term.category}, particularly when considering architectural design and implementation. Understanding this helps architects make informed decisions about building design and functionality.`;

  return {
    id: Date.now() + Math.random(),
    type: 'multiple-choice',
    category: term.category,
    question: questionTemplates[Math.floor(Math.random() * questionTemplates.length)],
    options: [term.definition, ...incorrectOptions].sort(() => Math.random() - 0.5),
    correctAnswer: term.definition,
    explanation
  };
}

function generateTrueFalseQuestion(term: Term, allTerms: Term[]): TrueFalseQuestion {
  // More sophisticated true/false templates
  const trueFalseTemplates = [
    {
      statement: `${term.definition}`,
      isTrue: true,
      explanation: `This is correct. ${term.term} is precisely defined as ${term.definition}. This understanding is fundamental to ${term.category}.`
    },
    {
      // Find a related term to create a plausible but false statement
      statement: `${term.term} is primarily used for ${
        allTerms.find(t => 
          t.category !== term.category && 
          t.definition.length < 100
        )?.definition.toLowerCase() || 'a different purpose entirely'
      }`,
      isTrue: false,
      explanation: `This is incorrect. ${term.term} actually ${term.definition}. The statement confuses this concept with a different architectural principle.`
    },
    {
      statement: `${term.term} is a fundamental concept in ${term.category} that directly impacts building design and functionality`,
      isTrue: true,
      explanation: `This is correct. ${term.term} is indeed a key concept in ${term.category}, specifically because ${term.definition}`
    },
    {
      // Create a false relationship with another concept
      statement: `${term.term} is exclusively used in ${
        allTerms.find(t => 
          t.category !== term.category
        )?.category || 'unrelated field'
      }`,
      isTrue: false,
      explanation: `This is incorrect. While ${term.term} may have applications in other areas, it is primarily defined as ${term.definition} and is most relevant to ${term.category}.`
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
    let termPool = [...availableTerms];

    while (questions.length < count) {
      // Replenish the term pool if needed
      if (termPool.length === 0) {
        termPool = [...availableTerms];
      }

      // Get a random term from the pool
      const randomIndex = Math.floor(Math.random() * termPool.length);
      const term = termPool[randomIndex];
      termPool.splice(randomIndex, 1);

      // Determine question type, ensuring a good mix
      const questionType = type === 'all'
        ? questions.length % 2 === 0 ? 'multiple-choice' : 'true-false'
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