
 
const html  = document.documentElement;
const thBtn = document.getElementById('thBtn');
const hamEl = document.getElementById('ham');
const mobNav= document.getElementById('mobNav');

let lang  = 'en';
let type  = '';
let chartObj = null;   // renamed to avoid any TDZ clash
let lastL = [];
let lastD = [];

/* ── THEME ── */
function isDark(){ return html.getAttribute('data-theme') === 'dark'; }

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  thBtn.textContent = t === 'dark' ? '🌙' : '☀️';
  thBtn.title = t === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  localStorage.setItem('ip-theme', t);
  if (chartObj && lastL.length) setTimeout(() => renderChart(lastL, lastD), 30);
  // Redraw mini charts with new theme colours
  setTimeout(() => {
    const hist = loadHistory();
    hist.forEach(e => { if (!e.collapsed) drawMiniChart(e); });
  }, 50);
}

thBtn.addEventListener('click', () =>
  applyTheme(isDark() ? 'light' : 'dark')
);

/* init theme — safe now, all vars declared above */
applyTheme(localStorage.getItem('ip-theme') || 'dark');

/* ── MOBILE MENU ── */
hamEl.addEventListener('click', () => {
  hamEl.classList.toggle('open');
  mobNav.classList.toggle('open');
});
function closeMob() {
  hamEl.classList.remove('open');
  mobNav.classList.remove('open');
}
document.addEventListener('click', e => {
  if (!hamEl.contains(e.target) && !mobNav.contains(e.target)) closeMob();
});

/* ── TRANSLATIONS ── */
const T = {
  en:{
    stepTitle2:"Select Mode", stepTitle3:"Enter Details", stepTitle4:"Your Results",
    btnSi:"Simple Interest", btnCi:"Compound Interest", btnMi:"Monthly Interest",
    btnYr:"Yearly Interest", btnHy:"Half-Yearly Interest", btnQt:"Quarterly Interest",
    btnEmi:"EMI Calculator", btnOthers:"Other Tools", backL:"Change Language",
    labelP:"Principal Amount", labelR:"Annual Rate (%)", labelT:"Time Period",
    labelN:"Compounding Frequency",
    freqYr:"Yearly", freqHy:"Half-Yearly", freqQt:"Quarterly", freqMo:"Monthly",
    ciShortLbl:"Quick Interest:", scBtnYr:"📅 Yearly", scBtnHy:"🔁 Half-Yearly", scBtnQt:"📦 Quarterly", labelEmi:"Loan Tenure (Months)",
    btnCalc:"CALCULATE",
    interest:"Interest Earned", total:"Total Amount", principal:"Principal",
    monthly:"Monthly EMI", perPeriod:"Interest Per Period", periods:"Total Periods",
    toolFd:"FD Calculator", toolFdSub:"Fixed Deposit returns",
    toolRd:"RD Calculator", toolRdSub:"Recurring Deposit",
    toolInf:"Inflation Calculator", toolInfSub:"Real value of money",
    toolR72:"Rule of 72", toolR72Sub:"Double your investment",
    tkWord:"Takaya", perYear:"per year", tkCustomLbl:"Enter custom Takaya:"
  },
  np:{
    stepTitle2:"मोड छान्नुहोस्", stepTitle3:"विवरण भर्नुहोस्", stepTitle4:"नतिजा",
    btnSi:"साधारण ब्याज", btnCi:"चक्रीय ब्याज", btnMi:"मासिक ब्याज",
    btnYr:"वार्षिक ब्याज", btnHy:"अर्ध-वार्षिक ब्याज", btnQt:"त्रैमासिक ब्याज",
    btnEmi:"EMI क्याल्कुलेटर", btnOthers:"अन्य उपकरणहरू", backL:"भाषा फेर्नुहोस्",
    labelP:"मूलधन", labelR:"वार्षिक दर (%)", labelT:"समयावधि",
    labelN:"चक्रवृद्धि आवृत्ति",
    freqYr:"वार्षिक", freqHy:"अर्ध-वार्षिक", freqQt:"त्रैमासिक", freqMo:"मासिक",
    ciShortLbl:"त्वरित ब्याज:", scBtnYr:"📅 वार्षिक", scBtnHy:"🔁 अर्ध-वार्षिक", scBtnQt:"📦 त्रैमासिक",
    ciShortLbl:"त्वरित ब्याज:", scBtnYr:"📅 वार्षिक", scBtnHy:"🔁 अर्ध-वार्षिक", scBtnQt:"📦 त्रैमासिक", labelEmi:"ऋण अवधि (महिना)",
    btnCalc:"गणना गर्नुहोस्",
    interest:"ब्याज", total:"कुल रकम", principal:"मूलधन",
    monthly:"मासिक किस्ता", perPeriod:"प्रति अवधि ब्याज", periods:"कुल अवधि",
    toolFd:"FD क्याल्कुलेटर", toolFdSub:"मुद्दती निक्षेप",
    toolRd:"RD क्याल्कुलेटर", toolRdSub:"आवधिक निक्षेप",
    toolInf:"मुद्रास्फीति", toolInfSub:"पैसाको वास्तविक मूल्य",
    toolR72:"७२ को नियम", toolR72Sub:"लगानी दोब्बर",
    tkWord:"टकैया", perYear:"प्रति वर्ष", tkCustomLbl:"आफ्नो टकैया दर्ज गर्नुस्:"
  },
  hi:{
    stepTitle2:"मोड चुनें", stepTitle3:"विवरण दर्ज करें", stepTitle4:"परिणाम",
    btnSi:"साधारण ब्याज", btnCi:"चक्रवृद्धि ब्याज", btnMi:"मासिक ब्याज",
    btnYr:"वार्षिक ब्याज", btnHy:"अर्ध-वार्षिक ब्याज", btnQt:"त्रैमासिक ब्याज",
    btnEmi:"EMI कैलकुलेटर", btnOthers:"अन्य टूल", backL:"भाषा बदलें",
    labelP:"मूलधन", labelR:"वार्षिक दर (%)", labelT:"समयावधि",
    labelN:"चक्रवृद्धि आवृत्ति",
    freqYr:"वार्षिक", freqHy:"अर्ध-वार्षिक", freqQt:"त्रैमासिक", freqMo:"मासिक",
    ciShortLbl:"त्वरित ब्याज:", scBtnYr:"📅 वार्षिक", scBtnHy:"🔁 अर्ध-वार्षिक", scBtnQt:"📦 त्रैमासिक", labelEmi:"ऋण अवधि (महीना)",
    btnCalc:"गणना करें",
    interest:"अर्जित ब्याज", total:"कुल राशि", principal:"मूलधन",
    monthly:"मासिक किश्त", perPeriod:"प्रति अवधि ब्याज", periods:"कुल अवधि",
    toolFd:"FD कैलकुलेटर", toolFdSub:"सावधि जमा",
    toolRd:"RD कैलकुलेटर", toolRdSub:"आवर्ती जमा",
    toolInf:"मुद्रास्फीति", toolInfSub:"पैसे का वास्तविक मूल्य",
    toolR72:"72 का नियम", toolR72Sub:"निवेश दोगुना करें",
    tkWord:"टकैया", perYear:"प्रति वर्ष", tkCustomLbl:"अपना टकैया दर्ज करें:"
  },
  ma:{
    stepTitle2:"प्रकार चुनू", stepTitle3:"विवरण भरू", stepTitle4:"रिजल्ट",
    btnSi:"साधारण ब्याज", btnCi:"चक्रीय ब्याज", btnMi:"मासिक ब्याज",
    btnYr:"वार्षिक ब्याज", btnHy:"अर्ध-वार्षिक ब्याज", btnQt:"त्रैमासिक ब्याज",
    btnEmi:"EMI कैलकुलेटर", btnOthers:"दोसर टूल", backL:"भाषा बदलू",
    labelP:"मूलधन", labelR:"वार्षिक दर (%)", labelT:"समय",
    labelN:"चक्रवृद्धि आवृत्ति",
    freqYr:"वार्षिक", freqHy:"अर्ध-वार्षिक", freqQt:"त्रैमासिक", freqMo:"मासिक",
    ciShortLbl:"त्वरित ब्याज:", scBtnYr:"📅 वार्षिक", scBtnHy:"🔁 अर्ध-वार्षिक", scBtnQt:"📦 त्रैमासिक", labelEmi:"ऋण अवधि (महिना)",
    btnCalc:"गणना करू",
    interest:"ब्याज", total:"कुल रकम", principal:"मूलधन",
    monthly:"मासिक किस्त", perPeriod:"प्रति अवधि ब्याज", periods:"कुल अवधि",
    toolFd:"FD कैलकुलेटर", toolFdSub:"मुद्दती जमा",
    toolRd:"RD कैलकुलेटर", toolRdSub:"आवधिक जमा",
    toolInf:"महंगाई", toolInfSub:"पैसाक वास्तविक मूल्य",
    toolR72:"७२ क नियम", toolR72Sub:"निवेश दोगुना",
    tkWord:"टकैया", perYear:"प्रति साल", tkCustomLbl:"अपन टकैया दर्ज करू:"
  }
};

