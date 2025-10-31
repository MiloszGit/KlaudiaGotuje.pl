(function () {
  const input = document.getElementById('recipe-search');
  const list = document.getElementById('recipe-list') || document.querySelector('.recipe-grid');
  const noResults = document.getElementById('no-results');
  const navLinks = Array.from(document.querySelectorAll('nav a[href]'))
    .filter(a => a.getAttribute('href') && a.getAttribute('href').endsWith('.html'));

  const categories = navLinks.length ? navLinks.map(a => ({ title: a.textContent.trim(), url: a.getAttribute('href') })) : [
    { title: 'Śniadania', url: 'sniadania.html' },
    { title: 'Obiady', url: 'obiady.html' },
    { title: 'Kolacje', url: 'kolacje.html' },
    { title: 'Przekąski', url: 'przekaski.html' },
    { title: 'Desery', url: 'desery.html' },
  ];

  const normalize = (s) => {
    if (!s) return '';
    try {
      return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    } catch (e) {
      return s.toLowerCase().replace(/[\u0300-\u036f]/g, '');
    }
  };

  const collectItems = () => {
    if (!list) return [];
    const anchors = Array.from(list.querySelectorAll('.card-link'));
    if (anchors.length) {
      return anchors.map(a => ({
        node: a,
        text: a.textContent.trim(),
        search: normalize(a.textContent.trim()),
        url: a.getAttribute('href') || null
      }));
    }
    const cards = Array.from(list.querySelectorAll('.recipe-card'));
    return cards.map(el => ({
      node: el,
      text: el.textContent.trim(),
      search: normalize(el.textContent.trim()),
      url: (el.closest('a') && el.closest('a').getAttribute('href')) || null
    }));
  };

  const items = collectItems();

  let sugBox = null;
  let updatePos = null;

  const ensureSugBox = () => {
    if (!input || sugBox) return;
    sugBox = document.createElement('div');
    sugBox.className = 'kg-search-suggestions';
    sugBox.style.position = 'absolute';
    sugBox.style.background = window.getComputedStyle(document.body).backgroundColor || '#fff';
    sugBox.style.border = '1px solid rgba(0,0,0,0.08)';
    sugBox.style.padding = '8px';
    sugBox.style.borderRadius = '8px';
    sugBox.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
    sugBox.style.zIndex = 2000;
    sugBox.style.display = 'none';
    sugBox.style.minWidth = '180px';
    sugBox.style.fontSize = '0.95rem';
    document.body.appendChild(sugBox);

    updatePos = () => {
      const r = input.getBoundingClientRect();
      const docW = document.documentElement.clientWidth;
      const left = Math.max(8, r.left + window.scrollX);
      // prefer same width as input
      const width = Math.max(input.offsetWidth, 180);
      let computedLeft = left;
      if (computedLeft + width > docW - 8) computedLeft = Math.max(8, docW - width - 8);
      sugBox.style.left = computedLeft + 'px';
      sugBox.style.top = (r.bottom + window.scrollY + 8) + 'px';
      sugBox.style.minWidth = width + 'px';
    };

    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    input.addEventListener('focus', updatePos);

    // position immediately (handles case input is already focused)
    requestAnimationFrame(updatePos);

    // keep clicks inside suggestions from closing immediately
    sugBox.addEventListener('pointerdown', (ev) => ev.stopPropagation());
  };

  const showSuggestions = (q) => {
    if (!input) return;
    ensureSugBox();
    if (!sugBox) return;
    const nq = normalize(q).trim();
    const listEls = [];
    const localMatches = items.filter(it => nq === '' || it.search.includes(nq)).slice(0, 6);

    if (localMatches.length) {
      listEls.push('<strong>Wyniki na tej stronie:</strong>');
      localMatches.forEach(m => {
        const text = escapeHtml(m.text);
        if (m.url) listEls.push(`<div style="padding:6px 0;"><a href="${m.url}" style="color:inherit;text-decoration:none;">${text}</a></div>`);
        else listEls.push(`<div style="padding:6px 0;">${text}</div>`);
      });
    }

    listEls.push('<strong style="display:block;margin-top:6px;">Szukaj w kategoriach:</strong>');
    categories.forEach(cat => {
      const href = cat.url + '?q=' + encodeURIComponent(q);
      listEls.push(`<div style="padding:4px 0;"><a href="${href}" style="color:inherit;text-decoration:none;">${escapeHtml(cat.title)}</a></div>`);
    });

    sugBox.innerHTML = listEls.join('');
    // ensure positioned correctly before showing
    if (updatePos) updatePos();
    sugBox.style.display = 'block';
  };

  const hideSuggestions = () => {
    if (sugBox) sugBox.style.display = 'none';
  };

  function filter(q) {
    const nq = normalize(q).trim();
    let visible = 0;
    items.forEach(it => {
      const match = nq === '' || it.search.includes(nq);
      it.node.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  if (input) {
    input.addEventListener('input', (e) => {
      const q = e.target.value || '';
      filter(q);
      showSuggestions(q);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        filter('');
        hideSuggestions();
      }
      if (e.key === 'Enter') {
        const nq = normalize(input.value || '').trim();
        const localMatches = items.filter(it => nq === '' || it.search.includes(nq));
        if (localMatches.length === 0) {
          const cat = categories[0];
          if (cat) location.href = cat.url + '?q=' + encodeURIComponent(input.value || '');
        } else {
          hideSuggestions();
        }
      }
    });

    document.addEventListener('click', (ev) => {
      if (!sugBox || !input) return;
      if (ev.target === input || input.contains(ev.target) || sugBox.contains(ev.target)) return;
      hideSuggestions();
    });

    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    if (q) {
      input.value = q;
      filter(q);
      input.focus();
      showSuggestions(q);
    }
  } else {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    if (q && items.length) {
      if (!noResults) {
        const nr = document.createElement('div');
        nr.id = 'no-results';
        nr.style.display = 'none';
        nr.style.textAlign = 'center';
        nr.style.marginTop = '12px';
        nr.style.color = '#556b2f';
        nr.textContent = 'Brak wyników wyszukiwania';
        if (list && list.parentNode) list.parentNode.insertBefore(nr, list);
      }
      filter(q);
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  window.KGSearch = { filter, items, categories };
})();