"use strict";

/**
 *  contest-play controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::contest-play.contest-play",
  ({ strapi }) => ({
    async getUserContestPlay(ctx) {
      if (!ctx.params.id) {
        ctx.body = { error: "Contest not found" };
        return;
      }
      const contestPlay = await strapi
        .query("api::contest-play.contest-play")
        .findOne({
          where: {
            contest: ctx.params.id,
            users_permissions_user: ctx.state.user.id,
          },
        });
      if (contestPlay) {
        ctx.body = contestPlay;
      } else {
        ctx.status = 404;
        ctx.body = {
          error: "Not contest play found",
        };
      }
    },
  })
);
