import { motion } from 'framer-motion'
import { ExternalLink, Github, Zap } from 'lucide-react'

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl glass-effect cyber-border"
    >
      {/* Glitch Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyber-blue/0 via-cyber-purple/0 to-cyber-pink/0 group-hover:from-cyber-blue/5 group-hover:via-cyber-purple/5 group-hover:to-cyber-pink/5 z-10 pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <div className="p-6 relative z-20">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-xl bg-cyber-dark/50 inline-block"
          >
            <Zap className="text-cyber-blue" size={24} />
          </motion.div>
          
          <div className="flex gap-2">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={project.github}
              target="_blank"
              className="p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800"
            >
              <Github size={18} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={project.live}
              target="_blank"
              className="p-2 rounded-lg bg-cyber-blue/20 hover:bg-cyber-blue/30"
            >
              <ExternalLink size={18} className="text-cyber-blue" />
            </motion.a>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-cyber-blue transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 mb-4">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1 text-xs rounded-full bg-cyber-dark border border-cyber-blue/30 text-cyber-blue"
            >
              {tag}
            </motion.span>
          ))}
        </div>
        
        {/* Circuit Line Animation */}
        <svg className="w-full h-px" viewBox="0 0 300 2">
          <motion.path
            d="M0,1 L300,1"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="300"
            strokeDashoffset="300"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f3ff" />
              <stop offset="50%" stopColor="#9d00ff" />
              <stop offset="100%" stopColor="#ff00c8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  )
              }
