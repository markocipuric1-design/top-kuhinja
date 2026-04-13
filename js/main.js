/* ── NAV SCROLL + PROGRESS BAR ── */
const nav = document.getElementById('navbar');
const progressBar = document.getElementById('progressBar');
if (nav && progressBar) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .feature-card, .review, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ── GALLERY LIGHTBOX ── */
(function () {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lbImg');
  const lbCount = document.getElementById('lbCounter');
  const TOTAL   = items.length;
  let current   = 0;

  const srcs = items.map(el => el.querySelector('img').src);
  const alts = items.map(el => el.querySelector('img').alt);

  function open(n) {
    current = (n + TOTAL) % TOTAL;
    lbImg.src = srcs[current];
    lbImg.alt = alts[current];
    lbCount.textContent = (current + 1) + ' / ' + TOTAL;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(el => el.addEventListener('click', () => open(+el.dataset.index)));
  document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); open(current - 1); });
  document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); open(current + 1); });
  document.getElementById('lbClose').addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
    if (e.key === 'Escape')     close();
  });

  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) open(current + (dx < 0 ? 1 : -1));
  });
})();

/* ── COOKIE BANNER ── */
(function () {
  const banner  = document.getElementById('cookieBanner');
  const details = document.getElementById('cookieDetails');
  if (!banner) return;
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => banner.classList.add('visible'), 800);
  }

  function hide() { banner.classList.remove('visible'); }

  function save(analytics, functional, marketing) {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true, analytics, functional, marketing, date: new Date().toISOString()
    }));
    hide();
  }

  document.getElementById('cookieAccept').addEventListener('click', () => save(true, true, true));
  document.getElementById('cookieDecline').addEventListener('click',  () => save(false, false, false));
  document.getElementById('cookieDecline2').addEventListener('click', () => save(false, false, false));
  document.getElementById('cookieSave').addEventListener('click', () => {
    save(
      document.getElementById('tAnalitika').checked,
      document.getElementById('tFunkcija').checked,
      document.getElementById('tMarketing').checked
    );
  });

  const detailsBtn = document.getElementById('cookieDetailsBtn');
  detailsBtn.addEventListener('click', () => {
    const open = details.classList.toggle('open');
    detailsBtn.textContent = open ? 'Skrij ▴' : 'Podrobnosti ▾';
  });
})();

/* ── PRICING SLIDER (mobile only) ── */
(function () {
  const grid   = document.getElementById('pricingGrid');
  const dotsEl = document.getElementById('pricingDots');
  const hint   = document.getElementById('swipeHint');
  if (!grid) return;

  function isMobile() { return window.innerWidth <= 620; }
  const cards = grid.querySelectorAll('.card');

  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'pricing-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Model ' + (i + 1));
    d.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
    dotsEl.appendChild(d);
  });

  function updateDots() {
    if (!isMobile()) return;
    const cardWidth = grid.clientWidth * 0.82 + 16;
    const active    = Math.round(grid.scrollLeft / cardWidth);
    dotsEl.querySelectorAll('.pricing-dot').forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
  }

  grid.addEventListener('scroll', () => {
    updateDots();
    if (hint) hint.classList.add('hidden');
  }, { passive: true });

  function toggleMobileUI() {
    const mobile = isMobile();
    dotsEl.style.display = mobile ? 'flex' : 'none';
    if (hint) hint.style.display = mobile ? 'flex' : 'none';
  }
  toggleMobileUI();
  window.addEventListener('resize', toggleMobileUI);
})();

/* ── FEATURES SLIDER (mobile only) ── */
(function () {
  const grid   = document.getElementById('featuresGrid');
  const dotsEl = document.getElementById('featuresDots');
  const hint   = document.getElementById('featuresSwipeHint');
  if (!grid) return;

  function isMobile() { return window.innerWidth <= 620; }
  const cards = grid.querySelectorAll('.feature-card');

  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'features-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Lastnost ' + (i + 1));
    d.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
    dotsEl.appendChild(d);
  });

  function updateDots() {
    if (!isMobile()) return;
    const cardWidth = grid.clientWidth * 0.82 + 16;
    const active    = Math.round(grid.scrollLeft / cardWidth);
    dotsEl.querySelectorAll('.features-dot').forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
  }

  grid.addEventListener('scroll', () => {
    updateDots();
    if (hint) hint.classList.add('hidden');
  }, { passive: true });

  function toggleMobileUI() {
    const mobile = isMobile();
    dotsEl.style.display = mobile ? 'flex' : 'none';
    if (hint) hint.style.display = mobile ? 'flex' : 'none';
  }
  toggleMobileUI();
  window.addEventListener('resize', toggleMobileUI);
})();

