'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function AnimationPlayground() {
  const [showBox, setShowBox] = useState(true)
  const [selectedAnimation, setSelectedAnimation] = useState('bounce')

  const cssAnimations = [
    { name: 'bounce', class: 'animate-bounce' },
    { name: 'spin', class: 'animate-spin' },
    { name: 'pulse', class: 'animate-pulse' },
    { name: 'ping', class: 'animate-ping' },
    { name: 'bounce-slow', class: 'animate-bounce-slow' },
    { name: 'spin-slow', class: 'animate-spin-slow' },
    { name: 'pulse-slow', class: 'animate-pulse-slow' },
    { name: 'wiggle', class: 'animate-wiggle' },
  ]

  const framerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.3 }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-12">
      {/* CSS Animations Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">CSS Animations</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Controls</h3>
            <div className="space-y-2">
              {cssAnimations.map((anim) => (
                <label key={anim.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="animation"
                    value={anim.name}
                    checked={selectedAnimation === anim.name}
                    onChange={(e) => setSelectedAnimation(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="capitalize">{anim.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div
                className={`w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg ${
                  cssAnimations.find(a => a.name === selectedAnimation)?.class || ''
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Framer Motion Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Framer Motion Animations</h2>

        <div className="space-y-6">
          {/* Presence Animation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Presence Animation</h3>
            <button
              onClick={() => setShowBox(!showBox)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
            >
              Toggle Box
            </button>

            <div className="h-32 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {showBox && (
                  <motion.div
                    key="box"
                    variants={framerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Drag Animation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Drag Animation</h3>
            <div className="h-48 bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
              <motion.div
                drag
                dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
                dragElastic={0.2}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full cursor-move"
              />
            </div>
          </div>

          {/* Stagger Animation */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Stagger Animation</h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-5 gap-2"
            >
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
                />
              ))}
            </motion.div>
          </div>

          {/* Gesture Animations */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Gesture Animations</h3>
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg text-white text-center cursor-pointer"
              >
                Hover & Tap
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-br from-yellow-500 to-red-500 rounded-lg text-white text-center"
              >
                Rotating
              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-4 bg-gradient-to-br from-green-500 to-teal-500 text-white text-center"
              >
                Morphing
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Keyframe Animations */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Custom Keyframe Animations</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-indigo-500 rounded-lg animate-slide-in" />
            <span className="text-sm">Slide In</span>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-purple-500 rounded-lg animate-fade-in" />
            <span className="text-sm">Fade In</span>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-pink-500 rounded-lg animate-scale-up" />
            <span className="text-sm">Scale Up</span>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-red-500 rounded-lg animate-wiggle" />
            <span className="text-sm">Wiggle</span>
          </div>
        </div>
      </section>
    </div>
  )
}