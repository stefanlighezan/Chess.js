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
        if(this.getType() == PIECE_TYPE.PAWN) {
            Pawn.move(currentRow, currentColumn, desiredRow, desiredColumn, setup)
        }
        return setup;
    }
}

const PIECE_TYPE = Object.freeze({
    PAWN: 'Pawn',
    KNIGHT: 'Knight',
    BISHOP: 'Bishop',
    ROOK: 'Rook',
    QUEEN: 'Queen',
    KING: 'King',
    NULL: 'Null',
});

const COLOR = Object.freeze({
    WHITE: 'White',
    BLACK: 'Black'
});

class Pawn extends Piece {
    constructor(color) {
        super(PIECE_TYPE.PAWN, color);
        this.hasMoved = false; // Track if the pawn has moved before
    }

    move(currentRow, currentColumn, desiredRow, desiredColumn, setup) {
        // Check if it's the first move
        if(setup[desiredRow][desiredColumn] instanceof Empty) {
            console.log("here")
            setup[desiredRow][desiredColumn] = setup[currentRow][currentColumn]  
            setup[currentRow][currentColumn] = new Empty()
            return setup
        }

        // If none of the conditions were met, it's an invalid move for pawn
        alert("Invalid Move for Pawn");
        return setup;
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