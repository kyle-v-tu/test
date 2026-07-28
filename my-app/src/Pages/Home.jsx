import landing from '../assets/landing.png'
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
          <img src={landing} />
          <div className="landing-text">
            <h1>HONOR. VIRTUE. BROTHERHOOD.</h1>
          </div>
        </div>
      </div>

      <div className="innerPage">
        <div className='news'>
          <div className='bom'>
            <div className="bom-image-wrapper">
              <img src={bom} />
              <div className="bom-overlay">
                <div className="textBox">
                  <h1>Brother of the Month</h1>
                  {CLASS && <strong><p>{CLASS}</p></strong>}
                  {BROTHER && <p>{BROTHER}</p>}
                  {DESCRIPTION && <p>{DESCRIPTION}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="instagram">
            {instagramUrl && <InstagramPost url={instagramUrl} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;