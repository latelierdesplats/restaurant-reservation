const nodemailer = require("nodemailer");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function createTransport() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function htmlConfirmation(prenom, date, heure, couverts) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400&display=swap');</style>
</head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:'Montserrat',Arial,sans-serif;">
  <div style="max-width:540px;margin:40px auto;background:#ffffff;border:1px solid #e0dbd4;">
    <div style="background:#1a1a1a;padding:32px;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;font-weight:300;letter-spacing:4px;color:#b5954a;text-transform:uppercase;">L'Atelier des Plats &nbsp;·&nbsp; Toulouse</p>
      <h1 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:300;color:#ffffff;letter-spacing:1px;">Réservation <em>confirmée</em></h1>
    </div>
    <div style="height:2px;background:linear-gradient(to right,#f7f5f2,#b5954a,#f7f5f2);"></div>
    <div style="padding:36px 40px;">
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:300;color:#1a1a1a;margin:0 0 16px;">Bonjour <strong style="font-weight:400;">${prenom}</strong>,</p>
      <p style="font-size:13px;font-weight:300;color:#555;line-height:1.8;margin:0 0 28px;">Nous avons le plaisir de confirmer votre réservation et avons hâte de vous accueillir.</p>
      <div style="background:#f7f5f2;border-left:2px solid #b5954a;padding:20px 24px;margin:0 0 28px;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <tr><td style="padding:6px 0;color:#888;font-weight:300;letter-spacing:1px;text-transform:uppercase;width:40%;">Date</td><td style="padding:6px 0;color:#1a1a1a;font-weight:400;">${date}</td></tr>
          <tr><td style="padding:6px 0;color:#888;font-weight:300;letter-spacing:1px;text-transform:uppercase;">Heure</td><td style="padding:6px 0;color:#1a1a1a;font-weight:400;">${heure}</td></tr>
          <tr><td style="padding:6px 0;color:#888;font-weight:300;letter-spacing:1px;text-transform:uppercase;">Couverts</td><td style="padding:6px 0;color:#1a1a1a;font-weight:400;">${couverts}</td></tr>
        </table>
      </div>
      <p style="font-size:12px;font-weight:300;color:#888;line-height:1.8;margin:0;font-style:italic;">En cas d'empêchement, merci de nous prévenir dès que possible au <a href="tel:0561733956" style="color:#b5954a;text-decoration:none;">05.61.73.39.56</a>.</p>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:300;color:#1a1a1a;margin:28px 0 0;">À très bientôt,<br><em>L'Atelier des Plats</em></p>
    </div>
    <div style="background:#2c2c2c;padding:20px 40px;text-align:center;">
      <p style="font-size:11px;font-weight:400;color:#ccc;letter-spacing:1px;margin:0 0 6px;text-transform:uppercase;">Ceci est un email automatique, merci de ne pas y répondre.</p>
      <p style="font-size:12px;font-weight:300;color:#ccc;margin:0;">Pour nous contacter : <a href="tel:0561733956" style="color:#b5954a;text-decoration:none;font-weight:400;">05.61.73.39.56</a> &nbsp;·&nbsp; <a href="mailto:latelierdesplats@gmail.com" style="color:#b5954a;text-decoration:none;font-weight:400;">latelierdesplats@gmail.com</a></p>
    </div>
  </div>
