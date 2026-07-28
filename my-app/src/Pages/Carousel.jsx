import { useState, useEffect, useCallback } from "react";
import activeHouseRaw from '/activeHouse.txt?raw';

// Vite glob import — loads all images from the bros folder at build time
const broImages = import.meta.glob('../assets/bros/*', { eager: true });

function getBroImage(number) {
  // number is e.g. "178" — try common extensions
  for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP']) {
    const key = `../assets/bros/${number}.${ext}`;
    if (broImages[key]) return broImages[key].default;
  }
  return null;
}

const FIELD_PATTERNS = [
  { key: 'name',    re: /𝕹𝖆𝖒𝖊|^name$/i },
  { key: 'major',   re: /𝕸𝖆𝖏𝖔𝖗|^major$/i },
  { key: 'big',     re: /𝕭𝖎𝖌|big/i },
  { key: 'hobbies', re: /𝕻𝖊𝖗𝖘𝖔𝖓|hobb/i },
  { key: 'dreams',  re: /𝕯𝖗𝖊𝖆𝖒|dream/i },
  { key: 'memory',  re: /𝕱𝖆𝖛𝖔𝖗|fav/i },
];

function parseActiveHouse(text) {
  const members = [];
  const cleaned = text.replace(/^ACTIVE HOUSE\s*/i, '').trim();
  const blocks = cleaned.split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    const member = {};
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const label = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      if (!value) continue;

      const match = FIELD_PATTERNS.find(({ re }) => re.test(label));
      if (match) member[match.key] = value;
    }

    if (member.name) members.push(member);
  }
  return members;
}

function parseName(nameStr) {
  if (!nameStr) return { number: '', numericId: '', alias: '', full: '' };
  const numMatch   = nameStr.match(/^#(\d+)/);
  const aliasMatch = nameStr.match(/[""]([^""]+)[""]/);
  const numericId  = numMatch   ? numMatch[1]        : '';
  const number     = numMatch   ? `#${numMatch[1]}`  : '';
  const alias      = aliasMatch ? aliasMatch[1]       : '';
  const full       = nameStr.replace(/^#\d+\s*/, '').replace(/[""][^""]+[""]\s*/g, '').trim();
  return { number, numericId, alias, full };
}

const COLORS = [
  { bg: '#1a2e1a', accent: '#4a7c59', text: '#c8e6c9' },
  { bg: '#1a1a2e', accent: '#4a4a7c', text: '#c8c8e6' },
  { bg: '#2e1a1a', accent: '#7c4a4a', text: '#e6c8c8' },
  { bg: '#1a2a2e', accent: '#4a6e7c', text: '#c8dde6' },
  { bg: '#2e2a1a', accent: '#7c6a4a', text: '#e6dcc8' },
  { bg: '#251a2e', accent: '#614a7c', text: '#dac8e6' },
];

const POSITIONS = [
  { offset: -2, sizeClass: 'ahc-card--far',    posClass: 'ahc-card--far-left'  },
  { offset: -1, sizeClass: 'ahc-card--side',   posClass: 'ahc-card--left'      },
  { offset:  0, sizeClass: 'ahc-card--center', posClass: ''                    },
  { offset:  1, sizeClass: 'ahc-card--side',   posClass: 'ahc-card--right'     },
  { offset:  2, sizeClass: 'ahc-card--far',    posClass: 'ahc-card--far-right' },
];

export default function ActiveHouseCarousel() {
  const members = parseActiveHouse(activeHouseRaw);
  const [current, setCurrent] = useState(0);
  const total = members.length;

  const go = useCallback((dir) => {
    setCurrent(i => (i + dir + total) % total);
  }, [total]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft')  go(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  const getIdx = (offset) => (current + offset + total) % total;

  const renderCard = ({ offset, sizeClass, posClass }) => {
    const idx = getIdx(offset);
    const m = members[idx];
    const { number, numericId, alias, full } = parseName(m.name);
    const color = COLORS[idx % COLORS.length];
    const isCenter = offset === 0;
    const image = getBroImage(numericId);

    const infoRows = [
      { label: 'Big',     value: m.big     },
      { label: 'Hobbies', value: m.hobbies },
      { label: 'Dreams',  value: m.dreams  },
      { label: 'Memory',  value: m.memory  },
    ];

    return (
      <div
        key={`${idx}-${offset}`}
        className={`ahc-card ${sizeClass} ${posClass}`}
        style={{
          backgroundColor: color.bg,
          boxShadow: isCenter
            ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${color.accent}44`
            : undefined,
        }}
        onClick={() => !isCenter && go(offset > 0 ? 1 : -1)}
      >
        {/* Photo or gradient background */}
        {image ? (
          <img src={image} className="ahc-card-photo" alt={full} />
        ) : (
          <div
            className="ahc-card-bg"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${color.accent}33 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 80%, ${color.accent}22 0%, transparent 50%)`,
            }}
          />
        )}

        {/* Overlay so text stays readable over photos */}
        <div className="ahc-card-overlay" />

        <div
          className="ahc-card-number"
          style={{
            color: color.accent,
            background: `${color.accent}22`,
            border: `1px solid ${color.accent}44`,
          }}
        >
          {number}
        </div>

        <div
          className="ahc-card-alias"
          style={{ textShadow: `0 2px 20px ${color.accent}88` }}
        >
          {alias || full.split(' ')[0]}
        </div>

        <div className="ahc-card-fullname">{full}</div>

        <div className="ahc-card-major" style={{ color: color.text }}>
          {m.major}
        </div>

        {(
          <div
            className="ahc-card-info"
            style={{ background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)` }}
          >
            <div className="ahc-card-info-rows">
              {infoRows.map(({ label, value }) => value && (
                <div key={label} className="ahc-card-info-row">
                  <span className="ahc-card-info-label" style={{ color: color.accent }}>
                    {label}
                  </span>
                  <span className="ahc-card-info-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <div className="ahc-wrapper">
        <div className="ahc-title">
          <h2>Active House</h2>
          <p>{total} Brothers</p>
        </div>

        <div className="ahc-stage">
          {POSITIONS.map(renderCard)}

          <button className="ahc-nav ahc-nav--prev" onClick={() => go(-1)}>‹</button>
          <button className="ahc-nav ahc-nav--next" onClick={() => go(1)}>›</button>
        </div>

        <div className="ahc-dots">
          {members.map((_, i) => (
            <button
              key={i}
              className={`ahc-dot ${i === current ? 'ahc-dot--active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <div className="ahc-counter">
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </div>
    </>
  );
}