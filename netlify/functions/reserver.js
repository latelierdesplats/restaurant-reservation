const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS_HEADERS, body: "Method Not Allowed" };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: CORS_HEADERS, body: "Invalid JSON" }; }

  const { prenom, nom, date, heure, couverts, tel, emailClient, message } = body;
  if (!prenom || !nom || !date || !heure || !couverts || !tel || !emailClient) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Champs manquants" }) };
  }

  const reservation = { prenom, nom, date, heure, couverts, tel, emailClient, message: message || "—" };
  const token = Buffer.from(JSON.stringify(reservation)).toString("base64");
  const siteUrl = process.env.SITE_URL;
  const acceptUrl = `${siteUrl}/.netlify/functions/repondre?action=accepter&token=${token}`;
  const refusUrl  = `${siteUrl}/.netlify/functions/repondre?action=refuser&token=${token}`;

  const htmlMail = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:30px auto;background:#fff;border:1px solid #ddd;border-top:4px solid #8b1a1a;">
    <div style="background:#1a1a1a;padding:24px 32px;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;font-weight:300;letter-spacing:4px;color:#b5954a;text-transform:uppercase;">L'Atelier des Plats &nbsp;·&nbsp; Toulouse</p>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:300;color:#ffffff;">Nouvelle Réservation</h1>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:1rem;">
        <tr><td style="padding:8px 0;color:#6b5344;width:40%;">Client</td><td style="padding:8px 0;font-weight:bold;color:#2c1810;">${prenom} ${nom}</td></tr>
        <tr style="background:#faf6ef;"><td style="padding:8px 6px;color:#6b5344;">Date</td><td style="padding:8px 6px;font-weight:bold;color:#2c1810;">${date}</td></tr>
        <tr><td style="padding:8px 0;color:#6b5344;">Heure</td><td style="padding:8px 0;font-weight:bold;color:#2c1810;">${heure}</td></tr>
        <tr style="background:#faf6ef;"><td style="padding:8px 6px;color:#6b5344;">Couverts</td><td style="padding:8px 6px;font-weight:bold;color:#2c1810;">${couverts}</td></tr>
        <tr><td style="padding:8px 0;color:#6b5344;">Téléphone</td><td style="padding:8px 0;font-weight:bold;color:#2c1810;">${tel}</td></tr>
        <tr style="background:#faf6ef;"><td style="padding:8px 6px;color:#6b5344;">Email client</td><td style="padding:8px 6px;font-weight:bold;color:#2c1810;">${emailClient}</td></tr>
        ${message && message !== '—' ? `<tr><td style="padding:8px 0;color:#6b5344;vertical-align:top;">Message</td><td style="padding:8px 0;color:#2c1810;font-style:italic;">${message}</td></tr>` : ''}
      </table>
      <div style="margin:32px 0 8px;text-align:center;">
        <a href="${acceptUrl}" style="display:inline-block;background:#2e6b35;color:#fff;text-decoration:none;padding:14px 36px;font-size:1rem;margin:0 8px 12px;">✓ Accepter</a>
        <a href="${refusUrl}" style="display:inline-block;background:#8b1a1a;color:#fff;text-decoration:none;padding:14px 36px;font-size:1rem;margin:0 8px 12px;">✗ Refuser</a>
      </div>
      <p style="text-align:center;color:#999;font-size:0.8rem;">Cliquez sur un bouton pour notifier automatiquement le client.</p>
    </div>
  </div>
</body></html>`;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "L'Atelier des Plats – Réservations", email: process.env.GMAIL_USER },
        to: [{ email: process.env.GMAIL_USER }],
        subject: `🍽️ Nouvelle réservation – ${prenom} ${nom} – ${date} à ${heure}`,
        htmlContent: htmlMail
      })
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt);
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Erreur:", err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) };
  }
};
