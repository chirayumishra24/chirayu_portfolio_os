import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
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

      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: CONTACT_RECEIVER,
        subject: `[Portfolio OS] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>New Message from Portfolio OS</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });
      
      console.log("SMTP Email notification dispatched successfully.");
    } else {
      console.log("SMTP variables not set. Saved to local SQLite db instead.");
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json({ message: error.message || "Failed to process request" }, { status: 500 });
  }
}
