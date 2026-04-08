import landing from '../assets/landing.png'

function Home() {
  return (
    <>
      <div className="home">
        <img src={landing} />
        <h1>Hello world!</h1>
      </div>
    </>
  )
}

export default Home