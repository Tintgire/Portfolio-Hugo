import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import LenisProvider from './lib/LenisProvider.jsx'
import './index.css'

// Force scroll to top on every page load / reload. Browsers default to
// restoring the last scroll position (great for back-button navigation, but
// breaks the intended "land on the hero" experience when the user hits F5).
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LenisProvider>
        <App />
      </LenisProvider>
    </BrowserRouter>
  </React.StrictMode>
)
