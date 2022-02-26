export const getRoute = (route: string, params: string) => {
  switch (route) {
    case "contests":
      return `/constests/${params}`;
    default:
      break;
  }
};
