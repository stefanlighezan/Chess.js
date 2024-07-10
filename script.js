let chessGame = {
    turn: "white",
    selected: null,
    selectedPos: null
}

let setup = [
    [new Rook(COLOR.BLACK), new Knight(COLOR.BLACK), new Bishop(COLOR.BLACK), new Queen(COLOR.BLACK), new King(COLOR.BLACK), new Bishop(COLOR.BLACK), new Knight(COLOR.BLACK), new Rook(COLOR.BLACK)],
    Array(8).fill(new Pawn(COLOR.BLACK)),
    Array(8).fill(new Empty()),
    Array(8).fill(new Empty()),
    Array(8).fill(new Empty()),
    Array(8).fill(new Empty()),
    Array(8).fill(new Pawn(COLOR.WHITE)),
    [new Rook(COLOR.WHITE), new Knight(COLOR.WHITE), new Bishop(COLOR.WHITE), new Queen(COLOR.WHITE), new King(COLOR.WHITE), new Bishop(COLOR.WHITE), new Knight(COLOR.WHITE), new Rook(COLOR.WHITE)]
];

document.addEventListener("DOMContentLoaded", function() {
    initializeChessboard()
});


function initializeChessboard() {
    const chessboard = document.getElementById('chessboard');

    chessboard.innerHTML = ""

    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        // Calculate row and column
        const row = Math.floor(i / 8);
        const col = i % 8;

        // Alternate colors
        if ((row + col) % 2 === 0) {
            square.classList.add('white');
        } else {
            square.classList.add('black');
        }

        chessboard.appendChild(square);
    }

    // Piece setup

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = setup[row][col];
            if (piece) {
                const square = chessboard.children[row * 8 + col];
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                square.addEventListener('click', function() {
                    if (chessGame.selected == null) {
                        chessGame.selected = setup[row][col]
                        chessGame.selectedPos = {r: row, c: col}
                        console.log(chessGame.selectedPos)
                    } else {
                        console.log("moved")
                        setup = chessGame.selected.move(chessGame.selectedPos["r"], chessGame.selectedPos["c"], row, col, setup);
                        initializeChessboard()
                        chessGame.selected = null;
                        chessGame.selectedPos = null
                    }

                    // Clear selected after movement
                });

                square.addEventListener('contextmenu', (ev) => {
                    ev.preventDefault();
                    chessGame.selected = null
                    chessGame.selectedPos = null
                })

                pieceElement.textContent = getPieceSymbol(piece); // Get the correct symbol for the piece
                square.appendChild(pieceElement);
            }
        }
    }

    function handleSquareClick(row, col) {
        const square = chessboard.children[row * 8 + col];
        // You can do something with the selected piece here
        chessGame.selected = { row, col }; // Example: Saving the selected square
        console.log(`Selected square: (${row}, ${col})`);
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
}