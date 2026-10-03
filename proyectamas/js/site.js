/* PROYECTA + — comportamiento compartido
   - Menú mobile
   - Plano interactivo (canvas) con 5 modos: grilla, cotas, celdas, ladrillos, curvas
   - Tarifario de Estudio a partir de js/precios.js
   - Formulario de contacto que arma el mensaje de WhatsApp o mail */

(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Menú ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Cerrar" : "Menú";
      document.body.style.overflow = open ? "hidden" : "";
    });
  }
  var y = document.getElementById("anio");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------------- Plano interactivo ---------------- */
  var YELLOW = "255,229,0";
  var WHITE = "255,255,255";

  function Plano(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.mode = canvas.getAttribute("data-modo") || "grilla";
    this.host = canvas.parentElement;
    this.mouse = { x: -9999, y: -9999, active: false };
    this.cur = { x: -9999, y: -9999 };
    this.t = 0;
    this.idle = 0;
    this.visible = true;
    this.readX = document.querySelector("[data-rot-x]");
    this.readY = document.querySelector("[data-rot-y]");
    this.resize();
    this.bind();
    var self = this;
    if (reduce) { this.cur.x = this.w * 0.68; this.cur.y = this.h * 0.42; this.draw(); }
    else requestAnimationFrame(function loop() { if (self.visible) { self.step(); self.draw(); } requestAnimationFrame(loop); });
  }

  Plano.prototype.resize = function () {
    var r = this.host.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = r.width; this.h = r.height;
    this.c.width = this.w * this.dpr; this.c.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.gap = this.w < 700 ? 26 : 32;
    this.build();
    if (reduce) this.draw();
  };

  Plano.prototype.build = function () {
    var g = this.gap, pts = [];
    if (this.mode === "ladrillos") {
      var bw = g * 2.2, bh = g * 0.9, row = 0;
      for (var yy = 0; yy < this.h + bh; yy += bh, row++) {
        var off = row % 2 ? bw / 2 : 0;
        for (var xx = -bw; xx < this.w + bw; xx += bw) pts.push({ x: xx + off, y: yy, w: bw - 4, h: bh - 4, dx: 0, dy: 0 });
      }
    } else if (this.mode === "celdas") {
      var cw = g * 2.6, ch = g * 0.95;
      this.cw = cw; this.ch = ch;
      for (var r = 0; r * ch < this.h + ch; r++)
        for (var col = 0; col * cw < this.w + cw; col++)
          pts.push({ x: col * cw, y: r * ch, r: r, col: col, glow: 0, val: (Math.random() * 9000 + 100) | 0 });
    } else if (this.mode === "curvas") {
      this.lines = Math.round(this.h / 16);
    } else {
      for (var py = g / 2; py < this.h + g; py += g)
        for (var px = g / 2; px < this.w + g; px += g) pts.push({ ox: px, oy: py, x: px, y: py });
    }
    this.pts = pts;
  };

  Plano.prototype.bind = function () {
    var self = this;
    function move(e) {
      var r = self.c.getBoundingClientRect();
      self.mouse.x = e.clientX - r.left; self.mouse.y = e.clientY - r.top; self.mouse.active = true; self.idle = 0;
      if (reduce) { self.cur.x = self.mouse.x; self.cur.y = self.mouse.y; self.draw(); }
    }
    this.host.addEventListener("pointermove", move);
    this.host.addEventListener("pointerdown", move);
    this.host.addEventListener("pointerleave", function () { self.mouse.active = false; });
    var to;
    window.addEventListener("resize", function () { clearTimeout(to); to = setTimeout(function () { self.resize(); }, 120); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { self.visible = en[0].isIntersecting; }).observe(this.host);
    }
  };

  Plano.prototype.step = function () {
    this.t += 1;
    var tx, ty;
    if (this.mouse.active) { tx = this.mouse.x; ty = this.mouse.y; }
    else {
      // Sin mouse (o en celular): un cursor "fantasma" recorre el plano despacio
      this.idle += 1;
      var s = this.t * 0.0045;
      // recorre la zona libre del plano: a la derecha en escritorio, arriba en celular
      if (this.w < 700) {
        tx = this.w * (0.5 + 0.36 * Math.sin(s * 1.3));
        ty = this.h * (0.24 + 0.1 * Math.sin(s * 0.9 + 1.2));
      } else {
        tx = this.w * (0.78 + 0.13 * Math.sin(s * 1.3));
        ty = this.h * (0.52 + 0.24 * Math.sin(s * 0.9 + 1.2));
      }
    }
    if (this.cur.x < -1000) { this.cur.x = tx; this.cur.y = ty; }
    this.cur.x += (tx - this.cur.x) * 0.12;
    this.cur.y += (ty - this.cur.y) * 0.12;
    if (this.readX && this.mode !== "celdas" && this.t % 4 === 0) {
      this.readX.textContent = (this.cur.x / 100).toFixed(2) + " m";
      this.readY.textContent = ((this.h - this.cur.y) / 100).toFixed(2) + " m";
    }
  };

  Plano.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    var fn = this["draw_" + this.mode] || this.draw_grilla;
    fn.call(this, ctx);
  };

  /* Grilla de puntos que se corren + líneas de construcción hacia el cursor */
  Plano.prototype.draw_grilla = function (ctx, conCotas) {
    var mx = this.cur.x, my = this.cur.y, R = this.w < 700 ? 120 : 170, R2 = R * R;
    var near = [];
    for (var i = 0; i < this.pts.length; i++) {
      var p = this.pts[i];
      var dx = p.ox - mx, dy = p.oy - my, d2 = dx * dx + dy * dy;
      var tx = p.ox, ty = p.oy;
      if (d2 < R2) {
        var d = Math.sqrt(d2) || 1, f = (1 - d / R);
        tx = p.ox + (dx / d) * f * f * 26;
        ty = p.oy + (dy / d) * f * f * 26;
        near.push({ p: p, f: f, d: d });
      }
      p.x += (tx - p.x) * 0.2; p.y += (ty - p.y) * 0.2;
    }
    // líneas de construcción
    ctx.lineWidth = 1;
    for (var k = 0; k < near.length; k++) {
      var n = near[k];
      if (n.f < 0.18) continue;
      ctx.strokeStyle = "rgba(" + WHITE + "," + (n.f * 0.45).toFixed(3) + ")";
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(n.p.x, n.p.y); ctx.stroke();
    }
    // puntos
    for (var j = 0; j < this.pts.length; j++) {
      var q = this.pts[j];
      var ddx = q.x - mx, ddy = q.y - my, dd = Math.sqrt(ddx * ddx + ddy * ddy);
      var hot = dd < R ? 1 - dd / R : 0;
      ctx.fillStyle = hot > 0.05 ? "rgba(" + YELLOW + "," + (0.35 + hot * 0.65).toFixed(3) + ")" : "rgba(" + WHITE + ",0.3)";
      var s = 1.3 + hot * 2.2;
      ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
    }
    // mira: solo cuando se mueve sola (con mouse se ve el cursor de la unidad)
    if (!this.mouse.active) {
    ctx.strokeStyle = "rgba(" + YELLOW + ",0.9)";
    ctx.beginPath();
    ctx.moveTo(mx - 14, my); ctx.lineTo(mx + 14, my);
    ctx.moveTo(mx, my - 14); ctx.lineTo(mx, my + 14);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(mx, my, 22, 0, Math.PI * 2); ctx.stroke();
    }

    if (conCotas) this.cotas(ctx, mx, my);
  };

  /* Estudio: además de la grilla, cotas que miden la distancia al borde */
  Plano.prototype.draw_cotas = function (ctx) { this.draw_grilla(ctx, true); };

  Plano.prototype.cotas = function (ctx, mx, my) {
    var g = this.gap;
    var sx = Math.round(mx / g) * g, sy = Math.round(my / g) * g;
    var x0 = g * 1.5, y0 = this.h - g * 1.2;
    ctx.save();
    ctx.strokeStyle = "rgba(" + WHITE + ",0.55)";
    ctx.fillStyle = "rgba(" + WHITE + ",0.85)";
    ctx.font = "500 12px Archivo, sans-serif";
    ctx.lineWidth = 1;
    // cota horizontal
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, y0 + 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(x0 - 8, sy); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(sx, y0); ctx.stroke();
    this.tick(ctx, x0, y0); this.tick(ctx, sx, y0);
    var lx = ((sx - x0) / 100).toFixed(2);
    ctx.fillText(lx, (x0 + sx) / 2 - 12, y0 - 7);
    // cota vertical
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, sy); ctx.stroke();
    this.tick(ctx, x0, sy); this.tick(ctx, x0, y0);
    ctx.save(); ctx.translate(x0 - 7, (y0 + sy) / 2 + 12); ctx.rotate(-Math.PI / 2);
    ctx.fillText(((y0 - sy) / 100).toFixed(2), 0, 0); ctx.restore();
    // rectángulo resaltado = un "local" que se dibuja
    ctx.fillStyle = "rgba(" + YELLOW + ",0.07)";
    ctx.fillRect(x0, Math.min(sy, y0), sx - x0, Math.abs(y0 - sy));
    ctx.restore();
  };
  Plano.prototype.tick = function (ctx, x, y) {
    ctx.beginPath(); ctx.moveTo(x - 5, y + 5); ctx.lineTo(x + 5, y - 5); ctx.stroke();
  };

  /* Tech: celdas de planilla que se encienden y muestran valores */
  Plano.prototype.draw_celdas = function (ctx) {
    var mx = this.cur.x, my = this.cur.y, R = 190;
    ctx.font = "500 11px Archivo, sans-serif";
    ctx.textBaseline = "middle";
    for (var i = 0; i < this.pts.length; i++) {
      var p = this.pts[i];
      var cx = p.x + this.cw / 2, cy = p.y + this.ch / 2;
      var d = Math.hypot(cx - mx, cy - my);
      var target = d < R ? 1 - d / R : 0;
      p.glow += (target - p.glow) * 0.15;
      ctx.strokeStyle = "rgba(" + WHITE + ",0.1)";
      ctx.strokeRect(p.x + 0.5, p.y + 0.5, this.cw, this.ch);
      if (p.glow > 0.03) {
        ctx.fillStyle = "rgba(" + YELLOW + "," + (p.glow * 0.5).toFixed(3) + ")";
        ctx.fillRect(p.x + 1, p.y + 1, this.cw - 1, this.ch - 1);
        if (p.glow > 0.25) {
          if (this.t % 9 === 0 && Math.random() < 0.3) p.val = (Math.random() * 9000 + 100) | 0;
          ctx.fillStyle = "rgba(" + WHITE + "," + Math.min(1, p.glow * 1.4).toFixed(3) + ")";
          ctx.fillText("$ " + p.val.toLocaleString("es-AR"), p.x + 8, cy);
        }
      }
    }
    // celda activa
    var acx = Math.floor(mx / this.cw) * this.cw, acy = Math.floor(my / this.ch) * this.ch;
    ctx.lineWidth = 2; ctx.strokeStyle = "rgb(" + YELLOW + ")";
    ctx.strokeRect(acx, acy, this.cw, this.ch);
    ctx.fillStyle = "rgb(" + YELLOW + ")"; ctx.fillRect(acx + this.cw - 4, acy + this.ch - 4, 6, 6);
    ctx.lineWidth = 1;
    var colName = String.fromCharCode(65 + (Math.floor(mx / this.cw) % 26));
    var rowName = Math.floor(my / this.ch) + 1;
    if (this.readX && this.t % 4 === 0) { this.readX.textContent = colName + rowName; this.readY.textContent = "$ " + (((mx * 37 + my * 91) | 0) % 9000 + 1200).toLocaleString("es-AR"); }
  };

  /* Construcciones: muro de ladrillos que se abre alrededor del cursor */
  Plano.prototype.draw_ladrillos = function (ctx) {
    var mx = this.cur.x, my = this.cur.y, R = 170;
    for (var i = 0; i < this.pts.length; i++) {
      var b = this.pts[i];
      var cx = b.x + b.w / 2, cy = b.y + b.h / 2;
      var dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy) || 1;
      var f = d < R ? 1 - d / R : 0;
      var tx = (dx / d) * f * f * 30, ty = (dy / d) * f * f * 30;
      b.dx += (tx - b.dx) * 0.18; b.dy += (ty - b.dy) * 0.18;
      ctx.strokeStyle = f > 0.02 ? "rgba(" + YELLOW + "," + (0.25 + f * 0.7).toFixed(3) + ")" : "rgba(" + WHITE + ",0.13)";
      ctx.strokeRect(b.x + b.dx + 0.5, b.y + b.dy + 0.5, b.w, b.h);
    }
    // plomada: hilo y nivel
    ctx.strokeStyle = "rgba(" + YELLOW + ",0.8)";
    ctx.setLineDash([2, 5]);
    ctx.beginPath(); ctx.moveTo(mx, 0); ctx.lineTo(mx, my - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, my); ctx.lineTo(this.w, my); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgb(" + YELLOW + ")";
    ctx.beginPath(); ctx.moveTo(mx - 7, my - 12); ctx.lineTo(mx + 7, my - 12); ctx.lineTo(mx, my + 4); ctx.closePath(); ctx.fill();
  };

  /* Desarrollos: líneas de terreno; el cursor levanta una loma */
  Plano.prototype.draw_curvas = function (ctx) {
    var mx = this.cur.x, my = this.cur.y, n = this.lines, step = this.h / n;
    var t = this.t * 0.01;
    ctx.lineWidth = 1;
    for (var i = 0; i < n + 2; i++) {
      var baseY = i * step;
      var dyLine = baseY - my;
      ctx.beginPath();
      for (var x = -10; x <= this.w + 10; x += 8) {
        var dx = x - mx;
        var bump = Math.exp(-(dx * dx) / (2 * 140 * 140)) * Math.exp(-(dyLine * dyLine) / (2 * 170 * 170));
        var yy = baseY
          + Math.sin(x * 0.006 + i * 0.35 + t) * 6
          + Math.sin(x * 0.013 - i * 0.2) * 3
          - bump * 70;
        if (x === -10) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      var a = Math.exp(-(dyLine * dyLine) / (2 * 160 * 160));
      ctx.strokeStyle = a > 0.15 ? "rgba(" + YELLOW + "," + (0.2 + a * 0.6).toFixed(3) + ")" : "rgba(" + WHITE + ",0.16)";
      ctx.stroke();
    }
    ctx.fillStyle = "rgb(" + YELLOW + ")";
    ctx.beginPath(); ctx.arc(mx, my - 70, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(" + YELLOW + ",0.7)";
    ctx.beginPath(); ctx.moveTo(mx, my - 70); ctx.lineTo(mx, my - 110); ctx.lineTo(mx + 26, my - 102); ctx.lineTo(mx, my - 94); ctx.stroke();
  };

  var canvases = document.querySelectorAll("canvas[data-modo]");
  for (var ci = 0; ci < canvases.length; ci++) new Plano(canvases[ci]);

  /* ---------------- Tarifario ---------------- */
  function money(n) {
    return n.toLocaleString("es-AR", { maximumFractionDigits: 2 });
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function waLink(text) {
    var num = (window.PRECIOS && window.PRECIOS.whatsapp) || "5493425104877";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
  }
  function precioHTML(p) {
    if (p.precio === null || p.precio === undefined) return '<div class="precio cotizar">A cotizar</div>';
    var m = (window.PRECIOS.moneda || "USD");
    return '<div class="precio">' + (p.desde ? '<span class="desde">desde</span>' : "") +
      '<small>' + m + '</small> ' + money(p.precio) + (p.unidad ? '<small>' + esc(p.unidad) + '</small>' : "") + "</div>";
  }

  var tarif = document.getElementById("tarifario");
  if (tarif && window.PRECIOS) {
    var P = window.PRECIOS, html = "", idx = "";
    P.categorias.forEach(function (cat) {
      idx += '<a href="#' + cat.id + '">' + esc(cat.corto || cat.nombre) + "</a>";
      html += '<section class="categoria" id="' + cat.id + '" aria-labelledby="h-' + cat.id + '"><div class="wrap">';
      html += '<div class="cat-head"><h2 class="d2" id="h-' + cat.id + '">' + esc(cat.nombre) + "</h2><p>" + esc(cat.intro) + "</p></div>";
      if (cat.lod) html += lodHTML(cat);
      var visibles = cat.lod ? [] : cat.productos; // en BIM los niveles se eligen en el selector LOD
      if (visibles.length) html += '<div class="niveles" style="--n:' + visibles.length + '">';
      visibles.forEach(function (p) {
        html += '<article class="nivel' + (p.destacado ? " destacado" : "") + '">';
        html += "<h3>" + esc(p.nombre) + "</h3>";
        if (p.sub) html += '<div class="sub">' + esc(p.sub) + "</div>";
        html += precioHTML(p);
        html += '<div class="extra">' + esc(p.extra || "") + "</div>";
        html += "<ul>" + p.incluye.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
        html += '<div class="meta">' + (p.plazo ? "<span>Plazo: " + esc(p.plazo) + "</span>" : "") + (p.revisiones ? "<span>" + p.revisiones + (p.revisiones === 1 ? " revisión incluida" : " revisiones incluidas") + "</span>" : "") + "</div>";
        html += '<a class="btn" target="_blank" rel="noopener" href="' + waLink("Hola Proyecta+, quiero cotizar " + cat.nombre + " — " + p.nombre + ".") + '">Pedir este servicio</a>';
        html += "</article>";
      });
      if (visibles.length) html += "</div>";
      if (P.aviso) html += '<p class="aviso">' + esc(P.aviso) + "</p>";
      html += '<div class="cat-pie">';
      if (cat.adicionales && cat.adicionales.length) html += "<div><h4>Adicionales</h4><ul>" + cat.adicionales.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      if (cat.noIncluye && cat.noIncluye.length) html += "<div><h4>No incluye</h4><ul>" + cat.noIncluye.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      if (cat.aporta) html += "<div><h4>Qué nos mandás</h4><p>" + esc(cat.aporta) + "</p></div>";
      html += "</div></div></section>";
    });
    tarif.innerHTML = html;
    var ind = document.getElementById("indice");
    if (ind) ind.innerHTML = idx;
    var cond = document.getElementById("condiciones-lista");
    if (cond) cond.innerHTML = P.condiciones.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("");
    initLOD();
    // índice activo según scroll
    if ("IntersectionObserver" in window && ind) {
      var links = ind.querySelectorAll("a");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) { l.classList.toggle("activo", l.getAttribute("href") === "#" + e.target.id); });
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      document.querySelectorAll(".categoria").forEach(function (s) { io.observe(s); });
    }
  }

  /* Selector de LOD con un muro dibujado que gana detalle */
  function lodHTML(cat) {
    var tabs = cat.productos.map(function (p, i) {
      return '<button role="tab" type="button" aria-selected="' + (i === 2 ? "true" : "false") + '" data-i="' + i + '">' + esc(p.nombre.replace("LOD ", "")) + "</button>";
    }).join("");
    return '<div class="lod" data-lod><div class="lod-dibujo">' + muroSVG() + cat.productos.map(function (p, i) {
        return p.imagen ? '<img class="lod-img" data-i="' + i + '" src="' + esc(p.imagen) + '" alt="Modelo ' + esc(p.nombre + " · " + p.sub) + '"' + (i === 2 ? "" : ' loading="lazy"') + ">" : "";
      }).join("") + '</div>' +
      '<div class="lod-panel"><p class="note" style="margin:0 0 10px">Nivel de desarrollo</p><div class="lod-tabs" role="tablist" aria-label="Nivel de desarrollo">' + tabs + '</div><div class="lod-info" aria-live="polite"></div></div></div>';
  }
  function muroSVG() {
    // capas: 1 masa, 2 muro con espesor, 3 capas y aberturas, 4 interferencias (instalaciones), 5 detalle de fijación, 6 verificado
    return '<svg viewBox="0 0 400 300" fill="none" stroke="#fff" stroke-width="1.5">' +
      '<g data-l="1"><rect x="60" y="60" width="280" height="180" stroke-dasharray="6 6" stroke="rgba(255,255,255,.6)"/></g>' +
      '<g data-l="2"><rect x="60" y="60" width="280" height="180"/><rect x="80" y="80" width="240" height="140"/></g>' +
      '<g data-l="3"><line x1="70" y1="60" x2="70" y2="240" stroke="rgba(255,255,255,.5)"/><rect x="170" y="60" width="60" height="20" fill="#122e54"/><line x1="170" y1="70" x2="230" y2="70"/><path d="M80 150 h-20 M80 190 h-20"/><path d="M80 150 a40 40 0 0 1 40 -40" stroke-dasharray="3 3"/><text x="200" y="45" fill="#fff" stroke="none" font-size="12" text-anchor="middle" font-family="Archivo">2.40</text><path d="M60 35 h280 M60 30 v10 M340 30 v10" stroke="rgba(255,255,255,.6)" stroke-width="1"/></g>' +
      '<g data-l="4" stroke="#ffe500"><path d="M100 230 V120 H300" stroke-width="3"/><circle cx="300" cy="120" r="6"/><path d="M200 225 v-80" stroke-dasharray="4 3"/><circle cx="200" cy="140" r="9" stroke="#ff6b6b"/></g>' +
      '<g data-l="5"><path d="M300 200 l12 12 M300 212 l12 -12" /><rect x="292" y="192" width="28" height="28"/><text x="306" y="250" fill="#fff" stroke="none" font-size="11" text-anchor="middle" font-family="Archivo">Det. 04</text></g>' +
      '<g data-l="6" stroke="#ffe500"><path d="M330 268 l8 8 l16 -18" stroke-width="2.5"/><text x="300" y="285" fill="#ffe500" stroke="none" font-size="11" text-anchor="end" font-family="Archivo">verificado en obra</text></g>' +
      "</svg>";
  }
  function initLOD() {
    var box = document.querySelector("[data-lod]");
    if (!box) return;
    var cat = window.PRECIOS.categorias.filter(function (c) { return c.lod; })[0];
    var info = box.querySelector(".lod-info");
    var tabs = box.querySelectorAll("[role=tab]");
    var layers = box.querySelectorAll("[data-l]");
    function show(i) {
      var p = cat.productos[i];
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i ? "true" : "false"); t.tabIndex = k === i ? 0 : -1; });
      layers.forEach(function (g) {
        var l = +g.getAttribute("data-l");
        // LOD 100 = capa 1; desde LOD 200 se oculta la masa
        var on = (i === 0 && l === 1) || (i > 0 && l > 1 && l <= i + 1);
        g.style.opacity = on ? 1 : 0;
        g.style.transition = reduce ? "none" : "opacity .35s";
      });
      // si el nivel tiene imagen propia (precios.js → imagen), se muestra en lugar del dibujo
      var svg = box.querySelector(".lod-dibujo svg");
      box.querySelectorAll(".lod-img").forEach(function (im) { im.classList.toggle("activa", +im.getAttribute("data-i") === i); });
      svg.style.display = p.imagen ? "none" : "";
      info.innerHTML = "<h3>" + esc(p.nombre) + " · " + esc(p.sub) + "</h3>" + precioHTML(p) +
        '<div class="extra">' + esc(p.extra || "") + "</div><ul>" + p.incluye.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<a class="btn btn--ink" style="align-self:flex-start;margin-top:auto" target="_blank" rel="noopener" href="' + waLink("Hola Proyecta+, quiero cotizar modelado BIM en Revit — " + p.nombre + ".") + '">' + (p.precio === null ? "Pedir cotización" : "Pedir este nivel") + "</a>";
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { show(+t.getAttribute("data-i")); });
      t.addEventListener("keydown", function (e) {
        var i = +t.getAttribute("data-i");
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var n = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
          show(n); tabs[n].focus();
        }
      });
    });
    show(2);
  }


  /* ---------- Plano real: selección sincronizada plano ↔ lista ---------- */
  var pr = document.querySelector("[data-plano-real]");
  if (pr) {
    var orden = ["estudio", "construcciones", "tech", "desarrollos"], k = 0, timer = null, manual = false;
    var marcar = function (u) {
      pr.querySelectorAll("[data-u]").forEach(function (el) { el.classList.toggle("on", el.getAttribute("data-u") === u); });
    };
    var auto = function () {
      if (reduce || manual) return;
      clearInterval(timer);
      marcar(orden[k]);
      timer = setInterval(function () { k = (k + 1) % orden.length; marcar(orden[k]); }, 2600);
    };
    pr.querySelectorAll("[data-u]").forEach(function (el) {
      var u = el.getAttribute("data-u");
      el.addEventListener("pointerenter", function () { manual = true; clearInterval(timer); marcar(u); k = orden.indexOf(u); });
      el.addEventListener("focus", function () { manual = true; clearInterval(timer); marcar(u); });
    });
    pr.addEventListener("pointerleave", function () { manual = false; auto(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { if (en[0].isIntersecting) auto(); else clearInterval(timer); }).observe(pr);
    } else auto();
  }


  /* ---------- Galería: ver más + lightbox ---------- */
  var gal = document.getElementById("galeria");
  if (gal) {
    var mas = document.getElementById("ver-mas");
    if (mas) mas.addEventListener("click", function () {
      var abierta = gal.classList.toggle("todas");
      mas.setAttribute("aria-expanded", abierta ? "true" : "false");
      mas.textContent = abierta ? "Ver menos" : "Ver todos los trabajos (" + gal.querySelectorAll("figure").length + ")";
      if (!abierta) gal.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
    var lb = document.getElementById("lightbox");
    if (lb && lb.showModal) {
      var lbImg = lb.querySelector("img"), lbPie = lb.querySelector(".lb-pie"), actual = 0;
      var visibles = function () { return Array.prototype.filter.call(gal.querySelectorAll("[data-lightbox]"), function (a) { return a.offsetParent !== null; }); };
      var abrir = function (i) {
        var items = visibles(); if (!items.length) return;
        actual = (i + items.length) % items.length;
        var a = items[actual], im = a.querySelector("img");
        lbImg.src = a.getAttribute("href"); lbImg.alt = im.alt;
        lbPie.textContent = im.alt + "  ·  " + (actual + 1) + " / " + items.length;
        if (!lb.open) lb.showModal();
      };
      gal.addEventListener("click", function (e) {
        var a = e.target.closest("[data-lightbox]"); if (!a) return;
        e.preventDefault(); abrir(visibles().indexOf(a));
      });
      lb.querySelector(".lb-cerrar").addEventListener("click", function () { lb.close(); });
      lb.querySelector(".lb-prev").addEventListener("click", function () { abrir(actual - 1); });
      lb.querySelector(".lb-next").addEventListener("click", function () { abrir(actual + 1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
      lb.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") abrir(actual + 1);
        if (e.key === "ArrowLeft") abrir(actual - 1);
      });
      var x0 = null;
      lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) abrir(actual + (dx < 0 ? 1 : -1));
      });
    }
  }

  /* ---------------- Contacto ---------------- */
  var form = document.getElementById("form-contacto");
  if (form) {
    var params = new URLSearchParams(location.search);
    if (params.get("unidad")) { var sel = form.querySelector("[name=unidad]"); if (sel) sel.value = params.get("unidad"); }
    function armar() {
      var d = new FormData(form);
      var nombre = (d.get("nombre") || "").trim(), msg = (d.get("mensaje") || "").trim();
      var err = form.querySelector(".error");
      if (!nombre || !msg) { err.textContent = "Completá tu nombre y contanos qué necesitás."; return null; }
      err.textContent = "";
      return "Hola Proyecta+, soy " + nombre + (d.get("ciudad") ? " (" + d.get("ciudad") + ")" : "") +
        ".\nÁrea: " + d.get("unidad") + "\n\n" + msg;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = armar(); if (!t) return;
      window.open(waLink(t), "_blank", "noopener");
    });
    var mailBtn = document.getElementById("enviar-mail");
    if (mailBtn) mailBtn.addEventListener("click", function () {
      var t = armar(); if (!t) return;
      var d = new FormData(form);
      location.href = "mailto:" + (window.PRECIOS ? window.PRECIOS.email : "hola@proyectamas.com.ar") +
        "?subject=" + encodeURIComponent("Consulta " + d.get("unidad") + " — " + d.get("nombre")) + "&body=" + encodeURIComponent(t);
    });
  }
})();
