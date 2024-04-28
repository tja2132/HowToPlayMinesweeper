// Adding an event listener

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const timer = document.querySelector('#timer');
    const emojiBtn = document.querySelector('.reset-btn');
    const spreadTimeout = 15
    let width = 10;
    let height = width
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let count = 0; // used for timer
    let intervalRef = null; // used for timer
    let isGameOver = false;
    
    // Create Board
    function createBoard() {
      // Get shuffled game array with random bombs
      const bombsArray = Array(bombAmount).fill('bomb'); // create bomb array
      const emptyArray = Array(width * height - bombAmount).fill('valid'); // create empty array
      const gameArray = emptyArray.concat(bombsArray); // combine both arrays
      const shuffledArray = gameArray.sort(() => Math.random() - 0.5); // shuffle bombs throughout
  
      flagsLeft.innerHTML = bombAmount;
  
      // creates a new div for each square in the game board
      for (let i = 0; i < width * height; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);
  
        // Normal Click
        square.addEventListener('click', function(e) {
          if (isGameOver) { return }
          click(square);
        });
  
        // ctrl and Left Click
        square.oncontextmenu = function(e) {
          e.preventDefault();
          addFlag(square);
        }
  
        // Mouseover
        // square.addEventListener('mouseover', function(e) {
        //   if (isGameOver) { return }
        //   emojiBtn.innerHTML = '🤔'; 
        // });
      }
  
      // Add numbers to the squares
      for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);
  
        if (squares[i].classList.contains('valid')) {
          if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) { total++ };
          if (i > (width-1) && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) { total++ };
          if (i > width && squares[i - width].classList.contains('bomb')) { total++ };
          if (i > (width+1) && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) { total++ };
          if (i < (width*height-2) && !isRightEdge && squares[i + 1].classList.contains('bomb')) { total++ };
          if (i < (width*height-width) && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) { total++ };
          if (i < (width*height-width-2) && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) { total++ };
          if (i < (width*height-width-1) && squares[i + width].classList.contains('bomb')) { total++ };
          squares[i].setAttribute('data', total);
        }
      }
    }
    createBoard();
  
    // Add flag with right click
    function addFlag(square) {
      if (isGameOver) { return }
      if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
          square.classList.add('flag');
          square.innerHTML = '🚩';
          flags++;
          flagsLeft.innerHTML = bombAmount - flags;
          checkForWin();
        } else { 
          square.classList.remove('flag');
          square.innerHTML = '';
          flags--;
          flagsLeft.innerHTML = bombAmount - flags; // fix so that you can uncheck flag if last flag has been placed
        } 
      }
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
   
    // Game Over
    function gameOver(square) {
      clearInterval(intervalRef);
      timer.innerHTML = 'END';
      emojiBtn.innerHTML = 'You Lose! Reset';
      result.innerHTML = 'BOOM! Game Over!';
      isGameOver = true;
  
      // Show ALL the bombs
      squares.forEach(square => {
        if (square.classList.contains('bomb')) {
          square.innerHTML = '💣';
        }
      });
    }
  
    // Check for Win
    function checkForWin() {
      let matches = 0;
  
      for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
          matches++;
        }
        if (matches === bombAmount) {
          clearInterval(intervalRef);
          timer.innerHTML = 'WIN'
          emojiBtn.innerHTML = 'You win!';
          result.innerHTML = 'YOU WIN!';
          isGameOver = true;
        }
      }
    }
  
    // Reload Game
    emojiBtn.addEventListener('click', function(e) {
      emojiBtn.style.borderColor = '#F0B7A4 #FFEBCF #FFEBCF #F0B7A4';
      location.reload();
    });
  });