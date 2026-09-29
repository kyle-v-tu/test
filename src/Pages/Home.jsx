import landing from '../assets/landing.jpg'
import InstagramPost from './InstagramPost';
import bom from '../assets/bom.png'
import landingPageRaw from '/landingPage.txt?raw'

function parseLandingPage(text) {
  const sections = {};
  const lines = text.split('\n');
  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^([A-Z][A-Z\s]+)$/);
    if (headerMatch) {
      currentKey = headerMatch[1].trim();
      sections[currentKey] = '';
    } else if (currentKey) {
      sections[currentKey] = sections[currentKey]
        ? sections[currentKey] + '\n' + trimmed
        : trimmed;
    }
  }

  return sections;
}

function Home() {
  const {
    CLASS = '',
    BROTHER = '',
    DESCRIPTION = '',
    'INSTAGRAM URL': instagramUrl = '',
  } = parseLandingPage(landingPageRaw);

  return (
    <>
      <div className="home">
        <div className="image-fade-wrapper">
          <img src={landing} fetchPriority="high" decoding="async" alt="" />
          <div className="landing-text">
            <h1>HONOR. VIRTUE. BROTHERHOOD.</h1>
          </div>
        </div>
      </div>

      <div className="innerPage">
        <div className="news">
          <article className="home-card bom-card">
            <div className="bom-card-media">
              <img src={bom} loading="lazy" decoding="async" alt="" />
              <div className="bom-card-scrim" />
              <div className="bom-card-body">
                <span className="bom-card-eyebrow">Brother of the Month</span>
                {BROTHER && <h3 className="bom-card-name">{BROTHER}</h3>}
                {CLASS && <p className="bom-card-class">{CLASS}</p>}
                {DESCRIPTION && <p className="bom-card-desc">{DESCRIPTION}</p>}
              </div>
            </div>
          </article>

          <article className="home-card instagram-card">
            <div className="instagram-card-header">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.6"/>
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor"/>
              </svg>
              <span>Follow along on Instagram</span>
            </div>
            <div className="instagram-card-body">
              {instagramUrl && <InstagramPost url={instagramUrl} />}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

export default Home;