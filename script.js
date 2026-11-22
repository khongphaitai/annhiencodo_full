
/* Footer copyright year — always shows the current year */
document.getElementById('copyrightYear').textContent = new Date().getFullYear();

/* An Nhiên Cố Đô — interactions
   Top bar + mobile menu · hero carousel · stat counters · product popups ·
   combo detail popups · FAQ panel · scroll reveal + active nav */

/* ---------------- Top bar ---------------- */
(function () {
  const bar = document.getElementById('topbar');
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    bar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));

  /* active nav link follows the section in view */
  const links = Array.from(nav.querySelectorAll('a'));
  const map = {};
  links.forEach(a => { map[a.getAttribute('href').slice(1)] = a; });
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && map[e.target.id]) {
        links.forEach(a => a.classList.remove('active'));
        map[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['hero', 'bo-suu-tap', 'danh-muc', 'cau-chuyen', 'combo', 'faq'].forEach(id => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
})();

/* ---------------- Hero carousel ---------------- */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('#heroDots .dot');
  let cur = 0, timer = null;

  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === cur));
    dots.forEach((d, k) => d.classList.toggle('active', k === cur));
  }
  function auto() {
    clearInterval(timer);
    timer = setInterval(() => show(cur + 1), 6000);
  }
  document.getElementById('heroNext').addEventListener('click', () => { show(cur + 1); auto(); });
  document.getElementById('heroPrev').addEventListener('click', () => { show(cur - 1); auto(); });
  dots.forEach(d => d.addEventListener('click', () => { show(+d.dataset.slide); auto(); }));
  document.getElementById('hero').addEventListener('mouseenter', () => clearInterval(timer));
  document.getElementById('hero').addEventListener('mouseleave', auto);
  auto();

})();

/* ---------------- Sound: ambient / loop music generated live (Web Audio API, no audio file) ----------------
   Browsers block autoplay with sound, so playback only starts on a tap.
   No file is downloaded: no copyright risk, no page weight, seamless endless loop. */
(function () {
  const btn = document.getElementById('musicBtn');
  const statusBtn = document.getElementById('soundStatus');
  const statusText = document.getElementById('soundStatusText');
  const cards = Array.from(document.querySelectorAll('[data-sound-mode]'));
  const volRange = document.getElementById('volRange');
  const volVal = document.getElementById('volVal');
  if (!btn) return;

  let ctx = null, master = null, mode = 'off', volume = 0.35;
  let liveNodes = [], timers = [], padNodes = [], chordIdx = 0;
  const CHORDS = [
    [220.00, 261.63, 329.63],  /* Am */
    [174.61, 220.00, 261.63],  /* F  */
    [196.00, 246.94, 293.66],  /* G  */
    [164.81, 196.00, 246.94]   /* Em */
  ];

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function clearTimers() { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = []; }
  function stopAllNodes() {
    clearTimers();
    liveNodes.forEach(n => { try { if (n.stop) n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} });
    liveNodes = []; padNodes = [];
  }
  function startNoise() {
    const len = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.4; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 520;
    const g = ctx.createGain(); g.gain.value = 0.42;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.16;
    lfo.connect(lfoG); lfoG.connect(g.gain);
    src.connect(filt); filt.connect(g); g.connect(master);
    src.start(); lfo.start();
    liveNodes.push(src, lfo, g, filt);
  }
  function playChord(freqs, vol) {
    padNodes.forEach(p => {
      try {
        p.g.gain.cancelScheduledValues(ctx.currentTime);
        p.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.4);
        const osc = p.o, osc2 = p.o2;
        setTimeout(() => { try { osc.stop(); } catch (e) {} try { osc2.stop(); } catch (e) {} }, 2700);
      } catch (e) {}
    });
    padNodes = [];
    freqs.forEach(f => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2;
      const g2 = ctx.createGain(); g2.gain.value = 0.22;
      const g = ctx.createGain(); g.gain.value = 0;
      g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 2.4);
      const flt = ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = 900;
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(flt); flt.connect(master);
      o.start(); o2.start();
      padNodes.push({ o: o, o2: o2, g: g });
      liveNodes.push(o, o2);
    });
  }
  function startPad(vol) {
    chordIdx = 0;
    playChord(CHORDS[0], vol);
    timers.push(setInterval(() => { chordIdx = (chordIdx + 1) % CHORDS.length; playChord(CHORDS[chordIdx], vol); }, 8000));
  }
  function scheduleChime() {
    timers.push(setTimeout(() => {
      if (mode !== 'ambient' || !ctx) return;
      const notes = [523.25, 587.33, 659.25, 783.99];
      const o = ctx.createOscillator(); o.type = 'sine';
      o.frequency.value = notes[Math.floor(Math.random() * notes.length)];
      const g = ctx.createGain(); const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.055, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
      o.connect(g); g.connect(master);
      o.start(); o.stop(t + 3);
      liveNodes.push(o);
      scheduleChime();
    }, 9000 + Math.random() * 9000));
  }
  function startMelody() {
    const seq = [329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 261.63, 293.66];
    let i = 0;
    (function pluck() {
      if (mode !== 'music' || !ctx) return;
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = seq[i % seq.length]; i++;
      const g = ctx.createGain(); const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      o.connect(g); g.connect(master);
      o.start(); o.stop(t + 1.6);
      liveNodes.push(o);
      timers.push(setTimeout(pluck, 950));
    })();
  }
  function updateUI() {
    const playing = mode !== 'off';
    btn.classList.toggle('playing', playing);
    btn.classList.toggle('off', !playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.setAttribute('aria-label', playing ? 'Tắt âm thanh thư giãn' : 'Bật âm thanh thư giãn');
    statusBtn.classList.toggle('on', playing);
    statusText.textContent = mode === 'ambient' ? 'Đang phát: Ambient thư giãn · chạm để tắt'
      : mode === 'music' ? 'Đang phát: Nhạc nền lặp · chạm để tắt'
      : 'Âm thanh đang tắt — chạm loa để nghe thử';
    const labels = {
      ambient: ['● Đang phát ambient — chạm để tắt', '▶ Nghe thử ambient'],
      music: ['● Đang phát nhạc nền — chạm để tắt', '▶ Nghe thử nhạc nền'],
      off: ['● Đang chọn: yên tĩnh', '○ Chọn yên tĩnh (tắt tiếng)']
    };
    cards.forEach(c => {
      const m = c.dataset.soundMode;
      const active = m === mode;
      c.classList.toggle('selected', active);
      c.setAttribute('aria-pressed', active ? 'true' : 'false');
      const st = c.querySelector('[data-sc-state]');
      if (st && labels[m]) st.textContent = active ? labels[m][0] : labels[m][1];
    });
  }
  function startMode(next) {
    if (!ensureCtx()) return;
    stopAllNodes();
    mode = next;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);
    if (next === 'ambient') { startNoise(); startPad(0.045); scheduleChime(); }
    if (next === 'music') { startPad(0.06); startMelody(); }
    updateUI();
  }
  function stopSound() {
    mode = 'off';
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      const nodesToStop = liveNodes.slice();
      setTimeout(() => { nodesToStop.forEach(n => { try { if (n.stop) n.stop(); } catch (e) {} }); }, 800);
    }
    clearTimers(); padNodes = [];
    updateUI();
  }
  btn.addEventListener('click', () => { if (mode === 'off') startMode('ambient'); else stopSound(); });
  statusBtn.addEventListener('click', () => { if (mode === 'off') startMode('ambient'); else stopSound(); });
  cards.forEach(c => c.addEventListener('click', () => {
    const m = c.dataset.soundMode;
    if (m === 'off' || m === mode) stopSound(); else startMode(m);
  }));
  if (volRange) volRange.addEventListener('input', () => {
    volume = (+volRange.value) / 100;
    if (volVal) volVal.textContent = volRange.value + '%';
    if (ctx && master && mode !== 'off') {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.15);
    }
  });
  updateUI();
})();


