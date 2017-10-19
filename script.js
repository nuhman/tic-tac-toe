var board = [3][3];
board = [
  [0,0,0],
  [0,0,0],
  [0,0,0]
];
function value(val){
  if(val === 0){
    return 2;
  } else if(val === "x"){
    return 3;
  } else{
    return 5;
  }
}

var audio_sources = ["https://soundbible.com/grab.php?id=1705&type=mp3","https://soundbible.com/grab.php?id=1003&type=mp3"];
var clickAudio = new Audio(audio_sources[0]);
clickAudio.volume = 0.8;
var victoryAudio = new Audio(audio_sources[1]);
victoryAudio.volume = 0.1;


var app = new Vue({
  el : '#app',
  data : {
    currentPlayer : "x",
    moveCount : 0,
    gameStatus : "",
    isGameOver : false,
    startScreen : true,
    playingMode : "human",
    computerGo : false,
    pressedReset : false,
    preTextForStatus : "Turn : Player ",
    soundStatus : "on",
    oppSoundStatus : "off",
    oppPlayer : "computer"
  },
  methods : {
    startGame : function(player){
      this.playingMode = player;
      this.currentPlayer = 'x';
      console.log("PLAYER IS "+player);
      this.startScreen = false;
      this.computerGo = false;
      if(player === "computer"){
          this.preTextForStatus = "Player plays : ";
          this.oppPlayer = "human";
      }
      else {
        this.preTextForStatus = "Turn : Player ";
        this.oppPlayer = "computer";
      }
      console.log(this.preTextForStatus);
    },

    setSymbol : function(x,y,event){
      if(this.pressedReset){
        event.target.innerText = "";
        return;
      }
      if(event.target.innerText === "" && !this.isGameOver){
        event.target.innerText = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === "x" ? "o" : "x";
        board[x][y] = event.target.innerText;
        this.computerGo = this.computerGo ? false : true;
        clickAudio.play();
        this.getResult(x,y,event);
      }
      if(this.playingMode === "computer" && !this.isGameOver && this.computerGo){
        this.moveByComputer();
      }
    },

    possWin : function(player){
      //check if human is going to win
      var product;
      if(player === "human"){
        product = 18;
      } else{
        product = 50;
      }

      var sumd = 0, sumr = 0, sumc = 0;

      //checking if diagonals fetch a win
      sumd = value(board[0][0]) * value(board[1][1]) * value(board[2][2]);
      if(sumd === product){
        if(value(board[0][0]) === 2) return [0,0];
        if(value(board[1][1]) === 2) return [1,1];
        if(value(board[2][2]) === 2) return [2,2];
      }
      sumd = value(board[0][2]) * value(board[1][1]) * value(board[2][0]);
      if(sumd === product){
        if(value(board[0][2]) === 2) return [0,2];
        if(value(board[1][1]) === 2) return [1,1];
        if(value(board[2][0]) === 2) return [2,0];
      }

      //check if row or col get a win
      for(var i=0;i<3;i++){
        //rows
        sumr = value(board[0][i]) * value(board[1][i]) * value(board[2][i]);
        //cols
        sumc = value(board[i][0]) * value(board[i][1]) * value(board[i][2]);

        if(sumr === product || sumc === product){
          if(sumr === product){
            if(value(board[0][i]) === 2) return [0,i];
            if(value(board[1][i]) === 2) return [1,i];
            if(value(board[2][i]) === 2) return [2,i];
          } else{
            if(value(board[i][0]) === 2) return [i,0];
            if(value(board[i][1]) === 2) return [i,1];
            if(value(board[i][2]) === 2) return [i,2];
          }
        }
      }
      //no win
      return false;

    },
    goMake2 : function(){
        if(board[1][1] === 0){
          document.getElementById("11").click();
          return true;
        } else if(board[0][1] == 0){
          document.getElementById("01").click();
          return true;
        } else if(board[1][0] == 0){
          document.getElementById("10").click();
          return true;
        } else if(board[1][2] == 0){
          document.getElementById("12").click();
          return true;
        } else if(board[2][1] == 0){
          document.getElementById("21").click();
          return true;
        } else{
          this.goBlank();
        }
    },
    goBlank : function(){
      //var a = Math.floor((Math.random() * 3) + 0);
      //var b = Math.floor((Math.random() * 3) + 0);
      var j = 0;
      var flag = -1;
      for(var i=0;i<3;i++){
        if(board[i][j] === 0) {
          flag = j; break;
        } else if(board[i][j+1] == 0){
          flag = j+1; break;
        } else if(board[i][j+2] == 0){
          flag = j+2; break;
        }
      }
      if(flag !== -1){
        flag = i+""+flag;
        console.log("INSIDE BLANK "+flag);
        document.getElementById(flag).click();
        return true;
      }
    },

    moveByComputer : function(){
      if(this.moveCount === 1){
        if(board[1][1] === 0){
          document.getElementById("11").click();
          return;
        } else{
          document.getElementById("00").click();
          return;
        }
      }
      else if(this.moveCount === 3){
        var x = this.possWin("human");
        if(x){
          document.getElementById(x[0]+""+x[1]).click();
          return;
        } else if(board[1][1] === 0){
          document.getElementById("11").click();
          return;
        } else{
          if(this.goMake2()) return;
        }
      }
      else if(this.moveCount === 5){
        var x = this.possWin("computer");
        var y = this.possWin("human");
        if(x){
          document.getElementById(x[0]+""+x[1]).click();
          return;
        } else if(y){
          document.getElementById(y[0]+""+y[1]).click();
          return;
        } else{
          console.log("here");
          if(this.goMake2()) return;
        }
      }
      else{
        var x = this.possWin("computer");
        var y = this.possWin("human");
        if(x){
          document.getElementById(x[0]+""+x[1]).click();
          return;
        } else if(y){
          document.getElementById(y[0]+""+y[1]).click();
          return;
        } else{
          console.log("GOING BLANK");
          if(this.goBlank()) return;
        }
      }
      console.log("THIS PART NEVER GETS EXECUTED!");

    },

    getResult : function(x,y,event){
      //increment the move count
      this.moveCount += 1;

      //check col
        for(var i = 0; i < 3; i++){
            if(board[x][i] !== event.target.innerText)
                break;
            if(i === 2){
                //alert(event.target.innerText + " has WON!");
                this.gameStatus = this.dispVictoryText(event.target.innerText);
                this.currentPlayer = "x";
                this.isGameOver = true;
                return true;
            }
        }
        //check row
          for(var i = 0; i < 3; i++){
              if(board[i][y] !== event.target.innerText)
                  break;
              if(i === 2){
                  this.gameStatus = this.dispVictoryText(event.target.innerText);
                  this.currentPlayer = "x";
                  this.isGameOver = true;
                  return true;
              }
          }
          //check diag
          if(x === y){
              //we're on a diagonal
              for(var i = 0; i < 3; i++){
                  if(board[i][i] !== event.target.innerText)
                      break;
                  if(i === 2){
                      this.gameStatus = this.dispVictoryText(event.target.innerText);
                      this.isGameOver = true;
                      this.currentPlayer = "x";
                      return true;
                  }
              }
          }
          //check anti diag
          if((x + y) === 2){
              console.log("anti");
              for(var i = 0;i<3;i++){
                  if(board[i][2-i] !== event.target.innerText)
                      break;
                  if(i === 2){
                      this.gameStatus = this.dispVictoryText(event.target.innerText);
                      this.isGameOver = true;
                      this.currentPlayer = "x";
                      return true;
                  }
              }
          }

          //check draw
        if(this.moveCount === 9){
            this.isGameOver = true;
            this.currentPlayer = "x";
            this.gameStatus ="Match Drawn!";
        }
    },

    dispVictoryText : function(player){
      if(player === "nothing") return " ";
      victoryAudio.play();
      if(this.playingMode === "computer" && player === "o") return "You Lost! AI triumphs!!";
      else if(this.playingMode === "computer") return "You Won! Congrats!!";
      return "Player '"+ player + "' has won!";
    },

    reset : function(){
      this.pressedReset = true;
      this.currentPlayer = 'x';
      var j = 0;
      for(var i=0;i<3;i++){
        board[i][j] = 0;
        document.getElementById(i+""+j).click();
        board[i][j+1] = 0;
        document.getElementById(i+""+(j+1)).click();
        board[i][j+2] = 0;
        document.getElementById(i+""+(j+2)).click();
      }
      this.moveCount = 0;
      this.pressedReset = false;
      if(this.isGameOver){
        this.isGameOver = false;
        this.gameStatus = this.dispVictoryText("nothing");
        this.startGame(this.playingMode);
      }
    },

    toggleSound : function(){
      console.log("TURNINF OGG");
      if(this.soundStatus === "on"){
        clickAudio.volume = 0.0;
        victoryAudio.volume = 0.0;
        this.soundStatus = "off";
        this.oppSoundStatus = "on";
      } else {
        clickAudio.volume = 0.8;
        victoryAudio.volume = 0.1;
        this.soundStatus = "on";
        this.oppSoundStatus = "off";
      }
    },

    togglePlay : function(){
      this.playingMode = this.playingMode === "human" ? "computer" : "human";
      this.reset();
      this.startGame(this.playingMode);
    }

  }
});
