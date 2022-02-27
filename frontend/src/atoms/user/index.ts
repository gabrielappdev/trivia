import { atom } from "recoil";

export const user = atom({
  key: "user",
  default: {
    id: null,
    username: "",
    email: "",
    confirmed: true,
    blocked: false,
    jwt: "",
    coins: 0,
  },
});
