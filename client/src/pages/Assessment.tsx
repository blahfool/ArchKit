import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ListFilter,
  Loader2
} from "lucide-react";
import { generateQuestions, type Question } from "@/lib/questionGenerator";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";

export default function Assessment() {
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['multiple-choice']);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' }
  ];

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const generatedQuestions = await generateQuestions(
        [],
        questionCount,
        "all",
        selectedTypes.length === 1 ? selectedTypes[0] : "all"
      );

      if (generatedQuestions.length === questionCount) {
        setQuestions(generatedQuestions);
        setScore(null);
        setAnswers({});
        setCurrentQuestion(0);
      } else {
        toast({
          title: "Error",
          description: `Could only generate ${generatedQuestions.length} questions. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
        case 'true-false':
          isCorrect = answer === q.correctAnswer;
          break;
      }

      return acc + (isCorrect ? 1 : 0);
    }, 0);

    setScore((correct / questions.length) * 100);
    setShowExplanation(true);
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={answers[currentQuestion]}
            onValueChange={(value) => {
              setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
            }}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label className="cursor-pointer flex-1" htmlFor={`option-${index}`}>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(value) => {
              setAnswers(prev => ({ ...prev, [currentQuestion]: value === 'true' }));
            }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
              <RadioGroupItem value="true" id="true" />
              <Label className="cursor-pointer" htmlFor="true">True</Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
              <RadioGroupItem value="false" id="false" />
              <Label className="cursor-pointer" htmlFor="false">False</Label>
            </div>
          </RadioGroup>
        );
    }
  };

  if (!questions.length) {
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
                  />
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-2">Assessment Details</h2>
                  <p className="text-muted-foreground">
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
        {score === null ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium flex items-center justify-between mb-4">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="text-muted-foreground">{questions[currentQuestion].type}</span>
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
              </div>

              {showExplanation && (
                <div className="space-y-6 mt-6">
                  {questions.map((q, index) => {
                    const isCorrect = answers[index] === q.correctAnswer;
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
                              Your answer: {answers[index]?.toString()}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                                Correct answer: {q.correctAnswer}
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