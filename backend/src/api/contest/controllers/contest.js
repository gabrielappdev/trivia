"use strict";
const _ = require("lodash");

/**
 *  contest controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::contest.contest", ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    if (!slug) {
      ctx.status = 404;
      ctx.body = { error: "Contest not found" };
    } else {
      try {
        const contest = await strapi.query("api::contest.contest").findOne({
          where: { slug },
          populate: [
            "questions",
            "users_permissions_users",
            "image",
            "category",
          ],
        });
        if (contest) {
          ctx.body = {
            ...contest,
            questions: contest.questions.map((question) =>
              _.omit(question, ["correct_answer"])
            ),
          };
        } else {
          ctx.status = 404;
          ctx.body = { error: "Contest not found" };
        }
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  async closeContest(ctx) {
    const { winner: winnerId, id: contestId } = ctx.request.body;
    try {
      if (!contestId) {
        ctx.status = 404;
        return;
      } else if (contestId) {
        const contest = await strapi.db
          .query("api::contest.contest")
          .findOne({ where: { id: contestId } });
        if (!contest) {
          ctx.status = 404;
          return;
        }
        if (!contest.active) {
          ctx.body = { error: "This contest is already closed" };
          return;
        }
      }
      const { contest, winner } = await strapi
        .service("api::contest.contest")
        .closeContest(contestId, winnerId);

      ctx.body = {
        contest,
        winner,
      };
    } catch (error) {
      ctx.body = { error };
    }
  },
  async registerContestant(ctx) {
    const signedUser = ctx.state.user;
    const { id: contestId } = ctx.request.body;

    try {
      if (!contestId) {
        ctx.status = 404;
        return;
      }
      const { contest, contestant } = await strapi
        .service("api::contest.contest")
        .registerContestant(contestId, signedUser.id);
      ctx.body = {
        contest,
        contestant,
      };
    } catch (error) {
      return { error: error.message };
    }
  },
  async checkAnswers(ctx) {
    const data = ctx.request.body.data;
    if (!data || !data?.length) {
      return { error: "No answers" };
    }
    const contestId = ctx.request.params.id;
    if (!contestId) {
      return { error: "Invalid contest" };
    }

    const answers = data;

    try {
      const result = await strapi
        .service("api::contest.contest")
        .checkAnswers(contestId, answers);
      let isWinner = false;
      if (result.ratio === 1) {
        await strapi
          .service("api::contest.contest")
          .closeContest(contestId, ctx.state.user.id);
        isWinner = true;
      } else {
        await strapi
          .service("api::contest.contest")
          .onPlayerLost(ctx.state.user.id, contestId);
      }
      ctx.body = {
        ...result,
        isWinner,
      };
    } catch (error) {
      return { error: error.message };
    }
  },
  async createContest(ctx) {
    const { category, difficulty } = ctx.request.body;
    const contest = await strapi
      .service("api::contest.contest")
      .createContest(category, difficulty);
    ctx.body = {
      contest,
    };
  },
  async onPlayerLost(ctx) {
    const { contestId } = ctx.request.body.data;
    if (!contestId) {
      ctx.status = 404;
      ctx.body = {
        error: "Contest is missing",
      };
    }
    try {
      const result = await strapi
        .service("api::contest.contest")
        .onPlayerLost(ctx.state.user.id, contestId);

      ctx.body = result;
    } catch (error) {
      return { error: error.message };
    }
  },
}));
