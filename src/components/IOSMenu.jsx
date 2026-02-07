import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { 
  Edit, 
  Share2, 
  Trash2, 
  Copy, 
  Download,
  Settings,
  MoreVertical
} from 'lucide-react'

const menuItems = [
  { icon: <Edit size={18} />, label: 'Edit', color: 'text-cyber-blue' },
  { icon: <Copy size={18} />, label: 'Duplicate', color: 'text-white' },
  { icon: <Share2 size={18} />, label: 'Share', color: 'text-white' },
  { icon: <Download size={18} />, label: 'Download', color: 'text-white' },
  { icon: <Settings size={18} />, label: 'Settings', color: 'text-white' },
  { icon: <Trash2 size={18} />, label: 'Delete', color: 'text-red-400' },
]

export default function IOSMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleContextMenu = (e) => {
    e.preventDefault()
    setCoords({ x: e.clientX, y: e.clientY })
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* 3 Dots Button */}
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onContextMenu={handleContextMenu}
          className="p-2 flex flex-col items-center justify-center space-y-1 group"
          aria-label="Open menu"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-cyber-blue transition-colors"
              animate={isOpen ? { scale: 1.3, y: i === 2 ? 0 : i === 1 ? 2 : -2 } : { scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: i * 0.05
              }}
            />
          ))}
        </button>

        {/* Menu Popup */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={handleClose}
              />
              
              <motion.div
                initial={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  x: coords.x - 200,
                  y: coords.y - 100 
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: coords.x - 200,
                  y: coords.y - 100
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  transition: { duration: 0.1 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                className="fixed z-50 w-56 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-gray-800/50"
                style={{ 
                  left: coords.x,
                  top: coords.y,
                  transform: 'translate(-100%, 0)'
                }}
              >
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      console.log(`${item.label} clicked`)
                      handleClose()
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/80 transition-all duration-200 ${item.color}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    
                    {item.label === 'Share' && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-xs bg-cyber-purple/20 text-cyber-purple px-2 py-1 rounded"
                      >
                        New
                      </motion.span>
                    )}
                  </motion.button>
                ))}
                
                {/* iOS-style separator */}
                <div className="h-px bg-gray-800/50 my-2" />
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-3 text-xs text-gray-500"
                >
                  <p>Long press anywhere for context menu</p>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Context Menu Hint */}
      <div className="absolute bottom-10 right-10 text-xs text-gray-500">
        <p>Try right-clicking anywhere on the page</p>
      </div>
    </>
  )
}