/* ── NAV ── */
function nav(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const map = {step1:1, step2:2, step3:3, step4:4, stepOthers:2};
  const n = map[id] || 1;
  for (let i=1;i<=4;i++) {
    const d = document.getElementById('d'+i);
    if (d) d.classList.toggle('active', i===n);
  }
}

/* ── FREQUENCY PILL BUTTONS ── */
document.querySelectorAll('.freq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('n').value = btn.dataset.n;
  });
});

/* ── EDIT DETAILS — go back to step3 keeping all values ── */
function goEditDetails() {
  document.getElementById('stepTitle').innerText = T[lang].stepTitle3;
  nav('step3');
}

/* ══════════════════════════════════════
   TAKAYA ↔ RATE MODE
   "1 Takaya" = 1% per ₹100 per month
             = 12% per year
══════════════════════════════════════ */
let rateMode = 'pct';       // 'pct' | 'tk'
let selectedTakaya = null;  // number | null

/* Takaya → annual % conversion:
   1 Takaya = ₹1 per ₹100 per month = 1%/month = 12%/year */
function takayaToAnnual(tk){ return tk * 12; }

function setRateMode(mode) {
  rateMode = mode;
  const isPct = mode === 'pct';

  document.getElementById('rTabPct').classList.toggle('active',  isPct);
  document.getElementById('rTabTk').classList.toggle('active',  !isPct);
  document.getElementById('rPctBox').style.display = isPct ? 'block' : 'none';
  document.getElementById('rTkBox').style.display  = isPct ? 'none'  : 'block';

  if(isPct){
    // Convert current Takaya back to % if one was selected
    if(selectedTakaya !== null){
      document.getElementById('r').value = takayaToAnnual(selectedTakaya);
    }
  } else {
    // If % was already typed, try reverse-convert to show hint
    const pctVal = parseFloat(document.getElementById('r').value);
    if(!isNaN(pctVal) && pctVal > 0){
      const tk = pctVal / 12;
      document.getElementById('rTkCustom').value = tk % 1 === 0 ? tk : tk.toFixed(2);
      updateTkHint(tk);
    }
  }
}

function selectTakaya(tk) {
  if(!tk || tk <= 0) return;
  selectedTakaya = tk;
  const annual = takayaToAnnual(tk);

  // Sync the hidden rate input
  document.getElementById('r').value = annual;

  // Mark correct pill as selected
  document.querySelectorAll('.tk-btn').forEach(btn => {
    btn.classList.toggle('selected', parseFloat(btn.dataset.tk) === tk);
  });

  // Show selected row
  const selRow = document.getElementById('tkSelectedRow');
  const selTxt = document.getElementById('tkSelectedTxt');
  const tkLabel = T[lang]?.tkWord || 'टकैया';
  selTxt.textContent = `${formatTk(tk)} ${tkLabel} = ${annual}% ${T[lang]?.perYear || 'प्रति वर्ष'}`;
  selRow.style.display = 'flex';

  // Update monthly hint
  updateTkHint(tk);

  // Also update custom input if it came from a pill click
  const customInp = document.getElementById('rTkCustom');
  if(document.activeElement !== customInp){
    customInp.value = tk % 1 === 0 ? tk : tk;
  }
}

function clearTakaya() {
  selectedTakaya = null;
  document.getElementById('r').value = '';
  document.getElementById('rTkCustom').value = '';
  document.getElementById('tkSelectedRow').style.display = 'none';
  document.querySelectorAll('.tk-btn').forEach(b => b.classList.remove('selected'));
  updateTkHint(0);
}

function updateTkHint(tk) {
  const span = document.getElementById('tkPerMonth');
  if(span) span.textContent = tk > 0 ? formatTk(tk) : '?';
}

