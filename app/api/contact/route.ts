import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !emailRegex.test(email.trim()) ||
      typeof subject !== "string" || !subject.trim() ||
      typeof message !== "string" || !message.trim()
    ) {
      return NextResponse.json({ message: "Invalid or missing required fields. Please provide a valid email and non-empty content." }, { status: 400 });
    }


    // 1. Record message in Local SQLite Database via Prisma
    const savedMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });

    console.log("Contact message recorded in database:", savedMessage.id);

    // 2. Setup SMTP Nodemailer if environment variables exist
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_RECEIVER) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeSubject = escapeHtml(subject);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: CONTACT_RECEIVER,
        subject: `[Portfolio OS] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Message from Portfolio OS</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      });
      
      console.log("SMTP Email notification dispatched successfully.");
    } else {
      console.log("SMTP variables not set. Saved to local SQLite db instead.");
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error: unknown) {
    console.error("Contact API error:", error);
    const message = error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json({ message }, { status: 500 });
  }
}
