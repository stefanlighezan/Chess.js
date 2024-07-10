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
  
  function getValidMoves(
    piece,
    currentRow,
    currentCol,
    desiredRow,
    desiredCol,
    setup,
  ) {
    let currentPiece = setup[currentRow][currentCol];
  
    if (desiredRow === currentRow && desiredCol === currentCol) {
      return null; // Invalid move: desired position is the same as current position
    }
  
    switch (piece) {
      case PIECE_TYPE.PAWN:
        //Forward Movement, Sideways Captures
        if (currentPiece.getColor() == COLOR.WHITE) {
          if(setup[desiredRow][desiredCol].getColor() == COLOR.BLACK) {
            if(desiredCol == currentCol + 1 || desiredCol == currentCol - 1) {
                if(desiredRow = currentRow - 1) {
                    setup[desiredRow][desiredCol] = setup[currentRow][currentCol];
                    setup[currentRow][currentCol] = new Empty();
                    return setup;
                }
              }
          }
        } else {
            if(setup[desiredRow][desiredCol].getColor() == COLOR.WHITE) {
                if(desiredCol == currentCol + 1 || desiredCol == currentCol - 1) {
                    if(desiredRow = currentRow + 1) {
                        setup[desiredRow][desiredCol] = setup[currentRow][currentCol];
                        setup[currentRow][currentCol] = new Empty();
                        return setup;
                    }
                  }
              }
        }
        if (desiredCol != currentCol) {
          // we want to move sideways on a non-capture
          return null;
        } else {
          if (currentPiece.getColor() == COLOR.WHITE) {
            if (setup[desiredRow][desiredCol] instanceof Empty) {
              //check for 2 step pawn movement
              if (currentRow == 6 && desiredRow == 4) {
                setup[desiredRow][desiredCol] = setup[currentRow][currentCol];
                setup[currentRow][currentCol] = new Empty();
                return setup;
              } else {
                if (currentRow - 1 == desiredRow) {
                  setup[desiredRow][desiredCol] = setup[currentRow][currentCol];
                  setup[currentRow][currentCol] = new Empty();
                  return setup;
                }
              }
            }
          } else {
            if (setup[desiredRow][desiredCol] instanceof Empty) {
              if (currentRow == 1 && desiredRow == 3) {
                setup[desiredRow][currentCol] = setup[currentRow][currentCol];
                setup[currentRow][currentCol] = new Empty();
                return setup;
              } else {
                if (currentRow + 1 == desiredRow) {
                  setup[desiredRow][currentCol] = setup[currentRow][currentCol];
                  setup[currentRow][currentCol] = new Empty();
                  return setup;
                }
              }
            }
          }
        }
    }
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
  }
  
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
  