class Game {
    //variables///////////////
    isWhiteTurn = true;
    whitePiecesCounter = 12;
    blackPiecesCounter = 12;
    logicBoard;
    newClickId;
    secondClickId;
    logicPieceChosen = null;
    movingDirection = 0;
    HTMLpieceChosen;
    pieceFromRihgt = undefined;
    secondPieceFromRight = undefined;
    pieceFromLeft = undefined;
    secondPieceFromLeft = undefined;
    isSecondClick = false;
    //////////////////////////
    startGame(/*event*/) {
        const HTMLboard = document.getElementById('board');
        this.creatHTMLboard()
        this.logicBoard = this.createLogicBoard()

        HTMLboard.addEventListener('click', (event) => {
            this.newClickId = event.target.id;
            if (!(this.isSecondClick) && this.isFirstClickValid()) {
                this.markHTMLpiece();
                this.isSecondClick = true;
            }
            else if (this.isSecondClick) {
                this.secondClickId = event.target.id;
                if (this.isSecondClickValid()) {
                    this.secondClickLogic()
                    this.isSecondClick = false;
                }
                else { alert('not valid choise'); }
            }
        })
    }
    creatHTMLboard() {
        const HTMLboard = document.getElementById('board');
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                const piece = document.createElement('button');
                piece.classList.add('piece')
                square.classList.add('box');
                HTMLboard.appendChild(square)
                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        square.classList.add("pink");
                    }
                    else {
                        square.classList.add("black");
                        square.id = i + "" + j + "square";
                        // inject the pieces
                        if (i === 0 || i === 2) {
                            piece.classList.add('white_piece')
                            piece.id = i + "" + j;
                            square.appendChild(piece);
                        }
                        if (i === 6) {
                            piece.classList.add('black_piece');
                            piece.id = i + "" + j;
                            square.appendChild(piece);
                        }
                        if (i === 3 || i === 4) {
                            piece.classList.add('empty_piece');
                            piece.id = i + "" + j;
                            square.appendChild(piece);
                        }
                    }
                }
                else {
                    if (j % 2 === 0) {
                        square.classList.add("black");
                        square.id = i + "" + j + "square";
                        if (i === 5 || i === 7) {
                            piece.classList.add('black_piece');
                            piece.id = i + "" + j;
                            square.appendChild(piece);
                        }
                        if (i === 1) {
                            piece.classList.add('white_piece');
                            piece.id = i + "" + j;
                            square.appendChild(piece);
                        }
                        if (i === 3 || i === 4) {
                            piece.classList.add('empty_piece');
                            piece.id = i + "" + j;
                            square.appendChild(piece);
                        }
                    }
                    else {
                        square.classList.add("pink");
                    }
                }
            }
        }
    }
    createLogicBoard() {
        let newBoard = [
            [undefined, new Piece(true, 0, 1), undefined, new Piece(true, 0, 3), undefined, new Piece(true, 0, 5), undefined, new Piece(true, 0, 7)],
            [new Piece(true, 1, 0), undefined, new Piece(true, 1, 2), undefined, new Piece(true, 1, 4), undefined, new Piece(true, 1, 6), undefined],
            [undefined, new Piece(true, 2, 1), undefined, new Piece(true, 2, 3), undefined, new Piece(true, 2, 5), undefined, new Piece(true, 2, 7)],
            [null, undefined, null, undefined, null, undefined, null, undefined],
            [undefined, null, undefined, null, undefined, null, undefined, null],
            [new Piece(false, 5, 0), undefined, new Piece(false, 5, 2), undefined, new Piece(false, 5, 4), undefined, new Piece(false, 5, 6), undefined],
            [undefined, new Piece(false, 6, 1), undefined, new Piece(false, 6, 3), undefined, new Piece(false, 6, 5), undefined, new Piece(false, 6, 7)],
            [new Piece(false, 7, 0), undefined, new Piece(false, 7, 2), undefined, new Piece(false, 7, 4), undefined, new Piece(false, 7, 6), undefined]
        ];
        return newBoard;
    }
    isClickOnPiece() {
        if (this.newClickId === '' || this.newClickId === 'board' || (this.newClickId.includes("square"))) { return false };
        if (this.logicBoard[this.newClickId[0]][this.newClickId[1]] == null) { return false }

        return true;
    }
    isPieceValidChoise() {
        const pieceThatMustEatAgain = document.getElementById(this.secondClickId)?.firstChild;
        if (pieceThatMustEatAgain !== undefined && pieceThatMustEatAgain?.id !== this.newClickId) { return false }
        this.logicPieceChosen = this.logicBoard[this.newClickId[0]][this.newClickId[1]];
        if (!(this.logicPieceChosen.isWhite === this.isWhiteTurn)) { return false }
        return true;
    }
    getPieceValidMovesArray() {
        const HTMLpiece = document.getElementById(this.secondClickId)?.firstChild;
        const pieceRow = this.logicPieceChosen.location.rowNumber;
        const pieceColumn = this.logicPieceChosen.location.colunmNumber;
        let isPieceJustAte = (!(HTMLpiece == null || HTMLpiece?.classList.contains('empty_piece')))
        let validMovesArrayForChosenPiece = []
        this.movingDirection = this.logicPieceChosen.isWhite ? 1 : -1;
        validMovesArrayForChosenPiece = validMovesArrayForChosenPiece.concat(this.updateValidMovesArrayForChosenPiece(pieceRow/*this.newClickId[0] * 1*/, pieceColumn /*this.newClickId[1] * 1*/, isPieceJustAte));
        if (this.logicPieceChosen.isKing) {
            this.movingDirection *= -1; // שינוי כיוון
            validMovesArrayForChosenPiece = validMovesArrayForChosenPiece.concat(this.updateValidMovesArrayForChosenPiece(pieceRow/*this.newClickId[0] * 1*/, pieceColumn /*this.newClickId[1] * 1*/, isPieceJustAte));

            this.movingDirection *= -1; // שינוי כיוון בחזרה
        }
        return validMovesArrayForChosenPiece;
    }
    setPieceBoundries(x, y) {
        const nextRowFromPiece = this.logicBoard[x + this.movingDirection];
        const secondNextRowFromPiece = this.logicBoard[x + (2 * this.movingDirection)];
        this.pieceFromRihgt = ((nextRowFromPiece) && ((y + 1) < 8)) ? nextRowFromPiece[y + 1] : undefined;
        this.pieceFromLeft = ((nextRowFromPiece) && ((y - 1) >= 0)) ? nextRowFromPiece[y - 1] : undefined;
        this.secondPieceFromRight = ((secondNextRowFromPiece) && ((y + 2) < 8)) ? secondNextRowFromPiece[y + 2] : undefined;
        this.secondPieceFromLeft = ((secondNextRowFromPiece) && ((y - 2) >= 0)) ? secondNextRowFromPiece[y - 2] : undefined;
    }
    isPieceUnblocked(logicPiece, isPieceJustAte) {
        this.setPieceBoundries(logicPiece.location.rowNumber, logicPiece.location.colunmNumber)
        if (this.pieceFromRihgt === undefined || this.pieceFromLeft === undefined) {
            if (!(logicPiece.location.colunmNumber === 7 || logicPiece.location.colunmNumber === 0)) { return false }
        } // if the row is the end return falls an try the other way around
        if (!(isPieceJustAte) && (this.pieceFromRihgt === null || this.pieceFromLeft === null)) { return true } //free to move
        else if (this.pieceFromRihgt !== null && logicPiece.isWhite !== this.pieceFromRihgt?.isWhite && this.secondPieceFromRight === null) { return true } // can eat to right side
        else if (this.pieceFromLeft !== null && logicPiece.isWhite !== this.pieceFromLeft?.isWhite && this.secondPieceFromLeft === null) { return true } // can eat to left side
        return false;
    }
    updateValidMovesArrayForChosenPiece(x, y, isPieceJustAte) {
        let validMovesArrayForChosenPiece = []
        const numberOfNextRow = x + this.movingDirection;
        const numberOfSecondNextRow = x + (2 * this.movingDirection);
        this.setPieceBoundries(this.logicPieceChosen.location.rowNumber, this.logicPieceChosen.location.colunmNumber);
        if (!(isPieceJustAte) && this.pieceFromRihgt === null) { validMovesArrayForChosenPiece.push((numberOfNextRow) + '' + (y + 1)) } //can move right
        else if (this.secondPieceFromRight === null && this.pieceFromRihgt !== null && this.pieceFromRihgt?.isWhite !== this.logicPieceChosen.isWhite) { validMovesArrayForChosenPiece.push((numberOfSecondNextRow) + '' + (y + 2)) } //can eat right
        if (!(isPieceJustAte) && this.pieceFromLeft === null) { validMovesArrayForChosenPiece.push((numberOfNextRow) + '' + (y - 1)) } // can move left
        else if (this.secondPieceFromLeft === null && this.pieceFromLeft !== null && this.pieceFromLeft?.isWhite !== this.logicPieceChosen.isWhite) { validMovesArrayForChosenPiece.push((numberOfSecondNextRow) + '' + (y - 2)) } //can eat left
        return validMovesArrayForChosenPiece;
    }
    isSecondClickValid() {
        const ValidMovesArray = this.getPieceValidMovesArray();
        for (let i = 0; i < ValidMovesArray.length; i++) {
            if (ValidMovesArray[i][0] === this.secondClickId[0] && ValidMovesArray[i][1] === this.secondClickId[1]) {
                return true;
            }
        }
        return false;
    }
    doTheEating() {
        let x = (this.logicPieceChosen.location.rowNumber - this.secondClickId[0] * 1) < 0 ? 1 : -1;
        let y = (this.logicPieceChosen.location.colunmNumber - this.secondClickId[1] * 1) < 0 ? 1 : -1;
        const eatenPieceRowNumber = this.logicPieceChosen.location.rowNumber + x;
        const eatenPieceColunmNumber = this.logicPieceChosen.location.colunmNumber + y;
        this.logicBoard[eatenPieceRowNumber][eatenPieceColunmNumber] = null;
        let whosNotTurn = this.isWhiteTurn ? 'black_piece' : 'white_piece';
        const removedHTMLpiece = document.getElementById((eatenPieceRowNumber) + "" + (eatenPieceColunmNumber) + "square").firstChild; // להפוך לפונקציה
        removedHTMLpiece.classList.remove(whosNotTurn);
        removedHTMLpiece.classList.add('empty_piece')
        if (removedHTMLpiece.classList.contains('king')) { this.removeHTMLking(removedHTMLpiece); }
        this.doTheMove()
        if (whosNotTurn === 'black_piece') { this.blackPiecesCounter-- }
        else { this.whitePiecesCounter-- }
    }
    removeHTMLking(HTMLpiece) {
        HTMLpiece.classList.remove('king');
        HTMLpiece.classList.add('piece');
        HTMLpiece.innerHTML = '';
    }
    doTheMove() {
        this.moveLogicPiece()
        this.moveHTMLpiece()
    }
    moveLogicPiece() {
        const chosenPieceRow = this.logicPieceChosen.location.rowNumber;
        const chosenPieceColumn = this.logicPieceChosen.location.colunmNumber;
        this.logicBoard[this.secondClickId[0] * 1][this.secondClickId[1] * 1] = this.logicBoard[chosenPieceRow][chosenPieceColumn];
        let moveToLocation = this.logicBoard[this.secondClickId[0] * 1][this.secondClickId[1] * 1];
        this.logicBoard[chosenPieceRow][chosenPieceColumn] = null;
        if (moveToLocation) {
            moveToLocation.location.rowNumber = (this.secondClickId[0] * 1);
            moveToLocation.location.colunmNumber = (this.secondClickId[1] * 1);
        }
    }
    moveHTMLpiece() {
        let whosTurn = this.isWhiteTurn ? 'white_piece' : 'black_piece';
        const moveToHTMLpiece = document.getElementById(this.secondClickId).firstChild;
        this.HTMLpieceChosen?.classList.remove(whosTurn, 'chosen');
        if (this.logicBoard[this.secondClickId[0] * 1][this.secondClickId[1] * 1])
         { this.updateTheHTMLoriginAndDestination(moveToHTMLpiece, whosTurn) }
    }
    promotePiece(HTMLpiece) {
        HTMLpiece.classList.remove('piece');
        HTMLpiece.classList.add('king');
        HTMLpiece.innerHTML = 'K';
        this.logicBoard[this.secondClickId[0] * 1][this.secondClickId[1] * 1].isKing = true;
    }
    promoteToKingIfNeeded() {
        if (this.logicBoard[this.secondClickId[0] * 1][this.secondClickId[1] * 1] && this.isPieceShouldGetPromotion()) {
            this.promotePiece(this.HTMLpieceChosen = document.getElementById(this.newClickId).firstChild)
        }
    }
    isPieceShouldGetPromotion() {
        if (this.logicBoard[this.secondClickId[0] * 1][this.secondClickId[1] * 1].isWhite && this.secondClickId[0] * 1 === 7) { return true }
        if (!(this.logicBoard[this.secondClickId[0] * 1][this.secondClickId[1] * 1].isWhite) && this.secondClickId[0] * 1 === 0) { return true }
        return false;
    }
    PieceMustEatAgainResetVriables() {
        this.newClickId = null; // the id of the first clicked html element
        this.logicPieceChosen = null; // the piece on the logic board
        this.movingDirection = 0; // -1-down to up, 0-neutral, 1-up to down, 
        this.pieceFromRihgt = undefined;
        this.secondPieceFromRight = undefined;
        this.pieceFromLeft = undefined;
        this.secondPieceFromLeft = undefined;
        this.secondClickId = null;
    }
    checkForWin() {
        const endGameModalContent = document.getElementById("endGameModal-content")
        const endGameModalContainer = document.getElementById("endGameModal-container")
        if (this.whitePiecesCounter === 0) {
            endGameModalContent.innerHTML = " black wins!!";
            endGameModalContainer.classList = "modal-container exist";
            return true;
        }
        if (this.blackPiecesCounter === 0) {
            endGameModalContent.innerHTML = " white wins!!";
            endGameModalContainer.classList = "modal-container exist";
            return true;
        }
        if (!(this.isThisPlayerHasLegalMove())) {
            endGameModalContent.innerHTML = this.isWhiteTurn ? " white wins!!" : " black wins!!";
            endGameModalContainer.classList = "modal-container exist";
        }
        return false;
    }
    isThisPlayerHasLegalMove() {
        let result = this.isPieceUnblockedForEndGame()
        this.isWhiteTurn = !(this.isWhiteTurn);
        return result;
    }
    isPieceUnblockedForEndGame() {
        this.isWhiteTurn = !(this.isWhiteTurn);
        let theTestedPiece;
        let result = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                theTestedPiece = this.logicBoard[i][j];
                if (theTestedPiece && theTestedPiece.isWhite === this.isWhiteTurn) {
                    this.movingDirection = theTestedPiece.isWhite ? 1 : -1;
                    if (this.isPieceUnblocked(theTestedPiece, false)) { return true }
                    if (theTestedPiece.isKing) {
                        this.movingDirection *= -1; // שינוי כיוון
                        result = this.isPieceUnblocked(theTestedPiece, false);
                        this.movingDirection *= -1; // שינוי כיוון בחזרה
                        if (result) { return result };
                    }
                }
            }
        }
    }
    changeTurn() {
        const whosTurnHTML = document.getElementById('whosTurn');
        this.isWhiteTurn = !(this.isWhiteTurn);
        let whosTurn = this.isWhiteTurn ? 'its WHITE turn' : 'its BLACK turn';
        whosTurnHTML.innerHTML = whosTurn;
        this.endTurnReset();
    }
    endTurnReset() {
        this.PieceMustEatAgainResetVriables()
        this.HTMLpieceChosen = null; // the html element of the piece // might be un neccery

    }
    burnedPiecesLaw() {
        let theTestedPiece;
        let piecesToRemove = [];
        let whosTurn = this.isWhiteTurn ? 'white_piece' : 'black_piece';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                theTestedPiece = this.logicBoard[i][j];
                if (theTestedPiece && theTestedPiece.isWhite === this.isWhiteTurn) {
                    this.movingDirection = theTestedPiece.isWhite ? 1 : -1;
                    if (this.isPieceUnblocked(theTestedPiece, true)) { piecesToRemove.push(theTestedPiece) }
                    else if (theTestedPiece.isKing) {
                        this.movingDirection *= -1; // שינוי כיוון
                        if (this.isPieceUnblocked(theTestedPiece, true)) { piecesToRemove.push(theTestedPiece) }
                        this.movingDirection *= -1; // שינוי כיוון בחזרה
                    }
                }
            }
        }
        for (let i = 0; i < piecesToRemove.length; i++) {
            this.logicBoard[piecesToRemove[i].location.rowNumber][piecesToRemove[i].location.colunmNumber] = null;
            let removedHTMLpiece = document.getElementById((piecesToRemove[i].location.rowNumber) + "" + (piecesToRemove[i].location.colunmNumber) + "square").firstChild;
            removedHTMLpiece.classList.remove(whosTurn);
            removedHTMLpiece.classList.add('empty_piece')
            if (removedHTMLpiece.classList.contains('king')) {
                this.removeHTMLking(removedHTMLpiece);
            }
        }
    }
    endTurnLogic() {
        this.checkForWin()
        this.changeTurn()
    }
    isFirstClickValid() {
        return this.isClickOnPiece() && this.isPieceValidChoise() && this.getPieceValidMovesArray().length > 0
    }
    markHTMLpiece() {
        this.HTMLpieceChosen = document.getElementById(this.newClickId);
        this.HTMLpieceChosen.classList.add('chosen');
    }
    secondClickLogic() {
        this.secondClickEatingLogic();
        this.secondClickMovingLogic();
    }
    secondClickEatingLogic() {
        if (Math.abs(this.logicPieceChosen.location.rowNumber - this.secondClickId[0] * 1) === 2) {
            this.doTheEating()// includ move the pieces and delete the aeten one
            this.promoteToKingIfNeeded()
            if (this.getPieceValidMovesArray().length > 0) {
                this.PieceMustEatAgainResetVriables();
            }
            else {
                this.endTurnLogic()
            }
        }
    }
    secondClickMovingLogic() {
        if (this.logicPieceChosen) {
            this.burnedPiecesLaw()
            this.doTheMove()
            this.promoteToKingIfNeeded()//is this piece still around?
            this.endTurnLogic()
        }
    }
    updateTheHTMLoriginAndDestination(moveToHTMLpiece, whosTurn) {
        moveToHTMLpiece.classList.remove('empty_piece');
        moveToHTMLpiece.classList.add(whosTurn);
        this.HTMLpieceChosen?.classList.add('empty_piece');
        if (this.HTMLpieceChosen?.classList.contains('king')) {
            this.promotePiece(moveToHTMLpiece)
            this.removeHTMLking(this.HTMLpieceChosen);
        }
    }
    eventListinersStarter() {
        const HTMLboard = document.getElementById('board');
        const endGameModalContent = document.getElementById("endGameModal-content")
        const endGameModalContainer = document.getElementById("endGameModal-container")
        const endGameModalButton = document.getElementById("newGame")
        const drawButton = document.getElementById("draw-button");
        const drawModalContainer = document.getElementById("drawModal-container")
        const denayDraw = document.getElementById("denayDraw")
        const acceptDraw = document.getElementById("acceptDraw")
        const resingButton = document.getElementById("resing-button");
        // startGame
        HTMLboard.addEventListener('click', (event) => { this.startGame(event) });
        // endGame
        endGameModalButton.addEventListener('click', () => { document.location.reload() })
        // draw
        drawButton.addEventListener('click', () => {
            drawModalContainer.classList = "modal-container exist";
        })
        denayDraw.addEventListener('click', () => {
            drawModalContainer.classList = "modal-container none";
        })
        acceptDraw.addEventListener('click', () => {
            drawModalContainer.classList = "modal-container none";
            endGameModalContent.innerHTML = "its a draw!"
            endGameModalContainer.classList = "modal-container exist"
        
        })
        // resing
        resingButton.addEventListener('click', () => {
            endGameModalContent.innerHTML = "its a resing!"
            endGameModalContainer.classList = "modal-container exist"
        })
    }
}
class Piece {
    constructor(isWhite, rowNumber, colunmNumber) {
        this.isWhite = isWhite;
        this.isKing = false;
        this.location = new Location(rowNumber, colunmNumber);
    }
    isPieceMovementLaw(origin, destination) {
        if (origin === destination) { return false }
        if (Math.abs(origin))

            return true
    }
}
class Location {
    constructor(rowNumber, colunmNumber) {
        this.rowNumber = rowNumber;
        this.colunmNumber = colunmNumber;
    }
}
////////////////////////////////////////////////////////////////
startGameButton.addEventListener('click', () => {
    startGameModal.classList = "none";
    const game = new Game()
    game.eventListinersStarter()
    game.startGame()
})