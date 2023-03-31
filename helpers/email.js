import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const { email, name, token } = data;
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: '"Eichtici - Landing Page Management" <cuenta@eichtici.com>',
    to: email,
    subject: "Eichtici - Confirm your account",
    text: "Confirm your account in the Eichtici administrator",
    html: `<p>Hello ${name}, check your account in Eichtici.</p>
        <p>Your account is almost ready, you just have to confirm it by clicking on the following link:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm/${token}">Check your account</a>
        <p>If you did not create this account, ignore this message</p>
    `,
  });
};

export const emailResetPswd = async (data) => {
  const { email, name, token } = data;
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: '"Eichtici - Landing Page Management" <cuenta@eichtici.com>',
    to: email,
    subject: "Eichtici - Reset your password",
    text: "Reset your password in the Eichtici administrator",
    html: `<p>Hello ${name}, You have requested to reset your password.</p>
          <p>Please click the following link to change your password:</p>
          <a href="${process.env.FRONTEND_URL}/auth/reset-password/${token}">Reset your password</a>
          <p>If you did not request to reset your password, ignore this message</p>
      `,
  });
};

export const emailContact = async (data) => {
  const { name, email, message } = data;
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: `"Name: ${name} - Landing Page Eichtici Develeper" <${email}>`,
    to: process.env.EMAIL_ADMIN,
    subject: `User ${name} wants to contact you`,
    text: `Eichtici Admin: The user "${name}" wants to contact you.`,
    html: `<p>${message}</p>
          <p>Sincerely: ${name}</p>
    `,
  });
};
