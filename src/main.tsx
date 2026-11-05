import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartProvider'
import { WishlistProvider } from './context/WishlistProvider'
import { OrdersProvider } from './context/OrdersProvider'
import { ToastProvider } from './context/ToastProvider'
import { ThemeProvider } from './context/ThemeProvider'
import ErrorBoundary from './components/ui/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
        <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
        </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
   
  </StrictMode>,
)
