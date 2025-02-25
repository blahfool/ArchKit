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
import BackButton from "@/components/BackButton";
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ListFilter
} from "lucide-react";

interface BaseQuestion {
  id: number;
  category: string;
  question: string;
  explanation: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'true-false' | 'chronological';
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

type Question = MultipleChoiceQuestion | FillInBlankQuestion | TrueFalseQuestion | ChronologicalQuestion;

// Mock questions - extensive set covering various architectural topics
const mockQuestions: Question[] = [
  // Design Principles and Theory
  {
    id: 1,
    type: 'multiple-choice',
    category: "Design Principles",
    question: "Which architectural principle emphasizes that the shape of a building should primarily be based on its intended function or purpose?",
    options: [
      "Form follows function",
      "Less is more",
      "Unity in diversity",
      "Truth to materials"
    ],
    correctAnswer: "Form follows function",
    explanation: "Form follows function, coined by Louis Sullivan, is a principle that suggests the shape of a building or object should primarily be based on its intended function or purpose."
  },
  {
    id: 2,
    type: 'multiple-choice',
    category: "Design Principles",
    question: "In tropical architecture, which design element is most crucial for natural ventilation?",
    options: [
      "Cross ventilation with properly placed openings",
      "Solid concrete walls",
      "Small windows",
      "Low ceilings"
    ],
    correctAnswer: "Cross ventilation with properly placed openings",
    explanation: "Cross ventilation is essential in tropical architecture to maintain air flow and reduce heat buildup, achieved through strategic placement of openings."
  },
  // Construction Technology
  {
    id: 3,
    type: 'multiple-choice',
    category: "Construction Technology",
    question: "What is the primary advantage of using post-tensioned concrete in construction?",
    options: [
      "Increased span capabilities with reduced structural depth",
      "Lower initial cost",
      "Simpler construction process",
      "Reduced construction time"
    ],
    correctAnswer: "Increased span capabilities with reduced structural depth",
    explanation: "Post-tensioning allows for longer spans with thinner structural elements, making it ideal for buildings requiring large column-free spaces."
  },
  // Environmental Design
  {
    id: 4,
    type: 'true-false',
    category: "Environmental Design",
    question: "Green walls only provide aesthetic benefits and do not contribute to building energy efficiency.",
    correctAnswer: false,
    explanation: "Green walls provide multiple benefits including thermal insulation, reducing heat gain, improving air quality, and managing stormwater, in addition to aesthetic value."
  },
  // Professional Practice
  {
    id: 5,
    type: 'multiple-choice',
    category: "Professional Practice",
    question: "Under Philippine law, what is the minimum professional experience required before an architect can apply for registration as an Environmental Planner?",
    options: [
      "2 years",
      "3 years",
      "5 years",
      "7 years"
    ],
    correctAnswer: "2 years",
    explanation: "According to Philippine regulations, architects need a minimum of 2 years of professional experience before being eligible for Environmental Planner registration."
  },
  // Building Systems
  {
    id: 6,
    type: 'fill-in-blank',
    category: "Building Systems",
    question: "A _______ is a mechanical system that removes excess moisture from the air to maintain comfortable indoor humidity levels.",
    correctKeywords: ["dehumidifier", "dehumidification system"],
    explanation: "Dehumidifiers are crucial in tropical climates to maintain indoor comfort and prevent mold growth by controlling humidity levels."
  },
  // Urban Planning
  {
    id: 7,
    type: 'multiple-choice',
    category: "Urban Planning",
    question: "Which urban planning concept promotes the development of self-contained communities with mixed land uses within walking distance?",
    options: [
      "Transit-oriented development",
      "Suburban sprawl",
      "Industrial zoning",
      "Commercial strip development"
    ],
    correctAnswer: "Transit-oriented development",
    explanation: "Transit-oriented development focuses on creating walkable communities with mixed uses centered around public transportation hubs."
  },
  // Structural Design
  {
    id: 8,
    type: 'multiple-choice',
    category: "Structural Design",
    question: "In seismic design, what is the primary purpose of a base isolation system?",
    options: [
      "To separate the building from ground motion during earthquakes",
      "To increase building weight",
      "To reduce construction costs",
      "To improve aesthetic appearance"
    ],
    correctAnswer: "To separate the building from ground motion during earthquakes",
    explanation: "Base isolation systems protect buildings during earthquakes by decoupling the structure from ground motion, reducing seismic forces transmitted to the building."
  },
  // Materials and Methods
  {
    id: 9,
    type: 'true-false',
    category: "Materials",
    question: "Bamboo used in construction must always be treated with preservatives to ensure durability.",
    correctAnswer: true,
    explanation: "Untreated bamboo is susceptible to insect attack and decay. Proper treatment with preservatives is essential for durability in construction applications."
  },
  // Building Codes
  {
    id: 10,
    type: 'multiple-choice',
    category: "Building Codes",
    question: "According to the National Building Code of the Philippines, what is the minimum width requirement for a main stairway in a public building?",
    options: [
      "1.20 meters",
      "1.50 meters",
      "0.90 meters",
      "2.00 meters"
    ],
    correctAnswer: "1.20 meters",
    explanation: "The National Building Code requires a minimum width of 1.20 meters for main stairways in public buildings to ensure safe egress during emergencies."
  },
  // Heritage Conservation
  {
    id: 11,
    type: 'chronological',
    category: "Heritage Conservation",
    question: "Arrange these steps in the correct order for heritage building restoration:",
    events: [
      "Documentation and assessment",
      "Historical research",
      "Conservation plan development",
      "Implementation of restoration work",
      "Post-restoration monitoring"
    ],
    correctOrder: [1, 0, 2, 3, 4],
    explanation: "Proper heritage restoration follows a systematic process starting with historical research, followed by documentation, planning, implementation, and monitoring."
  }
];

export default function Assessment() {
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isActive, setIsActive] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['multiple-choice']);

  const categories = ["all", ...new Set(mockQuestions.map(q => q.category))];
  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'fill-in-blank', label: 'Fill in the Blank' },
    { value: 'true-false', label: 'True/False' },
    { value: 'chronological', label: 'Chronological Order' }
  ];

  const filteredQuestions = mockQuestions
    .filter(q => selectedCategory === "all" || q.category === selectedCategory)
    .filter(q => selectedTypes.includes(q.type))
    .slice(0, questionCount);

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

    const correct = filteredQuestions.reduce((acc, q, index) => {
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
      }

      return acc + (isCorrect ? 1 : 0);
    }, 0);

    setScore((correct / filteredQuestions.length) * 100);
    setIsActive(false);
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
                    • Category: {selectedCategory === "all" ? "All Categories" : selectedCategory}<br />
                    • Types: {selectedTypes.map(t =>
                      questionTypes.find(qt => qt.value === t)?.label
                    ).join(', ')}
                  </p>
                </div>

                <Button
                  onClick={handleStart}
                  className="w-full"
                  disabled={selectedTypes.length === 0 || filteredQuestions.length === 0}
                >
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
                    {filteredQuestions[currentQuestion].category} • {
                      questionTypes.find(t => t.value === filteredQuestions[currentQuestion].type)?.label
                    }
                  </div>
                  <p className="text-lg mb-4">{filteredQuestions[currentQuestion].question}</p>

                  {renderQuestion(filteredQuestions[currentQuestion])}
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