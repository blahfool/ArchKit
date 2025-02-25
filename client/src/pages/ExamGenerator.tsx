import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/BackButton";
import type { Term } from "@shared/schema";

interface Question {
  id: number;
  term: Term;
  type: 'multiple' | 'text';
  userAnswer?: string;
  options?: string[];
  isCorrect?: boolean;
}

type ExamType = 'multiple' | 'text' | 'mixed';

export default function ExamGenerator() {
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [examType, setExamType] = useState<ExamType>('mixed');

  const { data: terms } = useQuery<Term[]>({ 
    queryKey: ["/api/terms"]
  });

  const generateMultipleChoiceOptions = (correctTerm: Term, allTerms: Term[]) => {
    const otherTerms = allTerms.filter(t => t.id !== correctTerm.id);
    const shuffled = [...otherTerms].sort(() => Math.random() - 0.5);
    const incorrectOptions = shuffled.slice(0, 3).map(t => t.term);
    const options = [...incorrectOptions, correctTerm.term].sort(() => Math.random() - 0.5);
    return options;
  };

  const generateExam = () => {
    if (!terms) return;

    const shuffled = [...terms].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numQuestions);

    const newQuestions = selected.map((term, idx) => {
      // Determine question type based on examType
      let questionType: 'multiple' | 'text';
      if (examType === 'mixed') {
        questionType = Math.random() > 0.5 ? 'multiple' : 'text';
      } else {
        questionType = examType;
      }

      return {
        id: idx,
        term,
        type: questionType,
        userAnswer: "",
        options: questionType === 'multiple' ? generateMultipleChoiceOptions(term, terms) : undefined,
        isCorrect: false
      };
    });

    setQuestions(newQuestions);
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
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Exam Generator</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Input
                  id="numQuestions"
                  type="number"
                  min={1}
                  max={terms?.length || 50}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Exam Type</Label>
                <RadioGroup 
                  value={examType}
                  onValueChange={(value: ExamType) => setExamType(value)}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple" id="multiple" />
                    <Label htmlFor="multiple">Multiple Choice Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">Text Input Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed">Mixed Questions</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={generateExam}
                className="w-full sm:w-auto"
              >
                Generate Exam
              </Button>
            </div>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <Card key={q.id} className="break-inside-avoid">
                <CardContent className="pt-6">
                  <p className="font-medium mb-4">
                    Question {idx + 1}: {q.term.definition}
                  </p>

                  {q.type === 'multiple' ? (
                    <RadioGroup
                      value={q.userAnswer}
                      onValueChange={(value) => {
                        const updated = questions.map(question =>
                          question.id === q.id
                            ? { ...question, userAnswer: value }
                            : question
                        );
                        setQuestions(updated);
                      }}
                      className="space-y-2"
                      disabled={showResults}
                    >
                      {q.options?.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${q.id}-opt${i}`} />
                          <Label 
                            htmlFor={`q${q.id}-opt${i}`}
                            className={showResults ? 
                              (option === q.term.term ? "text-green-600" : 
                               q.userAnswer === option ? "text-red-600" : "") : ""
                            }
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
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
                      disabled={showResults}
                    />
                  )}

                  {showResults && !q.isCorrect && (
                    <p className="mt-2 text-red-600">
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