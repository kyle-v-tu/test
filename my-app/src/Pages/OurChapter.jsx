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

          // Class header line
          if (line.startsWith('The ')) {
            const header = line;

            // Next line should be "Crossed ..."
            const crossedLine = lines[i + 1] || '';
            const crossedMatch = crossedLine.match(/^Crossed\s+(Spring|Fall|Summer)\s+(\d{4})/);
            const semester = crossedMatch ? `${crossedMatch[1]} ${crossedMatch[2]}` : '';

            // Extract first pledge educator from "under the direction of Mr. X"
            const educatorMatch = crossedLine.match(/under the direction of (Mr\.\s+\S+(?:\s+"[^"]+")?\s+\S+)/);
            const educator = educatorMatch ? educatorMatch[1].trim() : '';

            // Build slug from header
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
              <td><Link to={`/our-chapter/${slug}`}>View Class →</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OurChapter;