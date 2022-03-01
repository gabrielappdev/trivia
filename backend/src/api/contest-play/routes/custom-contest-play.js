module.exports = {
  routes: [
    {
      method: "GET",
      path: "/play-contest/:id",
      handler: "contest-play.getUserContestPlay",
    },
  ],
};
