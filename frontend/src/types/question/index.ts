export type AnswersProps = {
  type: string;
  questions: string[];
};

export type QuestionProps = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  answers: AnswersProps[];
  difficulty: string;
};
