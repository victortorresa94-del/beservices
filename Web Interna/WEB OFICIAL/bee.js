(function () {
  'use strict';

  var _beeMessages = [];
  var _beeOpen = false;
  var _beeMode = 'home';
  var _beeSending = false;

  var BEE_AVATAR_HTML = '<div class="bee-msg-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" width="16" height="16"><ellipse cx="12" cy="10" rx="6" ry="7"/><path d="M6 10c-2 0-3 1.5-3 3s1 3 3 3"/><path d="M18 10c2 0 3 1.5 3 3s-1 3-3 3"/><path d="M9 4L7 1M15 4l2-3"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/></svg></div>';

  var BEE_QUICK_ACTIONS = [
    { icon: '🔐', title: '¿Qué es Besafe y qué incluye?', subtitle: 'Seguridad gestionada para empresas' },
    { icon: '📦', title: '¿Cuál es el plan recomendado para mi empresa?', subtitle: 'Ayuda para elegir plan' },
    { icon: '☁️', title: '¿Gestionáis licencias de Microsoft 365?', subtitle: 'Licencias, configuración y soporte' },
    { icon: '🆓', title: '¿Cómo funciona el diagnóstico gratuito?', subtitle: 'BeAudit — análisis en tiempo real' }
  ];

  var BEE_SERVICES = [
    { icon: '🔐', name: 'Besafe', desc: 'Seguridad gestionada: MFA, Acceso Condicional, EDR, Backup' },
    { icon: '📧', name: 'Microsoft 365', desc: 'Partner certificado: licencias, configuración y soporte completo' },
    { icon: '🌐', name: 'Google Workspace', desc: 'Partner certificado: Gmail, Drive, Meet para empresas' },
    { icon: '☁️', name: 'Cloud & Infraestructura', desc: 'Azure, Microsoft 365, migración y gestión cloud' },
    { icon: '🎧', name: 'BeHelp (Soporte IT)', desc: 'Soporte gestionado: mensual, bolsa de horas o por incidencia' }
  ];

  var BEE_PLANS = [
    { name: 'Besafe Essentials', price: '~5.000 EUR impl. + MRR', desc: 'MFA gestionado, Acceso Condicional, Defender for Office. Identidad y correo seguros. ~13 días.' },
    { name: 'Besafe Advanced', price: '~8.000 EUR impl. + MRR', desc: 'Todo Essentials + EDR endpoints, Intune MDM, detección shadow IT. ~19 días.' },
    { name: 'Besafe Plus', price: 'Desde ~6.000 EUR + MRR', desc: 'Advanced + BeBackup: correo, OneDrive, SharePoint y Teams protegidos.' },
    { name: 'Besafe Total', price: 'Desde ~14.000 EUR + MRR', desc: 'Blindaje completo + auditoría, Disaster Recovery y reunión vCIO trimestral.' }
  ];

  function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function toggleBee() {
    _beeOpen = !_beeOpen;
    var w = document.getElementById('bee-widget');
    if (!w) return;
    if (_beeOpen) {
      w.style.display = 'flex';
      if (_beeMode === 'home') renderBeeHome();
    } else {
      w.style.display = 'none';
    }
  }

  function beeSetTab(name) {
    ['home', 'services', 'plans', 'history'].forEach(function (t) {
      var el = document.getElementById('bee-tab-' + t);
      if (el) el.classList.toggle('active', t === name);
    });
  }

  function renderBeeHome() {
    _beeMode = 'home';
    beeSetTab('home');
    var c = document.getElementById('bee-body');
    if (!c) return;
    c.innerHTML = '<div class="bee-home">'
      + '<div class="bee-greeting">Hola 👋</div>'
      + '<div class="bee-greeting-sub">Soy Bee, el asistente de BeServices.<br>¿En qué puedo ayudarte hoy?</div>'
      + BEE_QUICK_ACTIONS.map(function (a) {
          return '<div class="bee-quick-action" onclick="window._bee.sendQuick(\'' + escHtml(a.title).replace(/'/g, "&#39;") + '\')">'
            + '<div class="bee-qa-icon">' + a.icon + '</div>'
            + '<div class="bee-qa-text"><div class="bee-qa-title">' + escHtml(a.title) + '</div>'
            + '<div class="bee-qa-sub">' + escHtml(a.subtitle) + '</div></div>'
            + '<div class="bee-qa-arrow">›</div></div>';
        }).join('')
      + '</div>';
  }

  function beeShowHome() { renderBeeHome(); }

  function beeShowServices() {
    beeSetTab('services');
    var c = document.getElementById('bee-body');
    if (!c) return;
    var html = '<div class="bee-static-panel"><div class="bee-static-title">Servicios de BeServices</div>';
    BEE_SERVICES.forEach(function (s) {
      html += '<div class="bee-insight-item"><div class="bee-insight-icon">' + s.icon + '</div>'
        + '<div class="bee-insight-text"><strong>' + escHtml(s.name) + '</strong><br>' + escHtml(s.desc) + '</div></div>';
    });
    html += '<div style="margin-top:14px"><a href="mailto:comercial@beservices.es?subject=Consulta%20servicios%20BeServices" class="bee-rec-cta" style="display:block;text-align:center">Contactar con BeServices →</a></div>';
    html += '</div>';
    c.innerHTML = html;
  }

  function beeShowPlans() {
    beeSetTab('plans');
    var c = document.getElementById('bee-body');
    if (!c) return;
    var html = '<div class="bee-static-panel"><div class="bee-static-title">Planes Besafe</div>';
    BEE_PLANS.forEach(function (p) {
      html += '<div class="bee-rec-card" style="margin-bottom:8px">'
        + '<div class="bee-rec-title">' + escHtml(p.name) + '</div>'
        + '<div style="font-size:.72rem;color:var(--blue,#0075F2);font-weight:600;margin-bottom:4px">' + escHtml(p.price) + '</div>'
        + '<div class="bee-rec-desc">' + escHtml(p.desc) + '</div>'
        + '</div>';
    });
    html += '<div style="margin-top:4px"><button class="bee-quick-action" onclick="window._bee.sendQuick(\'¿Qué plan Besafe me recomiendas para mi empresa?\')" style="width:100%"><div class="bee-qa-icon">💬</div><div class="bee-qa-text"><div class="bee-qa-title">¿Qué plan me conviene?</div><div class="bee-qa-sub">Preguntarle a Bee</div></div><div class="bee-qa-arrow">›</div></button></div>';
    html += '</div>';
    c.innerHTML = html;
  }

  function beeShowHistory() {
    beeSetTab('history');
    var c = document.getElementById('bee-body');
    if (!c) return;
    if (_beeMessages.length === 0) {
      c.innerHTML = '<div class="bee-history-empty">No hay conversación todavía.<br>Haz una pregunta a Bee para empezar.</div>';
      return;
    }
    renderBeeChat();
  }

  function sendQuick(text) {
    _beeMode = 'chat';
    beeSetTab('home');
    var c = document.getElementById('bee-body');
    if (c) c.innerHTML = '';
    var input = document.getElementById('bee-input');
    if (input) input.value = text;
    sendToBee();
  }

  async function sendToBee() {
    var input = document.getElementById('bee-input');
    var text = (input ? input.value : '').trim();
    if (!text || _beeSending) return;
    if (input) input.value = '';
    _beeMode = 'chat';

    _beeMessages.push({ role: 'user', content: text });
    renderBeeChat();

    var c = document.getElementById('bee-body');
    if (c) {
      var chat = c.querySelector('.bee-chat');
      if (chat) {
        var typing = document.createElement('div');
        typing.className = 'bee-msg bee-msg-typing';
        typing.id = 'bee-typing';
        typing.innerHTML = BEE_AVATAR_HTML + '<div class="bee-msg-bubble"><div class="bee-typing-dots"><span></span><span></span><span></span></div></div>';
        chat.appendChild(typing);
        c.scrollTop = c.scrollHeight;
      }
    }

    _beeSending = true;
    try {
      var res = await fetch('/api/bee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: _beeMessages })
      });
      var data = await res.json();
      var reply = data.reply || 'Lo siento, ha habido un error. Inténtalo de nuevo.';
      _beeMessages.push({ role: 'assistant', content: reply });
    } catch (err) {
      _beeMessages.push({ role: 'assistant', content: 'Bee no está disponible ahora mismo. Contacta con el equipo de BeServices en comercial@beservices.es.' });
    } finally {
      _beeSending = false;
      var t = document.getElementById('bee-typing');
      if (t) t.remove();
      renderBeeChat();
    }
  }

  function renderBeeChat() {
    var c = document.getElementById('bee-body');
    if (!c) return;
    c.innerHTML = '<div class="bee-chat">'
      + _beeMessages.map(function (m) {
          return '<div class="bee-msg bee-msg-' + m.role + '">'
            + (m.role === 'assistant' ? BEE_AVATAR_HTML : '')
            + '<div class="bee-msg-bubble">' + formatBeeMsg(m.content) + '</div>'
            + '</div>';
        }).join('')
      + '</div>';
    c.scrollTop = c.scrollHeight;
  }

  function formatBeeMsg(text) {
    if (!text) return '';
    var s = escHtml(text);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/^#{1,3}\s+(.+)$/gm, '<strong>$1</strong>');
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  window._bee = {
    toggleBee: toggleBee,
    sendToBee: sendToBee,
    sendQuick: sendQuick,
    beeShowHome: beeShowHome,
    beeShowServices: beeShowServices,
    beeShowPlans: beeShowPlans,
    beeShowHistory: beeShowHistory
  };

  document.addEventListener('DOMContentLoaded', function () {
    var trigger = document.getElementById('bee-trigger');
    if (trigger) trigger.style.display = 'flex';
  });
})();
