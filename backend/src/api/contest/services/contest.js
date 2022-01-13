"use strict";
const _ = require("lodash");
const moment = require("moment");
const slugify = require("slugify");
/**
 * contest service.
 */

const difficulties = ["easy", "medium", "hard"];

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getCostBasedOnDifficulty = (difficulty) => {
  const baseRandomArray = Array.from(new Array(20));
  switch (difficulty) {
    case "easy":
      return baseRandomArray.map((_, index) => index + 20)[
        randomIntFromInterval(0, 19)
      ];
    case "medium":
      return baseRandomArray.map((_, index) => index + 40)[
        randomIntFromInterval(0, 19)
      ];
    case "hard":
      return baseRandomArray.map((_, index) => index + 100)[
        randomIntFromInterval(0, 19)
      ];
  }
};

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::contest.contest", ({ strapi }) => ({
  async closeContest(contestId, winnerId) {
    try {
      const winner = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: winnerId,
          },
        });
      const contest = await strapi.db.query("api::contest.contest").findOne({
        where: {
          id: contestId,
        },
      });
      if (!contest) {
        return;
      }
      const prize = contest.prizePool;
      let updatedContestant = null;
      if (winner) {
        updatedContestant = await strapi
          .query("plugin::users-permissions.user")
          .update({
            where: {
              id: winnerId,
            },
            data: {
              coins: winner.coins + prize,
            },
          });
      }
      const updatedContest = await strapi.query("api::contest.contest").update({
        where: {
          id: contestId,
        },
        data: {
          active: false,
        },
      });

      return { contest: updatedContest, winner: updatedContestant };
    } catch (error) {
      throw new Error(error);
    }
  },
  async registerContestant(contestId, contestantId) {
    try {
      const contest = await strapi.db.query("api::contest.contest").findOne({
        where: { id: contestId },
        populate: ["users_permissions_users"],
      });
      const contestant = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { id: contestantId } });

      if (contestant.coins - contest.cost < 0) {
        throw new Error("Insuficient coins");
      }

      if (
        contest.users_permissions_users
          .map(({ id }) => id)
          .includes(contestantId)
      ) {
        throw new Error("Contestant already registered");
      }

      const updatedContest = await strapi.db
        .query("api::contest.contest")
        .update({
          where: { id: contestId },
          data: {
            users_permissions_users: [
              ...contest.users_permissions_users.map((id) => id),
              contestantId,
            ],
            prizePool: contest.prizePool + contest.cost,
          },
          populate: ["users_permissions_users"],
        });

      const updatedContestant = await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: contestantId },
          data: { coins: contestant.coins - contest.cost },
        });

      return {
        contestant: _.omit(updatedContestant, ["password"]),
        contest: {
          ...updatedContest,
          users_permissions_users: updatedContest.users_permissions_users.map(
            (user) => _.omit(user, ["password"])
          ),
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  async checkAnswers(contestId, answers) {
    const contest = await strapi.db.query("api::contest.contest").findOne({
      where: { id: contestId },
      populate: ["questions"],
    });
    const { questions } = contest;

    const correctAnswers = [];
    const incorrectAnswers = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const isAnswerCorrect = await strapi
        .service("api::question.question")
        .verifyAnswer(question.id, answers[i]);
      if (isAnswerCorrect) {
        correctAnswers.push(answers[i]);
      } else {
        incorrectAnswers.push(answers[i]);
      }
    }

    return {
      correct: correctAnswers,
      incorrect: incorrectAnswers,
      ratio: correctAnswers.length / questions.length,
      percentage:
        correctAnswers.length === 0 && questions.length === 0
          ? "0%"
          : (correctAnswers.length / questions.length) * 100 + "%",
    };
  },
  async createContest(categoryId, difficultyArg) {
    let category = null;
    const categories = await strapi.db
      .query("api::category.category")
      .findMany({});
    if (!categoryId) {
      const randomCategoryIndex = randomIntFromInterval(
        0,
        categories.length - 1
      );
      category = categories[randomCategoryIndex];
      categoryId = category.id;
    } else {
      const paramCategory = await strapi.db
        .query("api::category.category")
        .findOne({
          where: { id: categoryId },
        });
      category = paramCategory;
    }

    const difficulty =
      difficultyArg || difficulties[randomIntFromInterval(0, 2)];
    const cost = getCostBasedOnDifficulty(difficulty);
    const contestsCount = await strapi.db.query("api::contest.contest").count();

    const contestTitle = `Contest #${contestsCount + 1} - ${_.capitalize(
      category.title
    )}`;

    const contest = await strapi.db.query("api::contest.contest").create({
      data: {
        title: contestTitle,
        description: `${_.capitalize(
          difficulty
        )} contest with entrance cost of ${cost} coins`,
        category: categoryId,
        expiration_date: moment().add(1, "day").toDate(),
        active: true,
        difficulty,
        prizePool: 0,
        slug: slugify(
          contestTitle.replace("#", "").replace(":", "")
        ).toLowerCase(),
        cost,
      },
    });
    const questions = await strapi
      .service("api::question.question")
      .createQuestions({ contest: contest.id, category: categoryId });
    if (questions.length) {
      return {
        ...contest,
        questions,
      };
    } else {
      await strapi.db.query("api::contest.contest").delete({
        where: { id: contest.id },
      });
      return await this.createContest(
        categories[randomIntFromInterval(0, categories.length - 1)].id
      );
    }
  },
  async giveCoinsToUsers(min = 10, max = 200) {
    const amount = randomIntFromInterval(min, max);
    const allUsers = await strapi
      .query("plugin::users-permissions.user")
      .findMany({});
    let ok = 0;
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const userUpdated = await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: user.id },
          data: {
            coins: user.coins + amount,
          },
        });
      if (userUpdated.coins === user.coins + amount) {
        ok++;
      }
    }
    return { users: ok, amount };
  },
  async removeInactiveContests() {
    const response = await strapi.db.query("api::contest.contest").updateMany({
      where: {
        active: true,
        expiration_date: {
          $lt: moment().toDate(),
        },
      },
      data: {
        active: false,
      },
    });
    return response;
  },
}));
