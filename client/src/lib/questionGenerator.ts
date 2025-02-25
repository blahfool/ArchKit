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

// Helper function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Generate detailed explanations for answers
function generateExplanation(answer: string, category: string): string {
  const explanations = [
    "This principle is fundamental to architectural design and planning.",
    "Understanding this concept is crucial for structural integrity.",
    "This knowledge is essential for sustainable architecture practices.",
    "This relates directly to building safety and regulations.",
    "This concept influences both form and function in design.",
    "This is a key consideration in modern architectural practices."
  ];

  return `The correct answer is ${answer}. ${explanations[Math.floor(Math.random() * explanations.length)]} This topic frequently appears in architectural examinations and professional practice.`;
}

// Function to fetch questions with retries
async function fetchQuestionsWithRetry(amount: number, retries = 3): Promise<any[]> {
  for (let i = 0; i < retries; i++) {
    try {
      const [mcResponse, tfResponse] = await Promise.all([
        fetch(`https://api.opentdb.com/api.php?amount=${Math.ceil(amount/2)}&category=24&type=multiple`),
        fetch(`https://api.opentdb.com/api.php?amount=${Math.floor(amount/2)}&category=24&type=boolean`)
      ]);

      if (!mcResponse.ok || !tfResponse.ok) {
        throw new Error('Failed to fetch questions');
      }

      const [mcData, tfData] = await Promise.all([
        mcResponse.json(),
        tfResponse.json()
      ]);

      return [...mcData.results, ...tfData.results];
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
  return [];
}

// Function to fetch questions from online source
async function fetchQuestions(requestedCount: number): Promise<Question[]> {
  try {
    const questions: Question[] = [];
    let attempts = 0;
    const maxAttempts = 3;

    while (questions.length < requestedCount && attempts < maxAttempts) {
      const results = await fetchQuestionsWithRetry(requestedCount * 2);
      console.log(`Fetched ${results.length} questions from API`);

      for (const q of results) {
        const question = decodeHTMLEntities(q.question);
        const isMultipleChoice = q.type === 'multiple';

        if (isMultipleChoice) {
          const options = [q.correct_answer, ...q.incorrect_answers]
            .map(decodeHTMLEntities)
            .sort(() => Math.random() - 0.5);

          questions.push({
            id: Date.now() + questions.length,
            type: 'multiple-choice',
            category: 'Architecture & Engineering',
            question,
            options,
            correctAnswer: decodeHTMLEntities(q.correct_answer),
            explanation: generateExplanation(decodeHTMLEntities(q.correct_answer), q.category)
          });
        } else {
          questions.push({
            id: Date.now() + questions.length,
            type: 'true-false',
            category: 'Architecture & Engineering',
            question,
            correctAnswer: q.correct_answer === "True",
            explanation: generateExplanation(q.correct_answer, q.category)
          });
        }

        if (questions.length >= requestedCount) {
          break;
        }
      }

      attempts++;
    }

    console.log(`Generated ${questions.length} questions total`);
    return questions;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return [];
  }
}

export async function generateQuestions(terms: Term[], count: number, category: string, type: string): Promise<Question[]> {
  try {
    const newQuestions = await fetchQuestions(count);
    if (newQuestions.length >= count) {
      return newQuestions.slice(0, count);
    }

    // If we couldn't get enough new questions, combine with cache
    const combinedQuestions = [...newQuestions, ...questionCache];
    questionCache = combinedQuestions; // Update cache with new questions

    const finalQuestions = combinedQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    console.log(`Returning ${finalQuestions.length} questions`);
    return finalQuestions;
  } catch (error) {
    console.error('Error getting questions:', error);
    // Fallback to cache if available
    const cachedQuestions = questionCache
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    console.log(`Returning ${cachedQuestions.length} cached questions`);
    return cachedQuestions;
  }
}