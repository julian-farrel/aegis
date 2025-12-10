'use client'

import { useEffect, useState } from 'react'

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated gold bars */}
      <div className="absolute left-[10%] top-[20%] h-32 w-32 animate-float opacity-10">
        <img
          src="/gold-bar-icon.png"
          alt=""
          className="h-full w-full object-contain blur-sm"
        />
      </div>
      
      <div className="absolute right-[15%] top-[40%] h-24 w-24 animate-float-delay opacity-10">
        <img
          src="/gold-bar-icon.png"
          alt=""
          className="h-full w-full object-contain blur-sm"
        />
      </div>
      
      <div className="absolute left-[20%] bottom-[30%] h-28 w-28 animate-float opacity-10">
        <img
          src="/gold-bar-icon.png"
          alt=""
          className="h-full w-full object-contain blur-sm"
        />
      </div>
      
      <div className="absolute right-[25%] bottom-[20%] h-20 w-20 animate-float-delay opacity-10">
        <img
          src="/gold-bar-icon.png"
          alt=""
          className="h-full w-full object-contain blur-sm"
        />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #D4AF37 1px, transparent 1px),
                           linear-gradient(to bottom, #D4AF37 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />
    </div>
  )
}
