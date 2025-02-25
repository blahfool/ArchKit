import { Term } from "@shared/schema";

interface QuestionTemplate {
  type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'chronological' | 'calculation' | 'complex';
  generate: (term: Term, allTerms: Term[]) => Question;
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
  steps: string[];
}

interface ComplexQuestion extends BaseQuestion {
  type: 'complex';
  parts: {
    question: string;
    correctAnswer: string;
    explanation: string;
  }[];
  dependencies: boolean[]; // If part N depends on part N-1
}

type Question = MultipleChoiceQuestion | TrueFalseQuestion | FillInBlankQuestion | ChronologicalQuestion | CalculationQuestion | ComplexQuestion;

const templates: QuestionTemplate[] = [
  {
    type: 'multiple-choice',
    generate: (term: Term, allTerms: Term[]): MultipleChoiceQuestion => {
      // Find related terms in the same category for more challenging options
      const relatedTerms = allTerms.filter(t => 
        t.category === term.category && t.id !== term.id
      );

      // Create plausible but incorrect options
      const otherOptions = relatedTerms
        .slice(0, 3)
        .map(t => t.definition)
        .concat([
          `A combination of ${term.term} and ${relatedTerms[0]?.term || 'another concept'}`,
          `The opposite application of ${term.term}`,
        ])
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      return {
        id: Date.now(),
        type: 'multiple-choice',
        category: term.category,
        question: `Which statement most accurately describes ${term.term} and its application in architectural design?`,
        options: [term.definition, ...otherOptions],
        correctAnswer: term.definition,
        explanation: `${term.term} is correctly defined as: ${term.definition}. Understanding this concept is crucial for architectural design decisions.`
      };
    }
  },
  {
    type: 'calculation',
    generate: (term: Term): CalculationQuestion => {
      const calculations = [
        {
          question: "For a multi-story building project:\n1. Calculate the Floor Area Ratio (FAR) if the total floor area is 45,000 sq ft on a lot of 15,000 sq ft\n2. Determine if this meets zoning requirements of max FAR 2.8\n3. If not compliant, calculate the maximum allowable floor area",
          formula: "FAR = Total Floor Area / Lot Area\nMax Floor Area = Lot Area × Max FAR",
          correctAnswer: 3,
          tolerance: 0.1,
          unit: "ratio",
          steps: [
            "Calculate FAR: 45,000 / 15,000 = 3.0",
            "Compare with max FAR: 3.0 > 2.8 (not compliant)",
            "Calculate max allowed: 15,000 × 2.8 = 42,000 sq ft"
          ]
        },
        {
          question: "For an office building renovation:\n1. Calculate required parking spaces if requirement is 1 space per 250 sq ft\n2. Given a floor area of 28,750 sq ft\n3. Include 15% additional spaces for visitors\n4. Round up to nearest whole number",
          formula: "Base Spaces = Floor Area / Area per Space\nTotal Spaces = Base Spaces × (1 + Visitor Percentage)",
          correctAnswer: 133,
          tolerance: 0,
          unit: "spaces",
          steps: [
            "Base spaces: 28,750 / 250 = 115",
            "Add 15% visitor spaces: 115 × 1.15 = 132.25",
            "Round up: 133 spaces"
          ]
        },
        {
          question: "For a wall assembly design:\n1. Calculate the total R-value given:\n- Exterior air film (R-0.17)\n- 8\" concrete block (R-1.11)\n- 2\" polyiso insulation (R-13)\n- 5/8\" gypsum board (R-0.56)\n- Interior air film (R-0.68)\n2. Then calculate the U-value\n3. Determine if it meets code minimum U-0.064",
          formula: "Total R-value = Sum of all R-values\nU-value = 1 / R-value",
          correctAnswer: 15.52,
          tolerance: 0.1,
          unit: "R-value",
          steps: [
            "Sum R-values: 0.17 + 1.11 + 13 + 0.56 + 0.68 = 15.52",
            "Calculate U-value: 1/15.52 = 0.0644",
            "Compare: 0.0644 < 0.064 (meets code)"
          ]
        }
      ];

      const calc = calculations[Math.floor(Math.random() * calculations.length)];
      return {
        id: Date.now(),
        type: 'calculation',
        category: 'Building Systems',
        ...calc
      };
    }
  },
  {
    type: 'complex',
    generate: (term: Term, allTerms: Term[]): ComplexQuestion => {
      // Find related terms for creating complex relationships
      const relatedTerms = allTerms.filter(t => 
        t.category === term.category && t.id !== term.id
      ).slice(0, 2);

      return {
        id: Date.now(),
        type: 'complex',
        category: term.category,
        question: `Multi-part analysis of ${term.term} in architectural design:`,
        parts: [
          {
            question: `Define ${term.term} and explain its primary function in architectural design.`,
            correctAnswer: term.definition,
            explanation: `Understanding ${term.term} is fundamental as it ${term.definition.toLowerCase()}`
          },
          {
            question: `How does ${term.term} interact with ${relatedTerms[0]?.term || 'related systems'} in practice?`,
            correctAnswer: `The interaction between ${term.term} and ${relatedTerms[0]?.term || 'related systems'} requires careful consideration of both elements' properties and functions.`,
            explanation: `This relationship is crucial for integrated design solutions.`
          },
          {
            question: `Propose a design solution that optimizes both ${term.term} and ${relatedTerms[1]?.term || 'environmental factors'}.`,
            correctAnswer: `A comprehensive solution should consider the properties of ${term.term} while accounting for ${relatedTerms[1]?.term || 'environmental factors'}.`,
            explanation: `This tests ability to synthesize multiple concepts in practical application.`
          }
        ],
        dependencies: [false, true, true],
        explanation: `This analysis demonstrates the interconnected nature of architectural concepts and their practical applications.`
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
    let availableIndices = availableTerms
      .map((_, index) => index)
      .filter(index => !usedTerms.has(index));

    if (availableIndices.length === 0) break;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedTerms.add(randomIndex);

    const term = availableTerms[randomIndex];
    questions.push(template.generate(term, availableTerms) as Question);
  }

  return questions;
}