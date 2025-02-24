import { useQuery } from "@tanstack/react-query";

function Progress() {
  const { data: terms } = useQuery({
    queryKey: ["terms"],
    queryFn: () => fetch("/api/terms").then((res) => res.json()),
  });

  const { data: formulas } = useQuery({
    queryKey: ["formulas"],
    queryFn: () => fetch("/api/formulas").then((res) => res.json()),
  });

  const { data: quizScores } = useQuery({
    queryKey: ["quiz-scores"],
    queryFn: () => fetch("/api/quiz-scores").then((res) => res.json()),
  });

  const { data: studyTimeData } = useQuery({
    queryKey: ["study-time"],
    queryFn: () => fetch("/api/study-time").then((res) => res.json()),
  });

  const studyTime = studyTimeData?.total || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Progress</h1>
      <div className="space-y-4">
        <div>
          <p className="font-medium">Terms Learned</p>
          <p className="text-sm text-muted-foreground">{terms?.length || 0} architectural terms</p>
        </div>
        <div>
          <p className="font-medium">Formulas Mastered</p>
          <p className="text-sm text-muted-foreground">{formulas?.length || 0} formulas available</p>
        </div>
        <div>
          <p className="font-medium">Quiz Performance</p>
          {quizScores?.map((score, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              {new Date(score.timestamp).toLocaleDateString()}: {score.score}/{score.total} ({Math.round(score.score/score.total * 100)}%)
            </p>
          ))}
        </div>
        <div>
          <p className="font-medium">Total Study Time</p>
          <p className="text-sm text-muted-foreground">
            {Math.round(studyTime / 60)} hours {studyTime % 60} minutes
          </p>
        </div>
      </div>
    </div>
  );
}

export default Progress;