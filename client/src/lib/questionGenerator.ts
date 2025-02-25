import { Term } from "@shared/schema";

interface QuestionTemplate {
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'chronological' | 'calculation';
  generate: (term: Term) => Question;
}

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

interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill-in-blank';
  correctKeywords: string[];
}

interface ChronologicalQuestion extends BaseQuestion {
  type: 'chronological';
  events: string[];
  correctOrder: number[];
}

interface CalculationQuestion extends BaseQuestion {
  type: 'calculation';
  formula: string;
  correctAnswer: number;
  tolerance: number;
  unit: string;
}

type Question = MultipleChoiceQuestion | TrueFalseQuestion | FillInBlankQuestion | ChronologicalQuestion | CalculationQuestion;

const templates: QuestionTemplate[] = [
  {
    type: 'multiple-choice',
    generate: (term: Term): MultipleChoiceQuestion => {
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
    generate: (term: Term): TrueFalseQuestion => ({
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
    generate: (term: Term): FillInBlankQuestion => ({
      id: Date.now(),
      type: 'fill-in-blank',
      category: term.category,
      question: `_____ is defined as ${term.definition}`,
      correctKeywords: [term.term.toLowerCase()],
      explanation: `The correct term is ${term.term}, which is defined as: ${term.definition}`
    })
  },
  {
    type: 'calculation',
    generate: (term: Term): CalculationQuestion => {
      const calculations = [
        {
          question: "Calculate the floor area ratio (FAR) for a building with total floor area of 25,000 sq ft on a lot of 10,000 sq ft.",
          formula: "FAR = Total Floor Area / Lot Area",
          correctAnswer: 2.5,
          tolerance: 0.1,
          unit: "ratio"
        },
        {
          question: "Calculate the required number of parking spaces for a 30,000 sq ft office building if the requirement is 1 space per 300 sq ft.",
          formula: "Parking Spaces = Total Floor Area / Area per Space",
          correctAnswer: 100,
          tolerance: 0,
          unit: "spaces"
        },
        {
          question: "Calculate the U-value of a wall assembly if R-value is 15 ft²·°F·h/BTU.",
          formula: "U-value = 1 / R-value",
          correctAnswer: 0.067,
          tolerance: 0.005,
          unit: "BTU/(ft²·°F·h)"
        },
        {
          question: "Calculate the minimum width of an emergency egress corridor that needs to accommodate 200 occupants (0.2 inches per occupant).",
          formula: "Width = Number of Occupants × Width per Occupant",
          correctAnswer: 40,
          tolerance: 0,
          unit: "inches"
        }
      ];

      const calc = calculations[Math.floor(Math.random() * calculations.length)];

      return {
        id: Date.now(),
        type: 'calculation',
        category: 'Building Systems',
        question: calc.question,
        formula: calc.formula,
        correctAnswer: calc.correctAnswer,
        tolerance: calc.tolerance,
        unit: calc.unit,
        explanation: `Using the formula: ${calc.formula}, we can solve this problem. This is a common calculation in architectural practice.`
      };
    }
  }
];

export function generateQuestions(terms: Term[], count: number, category: string, type: string): Question[] {
  const availableTerms = category === "all" 
    ? terms 
    : terms.filter(term => term.category === category);

  const template = templates.find(t => t.type === type);
  if (!template || availableTerms.length === 0) return [];

  const questions: Question[] = [];
  const usedTerms = new Set<number>();

  while (questions.length < count && usedTerms.size < availableTerms.length) {
    if (type === 'calculation') {
      questions.push(template.generate(availableTerms[0]) as Question);
      if (questions.length >= count) break;
      continue;
    }

    let availableIndices = availableTerms
      .map((_, index) => index)
      .filter(index => !usedTerms.has(index));

    if (availableIndices.length === 0) break;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedTerms.add(randomIndex);

    const term = availableTerms[randomIndex];
    questions.push(template.generate(term) as Question);
  }

  return questions;
}