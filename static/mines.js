
  const grid = document.querySelector('.grid');
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

      grid.innerHTML = ''; // Clear previous grid
        //   grid.attr('innerHTML', 'test');
      squares = []; // Reset squares

      // Create a new div for each square in the game board
      for (let i = 0; i < width * height; i++) {
          const square = document.createElement('div');
          square.setAttribute('id', i);
          square.classList.add(bombPositions.includes(i) ? 'bomb' : 'valid');
          console.log('appending square', square)
          grid.append(square);
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

      console.log(grid)
  }


   // Click on square actions
   function click(square) {
    let currentId = square.id;
    if (isGameOver) { return };
    if (square.classList.contains('flag') || square.classList.contains('checked')) { return };
    if (square.classList.contains('one') || square.classList.contains('two') || square.classList.contains('three') || square.classList.contains('four')) {
      //chording here
      //check adjacent bomb is flagged and click surrounding squares
      return
    }
    if (square.classList.contains('bomb')) {
      gameOver();
    } else {
      let total = square.getAttribute('data');
      if (total != 0) {
        square.classList.add('checked');
        if (total == 1) { square.classList.add('one') }; // adding classes for colors
        if (total == 2) { square.classList.add('two') };
        if (total == 3) { square.classList.add('three') };
        if (total == 4) { square.classList.add('four') };
        square.innerHTML = total;
        return
      }
      checkSquare(square, currentId);
    }
    square.classList.add('checked');
  }

  // Check neighboring squares once square is clicked
  // Creates the spreading effect
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        //const newId = parseInt(currentId) - 1   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
      if (currentId > (width-1) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        //const newId = parseInt(currentId) +1 -width   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
      if (currentId >= width) {
        const newId = squares[parseInt(currentId - width)].id;
        //const newId = parseInt(currentId) -width   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
      if (currentId >= (width+1) && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        //const newId = parseInt(currentId) -1 -width   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
      if (currentId <= (width*width-2) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        //const newId = parseInt(currentId) +1   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
      if (currentId < (width*width-width) && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        //const newId = parseInt(currentId) -1 +width   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
      if (currentId <= (width*width-width-2) && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        //const newId = parseInt(currentId) +1 +width   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
      if (currentId <= (width*width-width-1)) {
        const newId = squares[parseInt(currentId) + width].id;
        //const newId = parseInt(currentId) +width   ....refactor
        const newSquare = document.getElementById(newId);
        if (!newSquare.classList.contains('bomb')) {
          click(newSquare);
        }
      }
    }, spreadTimeout);
  }