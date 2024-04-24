document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const flagsLeft = document.querySelector('#flags-left');
  const result = document.querySelector('#result');
  const timer = document.querySelector('#timer');
  const emojiBtn = document.querySelector('.emoji-btn');
  const spreadTimeout = 15;
  let bombPositions = []; // Array of indices where bombs are located
  let width = 10; // Default width
  let height = 10; // Default height
  let bombAmount = 20; // Default bomb amount
  let flags = 0;
  let squares = [];
  let isGameOver = false;
  
  // Function to initialize the game
  function initGame(inputArray, w, h) {
      bombPositions = inputArray;
      width = w;
      height = h;
      bombAmount = bombPositions.length;
      createBoard();
  }
  
  // Create Board
  function createBoard() {
      flagsLeft.innerHTML = bombAmount;
      grid.innerHTML = ''; // Clear previous grid
      squares = []; // Reset squares

      // Create a new div for each square in the game board
      for (let i = 0; i < width * height; i++) {
          const square = document.createElement('div');
          square.setAttribute('id', i);
          square.classList.add(bombPositions.includes(i) ? 'bomb' : 'valid');
          grid.appendChild(square);
          squares.push(square);

          // Normal Click
          square.addEventListener('click', function(e) {
              if (isGameOver) { return }
              click(square);
          });

          // Right Click to add flag
          square.oncontextmenu = function(e) {
              e.preventDefault();
              addFlag(square);
          }
      }

      // Add numbers to the squares
      for (let i = 0; i < squares.length; i++) {
          let total = 0;
          const isLeftEdge = (i % width === 0);
          const isRightEdge = (i % width === width - 1);

          if (squares[i].classList.contains('valid')) {
              if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
              if (i > (width - 1) && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
              if (i > width && squares[i - width].classList.contains('bomb')) total++;
              if (i > (width + 1) && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
              if (i < (width * height - 2) && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
              if (i < (width * height - width) && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
              if (i < (width * height - width - 2) && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
              if (i < (width * height - width - 1) && squares[i + width].classList.contains('bomb')) total++;
              squares[i].setAttribute('data', total);
          }
      }
  }

  // Assuming initGame is called with parameters like:
  // initGame([1, 25, 49], 10, 10); // Bomb positions, width, height
});

