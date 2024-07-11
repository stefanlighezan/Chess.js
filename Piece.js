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

    getPossibleMoves(currentRow, currentColumn, setup) {
        // Default implementation for other pieces, overridden by specific piece types
        return [];
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

    getPossibleMoves(currentRow, currentColumn, setup) {
        const moves = [];
        const forwardDirection = (this.color === COLOR.WHITE) ? -1 : 1;

        // Standard move
        if (setup[currentRow + forwardDirection][currentColumn] instanceof Empty) {
            moves.push({ row: currentRow + forwardDirection, col: currentColumn });
        }

        // Initial two-step move
        const initialRow = (this.color === COLOR.WHITE) ? 6 : 1;
        if (currentRow === initialRow && setup[currentRow + 2 * forwardDirection][currentColumn] instanceof Empty) {
            moves.push({ row: currentRow + 2 * forwardDirection, col: currentColumn });
        }

        // Captures
        if (currentColumn > 0 && !(setup[currentRow + forwardDirection][currentColumn - 1] instanceof Empty) && setup[currentRow + forwardDirection][currentColumn - 1].getColor() !== this.color) {
            moves.push({ row: currentRow + forwardDirection, col: currentColumn - 1 });
        }
        if (currentColumn < 7 && !(setup[currentRow + forwardDirection][currentColumn + 1] instanceof Empty) && setup[currentRow + forwardDirection][currentColumn + 1].getColor() !== this.color) {
            moves.push({ row: currentRow + forwardDirection, col: currentColumn + 1 });
        }

        return moves;
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

    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
        // Validate Knight move
        if (validateKnightMove(currentRow, currentColumn, desiredRow, desiredColumn, setup)) {
            setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
            setup[currentRow][currentColumn] = new Empty();
            return setup;
        } else {
            console.log("Invalid Move for Knight");
            return setup;
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

        knightMoves.forEach(move => {
            const newRow = currentRow + move.row;
            const newCol = currentColumn + move.col;

            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const destinationPiece = setup[newRow][newCol];
                if (destinationPiece instanceof Empty || destinationPiece.getColor() !== this.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });

        return moves;
    }
}

function validateKnightMove(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    // Knight moves in an L shape: 2 squares in one direction and 1 square perpendicular
    const deltaX = Math.abs(desiredColumn - currentColumn);
    const deltaY = Math.abs(desiredRow - currentRow);

    if ((deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1)) {
        // Destination square must either be empty or have an opponent's piece
        const destinationPiece = setup[desiredRow][desiredColumn];
        const currentPiece = setup[currentRow][currentColumn];
        if (destinationPiece instanceof Empty || destinationPiece.getColor() !== currentPiece.getColor()) {
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

    getPossibleMoves(currentRow, currentColumn, setup) {
        const moves = [];
        const directions = [
            { row: 1, col: 1 },
            { row: 1, col: -1 },
            { row: -1, col: 1 },
            { row: -1, col: -1 },
        ];

        directions.forEach(direction => {
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

class Rook extends Piece {
    constructor(color) {
        super(PIECE_TYPE.ROOK, color);
    }

    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
        // Validate Rook move
        if (validateRookMove(currentRow, currentColumn, desiredRow, desiredColumn, setup)) {
            setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
            setup[currentRow][currentColumn] = new Empty();
            return setup;
        } else {
            console.log("Invalid Move for Rook");
            return setup;
        }
    }

    getPossibleMoves(currentRow, currentColumn, setup) {
        const moves = [];

        // Horizontal and vertical moves
        const directions = [
            { row: 1, col: 0 },
            { row: -1, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: -1 },
        ];

        directions.forEach(direction => {
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

function validateRookMove(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    // Rook moves vertically or horizontally: either the row or the column must match
    if (currentRow === desiredRow || currentColumn === desiredColumn) {
        // Check if there are any pieces obstructing the path
        if (currentRow === desiredRow) {
            // Moving horizontally
            const minCol = Math.min(currentColumn, desiredColumn);
            const maxCol = Math.max(currentColumn, desiredColumn);
            for (let col = minCol + 1; col < maxCol; col++) {
                if (setup[currentRow][col].getType() !== PIECE_TYPE.NULL) {
                    console.log("Path is obstructed by a piece");
                    return false; // Path is obstructed
                }
            }
        } else {
            // Moving vertically
            const minRow = Math.min(currentRow, desiredRow);
            const maxRow = Math.max(currentRow, desiredRow);
            for (let row = minRow + 1; row < maxRow; row++) {
                if (setup[row][currentColumn].getType() !== PIECE_TYPE.NULL) {
                    console.log("Path is obstructed by a piece");
                    return false; // Path is obstructed
                }
            }
        }

        // Destination square must either be empty or have an opponent's piece
        const destinationPiece = setup[desiredRow][desiredColumn];
        const currentPiece = setup[currentRow][currentColumn];
        if (destinationPiece instanceof Empty || destinationPiece.getColor() !== currentPiece.getColor()) {
            return true;
        }
    }

    console.log("Invalid rook move");
    return false;
}

class Queen extends Piece {
    constructor(color) {
        super(PIECE_TYPE.QUEEN, color);
    }

    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
        // Validate Queen move
        if (validateQueenMove(currentRow, currentColumn, desiredRow, desiredColumn, setup)) {
            setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
            setup[currentRow][currentColumn] = new Empty();
            return setup;
        } else {
            console.log("Invalid Move for Queen");
            return setup;
        }
    }

    getPossibleMoves(currentRow, currentColumn, setup) {
        const rookMoves = new Rook(this.color).getPossibleMoves(currentRow, currentColumn, setup);
        const bishopMoves = new Bishop(this.color).getPossibleMoves(currentRow, currentColumn, setup);
        return rookMoves.concat(bishopMoves);
    }
}

function validateQueenMove(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    // Queen moves like both Rook and Bishop
    return validateRookMove(currentRow, currentColumn, desiredRow, desiredColumn, setup) || validateBishopMove(currentRow, currentColumn, desiredRow, desiredColumn, setup)
}
    
  
  class King extends Piece {
    constructor(color) {
        super(PIECE_TYPE.KING, color);
    }

    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
        // Validate King move
        if (validateKingMove(currentRow, currentColumn, desiredRow, desiredColumn, setup)) {
            setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn];
            setup[currentRow][currentColumn] = new Empty();
            return setup;
        } else {
            console.log("Invalid Move for King");
            return setup;
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

        kingMoves.forEach(move => {
            const newRow = currentRow + move.row;
            const newCol = currentColumn + move.col;

            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const destinationPiece = setup[newRow][newCol];
                if (destinationPiece instanceof Empty || destinationPiece.getColor() !== this.color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        });

        return moves;
    }
}

function validateKingMove(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
    // King moves one square in any direction
    const deltaX = Math.abs(desiredColumn - currentColumn);
    const deltaY = Math.abs(desiredRow - currentRow);

    // Check if the move is within the King's range (1 square in any direction)
    if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1) || (deltaX === 1 && deltaY === 1)) {
        // Destination square must either be empty or have an opponent's piece
        const destinationPiece = setup[desiredRow][desiredColumn];
        const currentPiece = setup[currentRow][currentColumn];
        if (destinationPiece instanceof Empty || destinationPiece.getColor() !== currentPiece.getColor()) {
            return true;
        }
    }

    console.log("Invalid king move");
    return false;
}

  
  class Empty extends Piece {
    constructor(color) {
      super(PIECE_TYPE.NULL, color);
    }
  }
  