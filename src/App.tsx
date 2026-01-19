import { useState, useEffect, useCallback, useRef } from 'react'

interface Position {
  x: number
  y: number
}

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION: Position = { x: 1, y: 0 }
const GAME_SPEED = 150

export default function App() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const directionRef = useRef<Position>(INITIAL_DIRECTION)
  const gameLoopRef = useRef<number>()

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    )
    return newFood
  }, [snake])

  // Check collision
  const checkCollision = useCallback((head: Position): boolean => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true
    }
    // Self collision
    return snake.some(
      (segment, index) =>
        index > 0 && segment.x === head.x && segment.y === head.y
    )
  }, [snake])

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] }
        const currentDir = directionRef.current

        // Move head
        head.x += currentDir.x
        head.y += currentDir.y

        // Check collision
        if (checkCollision(head)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        // Check if food eaten
        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood())
          setScore(prev => prev + 10)
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameOver, isPaused, food, checkCollision, generateFood])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          // Reset game
          setSnake(INITIAL_SNAKE)
          setFood({ x: 15, y: 15 })
          directionRef.current = INITIAL_DIRECTION
          setGameOver(false)
          setScore(0)
          setIsPaused(false)
        }
        return
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev)
        return
      }

      const keyMap: { [key: string]: Position } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      }

      const newDirection = keyMap[e.key]
      if (newDirection) {
        // Prevent reversing into itself
        const currentDir = directionRef.current
        if (
          newDirection.x !== -currentDir.x &&
          newDirection.y !== -currentDir.y
        ) {
          directionRef.current = newDirection
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver])

  return (
    <div className={`app ${gameOver ? 'game-over-theme' : ''}`}>
      <div className="phone-container">
        <div className={`phone-screen ${gameOver ? 'game-over-theme' : ''}`}
          <div className="phone-header">
            <div className="nokia-logo">NOKIA</div>
            <div className="score-display">SCORE: {score}</div>
          </div>

          <div className="game-area">
            {gameOver ? (
              <div className="game-over">
                <div className="game-over-text">GAME OVER</div>
                <div className="game-over-score">Final Score: {score}</div>
                <div className="game-over-hint">Press SPACE to restart</div>
              </div>
            ) : isPaused ? (
              <div className="game-over">
                <div className="game-over-text">PAUSED</div>
                <div className="game-over-hint">Press SPACE to resume</div>
              </div>
            ) : (
              <div className="grid">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                  const x = index % GRID_SIZE
                  const y = Math.floor(index / GRID_SIZE)
                  const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y
                  const isSnakeBody = snake.some(
                    (segment, idx) => idx > 0 && segment.x === x && segment.y === y
                  )
                  const isFood = food.x === x && food.y === y

                  return (
                    <div
                      key={index}
                      className={`cell ${isSnakeHead ? 'snake-head' : ''} ${
                        isSnakeBody ? 'snake-body' : ''
                      } ${isFood ? 'food' : ''}`}
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE
                      }}
                    />
                  )
                })}
              </div>
            )}
          </div>

          <div className="phone-footer">
            <div className="controls-hint">
              Use Arrow Keys to play
            </div>
            <div className="controls-hint">
              SPACE to pause
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}