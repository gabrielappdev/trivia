module.exports = {
  routes: [
    {
      method: "GET",
      path: "/create-questions",
      handler: "question.createQuestions",
    },
    {
      method: "POST",
      path: "/verify-answer",
      handler: "question.verifyAnswer",
    },
  ],
};
