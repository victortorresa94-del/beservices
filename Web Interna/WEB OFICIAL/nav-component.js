/**
 * BeServices — Shared Navigation Component
 * Inject: <nav id="main-nav" data-active="home"></nav>
 * data-active values: home | servicios | nosotros | casos | blog | contacto | microsoft | google | internal
 */
(function () {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const active = nav.dataset.active || '';
  const base = '';           // relativa — funciona desde cualquier subdirectorio
  const isActive = (key) => active === key ? 'text-corporateNavy font-semibold' : 'text-[#6B7280] hover:text-corporateNavy';

  const html = `
<style>
  #main-nav { position:fixed; top:0; left:0; width:100%; z-index:50; transition:box-shadow .3s; }
  #bs-nav-inner { background:rgba(255,255,255,.85); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
    border-bottom:1px solid rgba(0,26,65,.06); }
  #bs-nav-inner.scrolled { box-shadow:0 4px 30px rgba(0,26,65,.07); }
  .bs-dropdown { position:relative; }
  .bs-dropdown-menu { display:none; position:absolute; top:calc(100% + 8px); left:50%; transform:translateX(-50%);
    background:#fff; border:1px solid rgba(0,26,65,.07); border-radius:1rem;
    box-shadow:0 20px 50px -10px rgba(0,26,65,.12); min-width:240px; padding:.75rem; z-index:100; }
  .bs-dropdown:hover .bs-dropdown-menu,
  .bs-dropdown:focus-within .bs-dropdown-menu { display:block; }
  .bs-dd-item { display:flex; align-items:flex-start; gap:.75rem; padding:.625rem .75rem;
    border-radius:.6rem; text-decoration:none; transition:background .15s; }
  .bs-dd-item:hover { background:#f3f4f5; }
  .bs-dd-icon { width:2rem; height:2rem; border-radius:.5rem; background:#f3f4f5;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:.1rem; }
  .bs-dd-icon i { color:#50cabf; font-size:1rem; }
  .bs-dd-title { font-size:.8rem; font-weight:700; color:#001A41; }
  .bs-dd-desc { font-size:.7rem; color:#9CA3AF; margin-top:.1rem; }
  /* Mobile */
  #bs-mobile-menu { display:none; background:#fff; border-top:1px solid rgba(0,26,65,.06);
    padding:1rem 1.5rem 1.5rem; }
  #bs-mobile-menu.open { display:block; }
  .bs-mob-section { font-size:.65rem; font-weight:700; color:#9CA3AF; letter-spacing:.12em;
    text-transform:uppercase; margin:.75rem 0 .4rem; }
  .bs-mob-link { display:block; font-size:.875rem; font-weight:500; color:#001A41;
    padding:.5rem 0; border-bottom:1px solid #f3f4f5; text-decoration:none; }
  .bs-mob-link:hover { color:#50cabf; }
  /* Active indicator */
  .bs-nav-link { position:relative; }
  .bs-nav-link.active::after { content:''; position:absolute; bottom:-2px; left:0; right:0;
    height:2px; background:#50cabf; border-radius:99px; }
</style>

<div id="bs-nav-inner">
  <div style="max-width:1280px;margin:0 auto;padding:0 1.5rem;height:4.5rem;display:flex;align-items:center;justify-content:space-between;">
    <!-- Logo -->
    <a href="index.html" style="display:flex;align-items:center;flex-shrink:0;">
      <img src="assets/logo.png" alt="BeServices" style="height:32px;width:auto;mix-blend-multiply;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <span style="display:none;font-weight:800;font-size:1.1rem;color:#001A41;letter-spacing:-.02em;">Be<span style="color:#50cabf;">Services</span></span>
    </a>

    <!-- Desktop Nav -->
    <div style="display:none;" id="bs-desktop-nav" class="md-flex">
      <div style="display:flex;align-items:center;gap:.25rem;background:rgba(255,255,255,.4);border:1px solid rgba(0,26,65,.05);padding:.375rem 1.5rem;border-radius:99px;backdrop-filter:blur(8px);">

        <!-- Servicios dropdown -->
        <div class="bs-dropdown">
          <button style="display:flex;align-items:center;gap:.3rem;font-size:.8125rem;padding:.375rem .75rem;border-radius:.5rem;border:none;background:transparent;cursor:pointer;font-family:inherit;" class="${isActive('servicios')}">
            Servicios <svg style="width:12px;height:12px;margin-top:1px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="bs-dropdown-menu" style="min-width:260px;">
            <a href="servicio-activa.html" class="bs-dd-item">
              <div class="bs-dd-icon"><i class="ph ph-lightning"></i></div>
              <div><div class="bs-dd-title">ACTIVA</div><div class="bs-dd-desc">Licencias y herramientas digitales</div></div>
            </a>
            <a href="servicio-escala.html" class="bs-dd-item">
              <div class="bs-dd-icon"><i class="ph ph-arrows-out"></i></div>
              <div><div class="bs-dd-title">ESCALA</div><div class="bs-dd-desc">Cloud y migración empresarial</div></div>
            </a>
            <a href="servicio-protege.html" class="bs-dd-item">
              <div class="bs-dd-icon"><i class="ph ph-shield-check"></i></div>
              <div><div class="bs-dd-title">PROTEGE</div><div class="bs-dd-desc">Ciberseguridad y cumplimiento NIS2</div></div>
            </a>
            <a href="servicio-potencia.html" class="bs-dd-item">
              <div class="bs-dd-icon"><i class="ph ph-robot"></i></div>
              <div><div class="bs-dd-title">POTENCIA</div><div class="bs-dd-desc">IA, Copilot y automatización</div></div>
            </a>
            <a href="servicio-gestiona.html" class="bs-dd-item">
              <div class="bs-dd-icon"><i class="ph ph-headset"></i></div>
              <div><div class="bs-dd-title">GESTIONA</div><div class="bs-dd-desc">Soporte IT y mantenimiento</div></div>
            </a>
          </div>
        </div>

        <!-- Soluciones dropdown -->
        <div class="bs-dropdown">
          <button style="display:flex;align-items:center;gap:.3rem;font-size:.8125rem;padding:.375rem .75rem;border-radius:.5rem;border:none;background:transparent;cursor:pointer;font-family:inherit;" class="text-[#6B7280] hover:text-corporateNavy">
            Soluciones <svg style="width:12px;height:12px;margin-top:1px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="bs-dropdown-menu">
            <a href="microsoft.html" class="bs-dd-item">
              <div class="bs-dd-icon" style="background:#f0f4ff;"><img src="assets/Logos Microsoft/PNG/Microsoft365-color.png" onerror="this.style.display='none'" style="width:18px;height:18px;object-fit:contain;"></div>
              <div><div class="bs-dd-title">Microsoft 365</div><div class="bs-dd-desc">Teams, Exchange, SharePoint, Copilot</div></div>
            </a>
            <a href="google.html" class="bs-dd-item">
              <div class="bs-dd-icon" style="background:#f0f9f0;"><img src="assets/Logos Google/google-workspace.svg" onerror="this.style.display='none'" style="width:18px;height:18px;object-fit:contain;"><i class="ph ph-google-logo" style="color:#4285F4;font-size:.9rem;"></i></div>
              <div><div class="bs-dd-title">Google Workspace</div><div class="bs-dd-desc">Gmail, Drive, Meet, Gemini</div></div>
            </a>
            <div style="height:1px;background:#f3f4f5;margin:.375rem .75rem;"></div>
            <a href="servicio-cloud.html" class="bs-dd-item">
              <div class="bs-dd-icon"><i class="ph ph-cloud"></i></div>
              <div><div class="bs-dd-title">BeCenter</div><div class="bs-dd-desc">Nube privada y hosting gestionado</div></div>
            </a>
            <a href="servicio-backup.html" class="bs-dd-item">
              <div class="bs-dd-icon"><i class="ph ph-database"></i></div>
              <div><div class="bs-dd-title">BeDataCenter</div><div class="bs-dd-desc">Datacenter y backup empresarial</div></div>
            </a>
          </div>
        </div>

        <a href="nosotros.html" style="font-size:.8125rem;padding:.375rem .75rem;border-radius:.5rem;text-decoration:none;transition:background .15s;" class="bs-nav-link ${active==='nosotros'?'active ':''} ${isActive('nosotros')}">Nosotros</a>
        <a href="casos.html" style="font-size:.8125rem;padding:.375rem .75rem;border-radius:.5rem;text-decoration:none;" class="bs-nav-link ${active==='casos'?'active ':''} ${isActive('casos')}">Casos</a>
        <a href="blog.html" style="font-size:.8125rem;padding:.375rem .75rem;border-radius:.5rem;text-decoration:none;" class="bs-nav-link ${active==='blog'?'active ':''} ${isActive('blog')}">Blog</a>
      </div>
    </div>

    <!-- CTA + Internal -->
    <div style="display:none;align-items:center;gap:.75rem;" id="bs-cta-area">
      <a href="contacto.html" style="display:inline-flex;align-items:center;gap:.375rem;padding:.5rem 1.25rem;font-size:.8125rem;font-weight:700;color:#fff;background:#001A41;border-radius:99px;text-decoration:none;transition:background .15s;box-shadow:0 4px 14px rgba(0,26,65,.18);" onmouseover="this.style.background='#0075f2'" onmouseout="this.style.background='#001A41'">
        Contacto <i class="ph ph-arrow-right" style="font-size:.875rem;"></i>
      </a>
      <a href="internal.html" style="font-size:.7rem;font-weight:600;color:#9CA3AF;text-decoration:none;letter-spacing:.02em;transition:color .15s;white-space:nowrap;" onmouseover="this.style.color='#001A41'" onmouseout="this.style.color='#9CA3AF'" title="Portal Interno BeServices">
        <i class="ph ph-lock-simple" style="font-size:.8rem;"></i>
      </a>
    </div>

    <!-- Hamburger -->
    <button id="bs-hamburger" style="display:flex;flex-direction:column;gap:5px;padding:.5rem;background:none;border:none;cursor:pointer;border-radius:.5rem;" aria-label="Abrir menú">
      <span class="bs-bar" style="width:22px;height:2px;background:#001A41;border-radius:2px;transition:.3s;display:block;"></span>
      <span class="bs-bar" style="width:22px;height:2px;background:#001A41;border-radius:2px;transition:.3s;display:block;"></span>
      <span class="bs-bar" style="width:16px;height:2px;background:#001A41;border-radius:2px;transition:.3s;display:block;"></span>
    </button>
  </div>

  <!-- Mobile Menu -->
  <div id="bs-mobile-menu" role="navigation" aria-label="Menú móvil">
    <div class="bs-mob-section">Servicios</div>
    <a href="servicio-activa.html" class="bs-mob-link">⚡ ACTIVA — Licencias</a>
    <a href="servicio-escala.html" class="bs-mob-link">↗ ESCALA — Cloud</a>
    <a href="servicio-protege.html" class="bs-mob-link">🛡 PROTEGE — Seguridad</a>
    <a href="servicio-potencia.html" class="bs-mob-link">🤖 POTENCIA — IA</a>
    <a href="servicio-gestiona.html" class="bs-mob-link">🎧 GESTIONA — Soporte</a>
    <div class="bs-mob-section">Soluciones</div>
    <a href="microsoft.html" class="bs-mob-link">Microsoft 365</a>
    <a href="google.html" class="bs-mob-link">Google Workspace</a>
    <a href="servicio-cloud.html" class="bs-mob-link">BeCenter</a>
    <a href="servicio-backup.html" class="bs-mob-link">BeDataCenter</a>
    <div class="bs-mob-section">Empresa</div>
    <a href="nosotros.html" class="bs-mob-link">Nosotros</a>
    <a href="casos.html" class="bs-mob-link">Casos de éxito</a>
    <a href="blog.html" class="bs-mob-link">Blog y recursos</a>
    <a href="contacto.html" class="bs-mob-link" style="font-weight:700;color:#50cabf;border:none;margin-top:.75rem;">Habla con nosotros →</a>
    <a href="internal.html" class="bs-mob-link" style="color:#9CA3AF;font-size:.75rem;border:none;">Portal Interno</a>
  </div>
</div>
`;

  nav.innerHTML = html;

  // Show desktop elements responsively
  function applyResponsive() {
    const w = window.innerWidth;
    const desktopNav = document.getElementById('bs-desktop-nav');
    const ctaArea = document.getElementById('bs-cta-area');
    const hamburger = document.getElementById('bs-hamburger');
    if (!desktopNav) return;
    if (w >= 768) {
      desktopNav.style.display = 'flex';
      ctaArea.style.display = 'flex';
      hamburger.style.display = 'none';
    } else {
      desktopNav.style.display = 'none';
      ctaArea.style.display = 'none';
      hamburger.style.display = 'flex';
    }
  }
  applyResponsive();
  window.addEventListener('resize', applyResponsive);

  // Hamburger toggle
  const hamburger = document.getElementById('bs-hamburger');
  const mobileMenu = document.getElementById('bs-mobile-menu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const bars = hamburger.querySelectorAll('.bs-bar');
    if (mobileMenu.classList.contains('open')) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      bars[2].style.width = '22px';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
      bars[2].style.width = '16px';
    }
  });

  // Scroll shadow
  const inner = document.getElementById('bs-nav-inner');
  window.addEventListener('scroll', () => {
    inner.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();
