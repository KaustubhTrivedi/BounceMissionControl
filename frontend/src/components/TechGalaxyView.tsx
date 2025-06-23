import { useEffect, useRef, useState, useCallback } from 'react'
import type { TechPortProject, TechPortCategory } from '../services/nasa'

interface TechGalaxyViewProps {
  projects: TechPortProject[]
  categories: TechPortCategory[]
  onProjectSelect: (projectId: string | null) => void
  selectedProject: string | null
}

interface Node {
  id: string
  title: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  category: string
  trl: number
  project: TechPortProject
}

export default function TechGalaxyView({
  projects,
  categories,
  onProjectSelect,
  selectedProject
}: TechGalaxyViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [focusedNode, setFocusedNode] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const nodesRef = useRef<Node[]>([])

  // Safely create category color map with null checks
  const categoryColorMap = useCallback(() => {
    const colorMap: Record<string, string> = {}
    if (!categories?.length) {
      return { 'default': '#66FCF1' }
    }
    
    categories.forEach((cat, index) => {
      if (cat?.id && cat?.color) {
        colorMap[cat.name || cat.id] = cat.color
      } else {
        // Fallback colors with good contrast
        const fallbackColors = ['#66FCF1', '#C3073F', '#FF7F50', '#4CAF50', '#FFC107', '#9C27B0', '#2196F3', '#FF9800']
        colorMap[cat?.name || `category-${index}`] = fallbackColors[index % fallbackColors.length]
      }
    })
    return colorMap
  }, [categories])

  // Initialize nodes with comprehensive null checks
  const initializeNodes = useCallback(() => {
    if (!projects?.length || !canvasRef.current) return []

    const canvas = canvasRef.current
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const colorMap = categoryColorMap()

    const nodes = projects
      .filter(project => project?.id && project?.title) // Filter out invalid projects
      .map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2
        const distance = Math.random() * 200 + 100
        
        return {
          id: project.id,
          title: project.title || 'Untitled Project',
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.max(3, Math.min(8, (project.budget || 1000000) / 2000000)),
          color: colorMap[project.category] || '#66FCF1',
          category: project.category || 'Unknown',
          trl: project.trl || 1,
          organization: project.organization || 'NASA',
          status: project.status || 'unknown',
          budget: project.budget || 0,
          description: project.description || 'No description available',
          startDate: project.startDate || '',
          endDate: project.endDate || '',
          manager: project.manager || 'Unknown',
          tags: project.tags || [],
          benefits: project.benefits || [],
          project
        } as Node
      })

    return nodes
  }, [projects, categoryColorMap])

  // Animation loop with enhanced null checks
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (!canvas || !ctx || !nodesRef.current?.length) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    // Clear canvas with semi-transparent overlay for trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create starfield background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 50; i++) {
      const x = (Date.now() * 0.01 + i * 137.5) % canvas.width
      const y = (Date.now() * 0.007 + i * 97.3) % canvas.height
      ctx.beginPath()
      ctx.arc(x, y, Math.sin(Date.now() * 0.001 + i) * 2 + 1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Filter out any undefined nodes
    const validNodes = nodesRef.current.filter(node => node && node.id)

    // Update node positions with physics simulation
    const updatedNodes = validNodes.map(node => {
      if (!node) return node

      // Center attraction force
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const dx = centerX - (node.x || centerX)
      const dy = centerY - (node.y || centerY)
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Apply forces only if distance is meaningful
      if (distance > 1) {
        const centerForce = 0.0005
        node.vx = (node.vx || 0) + dx * centerForce
        node.vy = (node.vy || 0) + dy * centerForce
      }

      // Category clustering force
      const categoryNodes = validNodes.filter(n => n && n.category === node.category && n.id !== node.id)
      let clusterForceX = 0
      let clusterForceY = 0
      
      categoryNodes.forEach(other => {
        if (!other || !other.x || !other.y) return
        
        const dx = other.x - node.x
        const dy = other.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist > 0 && dist < 100) {
          const force = 0.01 / dist
          clusterForceX += dx * force
          clusterForceY += dy * force
        }
      })

      // Apply cluster force
      node.vx = (node.vx || 0) + clusterForceX
      node.vy = (node.vy || 0) + clusterForceY

      // Damping
      node.vx = (node.vx || 0) * 0.99
      node.vy = (node.vy || 0) * 0.99

      // Update position
      node.x = (node.x || centerX) + (node.vx || 0)
      node.y = (node.y || centerY) + (node.vy || 0)

      // Boundary checking
      const margin = node.radius || 10
      if (node.x < margin) {
        node.x = margin
        node.vx = Math.abs(node.vx || 0)
      }
      if (node.x > canvas.width - margin) {
        node.x = canvas.width - margin
        node.vx = -Math.abs(node.vx || 0)
      }
      if (node.y < margin) {
        node.y = margin
        node.vy = Math.abs(node.vy || 0)
      }
      if (node.y > canvas.height - margin) {
        node.y = canvas.height - margin
        node.vy = -Math.abs(node.vy || 0)
      }

      return node
    })

    nodesRef.current = updatedNodes

    // Draw connections between related projects
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    updatedNodes.forEach(node => {
      if (!node || !node.id) return
      
      const relatedNodes = updatedNodes.filter(other => 
        other && other.id && other.category === node.category && other.id !== node.id
      )
      
      relatedNodes.forEach(other => {
        if (!other || !other.x || !other.y) return
        
        const distance = Math.sqrt((other.x - node.x) ** 2 + (other.y - node.y) ** 2)
        if (distance < 150) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      })
    })

    // Draw nodes with accessibility considerations
    updatedNodes.forEach(node => {
      if (!node || !node.id) return
      
      const isSelected = selectedProject === node.id
      const isHovered = hoveredNode === node.id
      const isFocused = focusedNode === node.id
      
      // Enhanced glow for selected/hovered/focused nodes
      if (isSelected || isHovered || isFocused) {
        const glowRadius = (node.radius || 10) * 3
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0, 
          node.x, node.y, glowRadius
        )
        gradient.addColorStop(0, (node.color || '#66FCF1') + '40')
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(
          node.x - glowRadius, 
          node.y - glowRadius, 
          glowRadius * 2, 
          glowRadius * 2
        )
      }
      
      // Node circle with better contrast
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius || 10, 0, Math.PI * 2)
      ctx.fillStyle = isSelected ? '#FFFFFF' : (node.color || '#66FCF1')
      ctx.fill()
      
      // Node border for better visibility
      ctx.strokeStyle = isFocused ? '#FFFFFF' : (isHovered ? '#FFFFFF' : (node.color || '#66FCF1'))
      ctx.lineWidth = isFocused ? 3 : (isHovered ? 2 : 1)
      ctx.stroke()
      
      // TRL indicator with better readability
      if (node.trl) {
        ctx.fillStyle = isSelected ? '#000000' : '#FFFFFF'
        ctx.font = 'bold 10px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // Add text shadow for better readability
        ctx.shadowColor = '#000000'
        ctx.shadowBlur = 2
        ctx.fillText(node.trl.toString(), node.x, node.y + 3)
        ctx.shadowBlur = 0
      }

      // Project title on hover/focus with better contrast
      if (isHovered || isFocused) {
        const title = node.title || 'Untitled'
        ctx.font = 'bold 12px Arial'
        const textWidth = ctx.measureText(title).width
        const padding = 8
        
        // Background for better readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(
          node.x - textWidth/2 - padding, 
          node.y - (node.radius || 10) - 25, 
          textWidth + padding * 2, 
          20
        )
        
        // White text with shadow
        ctx.fillStyle = '#FFFFFF'
        ctx.shadowColor = '#000000'
        ctx.shadowBlur = 1
        ctx.textAlign = 'center'
        ctx.fillText(title, node.x, node.y - (node.radius || 10) - 15)
        ctx.shadowBlur = 0
      }
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [selectedProject, hoveredNode, focusedNode])

  // Mouse interaction handlers with null checks
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !nodesRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const clickedNode = nodesRef.current.find(node => {
      if (!node || !node.id) return false
      const distance = Math.sqrt((x - (node.x || 0)) ** 2 + (y - (node.y || 0)) ** 2)
      return distance <= (node.radius || 10)
    })

    if (clickedNode) {
      onProjectSelect(clickedNode.id)
      setFocusedNode(clickedNode.id)
    } else {
      onProjectSelect(null)
      setFocusedNode(null)
    }
  }, [onProjectSelect])

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !nodesRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const hoveredNode = nodesRef.current.find(node => {
      if (!node || !node.id) return false
      const distance = Math.sqrt((x - (node.x || 0)) ** 2 + (y - (node.y || 0)) ** 2)
      return distance <= (node.radius || 10)
    })

    setHoveredNode(hoveredNode?.id || null)
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default'
  }, [])

  // Keyboard navigation support
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!nodesRef.current?.length) return

    const validNodes = nodesRef.current.filter(node => node && node.id)
    if (!validNodes.length) return

    const currentIndex = focusedNode 
      ? validNodes.findIndex(node => node.id === focusedNode)
      : -1

    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = (currentIndex + 1) % validNodes.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = currentIndex <= 0 ? validNodes.length - 1 : currentIndex - 1
        break
      case 'Enter':
      case ' ':
        if (focusedNode) {
          event.preventDefault()
          onProjectSelect(focusedNode)
        }
        break
      case 'Escape':
        event.preventDefault()
        setFocusedNode(null)
        onProjectSelect(null)
        return
    }

    if (nextIndex !== currentIndex && nextIndex >= 0 && validNodes[nextIndex]) {
      setFocusedNode(validNodes[nextIndex].id)
    }
  }, [focusedNode, onProjectSelect])

  // Initialize and cleanup
  useEffect(() => {
    const nodes = initializeNodes()
    nodesRef.current = nodes
    
    if (nodes.length > 0 && !isInitialized) {
      setIsInitialized(true)
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initializeNodes, animate, isInitialized])

  // Handle canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = Math.max(container.clientHeight, 600)
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div 
      className="relative w-full h-[600px] bg-gradient-to-b from-black to-gray-900 rounded-lg overflow-hidden border border-white/10"
      role="region"
      aria-label="Interactive NASA Technology Galaxy Visualization"
    >
      {/* Accessibility Instructions */}
      <div className="sr-only" id="galaxy-instructions">
        Navigate the technology galaxy using arrow keys. Press Enter or Space to select a project. 
        Press Escape to clear selection. {nodesRef.current?.length || 0} projects available.
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-default"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        tabIndex={0}
        role="application"
        aria-label="Interactive technology project galaxy"
        aria-describedby="galaxy-instructions"
        aria-live="polite"
        aria-atomic="false"
      />
      
      {/* Legend with improved accessibility */}
      <div 
        className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/20"
        role="complementary"
        aria-label="Galaxy visualization legend"
      >
        <h4 className="text-white font-bold mb-2 text-sm">🌌 Galaxy Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#66FCF1]"></div>
            <span className="text-gray-300">Node size = <abbr title="Technology Readiness Level">TRL</abbr></span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#C3073F]"></div>
            <span className="text-gray-300">Color = Category</span>
          </div>
          <div className="text-gray-400 text-xs mt-2">
            • Click/Enter to select<br/>
            • Arrow keys to navigate<br/>
            • Hover for details<br/>
            • ESC to clear
          </div>
        </div>
      </div>

      {/* Project count indicator */}
      <div 
        className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20"
        role="status"
        aria-live="polite"
      >
        <span className="text-[#66FCF1] font-bold text-sm">
          {nodesRef.current?.length || 0} Projects
        </span>
        {focusedNode && (
          <div className="text-gray-300 text-xs mt-1">
            Focus: {nodesRef.current?.find(n => n?.id === focusedNode)?.title || 'Unknown'}
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div 
          className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/20 max-w-xs"
          role="tooltip"
          aria-live="polite"
        >
          {(() => {
            const node = nodesRef.current?.find(n => n?.id === hoveredNode)
            return node ? (
              <div>
                <h4 className="text-white font-bold text-sm">{node.title}</h4>
                <p className="text-gray-300 text-xs">
                  {node.category} • TRL {node.trl} • {node.project?.status || 'Unknown'}
                </p>
              </div>
            ) : null
          })()}
        </div>
      )}
    </div>
  )
} 