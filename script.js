// Define constants for piece types and colors
const PIECE_TYPE = {
    PAWN: 'pawn',
    KNIGHT: 'knight',
    BISHOP: 'bishop',
    ROOK: 'rook',
    QUEEN: 'queen',
    KING: 'king'
};

const COLOR = {
    WHITE: 'white',
    BLACK: 'black'
};

// Piece classes with getType and getColor methods
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
}

class Pawn extends Piece {
    constructor(color) {
        super(PIECE_TYPE.PAWN, color);
    }

    isValidMove(fromRow, fromCol, toRow, toCol, color) {
        const direction = (color === COLOR.WHITE) ? -1 : 1;

        // Normal move (one square forward)
        if (fromCol === toCol && chessboard[toRow][toCol] === null) {
            if (fromRow + direction === toRow) {
                return true;
            }
            // Initial two-square move
            if (fromRow === (color === COLOR.WHITE ? 6 : 1) && fromRow + 2 * direction === toRow && chessboard[toRow][toCol] === null) {
                return true;
            }
        }

        // Capture diagonally
        if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow && chessboard[toRow][toCol] && chessboard[toRow][toCol].color !== color) {
            return true;
        }

        return false;
    }
}

class Rook extends Piece {
    constructor(color) {
        super(PIECE_TYPE.ROOK, color);
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Rook moves horizontally or vertically
        if (fromRow === toRow || fromCol === toCol) {
            // Check if there are any pieces blocking the path
            if (fromRow === toRow) { // Horizontal move
                const step = Math.sign(toCol - fromCol);
                for (let col = fromCol + step; col !== toCol; col += step) {
                    if (chessboard[fromRow][col] !== null) {
                        return false;
                    }
                }
            } else { // Vertical move
                const step = Math.sign(toRow - fromRow);
                for (let row = fromRow + step; row !== toRow; row += step) {
                    if (chessboard[row][fromCol] !== null) {
                        return false;
                    }
                }
            }
            // Check if the destination square is either empty or has an opponent's piece
            return chessboard[toRow][toCol] === null || chessboard[toRow][toCol].color !== this.color;
        }
        return false;
    }
}

class Knight extends Piece {
    constructor(color) {
        super(PIECE_TYPE.KNIGHT, color);
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Knight moves in an L shape: 2 squares in one direction and 1 square perpendicular
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);
        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }
}

class Bishop extends Piece {
    constructor(color) {
        super(PIECE_TYPE.BISHOP, color);
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Bishop moves diagonally
        if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
            const stepRow = Math.sign(toRow - fromRow);
            const stepCol = Math.sign(toCol - fromCol);
            for (let i = 1; i < Math.abs(fromRow - toRow); i++) {
                if (chessboard[fromRow + i * stepRow][fromCol + i * stepCol] !== null) {
                    return false;
                }
            }
            // Check if the destination square is either empty or has an opponent's piece
            return chessboard[toRow][toCol] === null || chessboard[toRow][toCol].color !== this.color;
        }
        return false;
    }
}

class Queen extends Piece {
    constructor(color) {
        super(PIECE_TYPE.QUEEN, color);
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Queen combines rook and bishop moves
        if (fromRow === toRow || fromCol === toCol) {
            // Rook-like move
            return new Rook(this.color).isValidMove(fromRow, fromCol, toRow, toCol);
        } else if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
            // Bishop-like move
            return new Bishop(this.color).isValidMove(fromRow, fromCol, toRow, toCol);
        }
        return false;
    }
}

class King extends Piece {
    constructor(color) {
        super(PIECE_TYPE.KING, color);
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // King moves one square in any direction
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);
        return dx <= 1 && dy <= 1;
    }
}

