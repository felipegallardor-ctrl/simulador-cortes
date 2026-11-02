(function () {
  "use strict";
  var CORTES = window.CORTES, FUENTES = window.FUENTES;
  var $ = function (id) { return document.getElementById(id); };
  var porId = function (id) { return CORTES.find(function (c) { return c.id === id; }); };

  /* ---------- Utilidades ---------- */
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function num(n) { return String(Math.round(n * 10) / 10).replace(".", ","); }
  function rango(d) { return d.min === d.max ? num(d.ref) + " mm" : num(d.min) + " a " + num(d.max) + " mm"; }
  function resumen(c) {
    return c.dims.map(function (d) { return d.n + ": " + rango(d); }).join(" · ");
  }
  function margen(d) { return Math.max(0.5, Math.round(d.ref * 0.1 * 10) / 10); }
  function leerNumero(texto) {
    var t = String(texto).trim().replace(",", ".");
    if (t === "") return { error: "Escribe una medida." };
    if (!/^\d+(\.\d+)?$/.test(t)) return { error: "Usa solo números, por ejemplo 3 o 3,5." };
    var v = parseFloat(t);
    if (v <= 0) return { error: "La medida debe ser mayor que 0." };
    if (v > 200) return { error: "La medida máxima es 200 mm." };
    return { valor: v };
  }
  /* Generador con semilla: permite repetir una misma secuencia en las pruebas (?semilla=1). */
  var semilla = parseInt(new URLSearchParams(location.search).get("semilla"), 10);
  var azar = isNaN(semilla) ? Math.random : function () {
    semilla = (semilla + 0x6D2B79F5) | 0;
    var t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  function mezclar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(azar() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- Dibujos ---------- */
  var C30 = Math.cos(Math.PI / 6), S30 = 0.5;
  var COLORES = { sup: "#f6a25e", izq: "#d9742c", der: "#ea8a3f", borde: "#8a4310" };
  function iso(x, y, z) { return [(x - y) * C30, (x + y) * S30 - z]; }
  function puntos(lista, f) {
    return lista.map(function (p) { return ((p[0] * f.e + f.dx).toFixed(1)) + "," + ((p[1] * f.e + f.dy).toFixed(1)); }).join(" ");
  }
  function ajuste(pts, ancho, alto, pad) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var e = Math.min((ancho - pad * 2) / (x1 - x0 || 1), (alto - pad * 2) / (y1 - y0 || 1));
    return { e: e, dx: (ancho - (x1 - x0) * e) / 2 - x0 * e, dy: (alto - (y1 - y0) * e) / 2 - y0 * e };
  }
  function etiqueta(x, y, texto, ancla) {
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + (ancla || "middle") +
      '" font-size="15" font-weight="700" fill="#17302f" stroke="#fff" stroke-width="4" paint-order="stroke">' + esc(texto) + "</text>";
  }
  function svg(descripcion, interior) {
    return '<svg viewBox="0 0 420 280" role="img" aria-label="' + esc(descripcion) + '">' + interior + "</svg>";
  }
  function dibujarCaja(L, A, H, etiquetas) {
    var W = 420, Y = 280;
    var V = [iso(0, 0, 0), iso(L, 0, 0), iso(L, A, 0), iso(0, A, 0), iso(0, 0, H), iso(L, 0, H), iso(L, A, H), iso(0, A, H)];
    var f = ajuste(V, W, Y, 62);
    var p = function (q) { return [q[0] * f.e + f.dx, q[1] * f.e + f.dy]; };
    var cara = function (idx, color) {
      return '<polygon points="' + puntos(idx.map(function (i) { return V[i]; }), f) + '" fill="' + color + '" stroke="' + COLORES.borde + '" stroke-width="1.5" stroke-linejoin="round"/>';
    };
    var s = cara([4, 5, 6, 7], COLORES.sup) + cara([3, 2, 6, 7], COLORES.izq) + cara([1, 2, 6, 5], COLORES.der);
    if (etiquetas) {
      var a = p(V[3]), b = p(V[2]), c = p(V[1]), d = p(V[5]);
      s += etiqueta((a[0] + b[0]) / 2 - 8, (a[1] + b[1]) / 2 + 24, etiquetas[0], "end");
      s += etiqueta((b[0] + c[0]) / 2 + 8, (b[1] + c[1]) / 2 + 24, etiquetas[1], "start");
      s += etiqueta(c[0] + 10, (c[1] + d[1]) / 2 + 5, etiquetas[2], "start");
    }
    return s;
  }
  function dibujarRodaja(esp, etq) {
    var cx = 210, cy = 130, rx = 110, ry = 58, g = Math.max(10, esp * 5);
    return '<path d="M' + (cx - rx) + " " + cy + " v" + g + " a" + rx + " " + ry + " 0 0 0 " + rx * 2 + " 0 v" + (-g) + '" fill="' + COLORES.izq + '" stroke="' + COLORES.borde + '" stroke-width="1.5"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + COLORES.sup + '" stroke="' + COLORES.borde + '" stroke-width="1.5"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="40" ry="21" fill="#f9b67c"/>' +
      (etq ? etiqueta(cx, cy + ry + g + 28, etq) : "");
  }
  function dibujarCinta(ancho, etq) {
    var g = Math.max(10, Math.min(44, ancho * 4)), d = "";
    for (var i = 0; i < 3; i++) {
      var y = 70 + i * 62;
      d += '<path d="M42 ' + y + " C120 " + (y - 36) + " 170 " + (y + 36) + " 240 " + y + " S340 " + (y - 30) + " 382 " + y + '" fill="none" stroke="#2f7d4f" stroke-width="' + g + '" stroke-linecap="round"/>';
    }
    return d + (etq ? etiqueta(210, 262, etq) : "");
  }
  function dibujarTorneado(etqL, etqD) {
    var caras = "";
    [-34, -13, 13, 34].forEach(function (b) {
      caras += '<path d="M70 140 Q210 ' + (140 + b * 2.4) + ' 350 140" fill="none" stroke="' + COLORES.borde + '" stroke-width="1.2"/>';
    });
    return '<path d="M70 140 Q210 20 350 140 Q210 260 70 140 Z" fill="' + COLORES.der + '" stroke="' + COLORES.borde + '" stroke-width="1.5"/>' + caras +
      (etqL ? etiqueta(210, 268, etqL) : "") + (etqD ? etiqueta(210, 30, etqD) : "");
  }
  /* valores: medidas a dibujar en mm; mostrar: si se escriben las medidas sobre el dibujo. */
  function dibujo(c, valores, mostrar) {
    var v = valores || c.dims.map(function (d) { return d.ref; });
    var e = function (i) { return mostrar ? c.dims[i].n + " " + num(v[i]) + " mm" : null; };
    var desc = "Dibujo proporcional: " + c.dims.map(function (d, i) { return d.n + " " + num(v[i]) + " milímetros"; }).join(", ");
    if (c.forma === "caja") return svg(desc, dibujarCaja(v[0], v[1], v[2], mostrar ? [num(v[0]) + " mm", num(v[1]) + " mm", num(v[2]) + " mm"] : null));
    if (c.forma === "rodaja") return svg(desc, dibujarRodaja(v[0], e(0)));
    if (c.forma === "cinta") return svg(desc, dibujarCinta(v[0], e(0)));
    return svg(desc, dibujarTorneado(e(0), e(1)));
  }

  /* ---------- Pestañas ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function activar(tab, foco) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (foco) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { activar(t); });
    t.addEventListener("keydown", function (ev) {
      var n = { ArrowRight: 1, ArrowLeft: -1 }[ev.key];
      if (n) { ev.preventDefault(); activar(tabs[(i + n + tabs.length) % tabs.length], true); }
      if (ev.key === "Home") { ev.preventDefault(); activar(tabs[0], true); }
      if (ev.key === "End") { ev.preventDefault(); activar(tabs[tabs.length - 1], true); }
    });
  });

  /* ---------- Explorar ---------- */
  function listaExplorar() {
    var html = "", familia = "";
    CORTES.forEach(function (c) {
      if (c.familia !== familia) { familia = c.familia; html += '<p class="grupo-titulo">' + esc(familia) + "</p>"; }
      html += '<button type="button" class="corte-boton" data-id="' + c.id + '" aria-pressed="false">' + esc(c.nombre) + "<small>" + esc(c.alias) + "</small></button>";
    });
    $("lista-cortes").innerHTML = html;
    $("lista-cortes").addEventListener("click", function (ev) {
      var b = ev.target.closest(".corte-boton");
      if (b) mostrarCorte(b.dataset.id);
    });
  }
  function mostrarCorte(id) {
    var c = porId(id);
    document.querySelectorAll(".corte-boton").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.id === id); });
    var filas = c.dims.map(function (d) { return "<tr><th scope=\"row\">" + esc(d.n) + "</th><td>" + rango(d) + "</td></tr>"; }).join("");
    var fuentes = c.fuentes.map(function (f) {
      return '<li><a href="' + esc(FUENTES[f].url) + '" target="_blank" rel="noopener">' + esc(FUENTES[f].nombre) + "</a></li>";
    }).join("");
    $("detalle-corte").innerHTML = "<h3>" + esc(c.nombre) + '</h3><p class="alias">' + esc(c.alias) + "</p>" +
      '<div class="detalle-grid"><div><div class="dibujo">' + dibujo(c, null, true) + '</div><p class="leyenda">' +
      (c.forma === "caja" ? "Dibujo proporcional, no en tamaño real." : "Dibujo ilustrativo, no a escala.") + "</p></div><div>" +
      '<table class="medidas"><caption class="leyenda" style="text-align:left">Medidas de referencia</caption><tbody>' + filas +
      '<tr><th scope="row">En pulgadas</th><td>' + esc(c.pulgadas) + "</td></tr></tbody></table>" +
      "<h4>Clave para reconocerlo</h4><p>" + esc(c.clave) + "</p>" +
      "<h4>Cómo se obtiene</h4><p>" + esc(c.origen) + "</p></div></div>" +
      "<h4>Diferencias entre fuentes</h4><p>" + esc(c.diferencias) + "</p>" +
      '<h4>Fuentes</h4><ul class="fuentes-corte">' + fuentes + "</ul>";
  }

  /* ---------- Reconocer ---------- */
  var TOTAL = 8, quiz;
  function distractores(c) {
    var misma = mezclar(CORTES.filter(function (o) { return o !== c && o.familia === c.familia; }));
    var otras = mezclar(CORTES.filter(function (o) { return o !== c && o.familia !== c.familia; }));
    return misma.concat(otras).slice(0, 3);
  }
  function iniciarQuiz() {
    quiz = {
      preguntas: mezclar(CORTES).slice(0, TOTAL).map(function (c, i) {
        return { corte: c, tipo: i % 2 ? "medidas" : "nombre", opciones: mezclar([c].concat(distractores(c))) };
      }),
      i: 0, puntos: 0, repasar: []
    };
    pregunta();
  }
  function pregunta() {
    var q = quiz.preguntas[quiz.i], c = q.corte;
    var enunciado = q.tipo === "nombre"
      ? "¿Qué corte es esta pieza?"
      : "¿Cuáles son las medidas de referencia de «" + c.nombre + "»?";
    var apoyo = q.tipo === "nombre" ? '<div class="dibujo">' + dibujo(c, null, true) + "</div>" : "";
    var botones = q.opciones.map(function (o) {
      return '<button type="button" class="opcion" data-id="' + o.id + '">' + esc(q.tipo === "nombre" ? o.nombre : resumen(o)) + "</button>";
    }).join("");
    $("quiz").innerHTML = '<p class="progreso">Pregunta ' + (quiz.i + 1) + " de " + TOTAL + " · Puntaje: " + quiz.puntos + "</p>" +
      '<p class="pregunta">' + esc(enunciado) + "</p>" + apoyo + '<div class="opciones">' + botones + '</div><div id="quiz-retro" aria-live="polite"></div>';
  }
  function responder(id) {
    var q = quiz.preguntas[quiz.i], c = q.corte, elegido = porId(id), bien = id === c.id;
    if (bien) quiz.puntos++; else quiz.repasar.push(c);
    document.querySelectorAll(".opcion").forEach(function (b) {
      b.disabled = true;
      if (b.dataset.id === c.id) b.classList.add("correcta");
      else if (b.dataset.id === id) b.classList.add("incorrecta");
    });
    var ultimo = quiz.i === TOTAL - 1;
    var texto = bien
      ? "<strong>¡Correcto!</strong>" + esc(c.clave) + " Se obtiene así: " + esc(c.origen.charAt(0).toLowerCase() + c.origen.slice(1))
      : "<strong>Todavía no: es " + esc(c.nombre) + ".</strong>" + esc(c.clave) + " Elegiste " + esc(elegido.nombre) + " (" + esc(resumen(elegido)) + ").";
    $("quiz-retro").innerHTML = '<div class="retro ' + (bien ? "bien" : "mal") + '">' + texto +
      '<br><button type="button" class="boton principal" id="quiz-siguiente">' + (ultimo ? "Ver resultado" : "Siguiente pregunta") + "</button></div>";
    $("quiz-siguiente").focus();
  }
  function resultadoQuiz() {
    var repaso = quiz.repasar.length
      ? "<p><strong>Repasa estos cortes:</strong></p><ul>" + quiz.repasar.map(function (c) { return "<li>" + esc(c.nombre) + ": " + esc(c.clave) + "</li>"; }).join("") + "</ul>"
      : "<p>Respondiste todo correctamente. Prueba ahora la sección Medir para escribir las medidas de memoria.</p>";
    $("quiz").innerHTML = '<p class="puntaje" id="quiz-puntaje" tabindex="-1">' + quiz.puntos + " de " + TOTAL + "</p>" + repaso +
      '<div class="acciones" style="margin-top:14px"><button type="button" class="boton principal" id="quiz-reiniciar">Jugar otra vez</button></div>';
    $("quiz-puntaje").focus();
  }
  $("quiz").addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;
    if (b.classList.contains("opcion")) responder(b.dataset.id);
    else if (b.id === "quiz-siguiente") {
      quiz.i++;
      if (quiz.i < TOTAL) { pregunta(); document.querySelector(".opcion").focus(); } else resultadoQuiz();
    } else if (b.id === "quiz-reiniciar") { iniciarQuiz(); document.querySelector(".opcion").focus(); }
  });

  /* ---------- Medir ---------- */
  function opcionesCorte(select, filtro) {
    select.innerHTML = CORTES.filter(filtro || function () { return true; }).map(function (c) {
      return '<option value="' + c.id + '">' + esc(c.nombre) + "</option>";
    }).join("");
  }
  function corteMedir() { return porId($("medir-corte").value); }
  function camposMedir() {
    var c = corteMedir();
    $("medir-campos").innerHTML = c.dims.map(function (d, i) {
      return '<label class="campo" for="m' + i + '">' + esc(d.n) + " (mm)" +
        '<input type="text" inputmode="decimal" autocomplete="off" id="m' + i + '" aria-describedby="m' + i + '-e"><span class="error" id="m' + i + '-e" hidden></span></label>';
    }).join("");
    $("medir-pista-texto").hidden = true;
    $("medir-resultado").innerHTML = "";
    $("medir-dibujo").innerHTML = '<p class="leyenda">El dibujo aparecerá cuando escribas todas las medidas.</p>';
  }
  function leerCampos(marcar) {
    var c = corteMedir(), valores = [], valido = true;
    c.dims.forEach(function (d, i) {
      var inp = $("m" + i), err = $("m" + i + "-e"), r = leerNumero(inp.value);
      if (r.error) {
        valido = false;
        if (marcar) { err.textContent = r.error; err.hidden = false; inp.setAttribute("aria-invalid", "true"); }
      } else {
        valores.push(r.valor);
        err.hidden = true; inp.removeAttribute("aria-invalid");
      }
    });
    return valido ? valores : null;
  }
  function dibujarMedir() {
    var v = leerCampos(false);
    if (v) $("medir-dibujo").innerHTML = dibujo(corteMedir(), v, true);
  }
  /* Compara de menor a mayor: así no importa en qué casilla se escribió cada medida de una caja. */
  function orden(a, b) { return a - b; }
  function compararMedidas(c, valores) {
    var indices = c.dims.map(function (d, i) { return i; }).sort(function (a, b) { return c.dims[a].ref - c.dims[b].ref; });
    var v = c.forma === "caja" ? valores.slice().sort(orden) : indices.map(function (i) { return valores[i]; });
    return indices.map(function (i, k) {
      var d = c.dims[i], m = margen(d), valor = v[k], est;
      if (valor >= d.min && valor <= d.max) est = "exacto";
      else if (valor >= d.min - m && valor <= d.max + m) est = "margen";
      else est = valor < d.min ? "bajo" : "alto";
      return { d: d, valor: valor, estado: est };
    });
  }
  function otroCorte(c, valores) {
    return CORTES.find(function (o) {
      if (o === c || o.forma !== c.forma || o.dims.length !== valores.length) return false;
      return compararMedidas(o, valores).every(function (r) { return r.estado === "exacto"; });
    });
  }
  function evaluarMedir(ev) {
    ev.preventDefault();
    var c = corteMedir(), valores = leerCampos(true);
    if (!valores) {
      $("medir-resultado").innerHTML = "";
      var primero = document.querySelector('#medir-campos [aria-invalid="true"]');
      if (primero) primero.focus();
      return;
    }
    $("medir-dibujo").innerHTML = dibujo(c, valores, true);
    var res = compararMedidas(c, valores);
    var todas = res.every(function (r) { return r.estado !== "bajo" && r.estado !== "alto"; });
    var exactas = res.every(function (r) { return r.estado === "exacto"; });
    var lista = res.map(function (r) {
      var t = esc(r.d.n) + ": escribiste " + num(r.valor) + " mm; referencia " + rango(r.d) + ". ";
      if (r.estado === "exacto") t += "Correcto.";
      if (r.estado === "margen") t += "Dentro del margen del simulador.";
      if (r.estado === "bajo") t += "Falta " + num(r.d.min - r.valor) + " mm.";
      if (r.estado === "alto") t += "Sobra " + num(r.valor - r.d.max) + " mm.";
      return "<li>" + t + "</li>";
    }).join("");
    var otro = !todas && otroCorte(c, valores);
    var extra = otro ? "<p style=\"margin-top:8px\">Tus medidas corresponden a <strong style=\"display:inline\">" + esc(otro.nombre) + "</strong>, no a " + esc(c.nombre) + ".</p>" : "";
    var clase = exactas ? "bien" : todas ? "cerca" : "mal";
    var titulo = exactas ? "¡Medidas correctas!" : todas ? "Aceptado, pero puedes ajustar más." : "Revisa estas medidas.";
    $("medir-resultado").innerHTML = '<div class="retro ' + clase + '"><strong>' + titulo + "</strong><ul>" + lista + "</ul>" + extra +
      '<p style="margin-top:8px">' + esc(c.clave) + "</p></div>";
  }

  /* ---------- Cortar ---------- */
  var CORTES_TOTAL = 5, tabla = { cortes: [] };
  function corteCortar() { return porId($("cortar-corte").value); }
  function medidaCortar(c) {
    return c.dims.reduce(function (m, d) { return d.ref < m.ref ? d : m; });
  }
  function nombreMedida(c, d) {
    var cubo = c.dims.length === 3 && c.dims.every(function (o) { return o.ref === d.ref; });
    return cubo ? "lado" : c.forma === "caja" && d.n !== "Espesor" ? "grosor" : d.n.toLowerCase();
  }
  function iniciarCortar() {
    var c = corteCortar(), d = medidaCortar(c);
    tabla = { cortes: [], largo: Math.round(d.ref * 7) };
    $("cortar-meta").textContent = "Meta: 5 piezas de " + rango(d) + " (" + nombreMedida(c, d) + " de «" + c.nombre + "»).";
    var r = $("cortar-posicion");
    r.max = tabla.largo; r.value = 0;
    $("cortar-resultado").innerHTML = "";
    $("cortar-aviso").hidden = true;
    pintarTabla();
  }
  function pintarTabla() {
    var W = 720, H = 170, ini = 20, ancho = W - ini * 2, y = 30, alto = 76;
    var L = tabla.largo, px = function (mm) { return ini + mm / L * ancho; };
    var pos = parseFloat($("cortar-posicion").value);
    var paso = L <= 20 ? 1 : L <= 50 ? 5 : 10;
    var s = '<rect x="' + ini + '" y="' + y + '" width="' + ancho + '" height="' + alto + '" rx="4" fill="' + COLORES.der + '" stroke="' + COLORES.borde + '" stroke-width="1.5"/>';
    tabla.cortes.forEach(function (c) {
      s += '<line x1="' + px(c) + '" y1="' + y + '" x2="' + px(c) + '" y2="' + (y + alto) + '" stroke="#fff" stroke-width="2.5"/>';
    });
    s += '<line x1="' + ini + '" y1="' + (y + alto + 12) + '" x2="' + (ini + ancho) + '" y2="' + (y + alto + 12) + '" stroke="#17302f"/>';
    for (var m = 0; m <= L; m += paso) {
      s += '<line x1="' + px(m) + '" y1="' + (y + alto + 12) + '" x2="' + px(m) + '" y2="' + (y + alto + 20) + '" stroke="#17302f"/>' +
        '<text x="' + px(m) + '" y="' + (y + alto + 36) + '" text-anchor="middle" font-size="14" fill="#17302f">' + m + "</text>";
    }
    s += '<polygon points="' + (px(pos) - 8) + ",4 " + (px(pos) + 8) + ",4 " + px(pos) + "," + (y - 2) + '" fill="#0a3439"/>' +
      '<line x1="' + px(pos) + '" y1="' + (y - 2) + '" x2="' + px(pos) + '" y2="' + (y + alto) + '" stroke="#0a3439" stroke-width="2" stroke-dasharray="5 4"/>';
    $("cortar-tabla").innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Producto sobre una regla. Largo ' + L + " milímetros, " + tabla.cortes.length + ' cortes realizados, cuchillo en ' + num(pos) + ' milímetros.">' + s + "</svg>";
    $("cortar-valor").textContent = num(pos) + " mm";
    var listo = tabla.cortes.length >= CORTES_TOTAL;
    $("cortar-accion").disabled = listo;
    $("cortar-deshacer").disabled = tabla.cortes.length === 0;
    $("cortar-accion").textContent = listo ? "Cortes completos" : "Cortar aquí (" + (tabla.cortes.length + 1) + " de " + CORTES_TOTAL + ")";
  }
  function hacerCorte() {
    var pos = parseFloat($("cortar-posicion").value);
    var previo = tabla.cortes.length ? tabla.cortes[tabla.cortes.length - 1] : 0;
    var aviso = $("cortar-aviso");
    if (pos <= previo) {
      aviso.textContent = "Mueve el cuchillo más allá de " + num(previo) + " mm para separar una pieza.";
      aviso.hidden = false;
      return;
    }
    aviso.hidden = true;
    tabla.cortes.push(pos);
    pintarTabla();
    if (tabla.cortes.length === CORTES_TOTAL) evaluarCortar();
  }
  function evaluarCortar() {
    var c = corteCortar(), d = medidaCortar(c), m = margen(d), previo = 0;
    var piezas = tabla.cortes.map(function (p) { var e = p - previo; previo = p; return e; });
    var dentro = piezas.filter(function (e) { return e >= d.min - m && e <= d.max + m; }).length;
    var mayor = Math.max.apply(null, piezas), menor = Math.min.apply(null, piezas);
    var difer = mayor - menor, promedio = piezas.reduce(function (a, b) { return a + b; }, 0) / piezas.length;
    var parejo = difer <= m * 2;
    var clase = dentro === piezas.length && parejo ? "bien" : dentro >= 3 ? "cerca" : "mal";
    var titulo = clase === "bien" ? "¡Buen trabajo: piezas parejas y en medida!" :
      clase === "cerca" ? "Vas bien: ajusta las piezas que se alejaron." : "Sigue practicando: las piezas se alejan de la meta.";
    var consejo = !parejo
      ? "La regularidad es lo primero por mejorar: entre tu pieza más grande y la más chica hay " + num(difer) + " mm. Las piezas pequeñas pueden cocerse antes que las grandes."
      : promedio < d.min - m ? "Tus piezas son parejas, pero más delgadas que la meta. Avanza un poco más entre cortes."
      : promedio > d.max + m ? "Tus piezas son parejas, pero más gruesas que la meta. Avanza un poco menos entre cortes."
      : "Mantuviste una distancia regular entre cortes.";
    $("cortar-resultado").innerHTML = '<div class="retro ' + clase + '"><strong>' + titulo + "</strong>" +
      "<p>Piezas: " + piezas.map(num).join(" · ") + " mm. Dentro de la medida: " + dentro + " de " + piezas.length + ". Promedio: " + num(promedio) + " mm.</p>" +
      '<p style="margin-top:6px">' + consejo + "</p></div>";
  }

  /* ---------- Inicio ---------- */
  listaExplorar();
  mostrarCorte("brunoise");
  iniciarQuiz();
  opcionesCorte($("medir-corte"));
  opcionesCorte($("cortar-corte"), function (c) { return !c.sinCortar; });
  camposMedir();
  iniciarCortar();
  $("lista-fuentes").innerHTML = Object.keys(FUENTES).map(function (k) {
    return '<li><a href="' + esc(FUENTES[k].url) + '" target="_blank" rel="noopener">' + esc(FUENTES[k].nombre) + "</a></li>";
  }).join("");

  $("medir-corte").addEventListener("change", camposMedir);
  $("medir-campos").addEventListener("input", dibujarMedir);
  $("form-medir").addEventListener("submit", evaluarMedir);
  $("medir-pista").addEventListener("click", function () {
    var c = corteMedir(), p = $("medir-pista-texto");
    p.textContent = "Pista: " + c.clave;
    p.hidden = false;
  });
  $("cortar-corte").addEventListener("change", iniciarCortar);
  $("cortar-posicion").addEventListener("input", pintarTabla);
  $("cortar-accion").addEventListener("click", hacerCorte);
  $("cortar-deshacer").addEventListener("click", function () {
    tabla.cortes.pop();
    $("cortar-resultado").innerHTML = "";
    $("cortar-aviso").hidden = true;
    pintarTabla();
  });
  $("cortar-reiniciar").addEventListener("click", iniciarCortar);
  $("cortar-tabla").addEventListener("click", function (ev) {
    var svgEl = ev.currentTarget.querySelector("svg"), r = svgEl.getBoundingClientRect();
    var x = (ev.clientX - r.left) / r.width * 720;
    var mm = Math.round(Math.max(0, Math.min(1, (x - 20) / 680)) * tabla.largo * 2) / 2;
    $("cortar-posicion").value = mm;
    pintarTabla();
  });
})();
