let chessGame = {
  turn: COLOR.WHITE,
  selected: null,
  selectedPos: null,
};

const container = document.getElementById("container");

let setup = newBadChessVariant(); // Initialize with the bad chess variant

document.addEventListener("DOMContentLoaded", function () {
  initializeChessboard();
  chessboard.classList.remove("tremor"); 
  
  let posX = 0;
  let posY = 0;
  let isMouseDown = false;
  let initialX = 0;
  let initialY = 0;

  container.addEventListener("mousedown", function (event) {
    isMouseDown = true;
    initialX = event.clientX - posX;
    initialY = event.clientY - posY;
  });

  container.addEventListener("mouseup", function () {
    isMouseDown = false;
  });

  container.addEventListener("mousemove", function (event) {
    if (isMouseDown) {
      posX = event.clientX - initialX;
      posY = event.clientY - initialY;

      const maxOffset = 100;

      if (Math.abs(posX) > maxOffset) {
        posX = posX > 0 ? maxOffset : -maxOffset;
      }
      if (Math.abs(posY) > maxOffset) {
        posY = posY > 0 ? maxOffset : -maxOffset;
      }

      container.style.transform = `translateX(${posX}px) translateY(${posY}px)`;
    }
  });

  const resetButton = document.getElementById("resetButton");
  const badChessButton = document.getElementById("badChessVariantButton");

  resetButton.addEventListener("click", resetBoard);
  badChessButton.addEventListener("click", function () {
    setup = newBadChessVariant();
    resetBoard(); // Optionally reset other game state when changing variants
  });
});

function newBadChessVariant() {
  const setup = [];
  const pieceOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
  const pieceTypes = [
    PIECE_TYPE.PAWN,
    PIECE_TYPE.KNIGHT,
    PIECE_TYPE.BISHOP,
    PIECE_TYPE.ROOK,
    PIECE_TYPE.QUEEN,
  ];

  let whitePiecesLeft = 16; // Including 1 King
  let blackPiecesLeft = 16; // Including 1 King

  // Initialize the board
  for (let row = 0; row < 8; row++) {
    setup[row] = [];
    
    // Determine color based on row position
    let color = COLOR.BLACK; // Default to black for top two ranks
    if (row >= 6) {
      color = COLOR.WHITE; // Switch to white for bottom two ranks
    }

    // Shuffle piece order for each row
    pieceOrder.sort(() => Math.random() - 0.5);

    for (let col = 0; col < 8; col++) {
      let piece = new Empty();
      
      // Ensure one king per side
      if ((row === 0 || row === 7) && col === 4) {
        piece = new King(row === 0 ? COLOR.BLACK : COLOR.WHITE);
        if (row === 0) blackPiecesLeft--;
        else whitePiecesLeft--;
      } else {
        // Randomly assign other pieces
        if ((color === COLOR.WHITE && whitePiecesLeft > 0) || (color === COLOR.BLACK && blackPiecesLeft > 0)) {
          const randomPieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
          piece = createPiece(randomPieceType, color);
          
          // Decrease count for the assigned color
          if (color === COLOR.BLACK) {
            blackPiecesLeft--;
          } else {
            whitePiecesLeft--;
          }
        }
      }
      
      setup[row][col] = piece;
    }
  }

  return setup;
}


function createPiece(pieceType, color) {
  switch (pieceType) {
    case PIECE_TYPE.PAWN:
      return new Pawn(color);
    case PIECE_TYPE.KNIGHT:
      return new Knight(color);
    case PIECE_TYPE.BISHOP:
      return new Bishop(color);
    case PIECE_TYPE.ROOK:
      return new Rook(color);
    case PIECE_TYPE.QUEEN:
      return new Queen(color);
    default:
      return new Empty();
  }
}

function resetBoard() {
  // Reset game state variables if any
  chessGame.turn = COLOR.WHITE;
  chessGame.selected = null;
  chessGame.selectedPos = null;

  initializeChessboard();
  chessboard.classList.add("tremor");
  setTimeout(() => {
    chessboard.classList.remove("tremor");
  }, 500);
}

