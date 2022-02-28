import { QuestionProps } from "../question";

export type ContestProps = {
  id: number;
  title: string;
  description: string;
  prizePool: number;
  createdAt: string;
  updatedAt: string;
  active: true;
  expiration_date: string;
  slug: string;
  cost: number;
  difficulty: string;
  users_permissions_users: [];
  image?: string;
  category: string;
  questions: QuestionProps[];
};
