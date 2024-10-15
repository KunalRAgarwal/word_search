import { useEffect, useState } from 'react';
import { wordMapper, gridFiller } from './helper';
import './App.css';

function App() {
  const [words, setWords] = useState({});
  const [gridWords, setGridWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]); // Track selected cells
  const [isDragging, setIsDragging] = useState(false); // Track if the user is dragging
  const [direction, setDirection] = useState(null); // Track direction of selection
  const [foundCells, setFoundCells] = useState([]); // Track cells that are part of found words

  useEffect(() => {
    let wordToSearch = wordMapper();
    setWords(wordToSearch);
    setGridWords(gridFiller(wordToSearch));
  }, []);

  // Handle cell mouse down event (start dragging)
  const handleMouseDown = (rowIndex, colIndex) => {
    setIsDragging(true);
    setSelectedCells([{ row: rowIndex, col: colIndex }]);
  };

  // Handle mouse enter event (drag over cells)
  const handleMouseEnter = (rowIndex, colIndex) => {
    if (isDragging) {
      if (selectedCells.length === 1) {
        // Determine direction based on the second cell selected
        if (selectedCells[0].row === rowIndex) {
          setDirection('HORIZONTAL');
        } else if (selectedCells[0].col === colIndex) {
          setDirection('VERTICAL');
        }
      } else {
        // Continue selecting only if the direction is maintained
        if (direction === 'HORIZONTAL' && selectedCells[0].row !== rowIndex) return;
        if (direction === 'VERTICAL' && selectedCells[0].col !== colIndex) return;
      }

      // Prevent adding duplicate cells
      if (!selectedCells.some((cell) => cell.row === rowIndex && cell.col === colIndex)) {
        setSelectedCells((prev) => [...prev, { row: rowIndex, col: colIndex }]);
      }
    }
  };

  // Handle mouse up event (end dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
    checkIfWordFound(selectedCells);
    setSelectedCells([]);
    setDirection(null);
  };

  // Check if selected cells form a valid word
  const checkIfWordFound = (selectedCells) => {
    if (selectedCells.length < 2) return;

    let selectedWord = '';
    for (let cell of selectedCells) {
      selectedWord += gridWords[cell.row][cell.col];
    }

    console.log(selectedWord, "selectedWord");

    // If word is found, update state and remove it from the search list
    if (words.hasOwnProperty(selectedWord) && !words[selectedWord]) {
      setWords((prevWords) => {
        const { [selectedWord]: _, ...remainingWords } = prevWords; // Remove found word immutably
        return remainingWords;
      });

      // Add the found cells to the foundCells state
      setFoundCells((prev) => [...prev, ...selectedCells]);
    }
  };

  // Check if all words are found
  const isGameWon = Object.keys(words).length === 0;

  const RowShower = ({ rowVal, rowIndex }) => {
    return (
      <div className="row">
        {rowVal.map((char, colIndex) => (
          <span
            key={colIndex}
            className={`cell ${getCellClass(rowIndex, colIndex)}`}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            onMouseUp={handleMouseUp}
          >
            {char}
          </span>
        ))}
      </div>
    );
  };

  // Function to check if a cell is selected
  const isSelected = (rowIndex, colIndex) => {
    return selectedCells.some((cell) => cell.row === rowIndex && cell.col === colIndex);
  };

  // Function to determine the appropriate CSS class for a cell
  const getCellClass = (rowIndex, colIndex) => {
    if (foundCells.some((cell) => cell.row === rowIndex && cell.col === colIndex)) {
      return 'found';
    }
    if (isSelected(rowIndex, colIndex)) {
      return 'selected';
    }
    return '';
  };

  return (
    <div className="container">
      <div className="gridContainer">
        <div className="App">
          {gridWords.map((row, index) => (
            <RowShower key={index} rowVal={row} rowIndex={index} />
          ))}
        </div>
      </div>
      <div className="AppRight">
        <h4>Words To Search</h4>
        {Object.keys(words).map((key) => (
          <div className="wordsshow" key={key}>
            {key}
          </div>
        ))}
        {isGameWon && <h4 className="won-message">You Won!</h4>}
      </div>
    </div>
  );
}

export default App;