/* ---------------- Product popup data ---------------- */
const PRODUCTS = {
  candle: {
    title: 'Nến thơm 8 mùi hương bản địa',
    sub: 'Cốc nến làm từ gốm và mùi hương Sứ tự nhiên',
    photo: 'assets/images/popup-candle-main.jpg',
    pills: ['Gốm 275 gr', 'Thủy Tinh 240gr', 'Thủy Tinh 170gr'],
    thumbs: [
      { photo: 'assets/images/popup-candle-main.jpg', title: 'Nến thơm 8 mùi hương bản địa', sub: 'Cốc nến làm từ gốm và mùi hương Sứ tự nhiên' },
      { photo: 'assets/images/popup-candle-dinhhuong.jpg', title: 'Nến thơm 8 mùi hương bản địa', sub: 'Cốc nến làm từ gốm và mùi hương Đinh Hương tự nhiên' },
      { photo: 'assets/images/popup-candle-nhai.jpg', title: 'Nến thơm 8 mùi hương bản địa', sub: 'Cốc nến làm từ gốm và mùi hương Nhài tự nhiên' },
      { photo: 'assets/images/popup-candle-que.jpg', title: 'Nến thơm 8 mùi hương bản địa', sub: 'Cốc nến làm từ gốm và mùi hương Quế tự nhiên' },
      { photo: 'assets/images/popup-candle-sen.jpg', title: 'Nến thơm 8 mùi hương bản địa', sub: 'Cốc nến làm từ gốm và mùi hương Sen tự nhiên' }
    ]
  },
  oil: {
    title: 'Tinh dầu thơm Cố Đô',
    sub: 'Đinh Hương — tinh dầu mùi gỗ quý hiếm.',
    photo: 'assets/images/popup-oil-main.jpg',
    pills: ['50ml', '20ml'],
    thumbs: [
      { photo: 'assets/images/popup-oil-main.jpg', title: 'Tinh dầu thơm Cố Đô', sub: 'Đinh Hương — tinh dầu mùi gỗ quý hiếm.' },
      { photo: 'assets/images/popup-oil-tram.jpg', title: 'Tinh dầu thơm Cố Đô', sub: 'Tràm — tinh dầu mùi gỗ ấm áp, thư giãn.' },
      { photo: 'assets/images/popup-oil-tung.jpg', title: 'Tinh dầu thơm Cố Đô', sub: 'Tùng — tinh dầu mùi gỗ thanh mát, trong lành.' },
      { photo: 'assets/images/popup-oil-que.jpg', title: 'Tinh dầu thơm Cố Đô', sub: 'Quế — tinh dầu mùi quế cay ấm, đậm hương Cố Đô.' },
      { photo: 'assets/images/popup-oil-sachanh.jpg', title: 'Tinh dầu thơm Cố Đô', sub: 'Sả Chanh — tinh dầu tươi mát, sảng khoái.' }
    ]
  },
  caotram: {
    title: 'Cao Tràm Thảo Mộc',
    sub: 'Cô đặc từ tinh túy tràm Huế và thảo mộc tự nhiên — dịu ấm, lành tính cho những ngày trở gió, tiện mang theo bên mình.',
    photo: 'assets/images/popup-caotram-30g.png',
    pills: ['30g', '10g'],
    pillPhotos: ['assets/images/popup-caotram-30g.png', 'assets/images/popup-caotram-10g.jpg'],
    thumbs: []
  }
};

/* ---------------- Combo popup data ---------------- */
const COMBOS = {
  combo1: {
    photo: 'assets/images/featured-gift.jpg',
    alt: 'Combo 1 — Hộp quà sang trọng',
    rows: [
      { head: 'Cốc nến & hộp diêm thủ công', body: 'Một cốc nến thơm cao cấp của An Nhiên Cố Đô (mùi hương tùy chọn) kèm hộp diêm thủ công, tiện dụng mỗi khi thắp nến.' },
      { head: 'Thiệp cảm ơn & hướng dẫn sử dụng', body: 'Thiệp cảm ơn viết tay cùng tờ hướng dẫn sử dụng và bảo quản sản phẩm, giúp món quà thêm trọn vẹn và tinh tế.' },
      { head: 'Hộp & đồ trang trí', body: 'Hộp quà sang trọng, trang trí chỉn chu với hoa khô và phụ kiện mang dấu ấn Cố Đô — sẵn sàng để trao tặng ngay.' }
    ]
  },
  combo2: {
    photo: 'assets/images/combo-2.jpg',
    alt: 'Combo 2 — Tri ân thầy cô, ưu đãi đặc biệt 20/11',
    rows: [
      { head: 'Cốc nến & hộp diêm thủ công', body: 'Một cốc nến thơm cao cấp của An Nhiên Cố Đô (mùi hương tùy chọn) kèm hộp diêm thủ công, tiện dụng mỗi khi thắp nến.' },
      { head: 'Thiệp cảm ơn & hướng dẫn sử dụng', body: 'Thiệp cảm ơn viết tay cùng tờ hướng dẫn sử dụng và bảo quản sản phẩm, giúp món quà thêm trọn vẹn và tinh tế.' },
      { head: 'Quà tặng kèm', body: 'Ưu đãi đặc biệt 20/11: tặng kèm Cao Tràm và Tinh dầu khi mua combo. Nến thơm cao cấp 550.000đ giảm còn 436.000đ.' }
    ]
  }
};

