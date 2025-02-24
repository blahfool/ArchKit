import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import BackButton from "@/components/BackButton";
import type { Term } from "@shared/schema";

interface Question {
  id: number;
  term: Term;
  userAnswer?: string;
  isCorrect?: boolean;
}

export default function ExamGenerator() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { data: terms } = useQuery<Term[]>({ 
    queryKey: ["/api/terms"]
  });

  const generateExam = () => {
    if (!terms) return;
    
    const shuffled = [...terms].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numQuestions);
    
    setQuestions(selected.map((term, idx) => ({
      id: idx,
      term,
      userAnswer: "",
      isCorrect: false
    })));
    
    setShowResults(false);
  };

  const handleSubmit = async () => {
    const graded = questions.map(q => ({
      ...q,
      isCorrect: q.userAnswer?.toLowerCase().trim() === 
                 q.term.term.toLowerCase().trim()
    }));
    setQuestions(graded);
    setShowResults(true);

    const score = graded.filter(q => q.isCorrect).length;
    await fetch('/api/quiz-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, total: questions.length })
    });
  };

  const score = questions.filter(q => q.isCorrect).length;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Exam Generator</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={1}
                max={terms?.length || 50}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-32"
              />
              <Button onClick={generateExam}>Generate Exam</Button>
            </div>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <Card key={q.id}>
                <CardContent className="pt-6">
                  <p className="font-medium mb-2">
                    Question {idx + 1}: {q.term.definition}
                  </p>
                  <Input
                    placeholder="Your answer"
                    value={q.userAnswer}
                    onChange={(e) => {
                      const updated = questions.map(question =>
                        question.id === q.id
                          ? { ...question, userAnswer: e.target.value }
                          : question
                      );
                      setQuestions(updated);
                    }}
                    className={showResults ? (q.isCorrect ? "border-green-500" : "border-red-500") : ""}
                  />
                  {showResults && (
                    <p className={`mt-2 ${q.isCorrect ? "text-green-600" : "text-red-600"}`}>
                      Correct answer: {q.term.term}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={showResults}
            >
              Submit
            </Button>

            {showResults && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-lg font-medium">
                    Your Score: {score} / {questions.length} ({Math.round(score/questions.length * 100)}%)
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <BackButton />
    </div>
  );
}
