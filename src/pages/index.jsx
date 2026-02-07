import { motion } from 'framer-motion'
import Scene3D from '../components/Scene3D'
import IOSMenu from '../components/IOSMenu'
import ProjectCard from '../components/ProjectCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { 
  Cpu, 
  Code2, 
  Zap, 
  Sparkles,
  ArrowRight,
  Mail,
  Github,
  Linkedin,
  ExternalLink
} from 'lucide-react'

const projects = [
  {
    title: "Quantum Circuit Simulator",
    description: "A web-based simulator for quantum computing circuits with real-time visualization.",
    tags: ["Quantum", "WebGL", "React", "Three.js"],
    github: "#",
    live: "#"
  },
  {
    title: "PCB Designer AI",
    description: "AI-powered PCB layout optimization tool with automatic routing.",
    tags: ["AI/ML", "Electronics", "Python", "Next.js"],
    github: "#",
    live: "#"
  },
  {
    title: "IoT Dashboard 3D",
    description: "3D visualization dashboard for IoT device networks and data flow.",
    tags: ["IoT", "3D", "WebSockets", "Node.js"],
    github: "#",
    live: "#"
  },
  {
    title: "Audio Signal Processor",
    description: "Real-time audio processing with Web Audio API and visualizations.",
    tags: ["Audio", "DSP", "JavaScript", "Canvas"],
    github: "#",
    live: "#"
  },
  {
    title: "Robotic Arm Controller",
    description: "Web-based interface for controlling robotic arms with inverse kinematics.",
    tags: ["Robotics", "WebGL", "Three.js", "API"],
    github: "#",
    live: "#"
  },
  {
    title: "Cyber Security Monitor",
    description: "Real-time network security monitoring with threat visualization.",
    tags: ["Security", "Networking", "React", "D3.js"],
    github: "#",
    live: "#"
  }
]

const skills = [
  { icon: <Cpu />, name: "Hardware Design", level: 90 },
  { icon: <Code2 />, name: "Full Stack Dev", level: 85 },
  { icon: <Zap />, name: "3D Graphics", level: 80 },
  { icon: <Sparkles />, name: "UI/UX Design", level: 75 }
]

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <Scene3D />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-transparent to-cyber-dark" />
      </div>
      
      {/* Binary Rain */}
      <div className="binary-rain" />
      
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(0, 243, 255, 0.5)",
                    "0 0 30px rgba(157, 0, 255, 0.7)",
                    "0 0 20px rgba(0, 243, 255, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl md:text-8xl font-bold mb-6 text-gradient"
              >
                ELECTRONICS
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-cyber-blue"
                >
                  .
                </motion.span>
                <span className="block text-3xl md:text-5xl mt-4">Innovator</span>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Building the future with circuits, code, and creativity.
                Specializing in electronics, 3D visualization, and interactive web experiences.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-cyber flex items-center gap-2"
                >
                  View Projects <ArrowRight size={20} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg font-medium border border-gray-700 hover:border-cyber-blue transition-colors"
                >
                  Contact Me
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* iOS Menu Demo */}
          <div className="absolute top-10 right-10">
            <IOSMenu />
          </div>
        </section>
        
        {/* Skills Section */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            <span className="text-gradient">Technical</span> Expertise
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-2xl p-6"
              >
                <div className="text-cyber-blue mb-4">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{skill.name}</h3>
                
                {/* Animated Progress Bar */}
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-400 mt-2 block">{skill.level}%</span>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Projects Section */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Let's Build <span className="text-gradient">Together</span>
            </h2>
            
            <p className="text-gray-300 mb-8 text-lg">
              Have an electronics project in mind? Need a custom 3D visualization?
              Let's create something amazing.
            </p>
            
            <motion.form
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyber-blue outline-none transition-colors"
              />
              <textarea
                placeholder="Your message"
                rows="4"
                className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyber-blue outline-none transition-colors resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full btn-cyber"
              >
                Send Message <Mail className="inline ml-2" size={20} />
              </motion.button>
            </motion.form>
            
            <div className="flex justify-center gap-4 mt-8">
              <motion.a
                whileHover={{ y: -5 }}
                href="#"
                className="p-3 rounded-xl bg-gray-900/50 hover:bg-gray-800 transition-colors"
              >
                <Github size={24} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5 }}
                href="#"
                className="p-3 rounded-xl bg-gray-900/50 hover:bg-gray-800 transition-colors"
              >
                <Linkedin size={24} />
              </motion.a>
              <motion.a
                whileHover={{ y: -5 }}
                href="#"
                className="p-3 rounded-xl bg-gray-900/50 hover:bg-gray-800 transition-colors"
              >
                <ExternalLink size={24} />
              </motion.a>
            </div>
          </motion.div>
        </section>
        
        <Footer />
      </div>
    </div>
  )
}
