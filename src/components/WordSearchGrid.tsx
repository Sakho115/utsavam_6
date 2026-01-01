import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ============ CONFIGURABLE WORDS ============
// Edit this array to change the words in the game
export const WORDS_TO_FIND = [
  'UTSAVAM',
  'TALENT',
  'CULTURE',
  'EXPRESS',
  'TEAM',
  'STAGE',
  'VOICE'
];

// Grid size (adjust if needed for more/longer words)
const GRID_SIZE = 12;

type Direction = [number, number];
type Position = { row: number; col: number };

const DIRECTIONS: Direction[] = [
  [0, 1],   // right
  [1, 0],   // down
  [1, 1],   // diagonal down-right
  [-1, 1],  // diagonal up-right
  [0, -1],  // left
  [-1, 0],  // up
  [-1, -1], // diagonal up-left
  [1, -1],  // diagonal down-left
];

function generateGrid(words: string[], size: number): { grid: string[][]; wordPositions: Map<string, Position[]> } {
  const grid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));
  const wordPositions = new Map<string, Position[]>();
  
  // Sort words by length (longest first for better placement)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  for (const word of sortedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!placed && attempts < maxAttempts) {
      attempts++;
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);
      
      if (canPlaceWord(grid, word, startRow, startCol, direction, size)) {
        const positions: Position[] = [];
        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * direction[0];
          const col = startCol + i * direction[1];
          grid[row][col] = word[i];
          positions.push({ row, col });
        }
        wordPositions.set(word, positions);
        placed = true;
      }
    }
  }
  
  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
  
  return { grid, wordPositions };
}

function canPlaceWord(grid: string[][], word: string, startRow: number, startCol: number, direction: Direction, size: number): boolean {
  for (let i = 0; i < word.length; i++) {
    const row = startRow + i * direction[0];
    const col = startCol + i * direction[1];
    
    if (row < 0 || row >= size || col < 0 || col >= size) return false;
    if (grid[row][col] !== '' && grid[row][col] !== word[i]) return false;
  }
  return true;
}

interface WordSearchGridProps {
  onWordFound: (word: string) => void;
  foundWords: string[];
}

const WordSearchGrid = ({ onWordFound, foundWords }: WordSearchGridProps) => {
  const [gridData] = useState(() => generateGrid(WORDS_TO_FIND, GRID_SIZE));
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  
  const getCellKey = (row: number, col: number) => `${row}-${col}`;
  
  const getSelectedWord = useCallback((cells: Position[]) => {
    return cells.map(pos => gridData.grid[pos.row][pos.col]).join('');
  }, [gridData.grid]);
  
  const checkWord = useCallback((cells: Position[]) => {
    const selectedWord = getSelectedWord(cells);
    const reversedWord = selectedWord.split('').reverse().join('');
    
    for (const word of WORDS_TO_FIND) {
      if ((selectedWord === word || reversedWord === word) && !foundWords.includes(word)) {
        // Mark cells as found
        const newFoundCells = new Set(foundCells);
        cells.forEach(pos => newFoundCells.add(getCellKey(pos.row, pos.col)));
        setFoundCells(newFoundCells);
        onWordFound(word);
        return true;
      }
    }
    return false;
  }, [foundWords, foundCells, getSelectedWord, onWordFound]);
  
  const getCellFromEvent = (e: React.TouchEvent | React.MouseEvent): Position | null => {
    if (!gridRef.current) return null;
    
    const rect = gridRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const cellSize = rect.width / GRID_SIZE;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { row, col };
    }
    return null;
  };
  
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (cell) {
      setIsSelecting(true);
      setSelectedCells([cell]);
    }
  };
  
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSelecting) return;
    e.preventDefault();
    
    const cell = getCellFromEvent(e);
    if (!cell) return;
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (selectedCells.length > 0) {
      const first = selectedCells[0];
      const last = cell;
      
      const rowDiff = last.row - first.row;
      const colDiff = last.col - first.col;
      
      // Check if it's a valid direction
      const absRowDiff = Math.abs(rowDiff);
      const absColDiff = Math.abs(colDiff);
      
      if (absRowDiff === 0 || absColDiff === 0 || absRowDiff === absColDiff) {
        const length = Math.max(absRowDiff, absColDiff) + 1;
        const rowStep = rowDiff === 0 ? 0 : rowDiff / absRowDiff;
        const colStep = colDiff === 0 ? 0 : colDiff / absColDiff;
        
        const newCells: Position[] = [];
        for (let i = 0; i < length; i++) {
          newCells.push({
            row: first.row + i * rowStep,
            col: first.col + i * colStep
          });
        }
        setSelectedCells(newCells);
      }
    }
  };
  
  const handleEnd = () => {
    if (isSelecting && selectedCells.length > 1) {
      checkWord(selectedCells);
    }
    setIsSelecting(false);
    setSelectedCells([]);
  };
  
  // Prevent scrolling on touch devices while selecting
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isSelecting) e.preventDefault();
    };
    
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, [isSelecting]);
  
  return (
    <div
      ref={gridRef}
      className="grid select-none touch-none"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        aspectRatio: '1',
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {gridData.grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const key = getCellKey(rowIndex, colIndex);
          const isSelected = selectedCells.some(
            pos => pos.row === rowIndex && pos.col === colIndex
          );
          const isFound = foundCells.has(key);
          
          return (
            <div
              key={key}
              className={cn(
                'flex items-center justify-center font-display text-xs sm:text-sm md:text-base lg:text-lg font-semibold',
                'aspect-square transition-all duration-200 rounded-sm',
                'border border-border/30',
                isFound && 'bg-primary/30 text-primary border-primary/50',
                isSelected && !isFound && 'bg-accent/40 text-accent-foreground scale-110 border-accent/60',
                !isFound && !isSelected && 'text-foreground/70 hover:bg-muted/30'
              )}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
};

export default WordSearchGrid;
