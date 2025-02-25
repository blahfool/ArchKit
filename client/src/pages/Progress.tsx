import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Award, Clock, Brain, TrendingUp } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function Progress() {
  const { data: quizScores } = useQuery({
    queryKey: ["/api/quiz-scores"],
    queryFn: () => fetch("/api/quiz-scores").then((res) => res.json()),
  });

  const { data: studyTimeData } = useQuery({
    queryKey: ["/api/study-time"],
    queryFn: () => fetch("/api/study-time").then((res) => res.json()),
  });

  // Calculate statistics
  const totalQuizzes = quizScores?.length || 0;
  const averageScore = quizScores?.reduce((acc: number, curr: any) =>
    acc + (curr.score / curr.total * 100), 0) / (totalQuizzes || 1);

  const studyHours = Math.floor((studyTimeData?.total || 0) / 60);
  const studyMinutes = (studyTimeData?.total || 0) % 60;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Your Progress</h1>

      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
        {/* Study Time Card */}
        <Card className="bg-background/60 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Study Time</h2>
            </div>
            <p className="text-3xl font-light mb-2">
              {studyHours}<span className="text-base font-normal">h </span>
              {studyMinutes}<span className="text-base font-normal">m</span>
            </p>
            <p className="text-sm text-muted-foreground">Total time spent learning</p>
          </CardContent>
        </Card>

        {/* Quiz Performance Card */}
        <Card className="bg-background/60 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Quiz Performance</h2>
            </div>
            <p className="text-3xl font-light mb-2">
              {averageScore.toFixed(1)}<span className="text-base font-normal">%</span>
            </p>
            <p className="text-sm text-muted-foreground">Average score from {totalQuizzes} quizzes</p>
          </CardContent>
        </Card>

        {/* Recent Scores */}
        <Card className="sm:col-span-2 bg-background/60 backdrop-blur border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Recent Scores</h2>
            </div>
            <div className="space-y-4">
              {quizScores?.slice(0, 5).map((score: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{new Date(score.timestamp).toLocaleDateString()}</span>
                    <span className="font-medium">{(score.score / score.total * 100).toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={score.score / score.total * 100} />
                </div>
              ))}
              {(!quizScores || quizScores.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  No quiz scores yet. Take some quizzes to track your progress!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <BackButton />
    </div>
  );
}