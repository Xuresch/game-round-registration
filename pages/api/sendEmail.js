// pages/api/sendEmail.js

import nodemailer from "nodemailer";
import mjml2html from "mjml";
import { selectTemplate } from "@/lib/emailTemplates/index.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { templateName, templateData, emailDetails } = req.body;

    // Use the template selector to get the populated MJML content
    const mjmlContent = selectTemplate(templateName, templateData);
    // Convert MJML to HTML
    const { html } = mjml2html(mjmlContent);

    // Setup NodeMailer transport
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: emailDetails.to,
        subject: emailDetails.subject,
        html: html,
      });
      res
        .status(200)
        .send({ status: "OK", message: "Email sent successfully!" });
    } catch (error) {
      res.status(500).send({ status: "Failed", message: error.message });
    }
  } else {
    res.status(405).send({ status: "Failed", message: "Method not allowed" });
  }
}