</body></html>`;
}

function htmlRefus(prenom, date, heure) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400&display=swap');</style>
</head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:'Montserrat',Arial,sans-serif;">
  <div style="max-width:540px;margin:40px auto;background:#ffffff;border:1px solid #e0dbd4;">
    <div style="background:#7a1f1f;padding:32px;text-align:center;">
      <p style="margin:0 0 6px;font-size:10px;font-weight:300;letter-spacing:4px;color:#f0b8b8;text-transform:uppercase;">L'Atelier des Plats &nbsp;·&nbsp; Toulouse</p>
      <div style="font-size:32px;margin:0 0 8px;">❌</div>
      <h1 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:400;color:#ffffff;letter-spacing:1px;">Réservation <em>non confirmée</em></h1>
    </div>
    <div style="height:3px;background:#7a1f1f;"></div>
    <div style="padding:36px 40px;">
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:300;color:#1a1a1a;margin:0 0 16px;">Bonjour <strong style="font-weight:400;">${prenom}</strong>,</p>
      <p style="font-size:13px;font-weight:300;color:#555;line-height:1.8;margin:0 0 16px;">Nous vous remercions de l'intérêt que vous portez à notre restaurant.</p>
      <p style="font-size:13px;font-weight:300;color:#555;line-height:1.8;margin:0 0 16px;">Malheureusement, nous ne sommes pas en mesure de donner une suite favorable à votre demande de réservation pour le <strong style="font-weight:400;color:#1a1a1a;">${date} à ${heure}</strong>.</p>
      <p style="font-size:13px;font-weight:300;color:#555;line-height:1.8;margin:0 0 28px;">Nous vous invitons à consulter nos disponibilités sur une autre date ou à nous contacter directement afin que nous puissions vous proposer une alternative.</p>
      <div style="background:#f7f5f2;border-left:2px solid #b5954a;padding:20px 24px;margin:0 0 28px;">
        <p style="font-size:11px;font-weight:300;letter-spacing:2px;text-transform:uppercase;color:#888;margin:0 0 10px;">Nous contacter</p>
        <p style="font-size:13px;font-weight:300;color:#1a1a1a;margin:4px 0;">📞 <a href="tel:0561733956" style="color:#b5954a;text-decoration:none;">05.61.73.39.56</a></p>
        <p style="font-size:13px;font-weight:300;color:#1a1a1a;margin:4px 0;">✉️ <a href="mailto:latelierdesplats@gmail.com" style="color:#b5954a;text-decoration:none;">latelierdesplats@gmail.com</a></p>
      </div>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:300;color:#1a1a1a;margin:24px 0 0;">Avec nos excuses,<br><em>L'Atelier des Plats</em></p>
    </div>
    <div style="background:#2c2c2c;padding:20px 40px;text-align:center;">
      <p style="font-size:11px;font-weight:400;color:#ccc;letter-spacing:1px;margin:0 0 6px;text-transform:uppercase;">Ceci est un email automatique, merci de ne pas y répondre.</p>
      <p style="font-size:12px;font-weight:300;color:#ccc;margin:0;">Pour nous contacter : <a href="tel:0561733956" style="color:#b5954a;text-decoration:none;font-weight:400;">05.61.73.39.56</a> &nbsp;·&nbsp; <a href="mailto:latelierdesplats@gmail.com" style="color:#b5954a;text-decoration:none;font-weight:400;">latelierdesplats@gmail.com</a></p>
    </div>
  </div>
</body></html>`;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  const { action, token } = event.queryStringParameters || {};

  if (!action || !token || !["accepter", "refuser"].includes(action)) {
    return { statusCode: 400, headers: CORS_HEADERS, body: "Paramètres invalides." };
  }

  let reservation;
  try {
    reservation = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: "Token invalide." };
  }

  const { prenom, nom, date, heure, couverts, emailClient } = reservation;
  const estAccepte = action === "accepter";

  const htmlClient = estAccepte
    ? htmlConfirmation(prenom, date, heure, couverts)
    : htmlRefus(prenom, date, heure);

  const couleur = estAccepte ? "#2e6b35" : "#8b1a1a";
  const titre   = estAccepte ? "Réservation acceptée ✓" : "Réservation refusée";
  const texte   = estAccepte
    ? `<strong>${prenom} ${nom}</strong> a été notifié de la confirmation pour le <strong>${date} à ${heure}</strong>.`
    : `<strong>${prenom} ${nom}</strong> a été notifié que la demande pour le <strong>${date} à ${heure}</strong> n'a pas pu être acceptée.`;

  try {
    const transporter = createTransport();
    await transporter.sendMail({
      from: `"L'Atelier des Plats" <${process.env.GMAIL_USER}>`,
      to: emailClient,
      subject: estAccepte
        ? `Votre réservation est confirmée – ${date} à ${heure}`
        : `❌ Réservation non confirmée – L'Atelier des Plats`,
      html: htmlClient
    });

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "text/html; charset=utf-8" },
      body: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titre}</title>
<style>
  body{margin:0;background:#f7f5f2;font-family:'Montserrat',Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .card{background:#fff;max-width:420px;width:90%;text-align:center;border:1px solid #e0dbd4;overflow:hidden;}
  .top{background:#1a1a1a;padding:32px;}
  .icon{width:56px;height:56px;border-radius:50%;background:${couleur};color:#fff;font-size:1.5rem;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
  h1{margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:300;color:#fff;}
  .body{padding:32px;}
  p{font-size:13px;font-weight:300;color:#555;line-height:1.8;margin:0;}
  .small{font-size:11px;color:#aaa;margin-top:16px;font-style:italic;}
</style></head>
<body><div class="card">
  <div class="top">
    <div class="icon">${estAccepte ? "✓" : "✗"}</div>
    <h1>${titre}</h1>
  </div>
  <div class="body">
    <p>${texte}</p>
    <p class="small">Vous pouvez fermer cette fenêtre.</p>
  </div>
</div></body></html>`
    };
  } catch (err) {
    return { statusCode: 500, headers: CORS_HEADERS, body: "Erreur : " + err.message };
  }
};
