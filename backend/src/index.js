"use strict";
const axios = require("axios");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const allCategories = await strapi.db
      .query("api::category.category")
      .findMany({});
    if (!allCategories?.length) {
      const openTriviaResponse = await axios(
        "https://opentdb.com/api_category.php"
      );
      if (openTriviaResponse?.data?.trivia_categories) {
        const categories = openTriviaResponse?.data?.trivia_categories;
        console.log("Creating categories from Open Trivia...");
        const { count } = await strapi.db
          .query("api::category.category")
          .createMany({
            data: categories.map(({ name, id: external_id }) => ({
              title: name,
              external_id,
            })),
          });
        console.log(`${count} Categories created. You're good to go now`);
      }
    }
  },
};