/* ---------------- Modal helpers ---------------- */
const productModal = document.getElementById('productModal');
const comboModal = document.getElementById('comboModal');
let lastFocus = null;

function openOverlay(overlay) {
  lastFocus = document.activeElement;
  overlay.hidden = false;
  document.body.classList.add('no-scroll');
  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}
function closeOverlay(overlay) {
  overlay.hidden = true;
  document.body.classList.remove('no-scroll');
  if (lastFocus) lastFocus.focus();
}
[productModal, comboModal].forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(overlay); });
  overlay.querySelector('[data-close]').addEventListener('click', () => closeOverlay(overlay));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!productModal.hidden) closeOverlay(productModal);
    if (!comboModal.hidden) closeOverlay(comboModal);
  }
});

/* ---------------- Product popup ---------------- */
const pmPhoto = document.getElementById('pmPhoto');
const pmTitle = document.getElementById('pmTitle');
const pmSub = document.getElementById('pmSub');
const pmPills = document.getElementById('pmPills');
const pmThumbs = document.getElementById('pmThumbs');
const pmThumbsLabel = document.getElementById('pmThumbsLabel');

function openProduct(key) {
  const p = PRODUCTS[key];
  if (!p) return;
  pmPhoto.src = p.photo;
  pmPhoto.alt = p.title;
  pmPhoto.classList.toggle('pm-photo--caotram', key === 'caotram');
  pmTitle.textContent = p.title;
  pmSub.textContent = p.sub;

  pmPills.innerHTML = '';
  p.pills.forEach((label, i) => {
    const b = document.createElement('button');
    b.className = 'pm-pill' + (i === 0 ? ' active' : '');
    b.textContent = label;
    b.addEventListener('click', () => {
      pmPills.querySelectorAll('.pm-pill').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      if (p.pillPhotos) { pmPhoto.src = p.pillPhotos[i]; }
    });
    pmPills.appendChild(b);
  });

  pmThumbs.innerHTML = '';
  pmThumbsLabel.style.display = p.thumbs.length ? '' : 'none';
  p.thumbs.forEach((t, i) => {
    const img = document.createElement('img');
    img.className = 'pm-thumb' + (i === 0 ? ' active' : '');
    img.src = t.photo;
    img.alt = t.title;
    img.addEventListener('click', () => {
      pmPhoto.src = t.photo;
      pmPhoto.alt = t.title;
      pmTitle.textContent = t.title;
      pmSub.textContent = t.sub;
      pmThumbs.querySelectorAll('.pm-thumb').forEach(x => x.classList.remove('active'));
      img.classList.add('active');
    });
    pmThumbs.appendChild(img);
  });

  openOverlay(productModal);
}

/* ---------------- Combo popup ---------------- */
const cmPhoto = document.getElementById('cmPhoto');
const cmAccordions = document.getElementById('cmAccordions');

function openCombo(key) {
  const c = COMBOS[key];
  if (!c) return;
  cmPhoto.src = c.photo;
  cmPhoto.alt = c.alt;
  cmAccordions.innerHTML = '';
  c.rows.forEach((row, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'accordion' + (idx === 0 ? ' open' : '');
    const head = document.createElement('button');
    head.className = 'accordion-head';
    head.innerHTML = '<span></span><span class="chev" aria-hidden="true"></span>';
    head.querySelector('span').textContent = row.head;
    const body = document.createElement('div');
    body.className = 'accordion-body';
    body.innerHTML = '<p></p>';
    body.querySelector('p').textContent = row.body;
    if (idx === 0) requestAnimationFrame(() => { body.style.maxHeight = body.scrollHeight + 'px'; });
    head.addEventListener('click', () => {
      const isOpen = wrap.classList.toggle('open');
      body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0px';
    });
    wrap.appendChild(head);
    wrap.appendChild(body);
    cmAccordions.appendChild(wrap);
  });
  openOverlay(comboModal);
}

/* ---------------- Triggers ---------------- */
document.querySelectorAll('[data-open-modal]').forEach(el => {
  el.addEventListener('click', () => {
    const key = el.dataset.openModal;
    if (key === 'combo1' || key === 'combo2') openCombo(key);
    else openProduct(key);
  });
  if (el.getAttribute('role') === 'button') {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  }
});
document.querySelectorAll('[data-scroll-to]').forEach(el => {
  el.addEventListener('click', () => {
    const target = document.querySelector(el.dataset.scrollTo);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
  });
});

