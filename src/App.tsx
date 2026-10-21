import { Route, Routes } from 'react-router'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
     
       <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
       </Routes>
      </main>
    </div>
  )
}

export default App
