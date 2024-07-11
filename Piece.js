class Piece {
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }

  getType() {
    return this.type;
  }

  getColor() {
    return this.color;
  }

  toString() {
    return `${this.color} ${this.type}`;
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    return setup;
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    return [];
  }

  isKingInCheck(setup, color) {
    let kingPosition = null;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = setup[row][col];
        if (piece.getType() === PIECE_TYPE.KING && piece.getColor() === color) {
          kingPosition = { row, col };
          break;
        }
      }
    }

    if (!kingPosition) return false;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = setup[row][col];
        if (piece.getColor() !== color && piece.getColor() !== null) {
          const possibleMoves = piece.getPossibleMoves(row, col, setup);
          for (const move of possibleMoves) {
            if (
              move.row === kingPosition.row &&
              move.col === kingPosition.col
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  isCheckmate(setup, color) {
    if (!this.isKingInCheck(setup, color)) return false;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = setup[row][col];
        if (piece.getColor() === color) {
          const possibleMoves = piece.getPossibleMoves(row, col, setup);
          for (const move of possibleMoves) {
            const tempSetup = JSON.parse(JSON.stringify(setup));
            tempSetup[move.row][move.col] = tempSetup[row][col];
            tempSetup[row][col] = new Empty();
            if (!this.isKingInCheck(tempSetup, color)) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }
}

const PIECE_TYPE = Object.freeze({
  PAWN: "Pawn",
  KNIGHT: "Knight",
  BISHOP: "Bishop",
  ROOK: "Rook",
  QUEEN: "Queen",
  KING: "King",
  EMPTY: "EMPTY",
});

const COLOR = Object.freeze({
  WHITE: "White",
  BLACK: "Black",
});

class Pawn extends Piece {
  constructor(color) {
    super(PIECE_TYPE.PAWN, color);
    this.hasMoved = false;
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    let move = getValidMoves(
      PIECE_TYPE.PAWN,
      currentRow,
      currentColumn,
      desiredRow,
      desiredColumn,
      setup,
    );
    if (move != null) {
      return move;
    }
    return null;
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    const moves = [];
    const forwardDirection = this.color === COLOR.WHITE ? -1 : 1;

    if (setup[currentRow + forwardDirection][currentColumn] instanceof Empty) {
      moves.push({ row: currentRow + forwardDirection, col: currentColumn });
    }

    const initialRow = this.color === COLOR.WHITE ? 6 : 1;
    if (
      currentRow === initialRow &&
      setup[currentRow + 2 * forwardDirection][currentColumn] instanceof Empty
    ) {
      moves.push({
        row: currentRow + 2 * forwardDirection,
        col: currentColumn,
      });
    }

    if (
      currentColumn > 0 &&
      !(
        setup[currentRow + forwardDirection][currentColumn - 1] instanceof Empty
      ) &&
      setup[currentRow + forwardDirection][currentColumn - 1].getColor() !==
        this.color
    ) {
      moves.push({
        row: currentRow + forwardDirection,
        col: currentColumn - 1,
      });
    }
    if (
      currentColumn < 7 &&
      !(
        setup[currentRow + forwardDirection][currentColumn + 1] instanceof Empty
      ) &&
      setup[currentRow + forwardDirection][currentColumn + 1].getColor() !==
        this.color
    ) {
      moves.push({
        row: currentRow + forwardDirection,
        col: currentColumn + 1,
      });
    }

    return moves;
  }
}

function getValidMoves(
  piece,
  currentRow,
  currentCol,
  desiredRow,
  desiredCol,
  setup,
) {
  const currentPiece = setup[currentRow][currentCol];
  const destinationPiece = setup[desiredRow][desiredCol];

  if (desiredRow === currentRow && desiredCol === currentCol) {
    console.log(
      "Invalid Move: Desired position is the same as the current position",
    );
    return null;
  }

  switch (piece) {
    case PIECE_TYPE.PAWN:
      if (
        validatePawnMove(
          currentPiece,
          destinationPiece,
          currentRow,
          currentCol,
          desiredRow,
          desiredCol,
        )
      ) {
        setup[desiredRow][desiredCol] = currentPiece;
        setup[currentRow][currentCol] = new Empty();
        return setup;
      }
      break;
    default:
      console.log("Invalid Piece Type");
      break;
  }

  console.log("Invalid Move for Piece");
  return null;
}

function validatePawnMove(
  currentPiece,
  destinationPiece,
  currentRow,
  currentCol,
  desiredRow,
  desiredCol,
) {
  const color = currentPiece.getColor();
  const forwardDirection = color === COLOR.WHITE ? -1 : 1;
  const initialRow = color === COLOR.WHITE ? 6 : 1;
  const isInitialMove =
    currentRow === initialRow &&
    desiredRow === currentRow + 2 * forwardDirection;

  if (isInitialMove && currentCol === desiredCol) {
    const middleRow = currentRow + forwardDirection;
    if (
      setup[middleRow][currentCol] instanceof Empty &&
      destinationPiece instanceof Empty
    ) {
      return true;
    } else return false;
  }

  if (desiredCol === currentCol && destinationPiece instanceof Empty) {
    if (desiredRow === currentRow + forwardDirection || isInitialMove) {
      return true;
    }
  }

  if (
    Math.abs(desiredCol - currentCol) === 1 &&
    desiredRow === currentRow + forwardDirection
  ) {
    if (
      destinationPiece.getColor() !== color &&
      !(destinationPiece instanceof Empty)
    ) {
      return true;
    }
  }

  return false;
}

class Knight extends Piece {
  constructor(color) {
    super(PIECE_TYPE.KNIGHT, color);
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    if (
      validateKnightMove(
        currentRow,
        currentColumn,
        desiredRow,
        desiredColumn,
        setup,
      )
    ) {
      setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
      setup[currentRow][currentColumn] = new Empty();
      return setup;
    } else {
      console.log("Invalid Move for Knight");
      return null;
    }
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    const moves = [];
    const knightMoves = [
      { row: 2, col: 1 },
      { row: 2, col: -1 },
      { row: -2, col: 1 },
      { row: -2, col: -1 },
      { row: 1, col: 2 },
      { row: 1, col: -2 },
      { row: -1, col: 2 },
      { row: -1, col: -2 },
    ];

    knightMoves.forEach((move) => {
      const newRow = currentRow + move.row;
      const newCol = currentColumn + move.col;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const destinationPiece = setup[newRow][newCol];
        if (
          destinationPiece instanceof Empty ||
          destinationPiece.getColor() !== this.color
        ) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });

    return moves;
  }
}

function validateKnightMove(
  currentRow,
  currentColumn,
  desiredRow,
  desiredColumn,
  setup,
) {
  const deltaX = Math.abs(desiredColumn - currentColumn);
  const deltaY = Math.abs(desiredRow - currentRow);

  if ((deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1)) {
    const destinationPiece = setup[desiredRow][desiredColumn];
    const currentPiece = setup[currentRow][currentColumn];
    if (
      destinationPiece instanceof Empty ||
      destinationPiece.getColor() !== currentPiece.getColor()
    ) {
      return true;
    }
  }

  console.log("Invalid knight move");
  return false;
}

class Bishop extends Piece {
  constructor(color) {
    super(PIECE_TYPE.BISHOP, color);
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    if (
      validateBishopMove(
        currentRow,
        currentColumn,
        desiredRow,
        desiredColumn,
        setup,
      )
    ) {
      setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
      setup[currentRow][currentColumn] = new Empty();
      return setup;
    } else {
      console.log("Invalid Move for Bishop");
      return null;
    }
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    const moves = [];
    const directions = [
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];

    directions.forEach((direction) => {
      for (let i = 1; i < 8; i++) {
        const newRow = currentRow + direction.row * i;
        const newCol = currentColumn + direction.col * i;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const destinationPiece = setup[newRow][newCol];
          if (destinationPiece instanceof Empty) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (destinationPiece.getColor() !== this.color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        } else {
          break;
        }
      }
    });

    return moves;
  }
}

function validateBishopMove(
  currentRow,
  currentColumn,
  desiredRow,
  desiredColumn,
  setup,
) {
  const deltaX = Math.abs(desiredColumn - currentColumn);
  const deltaY = Math.abs(desiredRow - currentRow);

  if (deltaX === deltaY) {
    const directionX = (desiredColumn - currentColumn) / deltaX;
    const directionY = (desiredRow - currentRow) / deltaY;

    for (let i = 1; i < deltaX; i++) {
      const checkRow = currentRow + i * directionY;
      const checkCol = currentColumn + i * directionX;

      if (setup[checkRow][checkCol] instanceof Empty) {
        continue;
      } else {
        console.log("Invalid Bishop move");
        return false;
      }
    }

    const destinationPiece = setup[desiredRow][desiredColumn];
    const currentPiece = setup[currentRow][currentColumn];
    if (
      destinationPiece instanceof Empty ||
      destinationPiece.getColor() !== currentPiece.getColor()
    ) {
      return true;
    }
  }

  console.log("Invalid Bishop move");
  return false;
}

class Rook extends Piece {
  constructor(color) {
    super(PIECE_TYPE.ROOK, color);
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    if (
      validateRookMove(
        currentRow,
        currentColumn,
        desiredRow,
        desiredColumn,
        setup,
      )
    ) {
      setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
      setup[currentRow][currentColumn] = new Empty();
      return setup;
    } else {
      console.log("Invalid Move for Rook");
      return null;
    }
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    const moves = [];
    const directions = [
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },
    ];

    directions.forEach((direction) => {
      for (let i = 1; i < 8; i++) {
        const newRow = currentRow + direction.row * i;
        const newCol = currentColumn + direction.col * i;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const destinationPiece = setup[newRow][newCol];
          if (destinationPiece instanceof Empty) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (destinationPiece.getColor() !== this.color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        } else {
          break;
        }
      }
    });

    return moves;
  }
}

function validateRookMove(
  currentRow,
  currentColumn,
  desiredRow,
  desiredColumn,
  setup,
) {
  if (desiredRow === currentRow) {
    const direction =
      (desiredColumn - currentColumn) / Math.abs(desiredColumn - currentColumn);

    for (
      let i = currentColumn + direction;
      i !== desiredColumn;
      i += direction
    ) {
      if (!(setup[currentRow][i] instanceof Empty)) {
        console.log("Invalid Rook move");
        return false;
      }
    }

    const destinationPiece = setup[desiredRow][desiredColumn];
    const currentPiece = setup[currentRow][currentColumn];
    if (
      destinationPiece instanceof Empty ||
      destinationPiece.getColor() !== currentPiece.getColor()
    ) {
      return true;
    }
  } else if (desiredColumn === currentColumn) {
    const direction =
      (desiredRow - currentRow) / Math.abs(desiredRow - currentRow);

    for (let i = currentRow + direction; i !== desiredRow; i += direction) {
      if (!(setup[i][currentColumn] instanceof Empty)) {
        console.log("Invalid Rook move");
        return false;
      }
    }

    const destinationPiece = setup[desiredRow][desiredColumn];
    const currentPiece = setup[currentRow][currentColumn];
    if (
      destinationPiece instanceof Empty ||
      destinationPiece.getColor() !== currentPiece.getColor()
    ) {
      return true;
    }
  }

  console.log("Invalid Rook move");
  return false;
}

class Queen extends Piece {
  constructor(color) {
    super(PIECE_TYPE.QUEEN, color);
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    if (
      validateQueenMove(
        currentRow,
        currentColumn,
        desiredRow,
        desiredColumn,
        setup,
      )
    ) {
      setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
      setup[currentRow][currentColumn] = new Empty();
      return setup;
    } else {
      console.log("Invalid Move for Queen");
      return null;
    }
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    const moves = [];
    const directions = [
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];

    directions.forEach((direction) => {
      for (let i = 1; i < 8; i++) {
        const newRow = currentRow + direction.row * i;
        const newCol = currentColumn + direction.col * i;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const destinationPiece = setup[newRow][newCol];
          if (destinationPiece instanceof Empty) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (destinationPiece.getColor() !== this.color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        } else {
          break;
        }
      }
    });

    return moves;
  }
}

function validateQueenMove(
  currentRow,
  currentColumn,
  desiredRow,
  desiredColumn,
  setup,
) {
  if (
    validateBishopMove(
      currentRow,
      currentColumn,
      desiredRow,
      desiredColumn,
      setup,
    ) ||
    validateRookMove(
      currentRow,
      currentColumn,
      desiredRow,
      desiredColumn,
      setup,
    )
  ) {
    return true;
  }

  console.log("Invalid Queen move");
  return false;
}

class King extends Piece {
  constructor(color) {
    super(PIECE_TYPE.KING, color);
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    if (
      validateKingMove(
        currentRow,
        currentColumn,
        desiredRow,
        desiredColumn,
        setup,
      )
    ) {
      setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
      setup[currentRow][currentColumn] = new Empty();
      return setup;
    } else {
      console.log("Invalid Move for King");
      return null;
    }
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    const moves = [];
    const kingMoves = [
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: -1 },
      { row: 1, col: 1 },
      { row: 1, col: -1 },
      { row: -1, col: 1 },
      { row: -1, col: -1 },
    ];

    kingMoves.forEach((move) => {
      const newRow = currentRow + move.row;
      const newCol = currentColumn + move.col;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const destinationPiece = setup[newRow][newCol];
        if (
          destinationPiece instanceof Empty ||
          destinationPiece.getColor() !== this.color
        ) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });

    return moves;
  }
}

function validateKingMove(
  currentRow,
  currentColumn,
  desiredRow,
  desiredColumn,
  setup,
) {
  const deltaX = Math.abs(desiredColumn - currentColumn);
  const deltaY = Math.abs(desiredRow - currentRow);

  if (
    (deltaX === 1 && deltaY === 0) ||
    (deltaX === 0 && deltaY === 1) ||
    (deltaX === 1 && deltaY === 1)
  ) {
    const destinationPiece = setup[desiredRow][desiredColumn];
    const currentPiece = setup[currentRow][currentColumn];
    if (
      destinationPiece instanceof Empty ||
      destinationPiece.getColor() !== currentPiece.getColor()
    ) {
      return true;
    }
  }

  console.log("Invalid King move");
  return false;
}

class Empty extends Piece {
  constructor() {
    super(PIECE_TYPE.EMPTY, null);
  }

  getColor() {
    return null;
  }

  getType() {
    return PIECE_TYPE.NULL;
  }

  toString() {
    return "Empty";
  }

  move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    console.log("Invalid Move for Empty");
    return null;
  }

  getPossibleMoves(currentRow, currentColumn, setup) {
    console.log("No moves for Empty");
    return [];
  }
}

function newGame() {
  const setup = [];
  const pieceOrder = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

  for (let row = 0; row < 8; row++) {
    setup[row] = [];
    for (let col = 0; col < 8; col++) {
      if (row === 1) {
        setup[row][col] = new Pawn(COLOR.BLACK);
      } else if (row === 6) {
        setup[row][col] = new Pawn(COLOR.WHITE);
      } else if (row === 0 || row === 7) {
        setup[row][col] = new pieceOrder[col](
          row === 0 ? COLOR.BLACK : COLOR.WHITE,
        );
      } else {
        setup[row][col] = new Empty();
      }
    }
  }

  return setup;
}
