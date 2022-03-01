const cron = require("node-schedule");
const rule = new cron.RecurrenceRule();

rule.minute = 1;

const coinRule = new cron.RecurrenceRule();
coinRule.hour = 24;
coinRule.minute = 0;

module.exports = {
  "0 */59 * * * *": async ({ strapi }) => {
    const contest = await strapi
      .service("api::contest.contest")
      .createContest();
    console.log("[CRON EXECUTED] - Create random contest", contest);
  },
  "0 */59 * * * *": async ({ strapi }) => {
    const { users, amount } = await strapi
      .service("api::contest.contest")
      .giveCoinsToUsers(50, 200);
    console.log(`[CRON EXECUTED] - Gave ${amount} coins to ${users} users`);
  },
  "*/59 * * * * *": async ({ strapi }) => {
    const { count } = await strapi
      .service("api::contest.contest")
      .removeInactiveContests();
    if (count > 0) {
      console.log(`[CRON EXECUTED] - Desactived ${count} contests`);
    }
  },
};
