/* Proyecta + — alta de suscriptores en Resend
   POST /api/suscribir  { email, nombre?, origen?, sitio? }
   - Crea el contacto en Resend, lo suma al segmento General y, según el origen,
     a otros segmentos (ej. "planillas").
   - Si el contacto es nuevo, le manda el mail de bienvenida.
   - Si el formulario llega sin JavaScript, redirige a /gracias.
   Variables de entorno (Vercel → Settings → Environment Variables):
     RESEND_API_KEY   (obligatoria, clave con permiso "Full access")
     RESEND_FROM      (opcional) ej. "Proyecta + <novedades@news.proyectamas.com.ar>"
     RESEND_REPLY_TO  (opcional) por defecto hola@proyectamas.com.ar */

const SEGMENTOS = {
  general: "0cd1189c-9632-44d6-8a8e-94122e8e56e6",
  planillas: "207ad42e-8651-4272-9663-9146d95ed90a"
};
const ORIGENES_PERMITIDOS = ["pie", "planillas", "checkout", "popup", "red", "otro"];
const ORIGENES_CON_SEGMENTO = { planillas: "planillas", checkout: "planillas" };

const API = "https://api.resend.com";
const emailOk = (e) => /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(e) && e.length <= 254;

async function leerCuerpo(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const raw = typeof req.body === "string" ? req.body : await new Promise((ok) => {
    let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => ok(d));
  });
  const tipo = (req.headers["content-type"] || "").toLowerCase();
  if (tipo.includes("application/json")) { try { return JSON.parse(raw || "{}"); } catch (e) { return {}; } }
  return Object.fromEntries(new URLSearchParams(raw));
}

