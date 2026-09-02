import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scrollcraft.css'
import '../index.css'
import './scrollcraft.js'
import './landing.css'
import { Demo } from './Demo'
import { mountFolio } from './signature'

window.ScrollCraft.mount(document.body)
mountFolio()

const demo = document.getElementById('demo')
if (demo) {
  createRoot(demo).render(
    <StrictMode>
      <Demo />
    </StrictMode>,
  )
}
