import landing from '../assets/landing.png'
import InstagramPost from './InstagramPost';
import bom from '../assets/bom.png'

function Home() {
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
                  <strong><p>Class: Alpha Zeta, Spring 21 | Alpha Kappa, Fall 2023</p></strong>
                  <p>Congratulations to #139 Simon "prada" Nguyen and #158 Leon "alexiares" Tran for being brothers of the month!</p>
                  <p>Along with the help of a few others, Simon and Leon helped plan, organize, and execute our biggest Halloween event "PURGE"! Thank you guys for putting your time and effort into our successful event.</p>
                </div>
              </div>
            </div>
          </div>
            <div className="instagram">
              <h1>Recent News</h1>
              <InstagramPost url="https://www.instagram.com/p/DWqtocxETnv/" />
            </div>
          </div>
        </div>
    </>
  )
}

export default Home