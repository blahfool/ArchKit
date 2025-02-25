import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/BackButton";
import type { Term } from "@shared/schema";

export default function Assessment() {
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const { data: terms } = useQuery<Term[]>({
    queryKey: ["/api/terms"],
  });

  const questions = terms?.map(term => ({
    question: `What best describes the term "${term.term}"?`,
    correctAnswer: term.definition,
    options: [
      term.definition,
      // In a real app, we would have wrong options from the database
      "Incorrect option 1",
      "Incorrect option 2",
      "Incorrect option 3",
    ].sort(() => Math.random() - 0.5),
  })) ?? [];

  const handleSubmit = () => {
    if (!questions.length) return;

    const correct = Object.entries(answers).reduce((acc, [qIndex, answer]) => {
      return acc + (answer === questions[parseInt(qIndex)].correctAnswer ? 1 : 0);
    }, 0);

    setScore((correct / questions.length) * 100);
  };

  if (!terms?.length) {
    return (
      <div className="min-h-screen p-4">
        <Card>
          <CardContent className="pt-6">
            Loading questions...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Architecture Assessment</h1>

      <div className="max-w-2xl mx-auto">
        {score === null ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">
                    Question {currentQuestion + 1} of {questions.length}
                  </h2>
                  <p className="text-lg mb-4">{questions[currentQuestion].question}</p>

                  <RadioGroup
                    value={answers[currentQuestion]}
                    onValueChange={(value) => {
                      setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
                    }}
                  >
                    {questions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  {currentQuestion === questions.length - 1 ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length !== questions.length}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Assessment Results</h2>
              <p className="text-3xl font-bold mb-4">{score.toFixed(1)}%</p>
              <Button onClick={() => {
                setScore(null);
                setCurrentQuestion(0);
                setAnswers({});
              }}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <BackButton />
    </div>
  );
}