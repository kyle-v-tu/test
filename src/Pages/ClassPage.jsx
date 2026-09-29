import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const images = import.meta.glob('../assets/bros/*', { eager: true });

const imageMap = {};
Object.entries(images).forEach(([path, module]) => {
  const filename = path.split('/').pop().replace(/\.[^/.]+$/, '');
  imageMap[filename] = module.default;
});

function slugFromHeader(header) {
  return header
    .replace(/^The\s+/, '')
    .replace(/"[^"]*"\s*/g, '')
    .replace(/\s*Class$/, '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .join('-');
}

function ClassPage() {
  const { name } = useParams();
  const [brothers, setBrothers] = useState([]);
  const [className, setClassName] = useState('');
  const [allClasses, setAllClasses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetch('/classes.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        let inClass = false;
        let matchedHeader = '';
        const parsed = [];
        const classList = [];

        lines.forEach(line => {
          if (line.startsWith('The ')) {
            const slug = slugFromHeader(line);
            classList.push({ header: line, slug });
            inClass = slug === name;
            if (inClass) matchedHeader = line;
          } else if (inClass && /^#\d+/.test(line)) {
            const match = line.match(/^#(\d+)\s(.+)$/);
            if (match) parsed.push({ number: match[1], label: line });
          } else if (inClass && (line.startsWith('Class Song') || line.startsWith('Class Motto'))) {
            inClass = false;
          }
        });

        setClassName(matchedHeader);
        setBrothers(parsed);
        setAllClasses(classList);
      });
  }, [name]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = allClasses
    .find(c => c.slug === name)
    ?.header.replace(/^The\s+/, '').replace(/"[^"]*"\s*/g, '').trim() ?? '';

  const filteredClasses = allClasses.filter(({ header }) =>
    header.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="class-page-layout">

      {/* ── Desktop sidebar ── */}
      <aside className="class-sidebar">
        <h2>Classes</h2>
        {allClasses.map(({ header, slug }) => (
          <Link
            key={slug}
            to={`/our-chapter/${slug}`}
            className={`sidebar-link ${slug === name ? 'active' : ''}`}
          >
            {header.replace(/^The\s+/, '').replace(/"[^"]*"\s*/g, '').trim()}
          </Link>
        ))}
      </aside>

      {/* ── Mobile dropdown ── */}
      <div className="mobile-class-picker" ref={dropdownRef}>
        <button
          className={`class-picker-trigger ${dropdownOpen ? 'open' : ''}`}
          onClick={() => { setDropdownOpen(o => !o); setSearch(''); }}
        >
          <span>{currentLabel || 'Select Class'}</span>
          <svg
            className="picker-chevron"
            width="12" height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="class-picker-dropdown">
            <div className="class-picker-search-wrap">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="#aaa" strokeWidth="1.5"/>
                <path d="M10 10L13.5 13.5" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="class-picker-search"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="class-picker-list">
              {filteredClasses.length > 0 ? filteredClasses.map(({ header, slug }) => {
                const label = header.replace(/^The\s+/, '').replace(/"[^"]*"\s*/g, '').trim();
                return (
                  <Link
                    key={slug}
                    to={`/our-chapter/${slug}`}
                    className={`class-picker-option ${slug === name ? 'active' : ''}`}
                    onClick={() => { setDropdownOpen(false); setSearch(''); }}
                  >
                    {label}
                  </Link>
                );
              }) : (
                <p className="class-picker-empty">No results</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="classPage">
        <h1>{className}</h1>
        <div className="brothers-grid">
          {brothers.map(({ number, label }) => (
            <div className="brother-card" key={number}>
              {imageMap[number]
                ? <img src={imageMap[number]} alt={label} loading="lazy" decoding="async" />
                : <div className="no-image">No Image</div>
              }
              <div className="brother-info">
                <p className="brother-name">{label.split('|')[0].trim()}</p>
                {label.includes('|') && (
                  <p className="brother-big">{label.split('|')[1].trim()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassPage;