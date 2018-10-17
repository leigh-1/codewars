function isCheck(Pieces, Player) {
  class NewBoard {
    constructor() {
      this.pieces = Pieces;
      this.player = Player;
      this.state = {
        player0Pieces: [],
        player1Pieces: [],
        defendingKingSquare: [],
        defendableSquares: [],
        threatenedSquares: [],
        inCheckArr: [],
        isMate: false,
      };
    }

    buildBoard() {
      this.pieces.forEach((p) => {
        if (p.owner === 0) {
          this.state.player0Pieces.push(p);
        }
        if (p.owner === 1) {
          this.state.player1Pieces.push(p);
        }
      });
    }

    kingSquareLocator() {
      let defendersSquaresArr;
      (this.player === 0) ? defendersSquaresArr = this.state.player0Pieces : defendersSquaresArr = this.state.player1Pieces;
      for (let i = 0; i < defendersSquaresArr.length; i++) {
        if (defendersSquaresArr[i].piece === 'king') {
          const { x } = defendersSquaresArr[i];
          const { y } = defendersSquaresArr[i];
          this.state.defendingKingSquare = [x, y];
        }
      }
    }

    determineIfKingIsIncheck() {
      const [x, y] = this.state.defendingKingSquare;
      for (let i = 0; i < this.state.threatenedSquares.length; i++) {
        for (let j = 0; j < this.state.threatenedSquares[i][1].length; j++) {
          if (x === this.state.threatenedSquares[i][1][j][0] && y === this.state.threatenedSquares[i][1][j][1]) {
            this.state.inCheckArr.push(this.state.threatenedSquares[i][0]);
          }
        }
      }
    }
  }

  // object composition factory returns object with methods to create inRange squares
  function threatsOrDefendableSquaresFactory() {
    const protoSquaresInRangeFactory = {
      // buildAll func to build all, although can use components separately
      // playr useful to mock in unit testing (dependency injection)
      buildAll(piecesArray, playr) {
        const totalThreatsorDefendableSquaresArray = [];
        for (let i = 0; i < piecesArray.length; i++) {
          if (piecesArray[i].piece === 'king') {
            this.buildInRangeOfKing(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'pawn') {
            this.buildInRangeOfPawn(piecesArray[i], playr, totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'knight') {
            this.buildInRangeOfKnight(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'rook') {
            this.buildInRangeOfRook(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'bishop') {
            this.buildInRangeOfBishop(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'queen') {
            this.buildInRangeOfQueen(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
        }
        return totalThreatsorDefendableSquaresArray;
      },
      buildInRangeOfKing(kingObj, tToDSA) {
        // squares in range of king
        const inRange = [];
        const { x } = kingObj;
        const { y } = kingObj;
        if (x - 1 >= 0) {
          inRange.push([x - 1, y]);
          if (y - 1 >= 0) {
            inRange.push([x - 1, y - 1]);
          }
          if (y + 1 <= 8) {
            inRange.push([x - 1, y + 1]);
          }
        }
        if (x + 1 <= 8) {
          inRange.push([x + 1, y]);
          if (y - 1 >= 0) {
            inRange.push([x + 1, y - 1]);
          }
          if (y + 1 <= 8) {
            inRange.push([x + 1, y + 1]);
          }
        }
        if (y - 1 >= 0) {
          inRange.push([x, y - 1]);
        }
        if (y + 1 <= 8) {
          inRange.push([x, y + 1]);
        }
        tToDSA.push([kingObj, inRange]);
      },
      buildInRangeOfPawn(pawnObj, playr, tToDSA) {
        // in range of pawns
        const inRange = [];
        const { x } = pawnObj;
        const { y } = pawnObj;
        // threats/defense advancing down the board with y increasing
        if (playr === 0) {
          if (x - 1 >= 0) {
            inRange.push([x - 1, y + 1]);
          }
          if (x + 1 <= 7) {
            inRange.push([x + 1, y + 1]);
          }
        }
        // advancing up the board with y decreasing
        if (this.player === 1) {
          if ((x - 1) >= 0) {
            inRange.push([x - 1, y - 1]);
          }
          if ((x + 1) <= 7) {
            inRange.push([x + 1, y - 1]);
          }
        }
        tToDSA.push([pawnObj, inRange]);
      },
      buildInRangeOfKnight(knightObj, tToDSA) {
        // squares in range of knight
        const inRange = [];
        const { x } = knightObj;
        const { y } = knightObj;
        if ((x + 2) <= 7 && (y - 1) >= 0) {
          inRange.push([x + 2, y - 1]);
        }
        if ((x + 2) <= 7 && (y + 1) <= 7) {
          inRange.push([x + 2, y + 1]);
        }
        if ((x + 1) <= 7 && (y - 2) >= 0) {
          inRange.push([x + 1, y - 2]);
        }
        if ((x - 1) >= 0 && (y - 2) >= 0) {
          inRange.push([x - 1, y - 2]);
        }
        if ((x - 2) >= 0 && (y - 1) >= 0) {
          inRange.push([x - 2, y - 1]);
        }
        if ((x - 2) >= 0 && (y + 1) <= 7) {
          inRange.push([x - 2, y + 1]);
        }
        if ((x - 1) >= 0 && (y + 2) <= 7) {
          inRange.push([x - 1, y + 2]);
        }
        if ((x + 1) <= 7 && (y + 2) <= 7) {
          inRange.push([x + 1, y + 2]);
        }
        tToDSA.push([knightObj, inRange]);
      },
      buildInRangeOfRook(rookObj, tToDSA) {
        // squares in range of rook
        const inRange = [];
        const { x } = rookObj;
        const { y } = rookObj;
        for (let j = -7; j <= 7; j++) {
          // ignore own square
          if (j === 0) {
            ++j;
          }
          if (x + j >= 0 && x + j <= 7) {
            inRange.push([x + j, y]);
          }
        }
        for (let k = -7; k <= 7; k++) {
          // ignore own square
          if (k === 0) {
            ++k;
          }
          if (y + k >= 0 && y + k <= 7) {
            inRange.push([x, y + k]);
          }
        }
        tToDSA.push([rookObj, inRange]);
      },
      buildInRangeOfBishop(bishopObj, tToDSA) {
        // squares in range of rook
        const inRange = [];
        const { x } = bishopObj;
        const { y } = bishopObj;
        for (let i = 1; i <= 7; i++) {
          if (x + i <= 7 && y + i <= 7) {
            inRange.push([x + i, y + i]);
          }
          if (x + i <= 7 && y - i >= 0) {
            inRange.push([x + i, y - i]);
          }
        }
        for (let i = 1; i <= 7; i++) {
          if (x - i >= 0 && y - i >= 0) {
            inRange.push([x - i, y - i]);
          }
          if (x - i >= 0 && y + i <= 7) {
            inRange.push([x - i, y + i]);
          }
        }
        tToDSA.push([bishopObj, inRange]);
      },
      buildInRangeOfQueen(queenObj, tToDSA) {
        // squares in range of queen => ..RangeOfRook + ..RangeOfBishop combined
        const inRange = [];
        const { x } = queenObj;
        const { y } = queenObj;
        for (let j = -7; j <= 7; j++) {
          // ignore own square
          if (j === 0) {
            ++j;
          }
          if (x + j >= 0 && x + j <= 7) {
            inRange.push([x + j, y]);
          }
        }
        for (let k = -7; k <= 7; k++) {
          // ignore own square
          if (k === 0) {
            ++k;
          }
          if (y + k >= 0 && y + k <= 7) {
            inRange.push([x, y + k]);
          }
        }
        for (let i = 1; i <= 7; i++) {
          if (x + i <= 7 && y + i <= 7) {
            inRange.push([x + i, y + i]);
          }
          if (x + i <= 7 && y - i >= 0) {
            inRange.push([x + i, y - i]);
          }
        }
        for (let i = 1; i <= 7; i++) {
          if (x - i >= 0 && y - i >= 0) {
            inRange.push([x - i, y - i]);
          }
          if (x - i >= 0 && y + i <= 7) {
            inRange.push([x - i, y + i]);
          }
        }
        tToDSA.push([queenObj, inRange]);
      },
    };
    return Object.create(protoSquaresInRangeFactory);
  }

  // logic
  const board = new NewBoard();
  board.buildBoard();
  board.kingSquareLocator();
  const boardThreatenedDefendedSquares = threatsOrDefendableSquaresFactory();
  if (board.player === 0) {
    board.state.threatenedSquares = boardThreatenedDefendedSquares.buildAll(board.state.player1Pieces, 0);
    // defenders own inRange squares not needed by isCheck, will be used by isMate: board.state.defendableSquares = boardThreatenedDefendedSquares.buildAll(board.state.player0Pieces, 0));
  }
  if (board.player === 1) {
    board.state.threatenedSquares = boardThreatenedDefendedSquares.buildAll(board.state.player0Pieces, 1);
    // defenders own in range squares not needed by isCheck: board.state.defendableSquares = boardThreatenedDefendedSquares.buildAll(board.state.player1Pieces, 1));
  }
  board.determineIfKingIsIncheck();
  return (board.state.inCheckArr.length === 0) ? false : board.state.inCheckArr;
}

function isMate(Pieces, Player) {
  class NewBoard {
    constructor() {
      this.pieces = Pieces;
      this.player = Player;
      this.state = {
        player0Pieces: [],
        player1Pieces: [],
        defendingKingSquare: [],
        defendableSquares: [],
        threatenedSquares: [],
        inCheckArr: [],
        fixedPiecesArr: [],
        isMate: null,
      };
    }

    buildBoard() {
      this.pieces.forEach((p) => {
        if (p.owner === 0) {
          this.state.player0Pieces.push(p);
        }
        if (p.owner === 1) {
          this.state.player1Pieces.push(p);
        }
      });
    }

    kingSquareLocator() {
      const defendersSquaresArr = (this.player === 0) ? this.state.player0Pieces : this.state.player1Pieces;
      for (let i = 0; i < defendersSquaresArr.length; i++) {
        if (defendersSquaresArr[i].piece === 'king') {
          const { x } = defendersSquaresArr[i];
          const { y } = defendersSquaresArr[i];
          this.state.defendingKingSquare = [x, y];
        }
      }
    }

    determineIfKingIsIncheck() {
      const [x, y] = this.state.defendingKingSquare;
      for (let i = 0; i < this.state.threatenedSquares.length; i++) {
        for (let j = 0; j < this.state.threatenedSquares[i][1].length; j++) {
          if (x === this.state.threatenedSquares[i][1][j][0] && y === this.state.threatenedSquares[i][1][j][1]) {
            this.state.inCheckArr.push(this.state.threatenedSquares[i]);
          }
        }
      }
    }
    // check player is able to reply with piece, ie no own or opponents pieces blocking
    checkReplyVector(checkPieceX, checkPieceY, defendingPiece) {
      const threatVectors = [];
      let allPiecesArr = [];
      // build holding array of all pieces [x, y]
      const arr1 = (() => {
        const tmpArr = [];
        for (let i = 0; i < this.state.player0Pieces.length; i++) {
          tmpArr.push([this.state.player0Pieces[i].x, this.state.player0Pieces[i].y]);
        }
        return tmpArr;
      })();
      const arr2 = (() => {
        const tmpArr = [];
        for (let i = 0; i < this.state.player1Pieces.length; i++) {
          tmpArr.push([this.state.player1Pieces[i].x, this.state.player1Pieces[i].y]);
        }
        return tmpArr;
      })();
    
      allPiecesArr = [...arr1, ...arr2];

      // build approach vector between defending piece and checking attacker
      if (defendingPiece.piece === 'rook') {
        if (checkPieceX === defendingPiece.x) {
          if (checkPieceY > defendingPiece.y) {
            for (let j = defendingPiece.y + 1; j < checkPieceY; j++) {
              threatVectors.push([checkPieceX, j]);
            }
          }
          if (defendingPiece.y > checkPieceY) {
            for (let j = checkPieceY + 1; j < defendingPiece.y; j++) {
              threatVectors.push([checkPieceX, j]);
            }
          }
        }
        if (checkPieceY === defendingPiece.y) {
          if (checkPieceX < defendingPiece.x) {
            for (let j = checkPieceX + 1; j < defendingPiece.x; j++) {
              threatVectors.push([j, checkPieceY]);
            }
          }
          if (defendingPiece.x < checkPieceX) {
            for (let j = defendingPiece.x + 1; j < checkPieceX; j++) {
              threatVectors.push([j, checkPieceY]);
            }
          }
        }
      }
      if (defendingPiece.piece === 'bishop') {
        if (checkPieceX > defendingPiece.x && checkPieceY > defendingPiece.y) {
          for (let j = defendingPiece.x + 1, k = defendingPiece.y + 1; j < checkPieceX; j++, k++) {
            threatVectors.push([j, k]);
          }
        }
        if (checkPieceX > defendingPiece.x && checkPieceY < defendingPiece.y) {
          for (let j = defendingPiece.x + 1, k = defendingPiece.y - 1; j < checkPieceX; j++, k--) {
            threatVectors.push([j, k]);
          }
        }
        if (checkPieceX < defendingPiece.x && checkPieceY < defendingPiece.y) {
          for (let j = defendingPiece.x - 1, k = defendingPiece.y - 1; j > checkPieceX; j--, k--) {
            threatVectors.push([j, k]);
          }
        }
        if (checkPieceX < defendingPiece.x && checkPieceY > defendingPiece.y) {
          for (let j = defendingPiece.x - 1, k = defendingPiece.y + 1; j > checkPieceX; j--, k++) {
            threatVectors.push([j, k]);
          }
        }
      }
      if (defendingPiece.piece === 'queen') {
        if (checkPieceX === defendingPiece.x) {
          if (checkPieceY > defendingPiece.y) {
            for (let j = defendingPiece.y + 1; j < checkPieceY; j++) {
              threatVectors.push([checkPieceX, j]);
            }
          }
          if (defendingPiece.y > checkPieceY) {
            for (let j = checkPieceY + 1; j < defendingPiece.y; j++) {
              threatVectors.push([checkPieceX, j]);
            }
          }
        }
        if (checkPieceY === defendingPiece.y) {
          if (checkPieceX < defendingPiece.x) {
            for (let j = checkPieceX + 1; j < defendingPiece.x; j++) {
              threatVectors.push([j, checkPieceY]);
            }
          }
          if (defendingPiece.x < checkPieceX) {
            for (let j = defendingPiece.x + 1; j < checkPieceX; j++) {
              threatVectors.push([j, checkPieceY]);
            }
          }
        }
        if (checkPieceX > defendingPiece.x && checkPieceY > defendingPiece.y) {
          for (let j = defendingPiece.x + 1, k = defendingPiece.y + 1; j < checkPieceX; j++, k++) {
            threatVectors.push([j, k]);
          }
        }
        if (checkPieceX > defendingPiece.x && checkPieceY < defendingPiece.y) {
          for (let j = defendingPiece.x + 1, k = defendingPiece.y - 1; j < checkPieceX; j++, k--) {
            threatVectors.push([j, k]);
          }
        }
        if (checkPieceX < defendingPiece.x && checkPieceY < defendingPiece.y) {
          for (let j = defendingPiece.x - 1, k = defendingPiece.y - 1; j > checkPieceX; j--, k--) {
            threatVectors.push([j, k]);
          }
        }
        if (checkPieceX < defendingPiece.x && checkPieceY > defendingPiece.y) {
          for (let j = defendingPiece.x - 1, k = defendingPiece.y + 1; j > checkPieceX; j--, k++) {
            threatVectors.push([j, k]);
          }
        }
      }

      // check if any pieces in way of defender taking checking attacking
      for (let i = 0; i < threatVectors.length; i++) {
        for (let j = 0; j < allPiecesArr.length; j++) {
          if (threatVectors[i].toString() === allPiecesArr[j].toString()) {
            // reply piece is blocked from taking attacker
            return true;
          }
        }
      }
      return false;
    }


    // examine opponents first then own pieces to see if a checking rook, queen or bishop approach vector is already blocked
    removeAlreadyBlockedPiecesFromCheckArr(board) {
      const [kingX, kingY] = this.state.defendingKingSquare;
      const attackVectors = [];
      // the squares the attacking piece must cover between itself and the King
      (function buildAttackVectors() {
        for (let i = 0; i < board.state.inCheckArr.length; i++) {
          if (board.state.inCheckArr[i][0].piece === 'rook') {
            const tmpArr = [];
            const { x } = board.state.inCheckArr[i][0];
            const { y } = board.state.inCheckArr[i][0];
            if (y === kingY) {
              if (x < kingX) {
                for (let j = x + 1; j < kingX; j++) {
                  tmpArr.push([j, y]);
                }
              }
              if (kingX < x) {
                for (let j = kingX + 1; j < x; j++) {
                  tmpArr.push([j, y]);
                }
              }
            }
            if (x === kingX) {
              if (y > kingY) {
                for (let j = kingY + 1; j < y; j++) {
                  tmpArr.push([x, j]);
                }
              }
              if (kingY > y) {
                for (let j = y + 1; j < kingY; j++) {
                  tmpArr.push([x, j]);
                }
              }
            }
            attackVectors.push([board.state.inCheckArr[i][0], tmpArr]);
          }

          if (board.state.inCheckArr[i][0].piece === 'bishop') {
            const tmpArr = [];
            const { x } = board.state.inCheckArr[i][0];
            const { y } = board.state.inCheckArr[i][0];

            if (x > kingX && y > kingY) {
              for (let j = kingX + 1, k = kingY + 1; j < x; j++, k++) {
                tmpArr.push([j, k]);
              }
            }
            if (x > kingX && y < kingY) {
              for (let j = kingX + 1, k = kingY - 1; j < x; j++, k--) {
                tmpArr.push([j, k]);
              }
            }
            if (x < kingX && y < kingY) {
              for (let j = kingX - 1, k = kingY - 1; j > x; j--, k--) {
                tmpArr.push([j, k]);
              }
            }
            if (x < kingX && y > kingY) {
              for (let j = kingX - 1, k = kingY + 1; j > x; j--, k++) {
                tmpArr.push([j, k]);
              }
            }
            attackVectors.push([board.state.inCheckArr[i][0], tmpArr]);
          }

          if (board.state.inCheckArr[i][0].piece === 'queen') {
            const tmpArr = [];
            const { x } = board.state.inCheckArr[i][0];
            const { y } = board.state.inCheckArr[i][0];
            // from rook approach vectors, ie same x or y
            if (y === kingY) {
              if (x < kingX) {
                for (let j = x + 1; j < kingX; j++) {
                  tmpArr.push([j, y]);
                }
              }
              if (kingX < x) {
                for (let j = kingX + 1; j < x; j++) {
                  tmpArr.push([j, y]);
                }
              }
            }
            if (x === kingX) {
              if (y > kingY) {
                for (let j = kingY + 1; j < y; j++) {
                  tmpArr.push([x, j]);
                }
              }
              if (kingY > y) {
                for (let j = y + 1; j < kingY; j++) {
                  tmpArr.push([x, j]);
                }
              }
            }
            // from bishop approach vectors, ie diagonal attack
            if (x > kingX && y > kingY) {
              for (let j = kingX + 1, k = kingY + 1; j < x; j++, k++) {
                tmpArr.push([j, k]);
              }
            }
            if (x > kingX && y < kingY) {
              for (let j = kingX + 1, k = kingY - 1; j < x; j++, k--) {
                tmpArr.push([j, k]);
              }
            }
            if (x < kingX && y < kingY) {
              for (let j = kingX - 1, k = kingY - 1; j > x; j--, k--) {
                tmpArr.push([j, k]);
              }
            }
            if (x < kingX && y > kingY) {
              for (let j = kingX - 1, k = kingY + 1; j > x; j--, k++) {
                tmpArr.push([j, k]);
              }
            }
            attackVectors.push([board.state.inCheckArr[i][0], tmpArr]);
          }
        }
      }());

      // could refactor the following 'check blocking' functions as very similar although can more easily see what the program is doing kept separate
      // also in 2nd func need to log player's piece as fixed if being in situe blocks an opponents check, player is unable to move it
      (function isOpponentBlockingApproachVector() {
        const playerPieces = (board.player === 0) ? board.state.player1Pieces : board.state.player0Pieces;
        const attackV = Array.from(attackVectors);
        for (let i = 0; i < playerPieces.length; i++) {
          const { x: oPieceX, y: oPieceY } = playerPieces[i];
          for (let j = 0; j < attackV.length; j++) {
            for (let k = 0; k < attackV[j].length; k++) {
              if (oPieceX === attackV[j][1][k][0] && oPieceY === attackV[j][1][k][1]) {
                // remove the attacking piece from inCheck arrays and attackVectors
                for (let l = 0; l < board.state.inCheckArr.length; l++) {
                  const { x: checkingPieceX, y: checkingPieceY } = board.state.inCheckArr[l][0];
                  if (checkingPieceX === attackV[j][0].x && checkingPieceY === attackV[j][0].y) {
                    board.state.inCheckArr.splice(l, 1);
                    attackVectors.splice(j, 1);
                  }
                }
              }
            }
          }
        }
        if (board.state.inCheckArr.length === 0) {
          const Board = board;
          Board.state.isMate = false;
        }
      }());

      (function isPlayerBlockingApproachVector() {
        const playerPieces = (board.player === 0) ? board.state.player0Pieces : board.state.player1Pieces;
        const attackV = Array.from(attackVectors);
        for (let i = 0; i < playerPieces.length; i++) {
          const { x: ownPieceX, y: ownPieceY } = playerPieces[i];
          for (let j = 0; j < attackV.length; j++) {
            for (let k = 0; k < attackV[j][1].length; k++) {
              if (ownPieceX === attackV[j][1][k][0] && ownPieceY === attackV[j][1][k][1]) {
                // remove the attacking piece from inCheck arrays and attackVectors
                for (let l = 0; l < board.state.inCheckArr.length; l++) {
                  const { x: checkingPieceX, y: checkingPieceY } = board.state.inCheckArr[l][0];
                  if (checkingPieceX === attackV[j][0].x && checkingPieceY === attackV[j][0].y) {
                    const Board = board;
                    // fixed piece as blocking opponent, in-check otherwise
                    Board.state.fixedPiecesArr.push(playerPieces[i]);
                    board.state.inCheckArr.splice(l, 1);
                    attackVectors.splice(j, 1);
                  }
                }
              }
            }
          }
        }
        if (board.state.inCheckArr.length === 0) {
          const Board = board;
          Board.state.isMate = false;
        }
      }());
      // for use later when try to block rook, queen or bishop attackVectors
      board.state.inCheckArr.push(attackVectors);
    }

    ableToTakeorBlockOpponentsCheckingPiece() {
      const { x: checkingPieceX, y: checkingPieceY } = this.state.inCheckArr[0][0];
      const defendingPiecesArr = this.state.defendableSquares;

      // remove fixed pieces blocking an opponents otherwise checking piece
      if (this.state.fixedPiecesArr.length > 0) {
        for (let i = 0; i < this.state.fixedPiecesArr.length; i++) {
          for (let j = 0; j < defendingPiecesArr.length; j++) {
            if (this.state.fixedPiecesArr[i].x === defendingPiecesArr[j][0].x && this.state.fixedPiecesArr[i].y === defendingPiecesArr[j][0].y) {
              defendingPiecesArr.splice(j, 1);
            }
          }
        }
      }
      // is player able to take checking piece
      for (let i = 0; i < defendingPiecesArr.length; i++) {
        for (let j = 0; j < defendingPiecesArr[i][1].length; j++) {
          if (defendingPiecesArr[i][1][j].toString() === `${checkingPieceX},${checkingPieceY}`) {
            if (defendingPiecesArr[i][0].piece === 'rook' || 'queen' || 'bishop') {
              if (this.checkReplyVector(checkingPieceX, checkingPieceY, defendingPiecesArr[i][0]) === true) {
                this.state.isMate = true;
                return true;
              }
            }
          }
        }
      }
      // can checking piece be blocked
      if (this.state.inCheckArr[0][0] === 'king' || 'queen' || 'bishop') {
        // remove king from defendingPiecesArr to check the array for 'check blocking' moves
        for (let i = 0; i < defendingPiecesArr.length; i++) {
          if (defendingPiecesArr[i][0].piece === 'king') {
            defendingPiecesArr.splice(i, 1);
            break;
          }
        }
        // can player block with remaining pieces
        for (let i = 0; i < defendingPiecesArr.length; i++) {
          for (let j = 0; j < defendingPiecesArr[i][1].length; j++) {
            for (let k = 0; k < this.state.inCheckArr[1][0][1].length; k++) {
              if (defendingPiecesArr[i][1][j].toString() === this.state.inCheckArr[1][0][1][k].toString()) {
                this.state.isMate = false;
                return false;
              }
            }
          }
        }
      }
      // no escape
      this.state.isMate = true;
      return true;
    }

    minusThreatenedSquares(availMoves) {
      const movesAvail = availMoves;
      // splicing array with nested for loop => count backwards on first loop
      for (let i = movesAvail.length - 1; i >= 0; i--) {
        for (let j = 0; j < this.state.threatenedSquares.length; j++) {
          if (movesAvail.length === 0) { break; }
          for (let k = 0; k < this.state.threatenedSquares[j][1].length; k++) {
            if (movesAvail[i][0] === this.state.threatenedSquares[j][1][k][0] && movesAvail[i][1] === this.state.threatenedSquares[j][1][k][1]) {
              movesAvail.splice(i, 1);
              if (i > 0) { i = movesAvail.length - 1; }
              k = 0;
              j = 0;
              if (movesAvail.length === 0) {
                break;
              }
            }
          }
        }
      }

      if (movesAvail.length > 0) {
        this.state.isMate = false;
        return false;
      }
      return this.ableToTakeorBlockOpponentsCheckingPiece();
    }

    // King's moves minus own pieces currently blocking escape
    kingAbletoMovetoFreeSquare(arr) {
      const availMoves = arr;
      const ownPiecesArr = Array.from((this.player === 0) ? this.state.player0Pieces : this.state.player1Pieces);
      for (let i = availMoves.length - 1; i >= 0; --i) {
        if (availMoves.length === 0) { break; }
        for (let j = 0; j < ownPiecesArr.length; j++) {
          if (availMoves[i][0] === ownPiecesArr[j].x && availMoves[i][1] === ownPiecesArr[j].y) {
            availMoves.splice(i, 1);
            i = availMoves.length - 1;
            if (availMoves.length === 0) {
              break;
            }
            // if set to 0 immediately increments++
            j = -1;
          }
        }
      }
      if (availMoves.length === 0) {
        this.state.ableToTakeorBlockOpponentsCheckingPiece();
      } // minus squares already under threat by opponent's pieces
      if (availMoves.length > 0) {
        this.minusThreatenedSquares(availMoves);
      }
    }
  }

  // object composition factory returns object exposing methods to create inRange squares
  function threatsOrDefendableSquaresFactory() {
    const protoSquaresInRangeFactory = {
      // buildAll func to build all, although can use components separately
      // playr useful to mock in unit testing (dependency injection)
      buildAll(piecesArray, playr) {
        const totalThreatsorDefendableSquaresArray = [];
        for (let i = 0; i < piecesArray.length; i++) {
          if (piecesArray[i].piece === 'king') {
            this.buildInRangeOfKing(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'pawn') {
            this.buildInRangeOfPawn(piecesArray[i], playr, totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'knight') {
            this.buildInRangeOfKnight(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'rook') {
            this.buildInRangeOfRook(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'bishop') {
            this.buildInRangeOfBishop(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
          if (piecesArray[i].piece === 'queen') {
            this.buildInRangeOfQueen(piecesArray[i], totalThreatsorDefendableSquaresArray);
          }
        }
        return totalThreatsorDefendableSquaresArray;
      },
      buildInRangeOfKing(kingObj, tToDSA) {
        // squares in range of king
        const inRange = [];
        const { x } = kingObj;
        const { y } = kingObj;
        if (x - 1 >= 0) {
          inRange.push([x - 1, y]);
          if (y - 1 >= 0) {
            inRange.push([x - 1, y - 1]);
          }
          if (y + 1 < 8) {
            inRange.push([x - 1, y + 1]);
          }
        }
        if (x + 1 < 8) {
          inRange.push([x + 1, y]);
          if (y - 1 >= 0) {
            inRange.push([x + 1, y - 1]);
          }
          if (y + 1 < 8) {
            inRange.push([x + 1, y + 1]);
          }
        }
        if (y - 1 >= 0) {
          inRange.push([x, y - 1]);
        }
        if (y + 1 < 8) {
          inRange.push([x, y + 1]);
        }
        tToDSA.push([kingObj, inRange]);
        return inRange;
      },
      buildInRangeOfPawn(pawnObj, playr, tToDSA) {
        // in range of pawns
        const inRange = [];
        const { x } = pawnObj;
        const { y } = pawnObj;
        // if player => 0 threats advancing down the board with y increasing
        if (playr === 0) {
          if (x - 1 >= 0) {
            inRange.push([x - 1, y + 1]);
          }
          if (x + 1 <= 7) {
            inRange.push([x + 1, y + 1]);
          }
        }
        // advancing up the board with y decreasing
        if (playr === 1) {
          if ((x - 1) >= 0) {
            inRange.push([x - 1, y - 1]);
          }
          if ((x + 1) <= 7) {
            inRange.push([x + 1, y - 1]);
          }
        }
        tToDSA.push([pawnObj, inRange]);
      },
      buildInRangeOfKnight(knightObj, tToDSA) {
        // squares in range of knight
        const inRange = [];
        const { x } = knightObj;
        const { y } = knightObj;
        if ((x + 2) <= 7 && (y - 1) >= 0) {
          inRange.push([x + 2, y - 1]);
        }
        if ((x + 2) <= 7 && (y + 1) <= 7) {
          inRange.push([x + 2, y + 1]);
        }
        if ((x + 1) <= 7 && (y - 2) >= 0) {
          inRange.push([x + 1, y - 2]);
        }
        if ((x - 1) >= 0 && (y - 2) >= 0) {
          inRange.push([x - 1, y - 2]);
        }
        if ((x - 2) >= 0 && (y - 1) >= 0) {
          inRange.push([x - 2, y - 1]);
        }
        if ((x - 2) >= 0 && (y + 1) <= 7) {
          inRange.push([x - 2, y + 1]);
        }
        if ((x - 1) >= 0 && (y + 2) <= 7) {
          inRange.push([x - 1, y + 2]);
        }
        if ((x + 1) <= 7 && (y + 2) <= 7) {
          inRange.push([x + 1, y + 2]);
        }
        tToDSA.push([knightObj, inRange]);
      },
      buildInRangeOfRook(rookObj, tToDSA) {
        // squares in range of rook
        const inRange = [];
        const { x } = rookObj;
        const { y } = rookObj;
        for (let j = -7; j <= 7; j++) {
          // ignore own square
          if (j === 0) {
            ++j;
          }
          if (x + j >= 0 && x + j <= 7) {
            inRange.push([x + j, y]);
          }
        }
        for (let k = -7; k <= 7; k++) {
          // ignore own square
          if (k === 0) {
            ++k;
          }
          if (y + k >= 0 && y + k <= 7) {
            inRange.push([x, y + k]);
          }
        }
        tToDSA.push([rookObj, inRange]);
      },
      buildInRangeOfBishop(bishopObj, tToDSA) {
        // squares in range of rook
        const inRange = [];
        const { x } = bishopObj;
        const { y } = bishopObj;
        for (let i = 1; i <= 7; i++) {
          if (x + i <= 7 && y + i <= 7) {
            inRange.push([x + i, y + i]);
          }
          if (x + i <= 7 && y - i >= 0) {
            inRange.push([x + i, y - i]);
          }
        }
        for (let i = 1; i <= 7; i++) {
          if (x - i >= 0 && y - i >= 0) {
            inRange.push([x - i, y - i]);
          }
          if (x - i >= 0 && y + i <= 7) {
            inRange.push([x - i, y + i]);
          }
        }
        tToDSA.push([bishopObj, inRange]);
      },
      buildInRangeOfQueen(queenObj, tToDSA) {
        // squares in range of queen => inRangeOfRook + inRangeOfBishop combined
        const inRange = [];
        const { x } = queenObj;
        const { y } = queenObj;
        for (let j = -7; j <= 7; j++) {
          // ignore own square
          if (j === 0) {
            ++j;
          }
          if (x + j >= 0 && x + j <= 7) {
            inRange.push([x + j, y]);
          }
        }
        for (let k = -7; k <= 7; k++) {
          // ignore own square
          if (k === 0) {
            ++k;
          }
          if (y + k >= 0 && y + k <= 7) {
            inRange.push([x, y + k]);
          }
        }
        for (let i = 1; i <= 7; i++) {
          if (x + i <= 7 && y + i <= 7) {
            inRange.push([x + i, y + i]);
          }
          if (x + i <= 7 && y - i >= 0) {
            inRange.push([x + i, y - i]);
          }
        }
        for (let i = 1; i <= 7; i++) {
          if (x - i >= 0 && y - i >= 0) {
            inRange.push([x - i, y - i]);
          }
          if (x - i >= 0 && y + i <= 7) {
            inRange.push([x - i, y + i]);
          }
        }
        tToDSA.push([queenObj, inRange]);
      },
    };
    return Object.create(protoSquaresInRangeFactory);
  }

  // logic
  const board = new NewBoard();
  board.buildBoard();
  board.kingSquareLocator();
  const boardThreatenedDefendedSquares = threatsOrDefendableSquaresFactory();
  if (board.player === 0) {
    board.state.threatenedSquares = boardThreatenedDefendedSquares.buildAll(board.state.player1Pieces, 0);
    board.state.defendableSquares = boardThreatenedDefendedSquares.buildAll(board.state.player0Pieces, 0);
  }
  if (board.player === 1) {
    board.state.threatenedSquares = boardThreatenedDefendedSquares.buildAll(board.state.player0Pieces, 1);
    board.state.defendableSquares = boardThreatenedDefendedSquares.buildAll(board.state.player1Pieces, 1);
  }
  board.determineIfKingIsIncheck();
  if (board.state.inCheckArr.length === 0) {
    return false;
  }
  board.removeAlreadyBlockedPiecesFromCheckArr(board);
  // component usable from anywhere, resulting array passed in as argument
  board.kingAbletoMovetoFreeSquare(boardThreatenedDefendedSquares.buildInRangeOfKing({ piece: 'king', x: board.state.defendingKingSquare[0], y: board.state.defendingKingSquare[1] }, []));

  return board.state.isMate;
}

const pieces = [
{ piece: 'pawn', owner: 0, x: 4, y: 4 },
{ piece: 'knight', owner: 0, x: 2, y: 5 },
{ piece: 'pawn', owner: 0, x: 6, y: 5 },
{ piece: 'knight', owner: 0, x: 4, y: 6 },
{ piece: 'pawn', owner: 0, x: 5, y: 6 },
{ piece: 'queen', owner: 0, x: 3, y: 7 },
{ piece: 'king', owner: 0, x: 4, y: 7 },
{ piece: 'bishop', owner: 0, x: 5, y: 7 },
{ piece: 'knight', owner: 1, x: 5, y: 5, prevX: 3, prevY: 4 },
{ piece: 'king', owner: 1, x: 4, y: 0 },
{ piece: 'pawn', owner: 1, x: 4, y: 3 }
];

console.log(isMate(pieces, 0));


/*
working on this now
[ { piece: 'pawn', owner: 0, x: 6, y: 4 },
  { piece: 'pawn', owner: 0, x: 5, y: 5 },
  { piece: 'pawn', owner: 0, x: 3, y: 6 },
  { piece: 'pawn', owner: 0, x: 4, y: 6 },
  { piece: 'pawn', owner: 0, x: 7, y: 6 },
  { piece: 'queen', owner: 0, x: 3, y: 7 },
  { piece: 'king', owner: 0, x: 4, y: 7 },
  { piece: 'bishop', owner: 0, x: 5, y: 7 },
  { piece: 'knight', owner: 0, x: 6, y: 7 },
  { piece: 'rook', owner: 0, x: 7, y: 7 },
  { piece: 'queen', owner: 1, x: 7, y: 4, prevX: 3, prevY: 0 },
  { piece: 'king', owner: 1, x: 4, y: 0 } ]
  mate for player 0


  [ { piece: 'pawn', owner: 0, x: 4, y: 4 },
  { piece: 'knight', owner: 0, x: 2, y: 5 },
  { piece: 'pawn', owner: 0, x: 6, y: 5 },
  { piece: 'knight', owner: 0, x: 4, y: 6 },
  { piece: 'pawn', owner: 0, x: 5, y: 6 },
  { piece: 'queen', owner: 0, x: 3, y: 7 },
  { piece: 'king', owner: 0, x: 4, y: 7 },
  { piece: 'bishop', owner: 0, x: 5, y: 7 },
  { piece: 'knight', owner: 1, x: 5, y: 5, prevX: 3, prevY: 4 },
  { piece: 'king', owner: 1, x: 4, y: 0 },
  { piece: 'pawn', owner: 1, x: 4, y: 3 } ]
  mate for player 0

  [ { piece: 'knight', owner: 0, x: 3, y: 6 },
  { piece: 'pawn', owner: 0, x: 4, y: 6 },
  { piece: 'pawn', owner: 0, x: 5, y: 6 },
  { piece: 'queen', owner: 0, x: 3, y: 7 },
  { piece: 'king', owner: 0, x: 4, y: 7 },
  { piece: 'bishop', owner: 0, x: 5, y: 7 },
  { piece: 'king', owner: 1, x: 4, y: 0 },
  { piece: 'queen', owner: 1, x: 4, y: 1 },
  { piece: 'knight', owner: 1, x: 3, y: 5, prevX: 2, prevY: 3 } ]
  TypeError: Cannot read property '0' of undefined
    at NewBoard.kingAbletoMovetoFreeSquare
    at isMate

[ { piece: 'pawn', owner: 0, x: 4, y: 4 },
  { piece: 'knight', owner: 0, x: 2, y: 5 },
  { piece: 'pawn', owner: 0, x: 6, y: 5 },
  { piece: 'knight', owner: 0, x: 4, y: 6 },
  { piece: 'pawn', owner: 0, x: 5, y: 6 },
  { piece: 'queen', owner: 0, x: 3, y: 7 },
  { piece: 'king', owner: 0, x: 4, y: 7 },
  { piece: 'bishop', owner: 0, x: 5, y: 7 },
  { piece: 'knight', owner: 1, x: 5, y: 5, prevX: 3, prevY: 4 },
  { piece: 'king', owner: 1, x: 4, y: 0 },
  { piece: 'pawn', owner: 1, x: 4, y: 3 } ]
ReferenceError: x is not defined
    at NewBoard.checkReplyVector
    at

const pieces = [
  // { piece: 'king', owner: 1, x: 0, y: 0 },
  // { piece: 'bishop', owner: 1, x: 1, y: 2 },
  // { piece: 'bishop', owner: 1, x: 5, y: 0},
  // { piece: 'queen', owner: 1, x: 0, y: 7 },
  { piece: 'pawn', owner: 0, x: 6, y: 6 },
  { piece: 'pawn', owner: 0, x: 7, y: 6 },
  { piece: 'king', owner: 0, x: 7, y: 7 },
  // { piece: 'knight', owner: 0, x: 6, y: 7 },
  { piece: 'knight', owner: 1, x: 6, y: 5},
  // { piece: 'bishop', owner: 0, x: 5, y: 1 },
  // piece: 'rook', owner: 1, x: 4, y: 2 },
  // { piece: 'knight', owner: 1, x: 3, y: 5 },
      => false
];
*/
