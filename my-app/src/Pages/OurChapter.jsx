import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OurChapter() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/classes.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const parsed = [];
        let i = 0;

        while (i < lines.length) {
          const line = lines[i];

          if (line.startsWith('The ')) {
            const header = line;
            const crossedLine = lines[i + 1] || '';
            const crossedMatch = crossedLine.match(/^Crossed\s+(Spring|Fall|Summer)\s+(\d{4})/);
            const semester = crossedMatch ? `${crossedMatch[1]} ${crossedMatch[2]}` : '';
            const educatorMatch = crossedLine.match(/under the direction of (Mr\.\s+\S+(?:\s+"[^"]+")?\s+\S+)/);
            const educator = educatorMatch ? educatorMatch[1].trim() : '';
            const slug = header
              .replace(/^The\s+/, '')
              .replace(/"[^"]*"\s*/g, '')
              .replace(/\s*Class$/, '')
              .trim()
              .toLowerCase()
              .split(/\s+/)
              .join('-');

            parsed.push({ header, semester, educator, slug });
          }
          i++;
        }

        setClasses(parsed);
      });
  }, []);

  return (
    <div className="our-chapter-page">
      <h1>UMCP Roster</h1>

      {/* Desktop table */}
      <table className="chapter-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Crossed</th>
            <th>Pledge Educator</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.map(({ header, semester, educator, slug }) => (
            <tr
              key={slug}
              onClick={() => navigate(`/our-chapter/${slug}`)}
              style={{ cursor: 'pointer' }}
            >
              <td>{header}</td>
              <td>{semester}</td>
              <td>{educator}</td>
              <td><Link to={`/our-chapter/${slug}`} onClick={e => e.stopPropagation()}>View Class →</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="chapter-cards">
        {classes.map(({ header, semester, educator, slug }) => (
          <div
            key={slug}
            className="chapter-card"
            onClick={() => navigate(`/our-chapter/${slug}`)}
          >
            <div className="chapter-card-header">
              <span className="chapter-card-name">{header}</span>
              <span className="chapter-card-semester">{semester}</span>
            </div>
            {educator && (
              <div className="chapter-card-educator">
                <span className="chapter-card-label">Pledge Educator</span>
                <span>{educator}</span>
              </div>
            )}
            <Link
              to={`/our-chapter/${slug}`}
              className="chapter-card-link"
              onClick={e => e.stopPropagation()}
            >
              View Class →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurChapter;