/**
 * Defines a function to send an email to a user with a verification token, which is
 * used by the Passport JS magic link strategy.
 *
 * Documentation: https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail#quick-start-hello-email
 */
const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

/** Sends an email verification link to the address entered by the user
 *
 * Notes:
 *  1.  The SERVER_URL environment variable must be set
 *  2.  The route must match the email verification route specified in the API
 *      (currently /api/email/verify)
 *
 * @param {Object} user The user object, which must contain a `user.email` field
 * @param {String} token The verification token generated by the magic link strategy
 */
const sendEmailWithToken = (user, token) => {
  const link = `${process.env.SERVER_URL}/api/email/verify?token=${token}`;
  console.log(`Emailing ${user.email} with link to ${link}`);
  return sendgrid.send({
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Verify your Email",
    text: `Hello! Click the link below to verify your email.\r\n\r\n${link}`,
    html: `
      <h3>Hello!</h3>
      <p>Click the link below to verify your email.</p>
      <p><a href="${link}">Verify Email</a></p>
    `,
  });
};

module.exports = sendEmailWithToken;