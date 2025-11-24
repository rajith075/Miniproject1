import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  const el = document.createElement('div')
  el.id = 'root'
  document.body.appendChild(el)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