async function resend(ruta, cuerpo, metodo) {
  const r = await fetch(API + ruta, {
    method: metodo || "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  let data = null; try { data = await r.json(); } catch (e) {}
  return { ok: r.ok, status: r.status, data };
}

function bienvenida(nombre) {
  const hola = nombre ? "Hola " + nombre.replace(/[<>&"]/g, "") + "," : "Hola,";
  return `<!doctype html><html lang="es"><body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;color:#0e2341">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:28px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:2px solid #122e54;border-radius:22px;overflow:hidden">
<tr><td style="background:#122e54;padding:26px 30px;border-bottom:6px solid #ffe500">
<span style="font-family:Impact,'Arial Black',sans-serif;font-size:30px;letter-spacing:1px;color:#ffe500">PROYECTA<span style="color:#ffffff">+</span></span></td></tr>
<tr><td style="padding:30px 30px 8px">
<h1 style="margin:0 0 14px;font-size:26px;line-height:1.15;color:#122e54">¡Bienvenido a Proyecta +!</h1>
<p style="margin:0 0 14px;font-size:16px;line-height:1.55">${hola}</p>
<p style="margin:0 0 14px;font-size:16px;line-height:1.55">Gracias por sumarte. Desde ahora vas a recibir antes que nadie los lanzamientos, descuentos y novedades de nuestras planillas, manuales y herramientas para la construcción.</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.55">Mandamos pocos mails y solo cuando hay algo que vale la pena. Mientras tanto, esto te puede servir:</p>
</td></tr>
<tr><td style="padding:0 30px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:12px 16px;border:1.5px solid #c3cedd;border-radius:14px"><a href="https://proyectamas.com.ar/productos#planillas" style="color:#122e54;font-weight:bold;text-decoration:none;font-size:16px">→ Planillas de cómputo y presupuesto</a><br><span style="font-size:14px;color:#4b5f7b">La Suite de 31 planillas y los packs por etapa.</span></td></tr>
<tr><td height="10"></td></tr>
<tr><td style="padding:12px 16px;border:1.5px solid #c3cedd;border-radius:14px"><a href="https://proyectamas.com.ar/productos#manuales" style="color:#122e54;font-weight:bold;text-decoration:none;font-size:16px">→ Manuales paso a paso</a><br><span style="font-size:14px;color:#4b5f7b">Proyecto integral, instalaciones, presupuesto, BIM, AutoCAD y más.</span></td></tr>
<tr><td height="10"></td></tr>
<tr><td style="padding:12px 16px;border:1.5px solid #c3cedd;border-radius:14px"><a href="https://proyectamas.com.ar/estudio" style="color:#122e54;font-weight:bold;text-decoration:none;font-size:16px">→ Servicios de + Estudio</a><br><span style="font-size:14px;color:#4b5f7b">Proyectos, instalaciones, BIM, renders y cómputos con precio de referencia.</span></td></tr>
</table></td></tr>
<tr><td style="padding:24px 30px 6px">
<a href="https://wa.me/5493425104877?text=Hola%20Proyecta%2B%2C%20me%20acabo%20de%20suscribir" style="display:inline-block;background:#ffe500;color:#122e54;font-weight:bold;text-decoration:none;padding:13px 24px;border-radius:999px;border:2px solid #122e54">Escribinos por WhatsApp</a></td></tr>
<tr><td style="padding:22px 30px 28px;font-size:13px;color:#4b5f7b;line-height:1.5">
Transparencia, confianza y honestidad: si en algún momento no querés recibir más mails, respondé este correo y te damos de baja.<br><br>
Proyecta + · Rosario, Santa Fe · <a href="https://proyectamas.com.ar" style="color:#1e4982">proyectamas.com.ar</a> · <a href="https://instagram.com/_proyectamas_" style="color:#1e4982">@_proyectamas_</a></td></tr>
</table></td></tr></table></body></html>`;
}

module.exports = async (req, res) => {
  const quiereJSON = (req.headers.accept || "").includes("application/json") || (req.headers["content-type"] || "").includes("application/json");
  const responder = (status, cuerpo) => {
    if (quiereJSON) { res.statusCode = status; res.setHeader("Content-Type", "application/json; charset=utf-8"); return res.end(JSON.stringify(cuerpo)); }
    res.statusCode = 303; res.setHeader("Location", cuerpo.ok ? "/gracias" : "/gracias?error=1"); return res.end();
  };
  if (req.method !== "POST") { res.statusCode = 405; res.setHeader("Allow", "POST"); return res.end(); }
  if (!process.env.RESEND_API_KEY) return responder(500, { ok: false, error: "config" });

  const b = await leerCuerpo(req);
  if (b.web) return responder(200, { ok: true }); // trampa para bots: campo oculto completado
  const email = String(b.email || "").trim().toLowerCase();
  const nombre = String(b.nombre || "").trim().slice(0, 60);
  const origen = ORIGENES_PERMITIDOS.includes(b.origen) ? b.origen : "otro";
  const sitio = String(b.sitio || "proyectamas.com.ar").slice(0, 60);
  if (!emailOk(email)) return responder(400, { ok: false, error: "email" });

  const segs = [SEGMENTOS.general];
  if (ORIGENES_CON_SEGMENTO[origen]) segs.push(SEGMENTOS[ORIGENES_CON_SEGMENTO[origen]]);

  // ¿Ya estaba suscripto? Lo sumamos a los segmentos que falten, sin repetir la bienvenida.
  const previo = await resend("/contacts/" + encodeURIComponent(email), null, "GET");
  if (previo.ok && previo.data && previo.data.id) {
    for (const id of segs) await resend("/contacts/" + encodeURIComponent(email) + "/segments/" + id);
    if (previo.data.unsubscribed) await resend("/contacts/" + encodeURIComponent(email), { unsubscribed: false }, "PATCH");
    return responder(200, { ok: true, existente: true });
  }

  const alta = await resend("/contacts", {
    email, first_name: nombre || undefined, unsubscribed: false,
    properties: { origen: origen + " · " + sitio },
    segments: segs.map((id) => ({ id }))
  });

  if (!alta.ok) return responder(502, { ok: false, error: "resend" });

  {
    await resend("/emails", {
      from: process.env.RESEND_FROM || "Proyecta + <novedades@proyectamas.com.ar>",
      to: [email],
      reply_to: process.env.RESEND_REPLY_TO || "hola@proyectamas.com.ar",
      subject: "¡Bienvenido a Proyecta +!",
      html: bienvenida(nombre)
    });
  }
  return responder(200, { ok: true });
};
