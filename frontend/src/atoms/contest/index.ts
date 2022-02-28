import { atom } from "recoil";

export const contest = atom({
  key: "contest",
  default: {
    id: null,
    title: "",
    description: "",
    prizePool: null,
    createdAt: "",
    updatedAt: "",
    active: true,
    expiration_date: "",
    slug: "",
    cost: null,
    difficulty: "easy",
    questions: [],
    category: "",
  },
});
