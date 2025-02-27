"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import Link from "next/link";

interface TetrominoShape {
  shape: number[][];
  color: string;
}

interface CurrentPiece {
  x: number;
  y: number;
  tetromino: TetrominoShape;
}

type Board = (string | 0)[][];

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "sky-500" },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "indigo-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "amber-500",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "yellow-400",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "emerald-500",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "fuchsia-500",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "rose-500",
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_DROP_TIME = 800;
const SPEED_INCREASE_FACTOR = 0.95;

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS);
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOS[randKey as keyof typeof TETROMINOS];
};

export default function Tetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME);
  const [level, setLevel] = useState(1);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dropInterval = useRef<NodeJS.Timeout | null>(null);

  const checkCollision = (x: number, y: number, shape: number[][]): boolean => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col;
          const newY = y + row;
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const isValidMove = (x: number, y: number, shape: number[][]): boolean =>
    !checkCollision(x, y, shape);

  const moveLeft = useCallback(() => {
    if (
      currentPiece &&
      isValidMove(
        currentPiece.x - 1,
        currentPiece.y,
        currentPiece.tetromino.shape
      )
    ) {
      setCurrentPiece((prev) => {
        if (!prev) return null;
        return { ...prev, x: prev.x - 1 };
      });
    }
  }, [currentPiece, board]);

  const moveRight = useCallback(() => {
    if (
      currentPiece &&
      isValidMove(
        currentPiece.x + 1,
        currentPiece.y,
        currentPiece.tetromino.shape
      )
    ) {
      setCurrentPiece((prev) => {
        if (!prev) return null;
        return { ...prev, x: prev.x + 1 };
      });
    }
  }, [currentPiece, board]);

  const moveDown = useCallback(() => {
    if (!currentPiece) return;
    if (
      isValidMove(
        currentPiece.x,
        currentPiece.y + 1,
        currentPiece.tetromino.shape
      )
    ) {
      setCurrentPiece((prev) => {
        if (!prev) return null;
        return { ...prev, y: prev.y + 1 };
      });
    } else {
      placePiece();
    }
  }, [currentPiece, board]);

  const rotate = useCallback(() => {
    if (!currentPiece) return;
    const rotated = currentPiece.tetromino.shape[0].map((_, i) =>
      currentPiece.tetromino.shape.map((row) => row[i]).reverse()
    );
    let newX = currentPiece.x;
    let newY = currentPiece.y;

    if (!isValidMove(newX, newY, rotated)) {
      if (isValidMove(newX - 1, newY, rotated)) {
        newX -= 1;
      } else if (isValidMove(newX + 1, newY, rotated)) {
        newX += 1;
      } else if (isValidMove(newX, newY - 1, rotated)) {
        newY -= 1;
      } else {
        return;
      }
    }

    setCurrentPiece((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        x: newX,
        y: newY,
        tetromino: { ...prev.tetromino, shape: rotated },
      };
    });

    if (isValidMove(newX, newY + 1, rotated) && newY + 1 < BOARD_HEIGHT) {
      setCurrentPiece((prev) => {
        if (!prev) return null;
        return { ...prev, y: prev.y + 1 };
      });
    }
  }, [currentPiece, board]);

  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    const newBoard = board.map((row) => [...row]);
    currentPiece.tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + currentPiece.y;
          const boardX = x + currentPiece.x;
          if (
            boardY >= 0 &&
            boardY < BOARD_HEIGHT &&
            boardX >= 0 &&
            boardX < BOARD_WIDTH
          ) {
            newBoard[boardY][boardX] = currentPiece.tetromino.color;
          }
        }
      });
    });
    setBoard(newBoard);
    clearLines(newBoard);
    spawnNewPiece();
  }, [currentPiece, board]);

  const clearLines = useCallback(
    (newBoard: Board) => {
      const linesCleared: number[] = [];
      const updatedBoard = newBoard.filter((row, index) => {
        if (row.every((cell) => cell !== 0)) {
          linesCleared.push(index);
          return false;
        }
        return true;
      });

      if (linesCleared.length > 0) {
        setCompletedRows(linesCleared);
        setTimeout(() => {
          while (updatedBoard.length < BOARD_HEIGHT) {
            updatedBoard.unshift(Array(BOARD_WIDTH).fill(0));
          }
          setBoard(updatedBoard);
          setCompletedRows([]);

          const newScore = score + linesCleared.length * 100;
          setScore(newScore);

          if (Math.floor(newScore / 500) > level - 1) {
            setLevel((prev) => prev + 1);
            setDropTime((prev) => prev * SPEED_INCREASE_FACTOR);
          }
        }, 500);
      }
    },
    [score, level]
  );

  const spawnNewPiece = useCallback(() => {
    const newPiece = {
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      tetromino: randomTetromino(),
    };
    if (checkCollision(newPiece.x, newPiece.y, newPiece.tetromino.shape)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
    }
  }, [board]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece();
    }
  }, [currentPiece, gameOver, spawnNewPiece]);

  useEffect(() => {
    if (!gameOver) {
      dropInterval.current = setInterval(moveDown, dropTime);
    }
    return () => {
      if (dropInterval.current) {
        clearInterval(dropInterval.current);
      }
    };
  }, [moveDown, gameOver, dropTime]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case "ArrowLeft":
          moveLeft();
          break;
        case "ArrowRight":
          moveRight();
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowUp":
          rotate();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [moveLeft, moveRight, moveDown, rotate, gameOver]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.loop = true;
      if (!gameOver && isMusicPlaying) {
        audio
          .play()
          .catch((error: Error) =>
            console.error("Audio playback failed:", error)
          );
      } else {
        audio.pause();
      }
    }
  }, [gameOver, isMusicPlaying]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setScore(0);
    setGameOver(false);
    setDropTime(INITIAL_DROP_TIME);
    setLevel(1);
    setCompletedRows([]);
    if (dropInterval.current) {
      clearInterval(dropInterval.current);
    }
  };

  const renderCell = (x: number, y: number): string | 0 => {
    if (
      currentPiece &&
      currentPiece.tetromino.shape[y - currentPiece.y] &&
      currentPiece.tetromino.shape[y - currentPiece.y][x - currentPiece.x]
    ) {
      return currentPiece.tetromino.color;
    }
    return board[y][x];
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Tetris</h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div
          className="grid bg-gray-300"
          style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
            width: `${BOARD_WIDTH * 20}px`,
            height: `${BOARD_HEIGHT * 20}px`,
            border: "1px solid #e5e7eb",
          }}
        >
          {board.map((row, y) =>
            row.map((_, x) => (
              <AnimatePresence key={`${y}-${x}`}>
                <motion.div
                  initial={false}
                  animate={{
                    opacity: completedRows.includes(y) ? 0 : 1,
                    scale: completedRows.includes(y) ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-5 h-5 ${
                    renderCell(x, y) ? `bg-${renderCell(x, y)}` : "bg-gray-100"
                  }`}
                  style={{ border: "1px solid #e5e7eb" }}
                />
              </AnimatePresence>
            ))
          )}
        </div>
      </div>
      <div className="mt-4 text-xl font-bold">Score: {score}</div>
      <div className="mt-2 text-lg">Level: {level}</div>
      <div className="mt-2 text-sm text-gray-600">
        Press Up Arrow to rotate the block
      </div>
      {gameOver && (
        <div className="mt-4 text-2xl font-bold text-red-600">Game Over!</div>
      )}
      <div className="flex gap-4 mt-4">
        <Button onClick={resetGame}>
          {gameOver ? "Play Again" : "Reset Game"}
        </Button>
        <Button onClick={toggleMusic}>
          <Music className="w-4 h-4 mr-2" />
          {isMusicPlaying ? "Stop Music" : "Play Music"}
        </Button>
      </div>
      <div className="flex gap-4 mt-4">
        <Link href="/login">
          <Button variant="outline">Sign in</Button>
        </Link>
        <Button variant="outline">Sign up</Button>
      </div>
      <audio
        ref={audioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tetris-kxnh5j7hpNEcFspAndlU2huV5n6dvk.mp3"
      />
    </div>
  );
}
