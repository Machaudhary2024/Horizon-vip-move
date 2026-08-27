import nodemailer from "nodemailer";
import { COMPANY } from "./constants";

const transporter =
  process.env.SMTP_HOST && process.env.SMTP_USER
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter) {
    console.log(`[Email skipped - no SMTP] To: ${to}, Subject: ${subject}`);
    return { success: true, skipped: true };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || COMPANY.email,
    to,
    subject,
    html,
  });

  return { success: true };
}

export function bookingNotificationEmail({
  bookingId,
  customerName,
  pickupDate,
  pickupLocation,
  dropoffLocation,
  isAdmin,
}: {
  bookingId: string;
  customerName: string;
  pickupDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  isAdmin?: boolean;
}) {
  const title = isAdmin ? "New Booking Request" : "Booking Confirmation";
  const message = isAdmin
    ? `A new booking request has been submitted by ${customerName}.`
    : `Thank you ${customerName}! Your booking request has been received.`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #fff; padding: 24px; border: 1px solid #C9A227;">
      <h1 style="color: #C9A227;">Horizon-VIP-Move</h1>
      <h2>${title}</h2>
      <p>${message}</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Date:</strong> ${pickupDate}</p>
      <p><strong>Pickup:</strong> ${pickupLocation}</p>
      <p><strong>Drop-off:</strong> ${dropoffLocation}</p>
      <p style="color: #C9A227;">${COMPANY.tagline}</p>
    </div>
  `;
}

export function statusUpdateEmail({
  customerName,
  bookingId,
  status,
}: {
  customerName: string;
  bookingId: string;
  status: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #fff; padding: 24px; border: 1px solid #C9A227;">
      <h1 style="color: #C9A227;">Horizon-VIP-Move</h1>
      <h2>Booking Status Update</h2>
      <p>Dear ${customerName},</p>
      <p>Your booking <strong>${bookingId}</strong> status has been updated to: <strong style="color: #C9A227;">${status}</strong></p>
      <p>Contact us on WhatsApp: ${COMPANY.whatsapp}</p>
    </div>
  `;
}

export function passwordResetEmail({ resetUrl }: { resetUrl: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #fff; padding: 24px; border: 1px solid #C9A227;">
      <h1 style="color: #C9A227;">Horizon-VIP-Move</h1>
      <h2>Password Reset</h2>
      <p>Use the link below to choose a new password. This link expires in one hour.</p>
      <p><a href="${resetUrl}" style="color: #C9A227;">Reset your password</a></p>
    </div>
  `;
}
