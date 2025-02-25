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
  // More sophisticated question templates
  const questionTemplates = [
    // Definition-based
    `Which of the following best describes ${term.term}?`,
    // Application-focused
    `How is ${term.term} typically applied in architectural design?`,
    // Purpose-focused
    `What is the primary function of ${term.term} in ${term.category}?`,
    // Relationship-focused
    `How does ${term.term} relate to building design and functionality?`,
    // Context-focused
    `In the context of ${term.category}, what defines ${term.term}?`
  ];

  // Find terms in the same category for more challenging options
  const sameCategory = allTerms.filter(t => 
    t.category === term.category && 
    t.id !== term.id &&
    t.definition !== term.definition
  );

  // Find terms with related concepts
  const relatedCategories = new Set([
    'Design Principles',
    'Construction',
    'Environmental Design',
    'Sustainability',
    term.category
  ]);

  const relatedTerms = allTerms.filter(t =>
    t.id !== term.id &&
    t.definition !== term.definition &&
    relatedCategories.has(t.category)
  );

  // Prioritize same category terms, then related categories
  let incorrectOptions: string[] = [];

  // Get 2 terms from same category if available
  if (sameCategory.length >= 2) {
    incorrectOptions.push(...sameCategory
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(t => t.definition)
    );
  }

  // Fill remaining with related terms
  const remainingNeeded = 3 - incorrectOptions.length;
  if (remainingNeeded > 0) {
    incorrectOptions.push(...relatedTerms
      .filter(t => !incorrectOptions.includes(t.definition))
      .sort(() => Math.random() - 0.5)
      .slice(0, remainingNeeded)
      .map(t => t.definition)
    );
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
      statement: `${term.term} primarily serves to ${allTerms.find(t => 
        t.category !== term.category && 
        t.definition.length < 100
      )?.definition.toLowerCase() || 'perform a different function entirely'}`,
      isTrue: false,
      explanation: `This is incorrect. ${term.term} actually ${term.definition}. The statement confuses this concept with a different architectural principle.`
    },
    {
      statement: `${term.term} is a fundamental concept in ${term.category} that impacts ${
        term.category === 'Design Principles' ? 'architectural decision-making' :
        term.category === 'Construction' ? 'building integrity' :
        term.category === 'Sustainability' ? 'environmental performance' :
        term.category === 'Environmental Design' ? 'occupant comfort' :
        'building functionality'
      }`,
      isTrue: true,
      explanation: `This is correct. ${term.term} is indeed a key concept in ${term.category}, specifically because ${term.definition}`
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

    // Get available terms based on category
    const availableTerms = category === "all" 
      ? allTerms 
      : allTerms.filter(term => term.category === category);

    if (availableTerms.length === 0) {
      throw new Error('No terms available for question generation');
    }

    const questions: Question[] = [];
    let termPool = [...availableTerms];

    // Ensure we generate exactly the requested number of questions
    while (questions.length < count) {
      // Replenish term pool if needed
      if (termPool.length === 0) {
        termPool = [...availableTerms];
      }

      // Get random term
      const randomIndex = Math.floor(Math.random() * termPool.length);
      const term = termPool[randomIndex];
      termPool.splice(randomIndex, 1);

      // Alternate between question types if 'all' is selected
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