/* ---------------- FAQ ---------------- */
const FAQ_ANSWERS = [
  { title: 'Làm sao để chọn mùi hương phù hợp', body: 'Hãy bắt đầu từ không gian và cảm xúc bạn muốn tạo ra: Sen và Nhài nhẹ nhàng cho phòng ngủ, Sứ và Tràm giúp thư giãn sau ngày dài, Quế và Đinh Hương ấm cúng cho phòng khách, còn Bưởi và Chanh Sả tươi mát cho góc làm việc. Nếu phân vân, bạn có thể bắt đầu với các mùi được yêu thích nhất là Sứ, Sen và Tràm — hoặc chọn combo để trải nghiệm nhiều mùi hương cùng lúc.' },
  { title: 'Nến thơm có thời gian đốt bao lâu?', body: 'Thời gian đốt tùy thuộc vào dung tích cốc nến và cách sử dụng. Với cốc nến gốm 170g và 240g, bạn nên đốt mỗi lần khoảng 2–3 giờ để mặt sáp tan đều, tránh tạo “hố” giữa nến. Bảo quản đúng cách và cắt bấc trước mỗi lần đốt sẽ giúp nến cháy lâu và thơm đều hơn.' },
  { title: 'Sử dụng và bảo quản nến thơm như thế nào?', body: 'Trước mỗi lần đốt, hãy cắt bấc còn khoảng 0,5cm và đặt nến trên bề mặt phẳng, tránh gió lùa. Đốt đến khi lớp sáp trên mặt tan đều rồi tắt nến bằng cách đậy nắp hoặc dùng dụng cụ dập lửa. Khi không sử dụng, đậy nắp và để nến nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp để giữ trọn mùi hương.' },
  { title: 'Tinh dầu được sử dụng như thế nào?', body: 'Nhỏ 3–5 giọt tinh dầu vào máy xông hoặc đèn khuếch tán có sẵn nước, hương thơm sẽ lan tỏa khắp không gian. Bạn cũng có thể nhỏ vài giọt lên đá khuếch tán, gỗ thơm hoặc vào nước lau nhà. Tránh bôi trực tiếp lên da khi chưa pha loãng và để xa tầm tay trẻ em.' },
  { title: 'Tôi có thể chọn sản phẩm để làm quà tặng không?', body: 'Hoàn toàn có thể. Bạn có thể tự chọn nến thơm, tinh dầu hoặc cao tràm để kết hợp thành hộp quà, hoặc chọn sẵn các combo quà tặng của An Nhiên Cố Đô — gồm cốc nến, hộp diêm thủ công, thiệp cảm ơn và hộp trang trí, phù hợp tặng người thân, thầy cô và bạn bè trong các dịp đặc biệt.' },
  { title: 'Máy xông là sản phẩm đi kèm hay phải mua ngoài?', body: 'Máy xông không đi kèm mặc định trong các combo nến thơm và tinh dầu, bạn có thể mua riêng để sử dụng cùng tinh dầu. Nếu chưa có máy xông, bạn vẫn có thể khuếch tán tinh dầu bằng đá thơm, gỗ khuếch tán hoặc đèn đốt nến.' },
  { title: 'Nếu sản phẩm bị hư hỏng khi nhận hàng, tôi cần làm gì?', body: 'Bạn hãy quay video hoặc chụp ảnh lại tình trạng sản phẩm ngay khi mở hộp và liên hệ An Nhiên Cố Đô qua điện thoại 096.424.2256 hoặc email annhiencodo.mst@gmail.com. Sản phẩm hư hỏng do vận chuyển sẽ được hỗ trợ đổi mới theo chính sách của cửa hàng.' }
];
const faqTitle = document.getElementById('faqAnswerTitle');
const faqBody = document.getElementById('faqAnswerBody');
function showFaq(i) {
  const a = FAQ_ANSWERS[i];
  if (!a) return;
  faqBody.classList.add('fading');
  setTimeout(() => {
    faqTitle.textContent = a.title;
    faqBody.textContent = a.body;
    faqBody.classList.remove('fading');
  }, 180);
  document.querySelectorAll('.faq-q').forEach((q, k) => q.classList.toggle('active', k === i));
}
document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => showFaq(+q.dataset.faq)));
faqBody.textContent = FAQ_ANSWERS[0].body;

/* ---------------- Scroll reveal ---------------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
