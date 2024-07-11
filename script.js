let chessGame = {
  turn: COLOR.WHITE,
  selected: null,
  selectedPos: null,
};

const container = document.getElementById("container");

let setup = [
  [
    new Rook(COLOR.BLACK),
    new Knight(COLOR.BLACK),
    new Bishop(COLOR.BLACK),
    new Queen(COLOR.BLACK),
    new King(COLOR.BLACK),
    new Bishop(COLOR.BLACK),
    new Knight(COLOR.BLACK),
    new Rook(COLOR.BLACK),
  ],
  Array(8).fill(new Pawn(COLOR.BLACK)),
  Array(8).fill(new Empty()),
  Array(8).fill(new Empty()),
  Array(8).fill(new Empty()),
  Array(8).fill(new Empty()),
  Array(8).fill(new Pawn(COLOR.WHITE)),
  [
    new Rook(COLOR.WHITE),
    new Knight(COLOR.WHITE),
    new Bishop(COLOR.WHITE),
    new Queen(COLOR.WHITE),
    new King(COLOR.WHITE),
    new Bishop(COLOR.WHITE),
    new Knight(COLOR.WHITE),
    new Rook(COLOR.WHITE),
  ],
];

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
      const resetButton = document.getElementById("resetButton");
      resetButton.addEventListener("click", resetBoard);
    }
  });
});

function resetBoard() {
  // Reset game state variables if any
  chessGame.turn = COLOR.WHITE;
  chessGame.selected = null;
  chessGame.selectedPos = null;

  // Reset setup to initial configuration
  setup = [
    [
      new Rook(COLOR.BLACK),
      new Knight(COLOR.BLACK),
      new Bishop(COLOR.BLACK),
      new Queen(COLOR.BLACK),
      new King(COLOR.BLACK),
      new Bishop(COLOR.BLACK),
      new Knight(COLOR.BLACK),
      new Rook(COLOR.BLACK),
    ],
    Array(8).fill(new Pawn(COLOR.BLACK)),
    Array(8).fill(new Empty()),
    Array(8).fill(new Empty()),
    Array(8).fill(new Empty()),
    Array(8).fill(new Empty()),
    Array(8).fill(new Pawn(COLOR.WHITE)),
    [
      new Rook(COLOR.WHITE),
      new Knight(COLOR.WHITE),
      new Bishop(COLOR.WHITE),
      new Queen(COLOR.WHITE),
      new King(COLOR.WHITE),
      new Bishop(COLOR.WHITE),
      new Knight(COLOR.WHITE),
      new Rook(COLOR.WHITE),
    ],
  ];

  // Reinitialize the chessboard UI
  initializeChessboard();
  chessboard.classList.add("tremor");
  setTimeout(() => {
    chessboard.classList.remove("tremor");
  }, 500)
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