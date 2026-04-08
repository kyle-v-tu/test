import { useState, useEffect } from 'react';
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

  return (
    <div className="class-page-layout">
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

      <div className="classPage">
        <h1>{className}</h1>
        <div className="brothers-grid">
          {brothers.map(({ number, label }) => (
            <div className="brother-card" key={number}>
              {imageMap[number]
                ? <img src={imageMap[number]} alt={label} />
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