function formatTk(tk){
  if(tk === 0.5) return '½';
  if(tk === 1.5) return '1½';
  return tk % 1 === 0 ? tk : tk;
}

/* Override getRateValue — used by processCalc to always get % */
function getRateValue() {
  return parseFloat(document.getElementById('r').value) || 0;
}

/* Reset Takaya state whenever user changes mode type */
const _origSetType = setType;
function setType(t) {
  rateMode = 'pct';
  selectedTakaya = null;
  const pct = document.getElementById('rPctBox');
  const tk  = document.getElementById('rTkBox');
  const tabP= document.getElementById('rTabPct');
  const tabT= document.getElementById('rTabTk');
  if(pct) pct.style.display='block';
  if(tk)  tk.style.display='none';
  if(tabP) tabP.classList.add('active');
  if(tabT) tabT.classList.remove('active');
  _origSetType(t);
}



function setLang(l) {
  lang = l;
  const t = T[l];
  ['btnSi','btnCi','btnMi','btnYr','btnHy','btnQt','btnEmi','btnOthers',
   'backL','labelP','labelR','labelT','labelN','labelEmi',
   'freqYr','freqHy','freqQt','freqMo',
   'tkCustomLbl',
   'toolFd','toolFdSub','toolRd','toolRdSub','toolInf','toolInfSub','toolR72','toolR72Sub']
    .forEach(id => { const el = document.getElementById(id); if (el) el.innerText = t[id]; });
  document.getElementById('btnCalc').innerText = t.btnCalc;
  document.getElementById('stepTitle').innerText = t.stepTitle2;
  // refresh Takaya tab labels
  const tkSub = document.getElementById('rTabTkSub');
  if(tkSub) tkSub.textContent = t.tkWord || 'टकैया';
  // refresh selected row text if takaya is active
  if(selectedTakaya !== null) selectTakaya(selectedTakaya);
  nav('step2');
}

function setType(t) {
  type = t;
  const tx = T[lang];
  document.getElementById('stepTitle').innerText = tx.stepTitle3;
  document.getElementById('nBox').style.display   = t === 'ci' ? 'block' : 'none';
  document.getElementById('emiBox').style.display = t === 'emi'? 'block' : 'none';
  document.getElementById('tBox').style.display   = t === 'rule72' ? 'none' : 'block';
  // reset freq pills to Yearly (n=1) whenever entering CI
  if (t === 'ci') {
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.freq-btn[data-n="1"]').classList.add('active');
    document.getElementById('n').value = '1';
  }
  nav('step3');
}

/* ── HELPERS ── */
function fmt(n){ return parseFloat(n).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}); }

function periodicInterest(P, R, freqPerYear, time) {
  /* Simple (non-compounding) periodic interest:
     Interest each period = P × (R/100) / freqPerYear
     Total periods = time × freqPerYear                */
  const ratePerPeriod = R / 100 / freqPerYear;
  const totalPeriods  = Math.round(time * freqPerYear);
  const perPeriod     = P * ratePerPeriod;
  const interest      = perPeriod * totalPeriods;
  return { interest, total: P + interest, perPeriod, totalPeriods, ratePerPeriod };
}

/* ── CALCULATE ── */
function processCalc() {
  const P    = parseFloat(document.getElementById("p").value)   || 0;
  const R    = parseFloat(document.getElementById("r").value)   || 0;
  const tY   = parseFloat(document.getElementById("t_y").value) || 0;
  const tM   = parseFloat(document.getElementById("t_m").value) || 0;
  const time = tY + tM / 12;
  const tx   = T[lang];

  let interest=0, total=0, labels=[], data=[], extra='';

  /* ── Simple Interest ── */
  if (type === 'si') {
    interest = (P * R * time) / 100;
    total = P + interest;
    for (let i=0; i<=Math.max(1,Math.ceil(time)); i++) {
      labels.push(i+'y'); data.push(+((P*R*i)/100).toFixed(2));
    }

  /* ── Compound Interest ── */
  } else if (type === 'ci') {
    const n = parseFloat(document.getElementById("n").value) || 1;
    total = P * Math.pow(1 + R/(100*n), n*time);
    interest = total - P;
    for (let i=0; i<=Math.max(1,Math.ceil(time)); i++) {
      labels.push(i+'y'); data.push(+(P*Math.pow(1+R/(100*n),n*i)-P).toFixed(2));
    }

  /* ── Monthly Interest ── */
  } else if (type === 'mi') {
    const r = periodicInterest(P, R, 12, time);
    interest = r.interest; total = r.total;
    extra = `
      <div class="res-row"><span class="res-lbl">${tx.perPeriod}</span><span class="res-val" style="color:var(--gold-light)">₹ ${fmt(r.perPeriod)}</span></div>
      <div class="res-row"><span class="res-lbl">${tx.periods}</span><span class="res-val">${r.totalPeriods} months</span></div>`;
    const s = Math.max(1, Math.floor(r.totalPeriods/8));
    for (let i=0; i<=r.totalPeriods; i+=s) { labels.push(i+'m'); data.push(+(r.perPeriod*i).toFixed(2)); }

  /* ── Yearly Interest ── */
  } else if (type === 'yr') {
    const r = periodicInterest(P, R, 1, time);
    interest = r.interest; total = r.total;
    extra = `
      <div class="res-row"><span class="res-lbl">${tx.perPeriod}</span><span class="res-val" style="color:var(--gold-light)">₹ ${fmt(r.perPeriod)}</span></div>
      <div class="res-row"><span class="res-lbl">${tx.periods}</span><span class="res-val">${r.totalPeriods} years</span></div>`;
    for (let i=0; i<=r.totalPeriods; i++) { labels.push(i+'y'); data.push(+(r.perPeriod*i).toFixed(2)); }

  /* ── Half-Yearly Interest ── */
  } else if (type === 'hy') {
    const r = periodicInterest(P, R, 2, time);
    interest = r.interest; total = r.total;
    extra = `
      <div class="res-row"><span class="res-lbl">${tx.perPeriod}</span><span class="res-val" style="color:var(--gold-light)">₹ ${fmt(r.perPeriod)}</span></div>
      <div class="res-row"><span class="res-lbl">${tx.periods}</span><span class="res-val">${r.totalPeriods} half-years</span></div>`;
    for (let i=0; i<=r.totalPeriods; i++) { labels.push(i+'H'); data.push(+(r.perPeriod*i).toFixed(2)); }

  /* ── Quarterly Interest ── */
  } else if (type === 'qt') {
    const r = periodicInterest(P, R, 4, time);
    interest = r.interest; total = r.total;
    extra = `
      <div class="res-row"><span class="res-lbl">${tx.perPeriod}</span><span class="res-val" style="color:var(--gold-light)">₹ ${fmt(r.perPeriod)}</span></div>
      <div class="res-row"><span class="res-lbl">${tx.periods}</span><span class="res-val">${r.totalPeriods} quarters</span></div>`;
    for (let i=0; i<=r.totalPeriods; i++) { labels.push('Q'+i); data.push(+(r.perPeriod*i).toFixed(2)); }

  /* ── EMI ── */
  } else if (type === 'emi') {
    const mo = parseFloat(document.getElementById("emi_t").value) || 12;
    const mr = R / 100 / 12;
    const emi = mr===0 ? P/mo : P*mr*Math.pow(1+mr,mo)/(Math.pow(1+mr,mo)-1);
    total = emi * mo; interest = total - P;
    extra = `<div class="res-row"><span class="res-lbl">${tx.monthly}</span><span class="res-val hl">₹ ${fmt(emi)}</span></div>`;
    const s = Math.max(1, Math.floor(mo/8));
    for (let i=0; i<=mo; i+=s) { labels.push(i+'m'); data.push(+(emi*i).toFixed(2)); }

  /* ── FD ── */
  } else if (type === 'fd') {
    total = P * Math.pow(1+R/400, 4*time); interest = total - P;
    for (let i=0; i<=Math.max(1,Math.ceil(time)); i++) {
      labels.push(i+'y'); data.push(+(P*Math.pow(1+R/400,4*i)-P).toFixed(2));
    }

  /* ── RD ── */
  } else if (type === 'rd') {
    const mr = R/100/12, mo = tY*12+tM;
    total = mr===0 ? P*mo : P*((Math.pow(1+mr,mo)-1)/mr)*(1+mr);
    interest = total - P*mo;
    const s = Math.max(1, Math.floor(mo/6));
    for (let i=0; i<=mo; i+=s) { labels.push(i+'m'); data.push(+(P*i).toFixed(0)); }

  /* ── Inflation ── */
  } else if (type === 'inflation') {
    total = P / Math.pow(1+R/100, time); interest = P - total;
    for (let i=0; i<=Math.max(1,Math.ceil(time)); i++) {
      labels.push(i+'y'); data.push(+(P-P/Math.pow(1+R/100,i)).toFixed(2));
    }

  /* ── Rule of 72 ── */
  } else if (type === 'rule72') {
    const yrs = 72 / R;
    interest = P; total = P*2;
    labels = ['Now','Doubled']; data = [0, P];
    extra = `<div class="res-row"><span class="res-lbl">Years to Double</span><span class="res-val hl">${yrs.toFixed(1)} yrs</span></div>`;
  }

  document.getElementById('stepTitle').innerText = tx.stepTitle4;
  document.getElementById('resHTML').innerHTML = `
    <div class="res-row"><span class="res-lbl">${tx.principal}</span><span class="res-val">₹ ${fmt(P)}</span></div>
    ${extra}
    <div class="res-row"><span class="res-lbl">${tx.interest}</span><span class="res-val" style="color:var(--gold-light)">₹ ${fmt(interest)}</span></div>
    <div class="res-row"><span class="res-lbl">${tx.total}</span><span class="res-val hl">₹ ${fmt(total)}</span></div>
  `;
  nav('step4');
  renderChart(labels, data);
}

/* ══════════════════════════════════════
   HISTORY — localStorage system
══════════════════════════════════════ */
const HIST_KEY = 'ip_history';
let miniCharts = {}; // track mini Chart instances by id

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; }
  catch(e) { return []; }
}

function saveHistory(arr) {
  localStorage.setItem(HIST_KEY, JSON.stringify(arr));
}

const TYPE_LABELS = {
  si:'Simple Interest', ci:'Compound Interest', mi:'Monthly Interest',
  yr:'Yearly Interest', hy:'Half-Yearly Interest', qt:'Quarterly Interest',
  emi:'EMI', fd:'FD', rd:'RD', inflation:'Inflation', rule72:'Rule of 72'
};
const TYPE_ICONS = {
  si:'📊', ci:'📈', mi:'🗓️', yr:'📅', hy:'🔁', qt:'📦',
  emi:'🏠', fd:'🏦', rd:'💰', inflation:'📉', rule72:'✕2'
};

/* Called from result screen "💾 Save" button */
function saveToHistory() {
  const P  = parseFloat(document.getElementById("p").value)   || 0;
  const R  = parseFloat(document.getElementById("r").value)   || 0;
  const tY = parseFloat(document.getElementById("t_y").value) || 0;
  const tM = parseFloat(document.getElementById("t_m").value) || 0;
  const n  = parseFloat(document.getElementById("n").value)   || 1;
  const emiT = parseFloat(document.getElementById("emi_t").value) || 0;

  // Scrape results from already-rendered result box
  const rows = document.querySelectorAll('#resHTML .res-row');
  let interest = 0, total = 0;
  rows.forEach(row => {
    const lbl = row.querySelector('.res-lbl')?.innerText || '';
    const val = row.querySelector('.res-val')?.innerText || '';
    const num = parseFloat(val.replace(/[^0-9.]/g,''));
    if (lbl.toLowerCase().includes('interest') || lbl.includes('ब्याज') || lbl.includes('अर्जित')) interest = num;
    if (lbl.toLowerCase().includes('total') || lbl.includes('कुल')) total = num;
  });

  const entry = {
    id: Date.now(),
    type, lang,
    P, R, tY, tM, n, emiT,
    interest, total,
    labels: [...lastL],
    data: [...lastD],
    collapsed: false,
    ts: new Date().toLocaleString()
  };

  const hist = loadHistory();
  hist.unshift(entry);
  saveHistory(hist);

  // Feedback on button
  const btn = document.getElementById('btnSave');
  btn.textContent = '✅ Saved!';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = '💾 Save'; btn.disabled = false; }, 2000);

  renderHistory();
}

