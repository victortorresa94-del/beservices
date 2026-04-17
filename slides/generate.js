const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// beServices brand
const NAVY = '#001A41';
const CYAN = '#00D4FF';
const WHITE = '#FFFFFF';
const GRAY_BG = '#F4F6F9';

// Inline beServices logo as SVG
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 40" width="140" height="32">
  <rect x="0" y="2" width="28" height="9" rx="2" fill="#1565C0"/>
  <rect x="0" y="14" width="20" height="9" rx="2" fill="#1565C0"/>
  <rect x="0" y="26" width="24" height="9" rx="2" fill="#1565C0"/>
  <text x="38" y="31" font-family="Montserrat, Helvetica Neue, Helvetica, sans-serif" font-weight="800" font-size="24" fill="${NAVY}" letter-spacing="-0.5">beservices</text>
</svg>`;

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800;900&family=Inter:wght@300;400;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px; height: 1080px;
    background: ${WHITE};
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, sans-serif;
    overflow: hidden; position: relative;
  }
  .zona-texto {
    position: absolute; top: 0; left: 0;
    width: 500px; height: 100%;
    padding: 90px 72px;
    display: flex; flex-direction: column;
    justify-content: center; gap: 20px;
    overflow: hidden;
  }
  .etiqueta {
    font-family: 'Inter', sans-serif;
    font-weight: 600; font-size: 12px;
    letter-spacing: 3.5px; text-transform: uppercase;
    color: ${CYAN};
  }
  .titular {
    font-weight: 900; font-size: 44px;
    line-height: 1.08; color: ${NAVY};
    letter-spacing: -1.5px;
  }
  .titular.lg { font-size: 52px; }
  .titular.sm { font-size: 36px; }
  .dato {
    font-weight: 900; font-size: 110px;
    line-height: 0.9; color: ${CYAN};
    letter-spacing: -4px;
  }
  .subtitulo {
    font-family: 'Inter', sans-serif;
    font-weight: 400; font-size: 17px;
    line-height: 1.55; color: rgba(0,26,65,0.62);
    max-width: 360px;
  }
  .subtitulo b { font-weight: 600; color: ${NAVY}; }
  .bullets { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
  .bullet {
    display: flex; align-items: flex-start; gap: 12px;
    font-family: 'Inter', sans-serif; font-weight: 400;
    font-size: 15.5px; line-height: 1.45; color: rgba(0,26,65,0.72);
    max-width: 340px;
  }
  .bullet-arrow { color: ${CYAN}; font-weight: 700; font-size: 17px; flex-shrink: 0; margin-top: 1px; }
  .step-num {
    font-weight: 900; font-size: 38px;
    color: ${CYAN}; line-height: 1; min-width: 44px;
  }
  .step-text {
    font-family: 'Inter', sans-serif;
    font-size: 15.5px; line-height: 1.45;
    color: rgba(0,26,65,0.75);
  }
  .step-item { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
  .frase-final {
    font-family: 'Inter', sans-serif;
    font-weight: 600; font-size: 15px;
    color: ${NAVY}; font-style: italic;
    border-left: 3px solid ${CYAN};
    padding-left: 14px; margin-top: 4px;
  }
  /* glassmorphism 3D object */
  .objeto {
    position: absolute;
    top: 50%; left: 70%;
    transform: translate(-50%, -50%);
  }
  .cubo {
    width: 340px; height: 340px;
    background: linear-gradient(145deg,
      rgba(255,255,255,0.92) 0%,
      rgba(210,230,248,0.65) 45%,
      rgba(0,26,65,0.18) 100%
    );
    border-radius: 32px;
    backdrop-filter: blur(24px);
    border: 1.5px solid rgba(255,255,255,0.85);
    box-shadow:
      0 40px 100px rgba(0,26,65,0.16),
      0 10px 40px rgba(0,212,255,0.12),
      inset 0 1.5px 0 rgba(255,255,255,0.95),
      inset 0 -1px 0 rgba(0,212,255,0.25);
    position: relative; display: flex;
    align-items: center; justify-content: center;
  }
  .cubo::before {
    content: ''; position: absolute;
    top: 18%; left: 18%; width: 64%; height: 64%;
    background: radial-gradient(ellipse,
      rgba(0,212,255,0.28) 0%,
      rgba(0,26,65,0.12) 55%,
      transparent 100%
    );
    border-radius: 50%;
  }
  .cubo-grieta {
    position: absolute;
    top: 22%; left: 52%;
    width: 2px; height: 45%;
    background: linear-gradient(180deg, transparent, rgba(0,212,255,0.7), rgba(0,212,255,0.9), transparent);
    transform: rotate(12deg);
    filter: blur(1px);
  }
  .escudo {
    width: 280px; height: 320px;
    background: linear-gradient(145deg,
      rgba(255,255,255,0.92) 0%,
      rgba(210,230,248,0.65) 45%,
      rgba(0,26,65,0.18) 100%
    );
    clip-path: polygon(50% 0%, 100% 20%, 100% 60%, 50% 100%, 0% 60%, 0% 20%);
    position: relative; display: flex;
    align-items: center; justify-content: center;
    backdrop-filter: blur(20px);
    filter: drop-shadow(0 30px 60px rgba(0,26,65,0.2)) drop-shadow(0 8px 30px rgba(0,212,255,0.15));
  }
  .icono {
    font-size: 110px;
    filter: drop-shadow(0 4px 24px rgba(0,212,255,0.45));
    position: relative; z-index: 2;
  }
  /* slide number */
  .slide-num {
    position: absolute; bottom: 54px; right: 68px;
    font-family: 'Inter', sans-serif;
    font-weight: 600; font-size: 14px;
    color: rgba(0,26,65,0.28); letter-spacing: 1px;
  }
  /* logo bottom left */
  .logo {
    position: absolute;
    bottom: 46px; left: 68px;
  }
  .logo-slogan {
    font-family: 'Inter', sans-serif;
    font-weight: 300; font-size: 11px;
    color: rgba(0,26,65,0.35); letter-spacing: 0.5px;
    margin-top: 2px;
  }
  /* cyan bottom line */
  .linea {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${CYAN} 0%, rgba(0,212,255,0.25) 60%, transparent 100%);
  }
  /* CTA highlight */
  .cta-word {
    display: inline-block;
    background: ${NAVY};
    color: ${WHITE};
    padding: 2px 10px;
    border-radius: 4px;
    font-weight: 800;
  }
  .hashtags {
    font-family: 'Inter', sans-serif;
    font-size: 13px; color: rgba(0,26,65,0.4);
    margin-top: 8px; letter-spacing: 0.3px;
  }
  /* divider */
  .divider {
    width: 48px; height: 3px;
    background: ${CYAN};
    border-radius: 2px;
  }
`;

