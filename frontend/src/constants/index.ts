export const getRoute = (route: string, params?: string) => {
  switch (route) {
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
      return "/contests?filters[active]=true&sort[0]=expiration_date%3Aasc&populate[0]=category&populate[1]=users_permissions_users&pagination[start]=0&pagination[limit]=100";
    case "contest":
      return `/contest/${params}`;
    case "contestPlay":
      return `/play-contest/${params}`;
    case "registerContestant":
      return "/register-contestant";
    default:
      return "";
  }
};
