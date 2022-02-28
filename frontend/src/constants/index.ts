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

export const getEndpoint = (endpoint: string, params?: string) => {
  switch (endpoint) {
    case "signin":
      return "/auth/local/";
    case "signup":
      return "/auth/local/register";
    case "me":
      return "/users/me";
    case "activeContests":
      return "/contests?filters[active]=true&populate[0]=category";
    case "contest":
      return `/contest/${params}`;
    default:
      return "";
  }
};
