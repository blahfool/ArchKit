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
    `Which of the following best describes ${term.term}?`,
    `In architectural design, what is the primary function of ${term.term}?`,
    `How is ${term.term} typically implemented in architectural practice?`,
    `What is the key characteristic of ${term.term}?`
  ];

  // Create plausible but incorrect options
  const incorrectOptions = relatedTerms
    .map(t => t.definition)
    .filter(def => def !== term.definition)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return {
    id: Date.now(),
    type: 'multiple-choice',
    category: term.category,
    question: questionTemplates[Math.floor(Math.random() * questionTemplates.length)],
    options: [term.definition, ...incorrectOptions].sort(() => Math.random() - 0.5),
    correctAnswer: term.definition,
    explanation: `${term.term} is ${term.definition}. This concept is important in ${term.category.toLowerCase()}.`
  };
}

function generateTrueFalseQuestion(term: Term, allTerms: Term[]): TrueFalseQuestion {
  // Generate true/false statements about the term
  const trueFalseTemplates = [
    { 
      statement: term.definition,
      isTrue: true
    },
    { 
      statement: `${term.term} is primarily used for ${allTerms.find(t => t.category !== term.category)?.definition.toLowerCase() || 'a different purpose entirely'}`,
      isTrue: false
    },
    {
      statement: `${term.term} is a key concept in ${term.category}`,
      isTrue: true
    }
  ];

  const selectedTemplate = trueFalseTemplates[Math.floor(Math.random() * trueFalseTemplates.length)];

  return {
    id: Date.now(),
    type: 'true-false',
    category: term.category,
    question: `True or False: ${selectedTemplate.statement}`,
    correctAnswer: selectedTemplate.isTrue,
    explanation: selectedTemplate.isTrue 
      ? `This statement is correct. ${term.term} ${term.definition}`
      : `This statement is false. ${term.term} actually ${term.definition}`
  };
}

export async function generateQuestions(terms: Term[], count: number, category: string, type: string): Promise<Question[]> {
  try {
    const availableTerms = category === "all" 
      ? terms 
      : terms.filter(term => term.category === category);

    if (availableTerms.length === 0) {
      throw new Error('No terms available for question generation');
    }

    const questions: Question[] = [];
    const usedTerms = new Set<number>();

    while (questions.length < count && usedTerms.size < availableTerms.length) {
      // Get random unused term
      const availableIndices = availableTerms
        .map((_, index) => index)
        .filter(index => !usedTerms.has(index));

      if (availableIndices.length === 0) break;

      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      usedTerms.add(randomIndex);
      const term = availableTerms[randomIndex];

      // Generate either multiple choice or true/false question
      const questionType = type === 'all'
        ? Math.random() > 0.5 ? 'multiple-choice' : 'true-false'
        : type;

      if (questionType === 'multiple-choice') {
        questions.push(generateMultipleChoiceQuestion(term, availableTerms));
      } else {
        questions.push(generateTrueFalseQuestion(term, availableTerms));
      }
    }

    return questions.slice(0, count);
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}