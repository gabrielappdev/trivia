"use strict";

/**
 * A set of functions called "actions" for `password`
 */

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  index: async (ctx) => {
    const params = ctx.request.body;

    if (!params.identifier) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.provide",
          message: "Por favor, informe o apelido ou o e-mail",
        })
      );
    }

    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { email: params.identifier } });

    const validPassword = await strapi.plugins[
      "users-permissions"
    ].services.user.validatePassword(params.password, user.password);

    if (!validPassword) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.invalid",
          message: "Usuário ou senha inválidos",
        })
      );
    } else {
      const password = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword({ password: params.newPassword });
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: { resetPasswordToken: null, password },
      });
      ctx.send({
        jwt: strapi.plugins["users-permissions"].services.jwt.issue({
          id: user.id,
        }),
      });
    }
  },
};
