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

// Cache for storing fetched questions
let questionCache: Question[] = [];

// Function to fetch questions from online source
async function fetchQuestions(amount: number = 50): Promise<Question[]> {
  try {
    // Fetch both multiple choice and true/false questions
    const [mcResponse, tfResponse] = await Promise.all([
      fetch(`https://api.opentdb.com/api.php?amount=${amount}&category=24&type=multiple`),
      fetch(`https://api.opentdb.com/api.php?amount=${amount}&category=24&type=boolean`)
    ]);

    const [mcData, tfData] = await Promise.all([
      mcResponse.json(),
      tfResponse.json()
    ]);

    const mcQuestions: MultipleChoiceQuestion[] = mcData.results.map((q: any, index: number) => ({
      id: Date.now() + index,
      type: 'multiple-choice',
      category: 'Architecture & Engineering',
      question: decodeHTMLEntities(q.question),
      options: [q.correct_answer, ...q.incorrect_answers].map(decodeHTMLEntities).sort(() => Math.random() - 0.5),
      correctAnswer: decodeHTMLEntities(q.correct_answer),
      explanation: generateExplanation(q.correct_answer, q.category)
    }));

    const tfQuestions: TrueFalseQuestion[] = tfData.results.map((q: any, index: number) => ({
      id: Date.now() + index + 1000,
      type: 'true-false',
      category: 'Architecture & Engineering',
      question: decodeHTMLEntities(q.question),
      correctAnswer: q.correct_answer === "True",
      explanation: generateExplanation(q.correct_answer, q.category)
    }));

    return [...mcQuestions, ...tfQuestions];
  } catch (error) {
    console.error('Failed to fetch online questions:', error);
    return [];
  }
}

// Helper function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Generate detailed explanations for answers
function generateExplanation(answer: string, category: string): string {
  const explanations = [
    "This concept is fundamental to architectural design principles.",
    "Understanding this helps in making informed design decisions.",
    "This is a key consideration in sustainable architecture.",
    "This relates to structural integrity and building safety.",
    "This principle affects both aesthetics and functionality.",
    "This is crucial for meeting building codes and regulations."
  ];

  return `The correct answer is ${answer}. ${explanations[Math.floor(Math.random() * explanations.length)]} This type of question often appears in professional architecture examinations.`;
}

// Function to get questions, either from cache or fetch new ones
async function getQuestions(count: number): Promise<Question[]> {
  if (questionCache.length < count) {
    try {
      const newQuestions = await fetchQuestions();
      questionCache = [...questionCache, ...newQuestions];
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  // Shuffle and return requested number of questions
  return questionCache
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export async function generateQuestions(terms: Term[], count: number, category: string, type: string): Promise<Question[]> {
  return getQuestions(count);
}