const LOGO_BLOCK = `
  <div class="logo">
    ${LOGO_SVG}
    <div class="logo-slogan">BeReady for the future, today.</div>
  </div>
`;

const slides = [
  // SLIDE 1 — COVER
  {
    name: 'slide_01',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>${BASE_CSS}</style></head><body>
      <div class="zona-texto" style="justify-content:flex-start; padding-top:200px;">
        <span class="etiqueta">Seguridad · Microsoft 365</span>
        <div class="divider"></div>
        <h1 class="titular" style="font-size:56px; max-width:380px;">Copilot leía lo que no debía.</h1>
        <p class="subtitulo">Una vulnerabilidad en Microsoft 365 Copilot dejó expuesta información confidencial de empresas. Parcheado el 14 de abril. <b>¿Estáis actualizados?</b></p>
      </div>
      <div class="objeto" style="top:48%; left:68%;">
        <div class="cubo">
          <div class="cubo-grieta"></div>
          <div class="icono">🔒</div>
        </div>
      </div>
      ${LOGO_BLOCK}
      <div class="slide-num">1 / 6</div>
      <div class="linea"></div>
    </body></html>`
  },
  // SLIDE 2 — QUÉ PASÓ
  {
    name: 'slide_02',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>${BASE_CSS}</style></head><body>
      <div class="zona-texto">
        <span class="etiqueta">CVE-2026-24307</span>
        <div class="divider"></div>
        <h1 class="titular sm">¿Qué pasó exactamente?</h1>
        <div class="bullets">
          <div class="bullet"><span class="bullet-arrow">→</span><span>Copilot accedía a información sensible sin autorización</span></div>
          <div class="bullet"><span class="bullet-arrow">→</span><span>No heredaba las etiquetas de confidencialidad de Purview</span></div>
          <div class="bullet"><span class="bullet-arrow">→</span><span>Su caché interna almacenaba documentos sin restricciones</span></div>
          <div class="bullet"><span class="bullet-arrow">→</span><span>Secretos comerciales y datos de clientes, expuestos en texto plano</span></div>
        </div>
        <p class="frase-final">Parcheado el 14 de abril — pero solo si lo has aplicado.</p>
      </div>
      <div class="objeto">
        <div class="cubo">
          <div class="cubo-grieta"></div>
          <div class="icono">⚠️</div>
        </div>
      </div>
      ${LOGO_BLOCK}
      <div class="slide-num">2 / 6</div>
      <div class="linea"></div>
    </body></html>`
  },
  // SLIDE 3 — SEÑALES DE RIESGO
  {
    name: 'slide_03',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>${BASE_CSS}</style></head><body>
      <div class="zona-texto">
        <span class="etiqueta">Autodiagnóstico</span>
        <div class="divider"></div>
        <h1 class="titular sm">¿Reconoces alguna de estas situaciones?</h1>
        <div class="bullets">
          <div class="bullet"><span class="bullet-arrow">→</span><span>Activasteis Copilot sin revisar permisos de SharePoint y OneDrive</span></div>
          <div class="bullet"><span class="bullet-arrow">→</span><span>No tenéis etiquetas de sensibilidad configuradas en Purview</span></div>
          <div class="bullet"><span class="bullet-arrow">→</span><span>Nadie sabe exactamente qué documentos puede ver Copilot</span></div>
        </div>
        <p class="frase-final">Si has dicho sí a una sola... sigue leyendo.</p>
      </div>
      <div class="objeto">
        <div class="cubo">
          <div class="icono">🔍</div>
        </div>
      </div>
      ${LOGO_BLOCK}
      <div class="slide-num">3 / 6</div>
      <div class="linea"></div>
    </body></html>`
  },
  // SLIDE 4 — DATO IMPACTO
  {
    name: 'slide_04',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>${BASE_CSS}
    .zona-texto-center {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column;
      justify-content: center; align-items: flex-start;
      padding: 0 110px;
      gap: 20px;
    }
    </style></head><body>
      <div class="zona-texto-center">
        <span class="etiqueta">El dato que no quieres oír</span>
        <div class="dato">+50%</div>
        <p class="subtitulo" style="max-width:520px; font-size:19px;">
          Así crecieron los incidentes de seguridad relacionados con IA en empresas en 2026 frente a 2025.
        </p>
        <p class="subtitulo" style="max-width:520px; font-size:18px; font-weight:600; color:${NAVY};">
          No porque la IA sea mala.<br>Porque nadie configuró los permisos.
        </p>
      </div>
      ${LOGO_BLOCK}
      <div class="slide-num">4 / 6</div>
      <div class="linea"></div>
    </body></html>`
  },
  // SLIDE 5 — 3 ACCIONES
  {
    name: 'slide_05',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>${BASE_CSS}</style></head><body>
      <div class="zona-texto">
        <span class="etiqueta">Actúa ahora</span>
        <div class="divider"></div>
        <h1 class="titular">3 acciones.<br>Esta semana.</h1>
        <div style="margin-top: 8px;">
          <div class="step-item">
            <span class="step-num">1</span>
            <span class="step-text">Verifica que el Patch Tuesday de abril está aplicado en tu tenant de M365</span>
          </div>
          <div class="step-item">
            <span class="step-num">2</span>
            <span class="step-text">Revisa las etiquetas de sensibilidad en Microsoft Purview</span>
          </div>
          <div class="step-item">
            <span class="step-num">3</span>
            <span class="step-text">Audita qué archivos de SharePoint puede indexar Copilot</span>
          </div>
        </div>
        <p class="frase-final">Sin equipo IT. Solo saber dónde mirar.</p>
      </div>
      <div class="objeto">
        <div class="cubo">
          <div class="icono">✅</div>
        </div>
      </div>
      ${LOGO_BLOCK}
      <div class="slide-num">5 / 6</div>
      <div class="linea"></div>
    </body></html>`
  },
  // SLIDE 6 — CTA
  {
    name: 'slide_06',
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>${BASE_CSS}
    .zona-cta {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; flex-direction: column;
      justify-content: center; align-items: flex-start;
      padding: 0 110px; gap: 28px;
    }
    .pregunta-grande {
      font-weight: 900; font-size: 58px;
      line-height: 1.05; color: ${NAVY};
      letter-spacing: -2px; max-width: 700px;
    }
    .divider-h {
      width: 64px; height: 4px;
      background: ${CYAN}; border-radius: 2px;
    }
    .cta-texto {
      font-family: 'Inter', sans-serif;
      font-size: 19px; line-height: 1.55;
      color: rgba(0,26,65,0.72); max-width: 620px;
    }
    </style></head><body>
      <div class="zona-cta">
        <span class="etiqueta">¿Estáis protegidos?</span>
        <h1 class="pregunta-grande">¿Tenéis Copilot activo en vuestra empresa?</h1>
        <div class="divider-h"></div>
        <p class="cta-texto">
          Comentad <span class="cta-word">AUDITORÍA</span> y os mandamos el checklist de 10 puntos que usamos nosotros para revisar permisos antes de activarlo.
        </p>
        <p class="hashtags">#ciberseguridad &nbsp; #microsoft365 &nbsp; #beservices</p>
      </div>
      ${LOGO_BLOCK}
      <div class="slide-num">6 / 6</div>
      <div class="linea"></div>
    </body></html>`
  }
];

async function render() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  for (const slide of slides) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
    await page.setContent(slide.html, { waitUntil: 'networkidle0', timeout: 15000 });
    // Give fonts time to render
    await new Promise(r => setTimeout(r, 1500));
    const outPath = path.join('/home/user/beservices/slides', `${slide.name}.png`);
    await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    await page.close();
    console.log(`✓ ${slide.name}.png`);
  }

  await browser.close();
  console.log('Done.');
}

render().catch(console.error);
