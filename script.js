let chessGame = {
  turn: COLOR.WHITE,
  selected: null,
  selectedPos: null,
};

const container = document.getElementById("container");

let setup = newBadChessVariant();

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

  resetButton.addEventListener("click", () => {
    setup = newBadChessVariant();
    resetBoard();
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

  let whitePiecesLeft = 16;
  let blackPiecesLeft = 16;

  for (let row = 0; row < 8; row++) {
    setup[row] = [];

    let color = COLOR.BLACK;
    if (row >= 6) {
      color = COLOR.WHITE;
    }

    pieceOrder.sort(() => Math.random() - 0.5);

    for (let col = 0; col < 8; col++) {
      let piece = new Empty();

      if ((row === 0 || row === 7) && col === 4) {
        piece = new King(row === 0 ? COLOR.BLACK : COLOR.WHITE);
        if (row === 0) blackPiecesLeft--;
        else whitePiecesLeft--;
      } else {
        if (
          (color === COLOR.WHITE && whitePiecesLeft > 0) ||
          (color === COLOR.BLACK && blackPiecesLeft > 0)
        ) {
          const randomPieceType =
            pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
          piece = createPiece(randomPieceType, color);

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

                chessGame.turn =
                  chessGame.turn == COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;

                if (chessGame.turn === COLOR.BLACK) {
                  setTimeout(moveAI, 500);
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

  for (let r1 = 0; r1 < 8; r1++) {
    for (let c1 = 0; c1 < 8; c1++) {
      const piece = setup[r1][c1];
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
      chessboard.classList.add("tremor");
      alert("Black wins!");
    } else if (!isKingPresent(setup, COLOR.BLACK)) {
      chessboard.classList.add("tremor");
      alert("White wins!");
    }
  }
  setTimeout(() => {
    location.reload();
  }, 1000);
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

function moveAI() {
  const bestMove = minimax(setup, 2, true);
  const { piece, from, to } = bestMove;
  setup = piece.move(from.row, from.col, to.row, to.col, setup);
  initializeChessboard();

  if (isKingMissing(setup)) {
    declareWinner();
    return;
  }

  chessGame.turn = COLOR.WHITE;
}

function minimax(board, depth, isMaximizing) {
  if (board == null) {
    return { score: 0 };
  }
  if (depth === 0 || isKingMissing(board)) {
    return { score: evaluateBoard(board) };
  }

  const moves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece.getColor() === (isMaximizing ? COLOR.BLACK : COLOR.WHITE)) {
        const possibleMoves = piece.getPossibleMoves(row, col, board);
        possibleMoves.forEach((move) => {
          moves.push({ piece, from: { row, col }, to: move });
        });
      }
    }
  }

  let bestMove;
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = move.piece.move(
        move.from.row,
        move.from.col,
        move.to.row,
        move.to.col,
        [...board.map((arr) => [...arr])],
      );
      const eval = minimax(newBoard, depth - 1, false).score;
      if (eval > maxEval) {
        maxEval = eval;
        bestMove = move;
      }
    }
    bestMove.score = maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = move.piece.move(
        move.from.row,
        move.from.col,
        move.to.row,
        move.to.col,
        [...board.map((arr) => [...arr])],
      );
      const eval = minimax(newBoard, depth - 1, true).score;
      if (eval < minEval) {
        minEval = eval;
        bestMove = move;
      }
    }
    bestMove.score = minEval;
  }
  return bestMove;
}

function evaluateBoard(board) {
  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.getType) {
        score += getPieceValue(piece);
      }
    }
  }
  return score;
}

function getPieceValue(piece) {
  const colorMultiplier = piece.getColor() === COLOR.WHITE ? -1 : 1;
  switch (piece.getType()) {
    case PIECE_TYPE.PAWN:
      return 10 * colorMultiplier;
    case PIECE_TYPE.KNIGHT:
      return 30 * colorMultiplier;
    case PIECE_TYPE.BISHOP:
      return 30 * colorMultiplier;
    case PIECE_TYPE.ROOK:
      return 50 * colorMultiplier;
    case PIECE_TYPE.QUEEN:
      return 90 * colorMultiplier;
    case PIECE_TYPE.KING:
      return 900 * colorMultiplier;
    default:
      return 0;
  }
}
