import { atom } from "recoil";

export const question = atom({
  key: "question",
  default: {
    requestWasSent: false,
  },
});
