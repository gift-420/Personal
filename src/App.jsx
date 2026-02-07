import { useEffect } from 'react'
import Home from './pages/index'
import './styles/globals.css'

export default function App() {
  useEffect(() => {
    // Add context menu prevention
    const handleContextMenu = (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
      }
    }
    
    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  return <Home />
}
