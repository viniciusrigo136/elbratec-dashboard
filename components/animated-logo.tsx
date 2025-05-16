"use client"

import { useEffect, useRef } from "react"

interface AnimatedLogoProps {
  className?: string
}

export function AnimatedLogo({ className = "h-10 w-10" }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const size = Math.min(canvas.width, canvas.height)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = size * 0.4

    // Animation variables
    let angle = 0
    let animationFrameId: number

    // Colors
    const greenColor = "#4CAF50"
    const yellowColor = "#FFEB3B"

    const drawLogo = () => {
      if (!ctx) return // Additional check to ensure ctx is still valid

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius)
      gradient.addColorStop(0, greenColor)
      gradient.addColorStop(1, yellowColor)

      // Draw outer circle (sun)
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw inner circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2)
      ctx.fillStyle = "#fff"
      ctx.fill()

      // Draw solar panel grid
      const gridSize = 3
      const cellSize = (radius * 1.4) / gridSize
      const startX = centerX - cellSize * (gridSize / 2)
      const startY = centerY - cellSize * (gridSize / 2)

      ctx.fillStyle = gradient
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          // Skip center cell to create sun rays effect
          if (i === 1 && j === 1) continue

          ctx.save()
          ctx.translate(centerX, centerY)
          ctx.rotate(angle)
          ctx.translate(-centerX, -centerY)

          ctx.fillRect(startX + i * cellSize, startY + j * cellSize, cellSize * 0.8, cellSize * 0.8)
          ctx.restore()
        }
      }

      // Draw sun rays
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle)

      const rayCount = 8
      const rayLength = radius * 0.3

      for (let i = 0; i < rayCount; i++) {
        const rayAngle = (i * Math.PI * 2) / rayCount

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(rayAngle) * rayLength, Math.sin(rayAngle) * rayLength)
        ctx.lineWidth = 3
        ctx.strokeStyle = gradient
        ctx.stroke()
      }

      ctx.restore()

      // Update animation
      angle += 0.005
      animationFrameId = requestAnimationFrame(drawLogo)
    }

    drawLogo()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} width={100} height={100} className={`logo-animation ${className}`} />
}
