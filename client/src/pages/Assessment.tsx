import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import BackButton from "@/components/BackButton";
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import type { Term } from "@shared/schema";

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function Assessment() {
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isActive, setIsActive] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock questions - in real app, these would come from an API
  const mockQuestions: Question[] = [
    {
      id: 1,
      category: "Design Principles",
      question: "Which architectural principle emphasizes that the shape of a building should primarily be based on its intended function or purpose?",
      options: [
        "Form follows function",
        "Less is more",
        "Unity in diversity",
        "Truth to materials"
      ],
      correctAnswer: "Form follows function",
      explanation: "Form follows function, coined by Louis Sullivan, is a principle that suggests the shape of a building or object should primarily be based on its intended function or purpose. This principle became a defining characteristic of modernist architecture."
    },
    {
      id: 2,
      category: "Building Systems",
      question: "What is the primary purpose of a building's HVAC system?",
      options: [
        "To maintain structural integrity",
        "To control temperature, humidity, and air quality",
        "To manage electrical distribution",
        "To handle waste disposal"
      ],
      correctAnswer: "To control temperature, humidity, and air quality",
      explanation: "HVAC (Heating, Ventilation, and Air Conditioning) systems are designed to maintain indoor environmental comfort by managing temperature, humidity, and air quality. This is crucial for occupant comfort and health."
    },
    // Add more questions for different categories
  ];

  const categories = ["all", ...new Set(mockQuestions.map(q => q.category))];

  const filteredQuestions = selectedCategory === "all" 
    ? mockQuestions 
    : mockQuestions.filter(q => q.category === selectedCategory);

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

  const handleStart = () => {
    setIsActive(true);
    setScore(null);
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(3600);
  };

  const handleSubmit = () => {
    if (!filteredQuestions.length) return;

    const correct = Object.entries(answers).reduce((acc, [qIndex, answer]) => {
      return acc + (answer === filteredQuestions[parseInt(qIndex)].correctAnswer ? 1 : 0);
    }, 0);

    setScore((correct / filteredQuestions.length) * 100);
    setIsActive(false);
    setShowExplanation(true);
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
                  <h2 className="text-lg font-medium mb-2">Select Category</h2>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-2">Exam Details</h2>
                  <p className="text-muted-foreground">
                    • Duration: 60 minutes<br />
                    • Questions: {filteredQuestions.length}<br />
                    • Category: {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </p>
                </div>

                <Button onClick={handleStart} className="w-full">
                  Start Assessment
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
                Question {currentQuestion + 1} of {filteredQuestions.length}
              </div>
            </div>
            <Progress value={(currentQuestion + 1) / filteredQuestions.length * 100} className="mb-4" />
          </CardContent>
        </Card>

        {score === null ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {filteredQuestions[currentQuestion].category}
                  </div>
                  <p className="text-lg mb-4">{filteredQuestions[currentQuestion].question}</p>

                  <RadioGroup
                    value={answers[currentQuestion]}
                    onValueChange={(value) => {
                      setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
                    }}
                  >
                    {filteredQuestions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
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

                  {currentQuestion === filteredQuestions.length - 1 ? (
                    <Button 
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length !== filteredQuestions.length}
                      className="flex items-center"
                    >
                      Submit
                      <CheckCircle2 className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(prev => Math.min(filteredQuestions.length - 1, prev + 1))}
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
                  {filteredQuestions.map((q, index) => {
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
                              Your answer: {answers[index]}
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