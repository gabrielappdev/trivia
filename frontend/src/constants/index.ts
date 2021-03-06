export const getRoute = (route: string, params?: string) => {
  switch (route) {
    case "home":
      return "/";
    case "contests":
      return `/contests/${params}`;
    case "signin":
      return "/signin";
    case "signup":
      return "/signup";
    default:
      break;
  }
};

export const getEndpoint = (endpoint: string, params?: string | number) => {
  switch (endpoint) {
    case "signin":
      return "/auth/local/";
    case "signup":
      return "/auth/local/register";
    case "me":
      return "/users/me";
    case "activeContests":
      return `/contests?filters[active]=true&sort[0]=expiration_date%3Aasc&populate[0]=category&populate[1]=users_permissions_users&pagination[page]=${
        params ?? 1
      }&pagination[pageSize]=12`;
    case "contest":
      return `/contest/${params}`;
    case "contestPlay":
      return `/play-contest/${params}`;
    case "contestPlayPut":
      return `/contest-plays/${params}`;
    case "registerContestant":
      return "/register-contestant";
    case "onLost":
      return "/contest-lost";
    case "checkAnswers":
      return `/check-answers/${params}`;
    default:
      return "";
  }
};
