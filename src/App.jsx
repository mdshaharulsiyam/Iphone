import './App.css'
import Hero from './components/Hero'
import HighLights from './components/HighLights'
import Navbar from './components/Navbar'

function App() {

  return (
    <main className='bg-black'>
      <Navbar />
      <Hero />
      <HighLights />
    </main>
  )
}

export default App
