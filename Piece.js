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
  
    // Debug Function
    toString() {
      return `${this.color} ${this.type}`;
    }
  
    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
      // Default move method, overridden by specific piece types
      if (this.getType() == PIECE_TYPE.PAWN) {
        Pawn.move(currentRow, currentColumn, desiredRow, desiredColumn, setup);
      }
      return setup;
    }
  }
  
  const PIECE_TYPE = Object.freeze({
    PAWN: "Pawn",
    KNIGHT: "Knight",
    BISHOP: "Bishop",
    ROOK: "Rook",
    QUEEN: "Queen",
    KING: "King",
    NULL: "Null",
  });
  
  const COLOR = Object.freeze({
    WHITE: "White",
    BLACK: "Black",
  });
  
  class Pawn extends Piece {
    constructor(color) {
      super(PIECE_TYPE.PAWN, color);
      this.hasMoved = false; // Track if the pawn has moved before
    }
  
    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
      // Check if it's the first move
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
  
      // If none of the conditions were met, it's an invalid move for pawn
      alert("Invalid Move for Pawn");
      return setup;
    }
  }
  
  function getValidMoves(piece, currentRow, currentCol, desiredRow, desiredCol, setup) {
    const currentPiece = setup[currentRow][currentCol];
    const destinationPiece = setup[desiredRow][desiredCol];
  
    // Check if the desired position is the same as the current position
    if (desiredRow === currentRow && desiredCol === currentCol) {
      console.log("Invalid Move: Desired position is the same as the current position");
      return null;
    }
  
    switch (piece) {
      case PIECE_TYPE.PAWN:
        if (validatePawnMove(currentPiece, destinationPiece, currentRow, currentCol, desiredRow, desiredCol)) {
          setup[desiredRow][desiredCol] = currentPiece;
          setup[currentRow][currentCol] = new Empty();
          return setup;
        }
        break;
  
      // Add cases for other piece types if needed
      default:
        console.log("Invalid Piece Type");
        break;
    }
  
    console.log("Invalid Move for Piece");
    return null;
  }
  
  function validatePawnMove(currentPiece, destinationPiece, currentRow, currentCol, desiredRow, desiredCol) {
    const color = currentPiece.getColor();
    const forwardDirection = (color === COLOR.WHITE) ? -1 : 1;
    const initialRow = (color === COLOR.WHITE) ? 6 : 1;
    const isInitialMove = (currentRow === initialRow && desiredRow === currentRow + 2 * forwardDirection);
  
    if (isInitialMove && currentCol === desiredCol) {
        // Check the middle square if it's empty
        const middleRow = currentRow + forwardDirection;
        if (setup[middleRow][currentCol] instanceof Empty && destinationPiece instanceof Empty) {
          return true;
        } else return false
      }
    // Check for standard pawn move
    if (desiredCol === currentCol && destinationPiece instanceof Empty) {
      if ((desiredRow === currentRow + forwardDirection) || isInitialMove) {
        return true;
      }
    }
  
    // Check for pawn capture
    if (Math.abs(desiredCol - currentCol) === 1 && desiredRow === currentRow + forwardDirection) {
      if (destinationPiece.getColor() !== color && !(destinationPiece instanceof Empty)) {
        return true;
      }
    }
  
    // Check for two-step initial move without obstruction
  
    return false;
  }
  
  
  
  
  class Knight extends Piece {
    constructor(color) {
      super(PIECE_TYPE.KNIGHT, color);
    }
  }
  
  class Bishop extends Piece {
    constructor(color) {
      super(PIECE_TYPE.BISHOP, color);
    }

    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
        // Validate Bishop move
        if (validateBishopMove(currentRow, currentColumn, desiredRow, desiredColumn, setup)) {
          setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
          setup[currentRow][currentColumn] = new Empty();
          return setup;
        } else {
          console.log("Invalid Move for Bishop");
          return setup;
        }
      }

  }
  function validateBishopMove(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    const deltaX = Math.abs(desiredColumn - currentColumn);
    const deltaY = Math.abs(desiredRow - currentRow);

    // Bishop moves diagonally: deltaX should equal deltaY for valid movement
    if (deltaX === deltaY) {
        // Determine direction of movement
        const directionX = (desiredColumn - currentColumn) / deltaX;
        const directionY = (desiredRow - currentRow) / deltaY;

        // Check each square along the diagonal path
        for (let i = 1; i < deltaX; i++) {
            const checkRow = currentRow + i * directionY;
            const checkCol = currentColumn + i * directionX;

            // Check if there's any piece (including pawns) obstructing the path
            if (setup[checkRow][checkCol].getType() != PIECE_TYPE.NULL) {
                console.log("Path is obstructed by a piece");
                return false; // Path is obstructed
            }
        }

        // Destination square must either be empty or have an opponent's piece
        const destinationPiece = setup[desiredRow][desiredColumn];
        const currentPiece = setup[currentRow][currentColumn];
        if (destinationPiece instanceof Empty || destinationPiece.getColor() !== currentPiece.getColor()) {
            return true;
        }
    }

    // If deltaX !== deltaY, the move is not diagonal
    console.log("Invalid diagonal move");
    return false;
}


  
    // Check if path is clear (no pieces in between)

  
  
  class Rook extends Piece {
    constructor(color) {
      super(PIECE_TYPE.ROOK, color);
    }
  }
  
  class Queen extends Piece {
    constructor(color) {
      super(PIECE_TYPE.QUEEN, color);
    }
  }
  
  class King extends Piece {
    constructor(color) {
      super(PIECE_TYPE.KING, color);
    }
  }
  
  class Empty extends Piece {
    constructor(color) {
      super(PIECE_TYPE.NULL, color);
    }
  }
  