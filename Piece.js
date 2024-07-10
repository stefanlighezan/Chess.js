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

    //Debug Functions
    toString() {
        return `${this.color} ${this.type}`;
    }
}

const PIECE_TYPE = Object.freeze({
    PAWN: 'Pawn',
    KNIGHT: 'Knight',
    BISHOP: 'Bishop',
    ROOK: 'Rook',
    QUEEN: 'Queen',
    KING: 'King'
});

const COLOR = Object.freeze({
    WHITE: 'White',
    BLACK: 'Black'
});

class Pawn extends Piece {
    constructor(color) {
        super(PIECE_TYPE.PAWN, color);
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