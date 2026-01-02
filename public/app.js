document.addEventListener('DOMContentLoaded', async () => {
  const menuToggle = document.querySelector('[data-js="menu-toggle"]');
  const nav = document.querySelector('[data-js="nav"]');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          menuToggle?.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  try {
    const response = await fetch('/content.json', { cache: 'no-cache' });
    const data = await response.json();
    populateContent(data);
  } catch (error) {
    console.error('Impossibile caricare il contenuto', error);
  }
});

function populateContent(content) {
  // Hero
  setText('hero-title', content.hero.title);
  setText('hero-subtitle', content.hero.subtitle);
  setText('hero-disclaimer', content.hero.disclaimer);
  setText('hero-cta-primary', content.hero.primaryCta);
  setText('hero-cta-secondary', content.hero.secondaryCta);
  renderList('hero-bullets', content.hero.bullets, (item) => {
    const li = document.createElement('div');
    li.className = 'badge';
    li.textContent = item;
    return li;
  });

  // Problema
  setText('problema-title', content.problema.title);
  setText('problema-subtitle', content.problema.subtitle);
  renderList('problema-cards', content.problema.cards, (card) => {
    const div = document.createElement('div');
    div.className = 'card';
    const h3 = document.createElement('h3');
    h3.textContent = card.title;
    const p = document.createElement('p');
    p.textContent = card.body;
    div.append(h3, p);
    return div;
  });
  setText('problema-note-title', content.problema.noteTitle);
  setText('problema-note-body', content.problema.noteBody);

  // Metodo
  setText('metodo-title', content.metodo.title);
  setText('metodo-subtitle', content.metodo.subtitle);
  renderList('metodo-steps', content.metodo.steps, (step) => {
    const div = document.createElement('div');
    div.className = 'card';
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '0.75rem';
    const label = document.createElement('span');
    label.className = 'step-label';
    label.textContent = step.label;
    const title = document.createElement('h3');
    title.textContent = step.title;
    header.append(label, title);
    const body = document.createElement('p');
    body.textContent = step.body;
    div.append(header, body);
    return div;
  });

  // Verifica
  setText('verifica-title', content.verifica.title);
  setText('verifica-subtitle', content.verifica.subtitle);
  renderList('verifica-steps', content.verifica.steps, (step) => {
    const div = document.createElement('div');
    div.className = 'card';
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '0.75rem';
    const label = document.createElement('span');
    label.className = 'step-label';
    label.textContent = step.number;
    const title = document.createElement('h3');
    title.textContent = step.title;
    header.append(label, title);
    const body = document.createElement('p');
    body.textContent = step.body;
    div.append(header, body);
    return div;
  });
  setText('verifica-results-title', content.verifica.resultsTitle);
  renderList('verifica-results', content.verifica.results, (res) => {
    const div = document.createElement('div');
    div.className = `badge-state ${res.tone}`;
    const title = document.createElement('p');
    title.textContent = res.label;
    const body = document.createElement('p');
    body.style.fontWeight = '500';
    body.textContent = res.description;
    div.append(title, body);
    return div;
  });
  setText('verifica-cta', content.verifica.cta);

  // Esempi
  setText('esempi-title', content.esempi.title);
  setText('esempi-subtitle', content.esempi.subtitle);
  renderList('esempi-cards', content.esempi.scenarios, (scenario) => {
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('h3');
    title.textContent = scenario.title;
    const why = document.createElement('div');
    why.className = 'note';
    const whyLabel = document.createElement('p');
    whyLabel.style.fontWeight = '700';
    whyLabel.textContent = 'Perché succede';
    const whyText = document.createElement('p');
    whyText.textContent = scenario.because;
    why.append(whyLabel, whyText);

    const checks = document.createElement('div');
    checks.className = 'note';
    const checkLabel = document.createElement('p');
    checkLabel.style.fontWeight = '700';
    checkLabel.textContent = 'Cosa controlla Tradelia';
    const list = document.createElement('ul');
    list.style.paddingLeft = '1rem';
    scenario.checks.forEach((c) => {
      const li = document.createElement('li');
      li.textContent = c;
      list.appendChild(li);
    });
    checks.append(checkLabel, list);

    card.append(title, why, checks);
    return card;
  });

  // Controlli
  setText('controlli-title', content.controlli.title);
  setText('controlli-subtitle', content.controlli.subtitle);
  renderList('controlli-list', content.controlli.items, (item) => {
    const div = document.createElement('div');
    div.className = 'check-item';
    const mark = document.createElement('span');
    mark.textContent = '✓';
    mark.style.fontWeight = '700';
    const text = document.createElement('p');
    text.textContent = item;
    div.append(mark, text);
    return div;
  });
  setText('controlli-footnote', content.controlli.footnote);

  // Trasparenza
  setText('trasparenza-title', content.trasparenza.title);
  setText('trasparenza-subtitle', content.trasparenza.subtitle);
  renderList('trasparenza-do', content.trasparenza.do, (item) => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  });
  renderList('trasparenza-dont', content.trasparenza.dont, (item) => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  });
  setText('metodologia-title', content.trasparenza.metodologiaTitle);
  renderList('metodologia-list', content.trasparenza.metodologia, (item) => {
    const div = document.createElement('div');
    div.className = 'check-item';
    const dot = document.createElement('span');
    dot.textContent = '•';
    const text = document.createElement('p');
    text.textContent = item;
    div.append(dot, text);
    return div;
  });
  setText('trasparenza-regola', content.trasparenza.regola);

  // CTA
  setText('cta-title', content.cta.title);
  setText('cta-subtitle', content.cta.subtitle);
  setText('cta-primary', content.cta.primary);
  setText('cta-secondary', content.cta.secondary);
  setText('cta-version', content.cta.version);
  setText('cta-legal', content.cta.legal);

  // Footer
  setText('footer-privacy', content.footer.privacy);
  setText('footer-disclaimer', content.footer.disclaimer);
  setText('footer-contatti', content.footer.contatti);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderList(id, items, renderer) {
  const container = document.getElementById(id);
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item) => {
    container.appendChild(renderer(item));
  });
}
