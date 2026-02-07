import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="px-6 py-8 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Cpu className="text-cyber-blue" />
            <span className="font-bold">ELECTRONICS PORTFOLIO</span>
          </motion.div>
          
          <div className="text-gray-500 text-sm">
            © {currentYear} Built with circuits and code
          </div>
          
          <motion.div
            animate={{ 
              textShadow: [
                "0 0 10px rgba(0, 243, 255, 0.3)",
                "0 0 20px rgba(0, 243, 255, 0.6)",
                "0 0 10px rgba(0, 243, 255, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs px-3 py-1 rounded-full border border-cyber-blue/30 text-cyber-blue"
          >
            v1.0.0
          </motion.div>
        </div>
      </div>
    </footer>
  )
                         }
