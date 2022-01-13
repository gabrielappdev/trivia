"use strict";
const axios = require("axios");
const qs = require("qs");
const _ = require("lodash");

/**
 * question service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::question.question", ({ strapi }) => ({
  async createQuestions({ contest, category, amount = 10 }) {
    const currentContest = await strapi.db
      .query("api::contest.contest")
      .findOne({
        where: {
          id: contest,
        },
      });
    if (!currentContest) {
      return null;
    }

    let qCategory = {};
    if (category) {
      const loadedCategory = await strapi.db
        .query("api::category.category")
        .findOne({
          where: { id: category },
        });
      qCategory = {
        category: loadedCategory?.external_id,
      };
    }
    let qDifficulty = {};
    if (currentContest?.difficulty) {
      qDifficulty = {
        difficulty: currentContest.difficulty,
      };
    }

    let qAmount = {};
    if (amount) {
      qAmount = {
        amount,
      };
    }

    const query = {
      ...qCategory,
      ...qDifficulty,
      ...qAmount,
    };

    const requestEndpoint = `https://opentdb.com/api.php?${qs.stringify(
      query
    )}`;

    console.log("Generating questions from endpoint: ", requestEndpoint);

    try {
      const response = await axios(requestEndpoint);
      if (response.data) {
        const externalQuestions = response.data?.results;
        const formattedQuestions = externalQuestions.map((question) => {
          return {
            ...question,
            correct_answer: question?.correct_answer,
            title: question?.question,
            answers: {
              type: question?.type,
              questions: [
                question?.correct_answer,
                ...question?.incorrect_answers,
              ],
            },
            contest: contest,
          };
        });
        const responses = [];
        for (const question of formattedQuestions) {
          const category = await strapi.db
            .query("api::category.category")
            .findOne({
              where: { title: { $containsi: question.category } },
            });
          const response = await strapi.db
            .query("api::question.question")
            .create({
              data: { ...question, category: category.id },
              populate: ["contest", "category"],
            });
          responses.push(response);
        }
        return responses;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },
  async verifyAnswer(questionId, answer) {
    const question = await strapi.db.query("api::question.question").findOne({
      where: {
        id: questionId,
      },
    });
    if (!question) {
      throw new Error("Unable to find this question");
    }
    const correctAnswer = question.correct_answer;
    return answer === correctAnswer;
  },
}));