/* ── DELIVERY CALENDAR ── */
(function () {
  const grid   = document.getElementById('calMonthsGrid');
  if (!grid) return;

  const DELIVERY_START = new Date(2026, 6, 5);
  const CALENDAR_END   = new Date(2027, 11, 31);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startYear  = today.getFullYear();
  const startMonth = today.getMonth();
  const totalMonths = (CALENDAR_END.getFullYear() - startYear) * 12 + (CALENDAR_END.getMonth() - startMonth) + 1;

  let page = 0;
  const label   = document.getElementById('calRangeLabel');
  const btnPrev = document.getElementById('calPrev');
  const btnNext = document.getElementById('calNext');

  const SL_MONTHS = ['Januar','Februar','Marec','April','Maj','Junij','Julij','Avgust','September','Oktober','November','December'];
  const SL_DAYS   = ['Po','To','Sr','Če','Pe','So','Ne'];

  function getCols() {
    return window.innerWidth <= 620 ? 1 : window.innerWidth <= 1100 ? 2 : 3;
  }

  function renderMonths() {
    grid.innerHTML = '';
    const cols = getCols();
    const firstIdx = page * cols;
    const count = Math.min(cols, totalMonths - firstIdx);

    const firstDate = new Date(startYear, startMonth + firstIdx, 1);
    const lastDate  = new Date(startYear, startMonth + firstIdx + count - 1, 1);
    label.textContent = count === 1
      ? SL_MONTHS[firstDate.getMonth()] + ' ' + firstDate.getFullYear()
      : SL_MONTHS[firstDate.getMonth()] + ' ' + firstDate.getFullYear() + ' – ' + SL_MONTHS[lastDate.getMonth()] + ' ' + lastDate.getFullYear();

    for (let i = 0; i < count; i++) {
      const idx   = firstIdx + i;
      if (idx >= totalMonths) break;
      const year  = startYear  + Math.floor((startMonth + idx) / 12);
      const month = (startMonth + idx) % 12;
      grid.appendChild(buildMonth(year, month));
    }

    btnPrev.disabled = page === 0;
    btnNext.disabled = (firstIdx + cols) >= totalMonths;
  }

  function buildMonth(year, month) {
    const wrap = document.createElement('div');
    wrap.className = 'cal-month';

    const title = document.createElement('div');
    title.className = 'cal-month-title';
    title.textContent = SL_MONTHS[month] + ' ' + year;
    wrap.appendChild(title);

    const wdays = document.createElement('div');
    wdays.className = 'cal-weekdays';
    SL_DAYS.forEach(d => {
      const wd = document.createElement('div');
      wd.className = 'cal-wday';
      wd.textContent = d;
      wdays.appendChild(wd);
    });
    wrap.appendChild(wdays);

    const days = document.createElement('div');
    days.className = 'cal-days';

    const firstDay = new Date(year, month, 1);
    let offset = firstDay.getDay() - 1;
    if (offset < 0) offset = 6;
    for (let e = 0; e < offset; e++) days.appendChild(document.createElement('div'));

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;
      if (date.getTime() === today.getTime()) cell.classList.add('today');
      else if (date < today) cell.classList.add('past');
      else if (date >= DELIVERY_START) cell.classList.add('available');
      else cell.classList.add('booked');
      days.appendChild(cell);
    }
    wrap.appendChild(days);
    return wrap;
  }

  btnPrev.addEventListener('click', () => { if (page > 0) { page--; renderMonths(); } });
  btnNext.addEventListener('click', () => { page++; renderMonths(); });
  window.addEventListener('resize', renderMonths);
  renderMonths();
})();

/* ── DELIVERY DATE PICKER ── */
(function () {
  const select    = document.getElementById('interest');
  const dateGroup = document.getElementById('deliveryDateGroup');
  const dateInput = document.getElementById('deliveryDate');
  if (!select) return;

  const minDate = '2026-07-05';
  const maxDate = '2027-12-31';
  dateInput.min = minDate;
  dateInput.max = maxDate;
  dateInput.value = minDate;

  function toggle() {
    const show = select.value === 'Dostava in vgradnja';
    dateGroup.style.display = show ? 'block' : 'none';
    dateInput.required = show;
  }

  select.addEventListener('change', toggle);
  toggle();
})();

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
