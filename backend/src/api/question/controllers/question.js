"use strict";

/**
 *  question controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::question.question",
  ({ strapi }) => ({
    async createQuestions(ctx) {
      try {
        const questions = await strapi
          .service("api::question.question")
          .createQuestions(ctx.query);
        ctx.body = questions;
      } catch (error) {
        return ctx.send(err.body, err.status);
      }
    },
    async verifyAnswer(ctx) {
      if (!ctx.request.body?.id) {
        ctx.status = 404;
      }
      const { id: questionId, answer } = ctx.request.body;
      try {
        const isAnswerCorrect = await strapi
          .service("api::question.question")
          .verifyAnswer(questionId, answer);
        ctx.body = isAnswerCorrect;
      } catch (error) {
        return ctx.send(err.body, err.status);
      }
    },
  })
);
