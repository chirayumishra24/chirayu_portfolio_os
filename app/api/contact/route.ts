import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
      return NextResponse.json(
        { message: "Invalid or missing required fields. Please provide a valid email and non-empty content." },
        { status: 400 }
      );
    }

    let dbSaved = false;
    let emailDispatched = false;

    // 1. Attempt to record message in Database via Prisma (safe for serverless / read-only filesystems)
    try {
      const savedMessage = await prisma.contactMessage.create({
        data: {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        },
      });
      console.log("Contact message recorded in database:", savedMessage.id);
      dbSaved = true;
    } catch (dbError) {
      console.warn("Database storage bypassed or unavailable:", dbError instanceof Error ? dbError.message : dbError);
    }

    // 2. Setup SMTP Nodemailer if environment variables exist
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER, SMTP_PORT, SMTP_SECURE } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_RECEIVER) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 587,
          secure: SMTP_SECURE === "true",
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        const safeName = escapeHtml(name.trim());
        const safeEmail = escapeHtml(email.trim());
        const safeSubject = escapeHtml(subject.trim());
        const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");

        await transporter.sendMail({
          from: `"${safeName}" <${SMTP_USER}>`,
          replyTo: email.trim(),
          to: CONTACT_RECEIVER,
          subject: `[Portfolio OS] ${safeSubject}`,
          text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
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
        emailDispatched = true;
      } catch (smtpError) {
        console.error("SMTP dispatch failed:", smtpError);
      }
    } else {
      console.log("SMTP variables not set.");
    }

    if (!dbSaved && !emailDispatched) {
      return NextResponse.json(
        {
          message: "Unable to process the message automatically because email delivery service is not configured on this host. You can still reach Chirayu directly using the email client fallback button.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error: unknown) {
    console.error("Contact API error:", error);
    const message = error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json({ message }, { status: 500 });
  }
}