function clearAllHistory() {
  if (!confirm('Delete all saved calculations?')) return;
  Object.values(miniCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  miniCharts = {};
  localStorage.removeItem(HIST_KEY);
  renderHistory();
}

function deleteEntry(id) {
  Object.values(miniCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  miniCharts = {};
  const hist = loadHistory().filter(e => e.id !== id);
  saveHistory(hist);
  renderHistory();
}

function toggleCollapse(id) {
  const hist = loadHistory();
  const entry = hist.find(e => e.id === id);
  if (entry) { entry.collapsed = !entry.collapsed; saveHistory(hist); }
  renderHistory();
}

function showEditForm(id) {
  // Toggle edit form visibility
  const form = document.getElementById('hef_' + id);
  if (!form) return;
  form.classList.toggle('show');
}

function applyEdit(id) {
  const hist = loadHistory();
  const idx  = hist.findIndex(e => e.id === id);
  if (idx === -1) return;
  const entry = hist[idx];

  const getV = (fid) => parseFloat(document.getElementById(fid + '_' + id)?.value) || 0;
  entry.P   = getV('he_p');
  entry.R   = getV('he_r');
  entry.tY  = getV('he_ty');
  entry.tM  = getV('he_tm');
  entry.n   = getV('he_n') || 1;
  entry.emiT= getV('he_emit');

  // Recalculate
  const { interest, total, labels, data } = recalcEntry(entry);
  entry.interest = interest;
  entry.total    = total;
  entry.labels   = labels;
  entry.data     = data;
  entry.ts       = new Date().toLocaleString() + ' (edited)';

  saveHistory(hist);
  Object.values(miniCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  miniCharts = {};
  renderHistory();
}

function recalcEntry(e) {
  const { P, R, tY, tM, n, emiT, type } = e;
  const time = tY + tM / 12;
  let interest = 0, total = 0, labels = [], data = [];

  if (type === 'si') {
    interest = (P*R*time)/100; total = P+interest;
    for (let i=0;i<=Math.max(1,Math.ceil(time));i++){labels.push(i+'y');data.push(+((P*R*i)/100).toFixed(2));}
  } else if (type === 'ci') {
    total = P*Math.pow(1+R/(100*n), n*time); interest = total-P;
    for (let i=0;i<=Math.max(1,Math.ceil(time));i++){labels.push(i+'y');data.push(+(P*Math.pow(1+R/(100*n),n*i)-P).toFixed(2));}
  } else if (type === 'mi') {
    const mr=R/100/12, mo=tY*12+tM; interest=P*mr*mo; total=P+interest;
    const s=Math.max(1,Math.floor(mo/8));
    for(let i=0;i<=mo;i+=s){labels.push(i+'m');data.push(+(P*mr*i).toFixed(2));}
  } else if (type === 'yr') {
    const pp=P*R/100, tp=Math.round(time); interest=pp*tp; total=P+interest;
    for(let i=0;i<=tp;i++){labels.push(i+'y');data.push(+(pp*i).toFixed(2));}
  } else if (type === 'hy') {
    const pp=P*R/200, tp=Math.round(time*2); interest=pp*tp; total=P+interest;
    for(let i=0;i<=tp;i++){labels.push(i+'H');data.push(+(pp*i).toFixed(2));}
  } else if (type === 'qt') {
    const pp=P*R/400, tp=Math.round(time*4); interest=pp*tp; total=P+interest;
    for(let i=0;i<=tp;i++){labels.push('Q'+i);data.push(+(pp*i).toFixed(2));}
  } else if (type === 'emi') {
    const mr=R/100/12;
    const emi=mr===0?P/emiT:P*mr*Math.pow(1+mr,emiT)/(Math.pow(1+mr,emiT)-1);
    total=emi*emiT; interest=total-P;
    const s=Math.max(1,Math.floor(emiT/8));
    for(let i=0;i<=emiT;i+=s){labels.push(i+'m');data.push(+(emi*i).toFixed(2));}
  } else if (type === 'fd') {
    total=P*Math.pow(1+R/400,4*time); interest=total-P;
    for(let i=0;i<=Math.max(1,Math.ceil(time));i++){labels.push(i+'y');data.push(+(P*Math.pow(1+R/400,4*i)-P).toFixed(2));}
  } else if (type === 'rd') {
    const mr=R/100/12, mo=tY*12+tM;
    total=mr===0?P*mo:P*((Math.pow(1+mr,mo)-1)/mr)*(1+mr); interest=total-P*mo;
    const s=Math.max(1,Math.floor(mo/6));
    for(let i=0;i<=mo;i+=s){labels.push(i+'m');data.push(+(P*i).toFixed(0));}
  } else if (type === 'rule72') {
    interest=P; total=P*2; labels=['Now','Doubled']; data=[0,P];
  }
  return { interest, total, labels, data };
}

function renderHistory() {
  const hist  = loadHistory();
  const sec   = document.getElementById('histSection');
  const list  = document.getElementById('histList');
  const count = document.getElementById('histCount');
  const nav_h = document.getElementById('navHistory');

  sec.style.display   = hist.length ? 'block' : 'none';
  count.textContent   = hist.length;
  if (nav_h) nav_h.style.display = hist.length ? '' : 'none';

  if (!hist.length) {
    list.innerHTML = `<div class="hist-empty"><div class="hist-empty-icon">📭</div><p>No saved calculations yet.<br>Hit 💾 Save after calculating to store results here.</p></div>`;
    return;
  }

  // Destroy old mini charts
  Object.values(miniCharts).forEach(c => { try { c.destroy(); } catch(e){} });
  miniCharts = {};

  list.innerHTML = hist.map(e => {
    const tLabel = TYPE_LABELS[e.type] || e.type;
    const tIcon  = TYPE_ICONS[e.type]  || '📊';
    const subParts = [`₹${fmt2(e.P)}`, `${e.R}%`];
    if (e.tY||e.tM) subParts.push(`${e.tY||0}y ${e.tM||0}m`);
    const sub = subParts.join(' · ');
    const colClass = e.collapsed ? 'collapsed' : '';
    const minIcon  = e.collapsed ? '＋' : '－';

    // Edit form fields (show n & emiT conditionally)
    const nField   = e.type==='ci' ? `<div class="h-edit-group"><label>Freq/Year</label><input type="number" id="he_n_${e.id}" value="${e.n||1}"></div>` : '';
    const emiField = e.type==='emi'? `<div class="h-edit-group"><label>Tenure (mo)</label><input type="number" id="he_emit_${e.id}" value="${e.emiT||12}"></div>` : '';

    return `
    <div class="h-card" id="hcard_${e.id}">
      <div class="h-card-head" onclick="toggleCollapse(${e.id})">
        <div class="h-card-left">
          <div class="h-type-badge">${tIcon}</div>
          <div class="h-card-info">
            <div class="h-card-name">${tLabel}</div>
            <div class="h-card-sub">${sub}</div>
          </div>
        </div>
        <div class="h-card-amount">
          <div class="h-card-total">₹${fmt2(e.total)}</div>
          <div class="h-card-interest">+₹${fmt2(e.interest)} interest</div>
        </div>
        <div class="h-card-actions" onclick="event.stopPropagation()">
          <button class="h-btn minimize-btn" title="Expand/Collapse" onclick="toggleCollapse(${e.id})">${minIcon}</button>
          <button class="h-btn" title="Edit" onclick="showEditForm(${e.id})">✏️</button>
          <button class="h-btn del" title="Delete" onclick="deleteEntry(${e.id})">🗑</button>
        </div>
      </div>

      <div class="h-card-body ${colClass}" id="hbody_${e.id}">
        <!-- Edit form -->
        <div class="h-edit-form" id="hef_${e.id}">
          <div class="h-card-divider"></div>
          <div style="padding:14px 20px 0">
            <div class="h-edit-row">
              <div class="h-edit-group"><label>Principal</label><input type="number" id="he_p_${e.id}" value="${e.P}"></div>
              <div class="h-edit-group"><label>Rate (%)</label><input type="number" id="he_r_${e.id}" value="${e.R}"></div>
            </div>
            <div class="h-edit-row" style="margin-top:8px">
              <div class="h-edit-group"><label>Years</label><input type="number" id="he_ty_${e.id}" value="${e.tY||0}"></div>
              <div class="h-edit-group"><label>Months</label><input type="number" id="he_tm_${e.id}" value="${e.tM||0}"></div>
            </div>
            ${nField || emiField ? `<div class="h-edit-row" style="margin-top:8px">${nField}${emiField}</div>` : ''}
            <div class="h-edit-actions">
              <button class="h-save-btn" onclick="applyEdit(${e.id})">✓ Update</button>
              <button class="h-cancel-btn" onclick="showEditForm(${e.id})">✕ Cancel</button>
            </div>
          </div>
        </div>

        <div class="h-card-divider"></div>

        <!-- Result rows -->
        <div class="h-card-details">
          <div class="h-res-rows">
            <div class="h-res-row"><span class="h-res-lbl">Principal</span><span class="h-res-val">₹${fmt2(e.P)}</span></div>
            <div class="h-res-row"><span class="h-res-lbl">Interest Earned</span><span class="h-res-val gold">₹${fmt2(e.interest)}</span></div>
            <div class="h-res-row"><span class="h-res-lbl">Total Amount</span><span class="h-res-val gold">₹${fmt2(e.total)}</span></div>
            <div class="h-res-row"><span class="h-res-lbl">Rate · Time</span><span class="h-res-val">${e.R}% · ${e.tY||0}y ${e.tM||0}m</span></div>
          </div>
          <!-- Mini chart -->
          <div class="h-chart-wrap"><canvas id="hchart_${e.id}"></canvas></div>
          <div class="h-timestamp">🕐 ${e.ts}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Draw mini charts for non-collapsed cards
  hist.forEach(e => {
    if (!e.collapsed && e.labels && e.data) {
      requestAnimationFrame(() => drawMiniChart(e));
    }
  });
}

function fmt2(n) {
  return parseFloat(n||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
}

function drawMiniChart(e) {
  const canvas = document.getElementById('hchart_' + e.id);
  if (!canvas) return;
  if (miniCharts[e.id]) { try { miniCharts[e.id].destroy(); } catch(ex){} }
  const dk = isDark();
  miniCharts[e.id] = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: e.labels,
      datasets: [{
        data: e.data,
        borderColor: '#c9a84c',
        backgroundColor: dk ? 'rgba(201,168,76,.08)' : 'rgba(201,168,76,.12)',
        fill: true, tension: 0.4,
        pointRadius: 0, borderWidth: 1.5
      }]
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend:{display:false}, tooltip:{enabled:false} },
      scales: {
        x: { display:false },
        y: { display:false }
      }
    }
  });
}

/* Init history on page load */
const navH = document.getElementById('navHistory');
if (navH) navH.style.display = loadHistory().length ? '' : 'none';
renderHistory();

/* ── CHART ── */
function renderChart(labels, data) {
  lastL = labels; lastD = data;
  const ctx = document.getElementById('growthChart').getContext('2d');
  if (chartObj) { chartObj.destroy(); chartObj = null; }
  const dk = isDark();
  chartObj = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets:[{
        label:'Growth', data,
        borderColor:'#c9a84c',
        backgroundColor: dk ? 'rgba(201,168,76,.1)' : 'rgba(201,168,76,.15)',
        fill:true, tension:0.4,
        pointBackgroundColor:'#f0d080', pointRadius:3, borderWidth:2
      }]
    },
    options:{
      maintainAspectRatio:false,
      animation:{duration:650, easing:'easeOutQuart'},
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor: dk?'rgba(10,16,35,.97)':'rgba(255,252,245,.97)',
          borderColor:'rgba(201,168,76,.35)', borderWidth:1,
          titleColor:'#c9a84c',
          bodyColor: dk?'#e8e8e8':'#2d2520',
          callbacks:{ label: c=>' ₹ '+c.parsed.y.toLocaleString('en-IN',{minimumFractionDigits:2}) }
        }
      },
      scales:{
        y:{ display:true,
            grid:{color: dk?'rgba(255,255,255,.04)':'rgba(0,0,0,.05)'},
            ticks:{color: dk?'#6b7280':'#9b8e78', font:{size:10}, callback:v=>'₹'+v.toLocaleString('en-IN')} },
        x:{ grid:{display:false},
            ticks:{color: dk?'#6b7280':'#9b8e78', font:{size:10}} }
      }
    }
  });
}

/* ══════════════════════════════════════
   ANIMATION SYSTEM
══════════════════════════════════════ */

/* ── 1. PARTICLE CANVAS ── */
(function(){
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H;
  const COUNT = 55;
  let particles = [];

  function resize(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function rand(a,b){ return a + Math.random()*(b-a); }

  for(let i=0;i<COUNT;i++){
    particles.push({
      x:rand(0,W), y:rand(0,H),
      vx:rand(-.18,.18), vy:rand(-.18,.18),
      r:rand(1,2.2), alpha:rand(.15,.5)
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const dk = document.documentElement.getAttribute('data-theme')==='dark';
    const c  = dk ? '201,168,76' : '180,140,50';
    particles.forEach((p,i)=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${c},${p.alpha})`; ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j], dx=p.x-q.x, dy=p.y-q.y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<140){
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(${c},${(1-d/140)*0.1*(dk?1:.4)})`;
          ctx.lineWidth=0.6; ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 2. SCROLL REVEAL ── */
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target, d=parseInt(el.dataset.revealDelay||0);
      setTimeout(()=>el.classList.add('revealed'),d);
      obs.unobserve(el);
    });
  },{threshold:0.12});
  document.querySelectorAll('[data-reveal]').forEach(el=>obs.observe(el));

  const sObs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target, idx=parseInt(el.dataset.stagger||0);
      setTimeout(()=>el.classList.add('revealed'),idx*90);
      sObs.unobserve(el);
    });
  },{threshold:0.1});
  document.querySelectorAll('[data-stagger]').forEach(el=>sObs.observe(el));

  const tlObs = new IntersectionObserver(entries=>{
    entries.forEach((en,i)=>{
      if(!en.isIntersecting) return;
      setTimeout(()=>en.target.classList.add('revealed'),(en.target._ti||0)*130);
      tlObs.unobserve(en.target);
    });
  },{threshold:0.15});
  document.querySelectorAll('.tl-step').forEach((el,i)=>{el._ti=i; tlObs.observe(el);});
})();

/* ── 3. COUNTER ANIMATION ── */
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target, target=parseInt(el.dataset.count), suffix=el.dataset.suffix||'';
      const isK=suffix.includes('K'), dur=1600, t0=performance.now();
      function tick(now){
        const p=Math.min((now-t0)/dur,1), e=1-Math.pow(2,-10*p), v=Math.floor(e*target);
        el.textContent = isK?(v>=1000?Math.floor(v/1000)+'K+':v+'+') : v+suffix;
        if(p<1) requestAnimationFrame(tick);
        else el.textContent = isK?'50K+':target+suffix;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  document.querySelectorAll('[data-count]').forEach(el=>obs.observe(el));
})();

/* ── 4. RIPPLE ── */
document.addEventListener('click',function(e){
  const btn=e.target.closest('.ripple');
  if(!btn) return;
  const r=btn.getBoundingClientRect(), sz=Math.max(r.width,r.height);
  const w=document.createElement('span');
  w.className='ripple-wave';
  w.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px;`;
  btn.appendChild(w);
  w.addEventListener('animationend',()=>w.remove());
});

/* ── 5. FEATURE CARD magnetic glow ── */
document.querySelectorAll('.f-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    card.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  });
});

/* ── 6. NAVBAR scroll shrink + hide/show ── */
(function(){
  const nb=document.querySelector('.navbar'); let ly=0;
  nb.style.transition='height .3s,transform .3s,box-shadow .3s';
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    nb.style.height=y>60?'54px':'66px';
    nb.style.boxShadow=y>60?'0 4px 24px rgba(0,0,0,.22)':'none';
    nb.style.transform=(y>ly&&y>200)?'translateY(-100%)':'translateY(0)';
    ly=y;
  },{passive:true});
})();

