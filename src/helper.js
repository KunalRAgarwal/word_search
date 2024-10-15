import { words, alphabets } from "./constants";

export const wordMapper = () => {
  let mapper = {};
  var i = 0;
  while (i < 7) {
    let word_index = Math.floor(Math.random() * words.length);
    let word_searched = words[word_index];
    if (!mapper.hasOwnProperty(word_searched)) {
      mapper[word_searched] = false;
      i++;
    }
  }
  return mapper;
};

export const gridFiller = (wordsList) => {
  let grid = Array(15)
    .fill(null)
    .map(() => Array(15).fill(null));

  // Helper function to check if word can fit
  const canPlaceWord = (word, row, col, direction) => {
    if (direction === "HORIZONTAL") {
      if (col + word.length > 15) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== null && grid[row][col + i] !== word[i]) {
          return false;
        }
      }
    } else if (direction === "VERTICAL") {
      if (row + word.length > 15) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== null && grid[row + i][col] !== word[i]) {
          return false;
        }
      }
    }
    return true;
  };

  // Helper function to place word in grid
  const placeWord = (word, row, col, direction) => {
    if (direction === "HORIZONTAL") {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
    } else if (direction === "VERTICAL") {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
    }
  };

  // Place each word in the grid
  for(let word in wordsList){
    let placed = false;
    while (!placed) {
      let direction = Math.random() > 0.5 ? "HORIZONTAL" : "VERTICAL";
      let row = Math.floor(Math.random() * 15);
      let col = Math.floor(Math.random() * 15);

      if (canPlaceWord(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        placed = true;
      }
    }
  };

  // Fill the remaining empty cells with random alphabets
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (grid[i][j] === null) {
        let randomIndex = Math.floor(Math.random() * alphabets.length);
        grid[i][j] = alphabets[randomIndex];
      }
    }
  }

  return grid;
};
