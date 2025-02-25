import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ListFilter,
  Loader2
} from "lucide-react";
import { generateQuestions } from "@/lib/questionGenerator";
import { fallbackTerms } from "@shared/schema";
import type { Term } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";


interface BaseQuestion {
  id: number;
  category: string;
  question: string;
  explanation: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'true-false' | 'chronological' | 'calculation';
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

interface FillInBlankQuestion extends BaseQuestion {
  type: 'fill-in-blank';
  correctKeywords: string[];
}

interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
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
  tolerance: number; // Percentage of acceptable deviation
  unit: string;
}

type Question = MultipleChoiceQuestion | FillInBlankQuestion | TrueFalseQuestion | ChronologicalQuestion | CalculationQuestion;


export default function Assessment() {
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isActive, setIsActive] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['multiple-choice']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: apiTerms } = useQuery<Term[]>({
    queryKey: ["/api/terms"]
  });

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'fill-in-blank', label: 'Fill in the Blank' },
    { value: 'true-false', label: 'True/False' },
    { value: 'chronological', label: 'Chronological Order' },
    { value: 'calculation', label: 'Calculation' }
  ];

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const terms = apiTerms
        ? [...apiTerms, ...fallbackTerms.map((t, i) => ({ ...t, id: 1000 + i }))]
        : fallbackTerms.map((t, i) => ({ ...t, id: 1000 + i }));

      let generatedQuestions: Question[] = [];
      for (const type of selectedTypes) {
        const typeQuestions = generateQuestions(
          terms,
          Math.floor(questionCount / selectedTypes.length),
          "all",
          type
        );
        generatedQuestions = [...generatedQuestions, ...typeQuestions];
      }

      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setIsActive(true);
        setScore(null);
        setAnswers({});
        setCurrentQuestion(0);
        setTimeLeft(3600);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate questions. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to start assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!questions.length) return;

    const correct = questions.reduce((acc, q, index) => {
      const answer = answers[index];
      let isCorrect = false;

      switch (q.type) {
        case 'multiple-choice':
          isCorrect = answer === q.correctAnswer;
          break;
        case 'fill-in-blank':
          isCorrect = q.correctKeywords.some(keyword =>
            answer?.toLowerCase().includes(keyword.toLowerCase())
          );
          break;
        case 'true-false':
          isCorrect = answer === q.correctAnswer;
          break;
        case 'chronological':
          isCorrect = JSON.stringify(answer) === JSON.stringify(q.correctOrder);
          break;
        case 'calculation':
          const percentError = Math.abs((answer - q.correctAnswer) / q.correctAnswer * 100);
          isCorrect = percentError <= q.tolerance;
          break;
      }

      return acc + (isCorrect ? 1 : 0);
    }, 0);

    setScore((correct / questions.length) * 100);
    setIsActive(false);
    setShowExplanation(true);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'calculation':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-mono">{question.formula}</p>
            </div>
            <Input
              type="number"
              step="0.01"
              value={answers[currentQuestion] || ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
                }
              }}
              placeholder={`Enter your answer (${question.unit})`}
              className="mt-2"
            />
          </div>
        );

      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[currentQuestion]}
            onValueChange={(value) => {
              setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
            }}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'fill-in-blank':
        return (
          <Input
            value={answers[currentQuestion] || ''}
            onChange={(e) => {
              setAnswers(prev => ({ ...prev, [currentQuestion]: e.target.value }));
            }}
            placeholder="Type your answer..."
            className="mt-2"
          />
        );

      case 'true-false':
        return (
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(value) => {
              setAnswers(prev => ({ ...prev, [currentQuestion]: value === 'true' }));
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true">True</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false">False</Label>
            </div>
          </RadioGroup>
        );

      case 'chronological':
        return (
          <div className="space-y-2">
            {question.events.map((event, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={answers[currentQuestion]?.[index]?.toString()}
                  onValueChange={(value) => {
                    const newOrder = [...(answers[currentQuestion] || Array(question.events.length).fill(null))];
                    newOrder[index] = parseInt(value);
                    setAnswers(prev => ({ ...prev, [currentQuestion]: newOrder }));
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="#" />
                  </SelectTrigger>
                  <SelectContent>
                    {question.events.map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>{event}</span>
              </div>
            ))}
          </div>
        );
    }
  };

  if (!isActive && score === null) {
    return (
      <div className="min-h-screen p-4 pb-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Architecture Assessment</h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-2">Question Types</h2>
                  <div className="flex flex-wrap gap-2">
                    {questionTypes.map(type => (
                      <Button
                        key={type.value}
                        variant={selectedTypes.includes(type.value) ? "default" : "outline"}
                        onClick={() => {
                          setSelectedTypes(prev =>
                            prev.includes(type.value)
                              ? prev.filter(t => t !== type.value)
                              : [...prev, type.value]
                          );
                        }}
                        className="flex items-center gap-2"
                      >
                        <ListFilter className="h-4 w-4" />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-2">Number of Questions</h2>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={questionCount}
                    className="w-full"
                    onChange={(e) => {
                      const value = e.target.value === '' ? 1 : parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 50) {
                        setQuestionCount(value);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-2">Exam Details</h2>
                  <p className="text-muted-foreground">
                    • Duration: 60 minutes<br />
                    • Questions: {questionCount}<br />
                    • Types: {selectedTypes.map(t =>
                      questionTypes.find(qt => qt.value === t)?.label
                    ).join(', ')}
                  </p>
                </div>

                <Button
                  onClick={handleStart}
                  className="w-full"
                  disabled={selectedTypes.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    'Start Assessment'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <BackButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Architecture Assessment</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>
            <Progress value={(currentQuestion + 1) / questions.length * 100} className="mb-4" />
          </CardContent>
        </Card>

        {score === null ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {questions[currentQuestion].type}
                  </div>
                  <p className="text-lg mb-4">{questions[currentQuestion].question}</p>

                  {renderQuestion(questions[currentQuestion])}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length !== questions.length}
                      className="flex items-center"
                    >
                      Submit
                      <CheckCircle2 className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                      className="flex items-center"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
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
              <div className="text-center mb-6">
                <p className="text-4xl font-bold mb-2">{score.toFixed(1)}%</p>
                <p className="text-muted-foreground">
                  Completed in {formatTime(3600 - timeLeft)}
                </p>
              </div>

              {showExplanation && (
                <div className="space-y-6 mt-6">
                  {questions.map((q, index) => {
                    let isCorrect = false;
                    switch (q.type) {
                      case 'multiple-choice':
                        isCorrect = answers[index] === q.correctAnswer;
                        break;
                      case 'fill-in-blank':
                        isCorrect = q.correctKeywords.some(keyword =>
                          answers[index]?.toLowerCase().includes(keyword.toLowerCase())
                        );
                        break;
                      case 'true-false':
                        isCorrect = answers[index] === q.correctAnswer;
                        break;
                      case 'chronological':
                        isCorrect = JSON.stringify(answers[index]) === JSON.stringify(q.correctOrder);
                        break;
                      case 'calculation':
                        const percentError = Math.abs((answers[index] - q.correctAnswer) / q.correctAnswer * 100);
                        isCorrect = percentError <= q.tolerance;
                        break;
                    }

                    return (
                      <div key={q.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-1" />
                          )}
                          <div>
                            <p className="font-medium mb-2">{q.question}</p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Your answer: {
                                q.type === 'chronological'
                                  ? answers[index]?.map((i: number) => q.events[i]).join(' → ')
                                  : answers[index]?.toString()
                              }
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                                Correct answer: {
                                  q.type === 'chronological'
                                    ? q.correctOrder.map(i => q.events[i]).join(' → ')
                                    : q.type === 'fill-in-blank'
                                      ? q.correctKeywords.join(' or ')
                                      : q.correctAnswer.toString()
                                }
                              </p>
                            )}
                            <div className="text-sm bg-muted/50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="h-4 w-4" />
                                <span className="font-medium">Explanation</span>
                              </div>
                              {q.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button onClick={handleStart} className="flex-1">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(prev => !prev)}
                  className="flex-1"
                >
                  {showExplanation ? "Hide" : "Show"} Explanations
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BackButton />
    </div>
  );
}