function initializeChessboard() {
  const chessboard = document.getElementById("chessboard");

  chessboard.innerHTML = "";

  for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    const row = Math.floor(i / 8);
    const col = i % 8;

    if ((row + col) % 2 === 0) {
      square.classList.add("white");
    } else {
      square.classList.add("black");
    }

    chessboard.appendChild(square);
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = setup[row][col];
      if (piece) {
        const square = chessboard.children[row * 8 + col];
        const pieceElement = document.createElement("span");
        pieceElement.classList.add("piece");
        square.addEventListener("click", function () {
          if (chessGame.selected == null) {
            if (setup[row][col].getColor() == chessGame.turn) {
              chessGame.selected = setup[row][col];
              chessGame.selectedPos = { r: row, c: col };
              highlightPossibleMoves(chessGame.selected, row, col, setup);
            }
          } else {
            if (setup[row][col].getColor() === chessGame.selected.getColor()) {
              chessGame.selected = setup[row][col];
              chessGame.selectedPos = { r: row, c: col };
              clearHighlights();
              highlightPossibleMoves(chessGame.selected, row, col, setup);
            } else {
              let set = chessGame.selected.move(
                chessGame.selectedPos.r,
                chessGame.selectedPos.c,
                row,
                col,
                setup,
              );
              if (set != null) {
                setup = set;
                chessGame.selected = null;
                chessGame.selectedPos = null;
                initializeChessboard();

                if (isKingMissing(setup)) {
                  declareWinner();
                  return;
                }

                if (chessGame.turn == COLOR.WHITE) {
                  chessGame.turn = COLOR.BLACK;
                } else {
                  chessGame.turn = COLOR.WHITE;
                }
              }
            }
          }
        });

        square.addEventListener("contextmenu", (ev) => {
          ev.preventDefault();
          chessGame.selected = null;
          chessGame.selectedPos = null;
          clearHighlights();
        });

        pieceElement.textContent = getPieceSymbol(piece);
        square.appendChild(pieceElement);
      }
    }
  }

  function highlightPossibleMoves(piece, row, col, setup) {
    clearHighlights();
    const possibleMoves = piece.getPossibleMoves(row, col, setup);
    possibleMoves.forEach((move) => {
      const moveSquare = chessboard.children[move.row * 8 + move.col];
      moveSquare.classList.add("highlight");
    });
  }

  function clearHighlights() {
    const highlightedSquares = chessboard.querySelectorAll(".highlight");
    highlightedSquares.forEach((square) => {
      square.classList.remove("highlight");
    });
  }

  function getPieceSymbol(piece) {
    const type = piece.getType();
    const color = piece.getColor();
    if (color === COLOR.WHITE) {
      switch (type) {
        case PIECE_TYPE.PAWN:
          return "♙";
        case PIECE_TYPE.KNIGHT:
          return "♘";
        case PIECE_TYPE.BISHOP:
          return "♗";
        case PIECE_TYPE.ROOK:
          return "♖";
        case PIECE_TYPE.QUEEN:
          return "♕";
        case PIECE_TYPE.KING:
          return "♔";
        default:
          return "";
      }
    } else {
      switch (type) {
        case PIECE_TYPE.PAWN:
          return "♟";
        case PIECE_TYPE.KNIGHT:
          return "♞";
        case PIECE_TYPE.BISHOP:
          return "♝";
        case PIECE_TYPE.ROOK:
          return "♜";
        case PIECE_TYPE.QUEEN:
          return "♛";
        case PIECE_TYPE.KING:
          return "♚";
        default:
          return "";
      }
    }
  }
}

function isKingMissing(setup) {
  let whiteKingAlive = false;
  let blackKingAlive = false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = setup[row][col];
      if (piece instanceof King) {
        if (piece.getColor() === COLOR.WHITE) {
          whiteKingAlive = true;
        } else if (piece.getColor() === COLOR.BLACK) {
          blackKingAlive = true;
        }
      }
    }
  }

  return !whiteKingAlive || !blackKingAlive;
}

function declareWinner() {
  if (isKingMissing(setup)) {
    if (!isKingPresent(setup, COLOR.WHITE)) {
      chessboard.classList.add("tremor"); // Apply tremor effect
      alert("Black wins!");
    } else if (!isKingPresent(setup, COLOR.BLACK)) {
      chessboard.classList.add("tremor"); // Apply tremor effect
      alert("White wins!");
    }
  }
  setTimeout(() => {
    location.reload(); // Reload page after delay
  }, 1000); // Adjust delay time as needed
}

function isKingPresent(setup, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = setup[row][col];
      if (piece instanceof King && piece.getColor() === color) {
        return true;
      }
    }
  }
  return false;
}
