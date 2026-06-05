exports.handler = async (event) => {
  const { action, token } = event.queryStringParameters || {};

  if (!action || !token || !["accepter", "refuser"].includes(action)) {
    return { statusCode: 400, body: "Paramètres invalides." };
  }

  let reservation;
  try {
    reservation = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  } catch {
    return { statusCode: 400, body: "Token invalide." };
  }

  const { prenom, nom, date, heure, couverts, emailClient } = reservation;
  const estAccepte = action === "accepter";

  const htmlClient = estAccepte ? `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:30px auto;background:#fff;border:1px solid #ddd;border-top:4px solid #2e6b35;">
    <div style="background:#2e6b35;padding:24px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:1.3rem;">Réservation Confirmée ✓</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="font-size:1.1rem;color:#2c1810;">Bonjour <strong>${prenom}</strong>,</p>
      <p style="color:#4a3728;line-height:1.6;">Nous avons le plaisir de confirmer votre réservation. Nous serons ravis de vous accueillir !</p>
      <div style="background:#f5f0e8;border-left:3px solid #2e6b35;padding:16px 20px;margin:20px 0;">
        <p style="margin:4px 0;color:#2c1810;"><strong>📅 Date :</strong> ${date}</p>
        <p style="margin:4px 0;color:#2c1810;"><strong>🕐 Heure :</strong> ${heure}</p>
        <p style="margin:4px 0;color:#2c1810;"><strong>👥 Couverts :</strong> ${couverts}</p>
      </div>
      <p style="color:#6b5344;font-style:italic;">En cas d'empêchement, merci de nous prévenir dès que possible.</p>
      <p style="color:#2c1810;margin-top:24px;">À très bientôt,<br><strong>L'Atelier des Plats</strong></p>
    </div>
  </div>
</body></html>`
  : `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <div style="max-width:520px;margin:30px auto;background:#fff;border:1px solid #ddd;border-top:4px solid #8b1a1a;">
    <div style="background:#8b1a1a;padding:24px 32px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:1.3rem;">Créneau Indisponible</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="font-size:1.1rem;color:#2c1810;">Bonjour <strong>${prenom}</strong>,</p>
      <p style="color:#4a3728;line-height:1.6;">Nous vous remercions de votre intérêt, mais nous sommes dans l'impossibilité d'honorer votre réservation pour le <strong>${date} à ${heure}</strong> — ce créneau est malheureusement complet.</p>
      <p style="color:#4a3728;line-height:1.6;">N'hésitez pas à nous recontacter pour trouver une autre disponibilité.</p>
      <p style="color:#2c1810;margin-top:24px;">Avec nos excuses,<br><strong>L'Atelier des Plats</strong></p>
    </div>
  </div>
</body></html>`;

  const couleur = estAccepte ? "#2e6b35" : "#8b1a1a";
  const titre   = estAccepte ? "Réservation acceptée ✓" : "Réservation refusée";
  const texte   = estAccepte
    ? `<strong>${prenom} ${nom}</strong> a été notifié de la confirmation pour le <strong>${date} à ${heure}</strong>.`
    : `<strong>${prenom} ${nom}</strong> a été notifié que le créneau du <strong>${date} à ${heure}</strong> est indisponible.`;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: "L'Atelier des Plats – Réservations", email: process.env.GMAIL_USER },
        to: [{ email: emailClient }],
        subject: estAccepte
          ? `✅ Réservation confirmée – ${date} à ${heure}`
          : `Réservation – Créneau indisponible`,
        htmlContent: htmlClient
      })
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titre}</title>
<style>body{margin:0;background:#f5f0e8;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.card{background:#fff;max-width:420px;width:90%;padding:48px 40px;text-align:center;border-top:4px solid ${couleur};box-shadow:0 8px 32px rgba(0,0,0,0.1);}
.icon{width:64px;height:64px;border-radius:50%;background:${couleur};color:#fff;font-size:1.8rem;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;}
h1{font-family:Georgia,serif;color:#2c1810;font-size:1.4rem;margin:0 0 16px;}
p{color:#6b5344;line-height:1.6;font-size:1rem;}</style></head>
<body><div class="card">
  <div class="icon">${estAccepte ? "✓" : "✗"}</div>
  <h1>${titre}</h1>
  <p>${texte}</p>
  <p style="margin-top:16px;font-style:italic;font-size:0.85rem;color:#999;">Vous pouvez fermer cette fenêtre.</p>
</div></body></html>`
    };
  } catch (err) {
    return { statusCode: 500, body: "Erreur lors de l'envoi du mail au client : " + err.message };
  }
};
