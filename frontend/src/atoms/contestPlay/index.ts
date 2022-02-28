import { atom } from "recoil";

export const contestPlay = atom({
  key: "contestPlay",
  default: {
    id: null,
    step: 0,
  },
});
