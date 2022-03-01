export type AnswersProps = {
  questions: string[];
  type: string;
};

export type QuestionProps = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  answers: AnswersProps;
  difficulty: string;
};
