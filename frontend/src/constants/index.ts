export const getRoute = (route: string, params?: string) => {
  switch (route) {
    case "contests":
      return `/constests/${params}`;
    case "signin":
      return "/signin";
    case "signup":
      return "/signup";
    default:
      break;
  }
};

export const getEndpoint = (endpoint) => {
  switch (endpoint) {
    case "signin":
      return "/auth/local/";
    case "signup":
      return "/auth/local/register";
    case "me":
      return "/users/me";
    default:
      return "";
  }
};