// Initialize the chessboard and piece setup
document.addEventListener("DOMContentLoaded", function() {
    const chessboard = [];
    const pieces = [];

    for (let i = 0; i < 8; i++) {
        chessboard.push(Array(8).fill(null));
    }

    const initialSetup = [
        [new Rook(COLOR.BLACK), new Knight(COLOR.BLACK), new Bishop(COLOR.BLACK), new Queen(COLOR.BLACK), new King(COLOR.BLACK), new Bishop(COLOR.BLACK), new Knight(COLOR.BLACK), new Rook(COLOR.BLACK)],
        Array(8).fill(new Pawn(COLOR.BLACK)),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(null),
        Array(8).fill(new Pawn(COLOR.WHITE)),
        [new Rook(COLOR.WHITE), new Knight(COLOR.WHITE), new Bishop(COLOR.WHITE), new Queen(COLOR.WHITE), new King(COLOR.WHITE), new Bishop(COLOR.WHITE), new Knight(COLOR.WHITE), new Rook(COLOR.WHITE)]
    ];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = initialSetup[row][col];
            if (piece) {
                chessboard[row][col] = piece;
                pieces.push(piece);
            }
        }
    }

    // Event handling for moving pieces
    let selectedSquare = null;

    chessboard.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            if (piece) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = rowIndex;
                square.dataset.col = colIndex;
                square.textContent = getPieceSymbol(piece);
                square.addEventListener('click', () => handlePieceClick(rowIndex, colIndex));
                document.getElementById('chessboard').appendChild(square);
            }
        });
    });

    function handlePieceClick(row, col) {
        const clickedPiece = chessboard[row][col];
        if (!selectedSquare) {
            if (clickedPiece && clickedPiece.color === chessGame.turn) {
                selectedSquare = { row, col };
                document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
            }
        } else {
            const { row: fromRow, col: fromCol } = selectedSquare;
            if (isValidMove(fromRow, fromCol, row, col)) {
                movePiece(fromRow, fromCol, row, col);
                selectedSquare = null;
                updateBoardUI();
            } else {
                console.log("Invalid move!");
            }
        }
    }

    function isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = chessboard[fromRow][fromCol];
        return piece.isValidMove(fromRow, fromCol, toRow, toCol, piece.color);
    }

    function movePiece(fromRow, fromCol, toRow, toCol) {
        chessboard[toRow][toCol] = chessboard[fromRow][fromCol];
        chessboard[fromRow][fromCol] = null;
        chessGame.turn = (chessGame.turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
    }

    function updateBoardUI() {
        const board = document.getElementById('chessboard');
        board.innerHTML = ''; // Clear the board

        chessboard.forEach((row, rowIndex) => {
            row.forEach((piece, colIndex) => {
                if (piece) {
                    const square = document.createElement('div');
                    square.classList.add('square');
                    square.dataset.row = rowIndex;
                    square.dataset.col = colIndex;
                    square.textContent = getPieceSymbol(piece);
                    square.addEventListener('click', () => handlePieceClick(rowIndex, colIndex));
                    board.appendChild(square);
                }
            });
        });
    }

    function getPieceSymbol(piece) {
        const type = piece.getType();
        const color = piece.getColor();
        if (color === COLOR.WHITE) {
            switch (type) {
                case PIECE_TYPE.PAWN:
                    return '♙';
                case PIECE_TYPE.KNIGHT:
                    return '♘';
                case PIECE_TYPE.BISHOP:
                    return '♗';
                case PIECE_TYPE.ROOK:
                    return '♖';
                case PIECE_TYPE.QUEEN:
                    return '♕';
                case PIECE_TYPE.KING:
                    return '♔';
                default:
                    return '';
            }
        } else {
            switch (type) {
                case PIECE_TYPE.PAWN:
                    return '♟';
                case PIECE_TYPE.KNIGHT:
                    return '♞';
                case PIECE_TYPE.BISHOP:
                    return '♝';
                case PIECE_TYPE.ROOK:
                    return '♜';
                case PIECE_TYPE.QUEEN:
                    return '♛';
                case PIECE_TYPE.KING:
                    return '♚';
                default:
                    return '';
            }
        }
    }
});
