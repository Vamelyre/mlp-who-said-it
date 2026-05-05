export interface QuizQuestion {
  id: number;
  quote: string;
  characer: string;
  difficulty: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  showScore: boolean;
}
