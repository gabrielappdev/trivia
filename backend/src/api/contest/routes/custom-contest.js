module.exports = {
  routes: [
    {
      method: "POST",
      path: "/close-contest",
      handler: "contest.closeContest",
    },
    {
      method: "POST",
      path: "/register-contestant",
      handler: "contest.registerContestant",
    },
    {
      method: "POST",
      path: "/check-answers/:id",
      handler: "contest.checkAnswers",
    },
    {
      method: "POST",
      path: "/create-contest",
      handler: "contest.createContest",
    },
    {
      method: "GET",
      path: "/contest/:slug",
      handler: "contest.findBySlug",
    },
    {
      method: "POST",
      path: `/contest-lost`,
      handler: "contest.onPlayerLost",
    },
  ],
};
