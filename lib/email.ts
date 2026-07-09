import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "AIKO Event <noreply@aikoevent.com>";

interface SendConfirmationInput {
  to: string;
  participantName: string;
  eventName: string;
  eventDate: string;
  eventLieu: string;
  reference: string;
  ticketNumber: number;
  type: "badge" | "ticket";
  amount?: number;
}

export async function sendConfirmationEmail(input: SendConfirmationInput) {
  const resend = getResend();
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set, skipping email");
    return null;
  }

  const ticketLabel = input.type === "ticket" ? "Ticket" : "Badge";
  const ticketNum = String(input.ticketNumber).padStart(4, "0");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F3F2EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px">
    <!-- Header -->
    <div style="background:#0A0A0A;border-radius:16px 16px 0 0;padding:32px 32px 24px">
      <table width="100%"><tr>
        <td><span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#C8A951;letter-spacing:0.04em">AIKO</span></td>
        <td align="right"><span style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:rgba(255,255,255,0.4)">${ticketLabel}</span></td>
      </tr></table>
    </div>

    <!-- Body -->
    <div style="background:#FFFFFF;padding:32px;border-left:1px solid #E8E6E1;border-right:1px solid #E8E6E1">
      <p style="font-family:Georgia,serif;font-size:22px;color:#0A0A0A;margin:0 0 8px;line-height:1.3">
        ${ticketLabel} confirme !
      </p>
      <p style="font-size:14px;color:#8A8680;margin:0 0 24px;line-height:1.5">
        ${input.participantName}, votre ${ticketLabel.toLowerCase()} pour <strong style="color:#0A0A0A">${input.eventName}</strong> est pret.
      </p>

      <!-- Info card -->
      <div style="background:#F3F2EE;border-radius:12px;padding:20px;margin-bottom:24px">
        <table width="100%" style="font-size:13px;color:#0A0A0A">
          <tr>
            <td style="padding:4px 0;color:#8A8680;width:100px">Evenement</td>
            <td style="padding:4px 0;font-weight:600">${input.eventName}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#8A8680">Date</td>
            <td style="padding:4px 0">${input.eventDate}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#8A8680">Lieu</td>
            <td style="padding:4px 0">${input.eventLieu}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#8A8680">Reference</td>
            <td style="padding:4px 0;font-family:monospace;color:#C8A951;font-weight:600">${input.reference}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#8A8680">${ticketLabel} N°</td>
            <td style="padding:4px 0;font-family:monospace;font-weight:700;font-size:16px">${ticketNum}</td>
          </tr>
          ${input.amount && input.amount > 0 ? `
          <tr>
            <td style="padding:4px 0;color:#8A8680">Montant</td>
            <td style="padding:4px 0;font-weight:600">${new Intl.NumberFormat("fr-FR").format(input.amount)} XOF</td>
          </tr>` : ""}
        </table>
      </div>

      <p style="font-size:13px;color:#8A8680;margin:0 0 8px;line-height:1.5">
        Presentez ce ${ticketLabel.toLowerCase()} (imprime ou sur telephone) a l'entree. Le QR code sera scanne pour valider votre acces.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#0A0A0A;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center">
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:rgba(255,255,255,0.3);margin:0">
        AIKO Event & Tech · aikoevent.com
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: `${ticketLabel} confirme — ${input.eventName} (${input.reference})`,
      html,
    });
    console.log(`[email] Confirmation sent to ${input.to}: ${result.data?.id}`);
    return result;
  } catch (err) {
    console.error("[email] send error:", err);
    return null;
  }
}

interface SendReminderInput {
  to: string;
  participantName: string;
  eventName: string;
  eventDate: string;
  eventLieu: string;
  reference: string;
}

export async function sendReminderEmail(input: SendReminderInput) {
  const resend = getResend();
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set, skipping reminder");
    return null;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F3F2EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px">
    <div style="background:#0A0A0A;border-radius:16px 16px 0 0;padding:32px 32px 24px">
      <table width="100%"><tr>
        <td><span style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#C8A951;letter-spacing:0.04em">AIKO</span></td>
        <td align="right"><span style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:rgba(255,255,255,0.4)">Rappel</span></td>
      </tr></table>
    </div>

    <div style="background:#FFFFFF;padding:32px;border-left:1px solid #E8E6E1;border-right:1px solid #E8E6E1">
      <p style="font-family:Georgia,serif;font-size:22px;color:#0A0A0A;margin:0 0 8px;line-height:1.3">
        C'est demain !
      </p>
      <p style="font-size:14px;color:#8A8680;margin:0 0 24px;line-height:1.5">
        ${input.participantName}, <strong style="color:#0A0A0A">${input.eventName}</strong> commence demain.
      </p>

      <div style="background:#F3F2EE;border-radius:12px;padding:20px;margin-bottom:24px">
        <table width="100%" style="font-size:13px;color:#0A0A0A">
          <tr>
            <td style="padding:4px 0;color:#8A8680;width:100px">Date</td>
            <td style="padding:4px 0;font-weight:600">${input.eventDate}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#8A8680">Lieu</td>
            <td style="padding:4px 0">${input.eventLieu}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#8A8680">Reference</td>
            <td style="padding:4px 0;font-family:monospace;color:#C8A951;font-weight:600">${input.reference}</td>
          </tr>
        </table>
      </div>

      <p style="font-size:13px;color:#8A8680;margin:0;line-height:1.5">
        N'oubliez pas votre badge ou ticket (imprime ou sur telephone). A demain !
      </p>
    </div>

    <div style="background:#0A0A0A;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center">
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:rgba(255,255,255,0.3);margin:0">
        AIKO Event & Tech · aikoevent.com
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: `Rappel — ${input.eventName} commence demain`,
      html,
    });
    console.log(`[email] Reminder sent to ${input.to}: ${result.data?.id}`);
    return result;
  } catch (err) {
    console.error("[email] reminder error:", err);
    return null;
  }
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}