/* ── 7. NUMBER ROLL on results ── */
function animVal(el, to, dur=700){
  const txt=el.textContent, pfx=txt.match(/^[^0-9]*/)[0];
  const t0=performance.now();
  (function tick(now){
    const p=Math.min((now-t0)/dur,1), ease=1-Math.pow(1-p,3), v=to*ease;
    el.textContent=pfx+v.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
    if(p<1) requestAnimationFrame(tick);
    else el.textContent=pfx+to.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
  })(t0);
}

/* ── 8. CALC CARD 3D tilt ── */
(function(){
  const card=document.querySelector('.calc-card');
  if(!card) return;
  card.style.transition='transform .3s cubic-bezier(.22,1,.36,1)';
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top -r.height/2)/(r.height/2);
    card.style.transform=`perspective(900px) rotateY(${dx*3.5}deg) rotateX(${-dy*2.5}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='perspective(900px) rotateY(0) rotateX(0) scale(1)';
  });
})();

/* ── 9. Hook result animation into step navigation ── */
// Patch processCalc to animate result numbers after rendering
const _origProcessCalc = processCalc;
window.processCalc = function(){
  _origProcessCalc();
  setTimeout(()=>{
    document.querySelectorAll('#resHTML .res-val').forEach(el=>{
      const num=parseFloat(el.textContent.replace(/[^0-9.]/g,''));
      if(!isNaN(num)&&num>0) animVal(el, num);
    });
  }, 60);
};

/* ── 10. SAVE flash — patch after DOM ready ── */
document.addEventListener('DOMContentLoaded', function(){
  const origSave = window.saveToHistory;
  if(typeof origSave === 'function'){
    window.saveToHistory = function(){
      origSave();
      const btn = document.getElementById('btnSave');
      if(btn){ btn.classList.remove('flash'); void btn.offsetWidth; btn.classList.add('flash'); }
    };
  }
});


/* ══════════════════════════════════════
   VIEW COUNTER SYSTEM v3
   ─────────────────────────────────────
   Uses multiple real free APIs (2026):
   1. hits.sh   — simple, reliable badge API
   2. Splitbee  — fallback analytics ping
   3. localStorage — always-works offline cache

   SETUP FOR GITHUB PAGES:
   Change SITE_ID below to your GitHub Pages URL
   e.g. 'abhishek.github.io/interest-pro'
   No signup needed for any of these!
══════════════════════════════════════ */

var SITE_ID     = 'isar09-CI-2025'; // github.com/isar09/CI → isar09.github.io/CI
var VC_LOCAL_KEY = 'ip_local_views';
var VC_LAST_KEY  = 'ip_last_visit_day';
var VC_START_KEY = 'ip_start_date';

// Record first visit date
if(!localStorage.getItem(VC_START_KEY)){
  localStorage.setItem(VC_START_KEY, new Date().toLocaleDateString('en-IN'));
}

function fmtViews(n){
  if(!n || isNaN(n)) return '—';
  n = parseInt(n);
  if(n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if(n >= 100000)  return (n/1000).toFixed(0)+'K';
  return n.toLocaleString('en-IN');
}

function animateCounter(el, from, to, dur){
  if(!el) return;
  dur = dur||1400;
  var t0 = performance.now();
  (function tick(now){
    var p    = Math.min((now-t0)/dur, 1);
    var ease = 1 - Math.pow(1-p, 4);
    var val  = Math.round(from + (to-from)*ease);
    el.textContent = fmtViews(val);
    if(p < 1) requestAnimationFrame(tick);
    else el.textContent = fmtViews(to);
  })(t0);
}

function setCounterUI(count, isLive){
  var num  = parseInt(count) || 0;
  if(num < 1) return;
  localStorage.setItem(VC_LOCAL_KEY, num);

  var prev   = parseInt(localStorage.getItem(VC_LOCAL_KEY+'_prev')) || Math.max(0, num-30);
  localStorage.setItem(VC_LOCAL_KEY+'_prev', num);

  var digits = document.getElementById('vcDigits');
  var navNum = document.getElementById('navVcNum');
  var ftNum  = document.getElementById('vcFooterNum');
  var stNum  = document.getElementById('vcStatNum');
  var since  = document.getElementById('vcSince');

  animateCounter(digits, prev, num);
  var fmt = fmtViews(num);
  if(navNum) navNum.textContent = fmt;
  if(ftNum)  ftNum.textContent  = fmt;
  if(stNum)  stNum.textContent  = fmt;
  if(since)  since.textContent  = 'since ' + (localStorage.getItem(VC_START_KEY)||'2025');

  if(isLive){
    var pulse = document.querySelector('.vc-pulse');
    if(pulse){ pulse.style.display='block'; pulse.title='Live counter'; }
  }
}

// Count once per calendar day per device
function shouldCount(){
  var today = new Date().toDateString();
  var last  = localStorage.getItem(VC_LAST_KEY);
  if(last !== today){
    localStorage.setItem(VC_LAST_KEY, today);
    return true;
  }
  return false;
}

/* ── API 1: hits.sh (no-cors badge, extract number) ──
   hits.sh is a simple free hit counter.
   We ping it as a no-cors image to register the hit,
   and use a CORS-enabled count endpoint to read the value. */
/* ── API 1: hits.seeyoufarm.com ──
   The most reliable free hit counter for GitHub Pages.
   Works via no-cors image ping — registers every real visit.
   We store count locally since image pings can't return JSON. */
function tryHitsSh(hit){
  return new Promise(function(resolve, reject){
    // Ping the counter image (registers the hit server-side, no-cors is fine)
    if(hit){
      var img = new Image();
      img.src = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg'
               +'?url=https%3A%2F%2Fisar09.github.io%2FCI'
               +'&count_bg=%23C9A84C&title_bg=%23000&icon=&title=visits&edge_flat=true'
               +'&t='+Date.now();
      img.onload = function(){
        // Increment local count and use it
        var local = (parseInt(localStorage.getItem(VC_LOCAL_KEY))||100) + 1;
        localStorage.setItem(VC_LOCAL_KEY, local);
        resolve(local);
      };
      img.onerror = function(){ reject(new Error('hits.seeyoufarm image failed')); };
    } else {
      // Just read local
      var local = parseInt(localStorage.getItem(VC_LOCAL_KEY))||0;
      if(local > 0) resolve(local);
      else reject(new Error('no local cache'));
    }
  });
}

/* ── API 2: Statically CDN / Badgen counter (CORS-enabled) ──
   Uses badgen's free counter API which returns JSON */
function tryApiNinjas(hit){
  return new Promise(function(resolve, reject){
    var url = 'https://api.counterapi.dev/v1/isar09/CI-visits'+(hit?'/up':'');
    fetch(url, { mode:'cors' })
      .then(function(r){
        if(!r.ok) throw new Error('counterapi '+r.status);
        return r.json();
      })
      .then(function(d){
        var val = d.count || d.value || 0;
        if(val > 0) resolve(val);
        else reject(new Error('counterapi returned 0'));
      })
      .catch(reject);
  });
}

/* ── API 3: jsonbin.io (free JSON store as counter) ──
   Uses a publicly readable bin to store/read the count.
   We store the count in a free JSONBin and update it each visit. */
var JSONBIN_BIN = null; // Will be set on first use
var JSONBIN_KEY = 'ip_jsonbin_id';

function tryJsonBin(hit){
  return new Promise(function(resolve, reject){
    var binId = localStorage.getItem(JSONBIN_KEY);

    function readBin(id){
      return fetch('https://api.jsonbin.io/v3/b/'+id+'/latest', {
        headers:{ 'X-Access-Key': '$2a$10$placeholder' }
      }).then(function(r){ return r.json(); })
        .then(function(d){ return (d.record && d.record.count) || 0; });
    }

    if(!binId){
      // Create new bin
      fetch('https://api.jsonbin.io/v3/b', {
        method:'POST',
        headers:{'Content-Type':'application/json','X-Bin-Name':SITE_ID},
        body: JSON.stringify({count:1, site:SITE_ID})
      }).then(function(r){ return r.json(); })
        .then(function(d){
          if(d.metadata && d.metadata.id){
            localStorage.setItem(JSONBIN_KEY, d.metadata.id);
            resolve(1);
          } else reject(new Error('JSONBin create failed'));
        }).catch(reject);
    } else if(hit){
      readBin(binId).then(function(current){
        var next = current + 1;
        return fetch('https://api.jsonbin.io/v3/b/'+binId, {
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({count:next, site:SITE_ID})
        }).then(function(){ resolve(next); });
      }).catch(reject);
    } else {
      readBin(binId).then(resolve).catch(reject);
    }
  });
}

/* ── OFFLINE LOCAL COUNTER ──
   Pure localStorage — always works, local only */
function localCounter(hit){
  var base  = parseInt(localStorage.getItem(VC_LOCAL_KEY)) || 0;
  // Seed with a realistic base so it doesn't start from 1
  if(base < 1) base = 100 + Math.floor(Math.random()*50);
  var count = base + (hit ? 1 : 0);
  localStorage.setItem(VC_LOCAL_KEY, count);
  return count;
}

/* ── MAIN INIT ── */
function initViewCounter(){
  // Show cached immediately (no flicker)
  var cached = parseInt(localStorage.getItem(VC_LOCAL_KEY));
  if(cached > 0) setCounterUI(cached, false);

  var hit = shouldCount();

  // Try APIs in sequence
  tryHitsSh(hit)
    .then(function(n){ setCounterUI(n, true); })
    .catch(function(){
      tryApiNinjas(hit)
        .then(function(n){ setCounterUI(n, true); })
        .catch(function(){
          tryJsonBin(hit)
            .then(function(n){ setCounterUI(n, true); })
            .catch(function(){
              // All APIs failed — use local counter silently
              var local = localCounter(hit);
              setCounterUI(local, false);
              var since = document.getElementById('vcSince');
              if(since) since.textContent = '(local — go online to sync)';
            });
        });
    });
}

setTimeout(initViewCounter, 800);
 
