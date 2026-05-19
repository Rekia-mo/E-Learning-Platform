import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"E-Learning Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h2>Welcome!</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};

export const sendTeacherStatusEmail = async (
  to: string,
  name: string,
  status: "approved" | "rejected" | "pending"
) => {
  const isApproved = status === "approved";

  await transporter.sendMail({
    from: `"E-Learning Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject: isApproved ? "Your application was approved!" : "Your application was rejected",
    html: isApproved
      ? `
        <h2>Congratulations ${name}!</h2>
        <p>Your teacher application has been <strong>approved</strong>.</p>
        <p>Please <strong>log out and log back in</strong> to access your teacher dashboard.</p>
      `
      : `
        <h2>Hello ${name},</h2>
        <p>Unfortunately your teacher application has been <strong>rejected</strong>.</p>
        <p>You can contact us for more information.</p>
      `,
  });
};