//  \\      /////////////////////////
//   \\    /////////////////////////
//    \\  ///////// cdepman ///////
//     \\/////////////////////////
//     //\\\\\\\\\\\\\\\\\\\\\\\\\
//    //  \\\\\ gameOver() to \\\\\
//   //    \\\\\  bypass pic  \\\\\\
//  //      \\\\\\\  puzzle  \\\\\\\\
// //        \\\\\\\\\\\\\\\\\\\\\\\\\
////          \\\\\\\\\\\\\\\\\\\\\\\\\

document.body.onload = init;

const ANSWERS = [
  {
    text: "biplanes",
    complete: false
  }, {
    text: "scrapped",
    complete: false
  }
];
const HIDDEN_RIDDLE = "bad apple princess"
const GUESS_ELEMENT_HASH = {};
const puzzleWordElement = document.getElementById("puzzle_words");

function initWordPuzzle(text){
  each(text, function(char){
    if (isSpaceCharacter(char)){
      addElementToBody(createSpaceElement());
    } else {
      addElementToBody(createCharacterElement(char));
    }
  });
}

function createCharacterElement(char){
  if (charInAnswer(char)){
    element = createGuessLetterElement(char);
    popuplateGuessElementHash(char, element);
    return element;
  }
  return createRevealedLetterElement(char);
}

function popuplateGuessElementHash(char, element){
  if (!GUESS_ELEMENT_HASH[char]){
    GUESS_ELEMENT_HASH[char] = [];
  }
  GUESS_ELEMENT_HASH[char].push(element);
}

function addElementToBody(element){
  puzzleWordElement.appendChild(element);
  return element;
}

function charInAnswer(char){
  return true;
}

function createSpaceElement(){
  let spaceElement = document.createElement("div");
  spaceElement.className = "space-element";
  return spaceElement;
}

function createRevealedLetterElement(char){
  let letterElement = document.createElement("div");
  letterElement.dataset.letter = char;
  letterElement.className = "revealed-letter-element";
  letterElement.innerHTML = char;
  return letterElement;
}

function isSpaceCharacter(char){
  return char.charCodeAt(0) === 32;
}

function revealCorrectGuess(word){
  console.log(word)
  each(word, function(letter){
    let optionsArray = GUESS_ELEMENT_HASH[letter];
    console.log(optionsArray)
    let choice = chooseRandomOption(optionsArray);
    console.log(choice)
    delete(choice.dataset.letter);
    choice.style.borderBottom = "none";
    choice.style.textShadow = "10px 10px 0 #ffd217, 20px 20px 0 #5ac7ff, 30px 30px 0 #ffd217, 40px 40px 0 #5ac7ff";
    choice.style.color = "white";
  });
}

function chooseRandomOption(optionsArray){
  filteredOptions = filter(optionsArray, onlyTakeUnchosen);
  let randomIndex = Math.floor(Math.random()*(filteredOptions.length));
  let choice = filteredOptions[randomIndex];
  return choice
}

function onlyTakeUnchosen(option){
  if (option.dataset.letter){
    return true;
  } else {
    return false;
  } 
}

function createGuessLetterElement(letter){
  let letterElement = document.createElement("div");
  letterElement.dataset.letter = letter;
  letterElement.className = "letter-element";
  letterElement.innerHTML = letter;
  return letterElement;
}

function each(objOrArray, callback){
  if (Array.isArray(objOrArray)){
    for (var i = 0; i <= objOrArray.length - 1; i++){
      callback(objOrArray[i], i);
    }
  } else {
    for (key in objOrArray){
      callback(objOrArray[key], key);
    }
  }
}

function map(array, callback){
  var mapped = [];
  each(array, function(item){
    mapped.push(callback(item));
  })
  return mapped;
}

function filter(array, filterFunction){
  let filtered = [];
  console.log(array);
  each(array, function(item){
    console.log(item)
    if (filterFunction(item)){ filtered.push(item); }
  });
  return filtered;
}

function markComplete(answer){
  answer.complete = true;
}

function guessIsCorrect(guess){
  guess = guess.toLowerCase();
  for (var i = 0; i < ANSWERS.length; i++){
    if (guess === ANSWERS[i].text){
      console.log(ANSWERS[i]);
      if (ANSWERS[i].complete){
        alertAlreadyAnswered(guess);
        return false;
      } else {
        markComplete(ANSWERS[i]);
        return true;
      }
    }
  }
  alertWrongAnswer(guess);
  return false;
}

function submitGuess(){
  let input = document.getElementById("guess_input");
  let guess = input.value;
  if (guess && guessIsCorrect(guess)){
    document.getElementById("notice_box").innerHTML = "";
    revealCorrectGuess(guess);
    input.value = "";
  }
}

function inputKeyUp(event){
  console.log(event)
  event.which = event.which || event.keventyCode;
    if (event.which == 13) {
       submitGuess();
    }
}

function alertWrongAnswer(wrongAnswer){
  let elem = document.getElementById("notice_box");
  elem.innerHTML = `Sorry, ${wrongAnswer} is not the right answer. Guess again!`;
}

function alertAlreadyAnswered(answer){
  let elem = document.getElementById("notice_box");
  elem.innerHTML = `Sorry, you already guessed ${answer}. Guess again!`;
}

// IMAGE PUZZLE adapted from: https://code.tutsplus.com/tutorials/create-an-html5-canvas-tile-swapping-puzzle--active-10747

const PUZZLE_DIFFICULTY = 5;
const PUZZLE_HOVER_TINT = '#009900';
const PUZZLE_INITIAL_VIEW_LENGTH_MS = 5000;
 
var CONVAS;
var STAGE;
var IMAGE;
var PIECES;
var PUZZLE_WIDTH;
var PUZZLE_HEIGHT;
var PEICE_WIDTH;
var PIECE_HEIGHT;
var CURRENT_PIECE;
var CURRENT_DROPPIECE;
var MOUSE;

function init(){
    IMAGE = new Image();
    IMAGE.addEventListener('load', onImage, false);
    IMAGE.src = "./images/flowercarrier.jpg";
}

function onImage(e){
    PEICE_WIDTH = Math.floor(IMAGE.width / PUZZLE_DIFFICULTY)
    PIECE_HEIGHT = Math.floor(IMAGE.height / PUZZLE_DIFFICULTY)
    PUZZLE_WIDTH = PEICE_WIDTH * PUZZLE_DIFFICULTY;
    PUZZLE_HEIGHT = PIECE_HEIGHT * PUZZLE_DIFFICULTY;
    setCanvas();
    initPuzzle();
}

start = document.getElementById("start_button")
start.addEventListener('click', function(){
  shufflePuzzle();
  countDown();
  start.parentNode.removeChild(start)
})

function setCanvas(){
    _clickWrapper = document.getElementById('canvas_click_wrapper');
    _frame = document.getElementById('frame');
    CONVAS = document.getElementById('canvas');
    constGE = CONVAS.getContext('2d');
    CONVAS.width = PUZZLE_WIDTH;
    CONVAS.height = PUZZLE_HEIGHT;
}

function initPuzzle(){
    PIECES = [];
    MOUSE = { x: 0, y: 0 };
    CURRENT_PIECE = null;
    CURRENT_DROPPIECE = null;
    constGE.drawImage(IMAGE, 0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT, 0, 0, PUZZLE_WIDTH, PUZZLE_HEIGHT);
    buildPieces();
}

function createTitle(msg){
    constGE.fillStyle = "#000000";
    constGE.globalAlpha = .4;
    constGE.fillRect(100,PUZZLE_HEIGHT - 40,PUZZLE_WIDTH - 200,40);
    constGE.fillStyle = "#FFFFFF";
    constGE.globalAlpha = 1;
    constGE.textAlign = "center";
    constGE.textBaseline = "middle";
    constGE.font = "20px Arial";
    constGE.fillText(msg,PUZZLE_WIDTH / 2,PUZZLE_HEIGHT - 20);
}

function buildPieces(){
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++){
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        PIECES.push(piece);
        xPos += PEICE_WIDTH;
        if(xPos >= PUZZLE_WIDTH){
            xPos = 0;
            yPos += PIECE_HEIGHT;
        }
    }
}

function shufflePuzzle(){
    PIECES = shuffleArray(PIECES);
    constGE.clearRect(0,0,PUZZLE_WIDTH,PUZZLE_HEIGHT);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < PIECES.length;i++){
        piece = PIECES[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        constGE.drawImage(IMAGE, piece.sx, piece.sy, PEICE_WIDTH, PIECE_HEIGHT, xPos, yPos, PEICE_WIDTH, PIECE_HEIGHT);
        constGE.strokeRect(xPos, yPos, PEICE_WIDTH,PIECE_HEIGHT);
        xPos += PEICE_WIDTH;
        if(xPos >= PUZZLE_WIDTH){
            xPos = 0;
            yPos += PIECE_HEIGHT;
        }
    }
    _clickWrapper.onmousedown = onPuzzleClick;
}

function shuffleArray(o){
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function onPuzzleClick(e){
    if(e.layerX || e.layerX == 0){
        MOUSE.x = e.layerX - CONVAS.offsetLeft;
        MOUSE.y = e.layerY - CONVAS.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        MOUSE.x = e.offsetX - CONVAS.offsetLeft;
        MOUSE.y = e.offsetY - CONVAS.offsetTop;
    }
    CURRENT_PIECE = checkPieceClicked();
    if(CURRENT_PIECE != null){
        constGE.clearRect(CURRENT_PIECE.xPos,CURRENT_PIECE.yPos,PEICE_WIDTH,PIECE_HEIGHT);
        constGE.save();
        constGE.globalAlpha = .9;
        constGE.drawImage(IMAGE, CURRENT_PIECE.sx, CURRENT_PIECE.sy, PEICE_WIDTH, PIECE_HEIGHT, MOUSE.x - (PEICE_WIDTH / 2), MOUSE.y - (PIECE_HEIGHT / 2), PEICE_WIDTH, PIECE_HEIGHT);
        constGE.restore();
        _clickWrapper.onmousemove = updatePuzzle;
        _clickWrapper.onmouseup = pieceDropped;
    }
}

function checkPieceClicked(){
  var i;
  var piece;
  for(i = 0;i < PIECES.length;i++){
    piece = PIECES[i];
    
    if(MOUSE.x < piece.xPos || MOUSE.x > (piece.xPos + PEICE_WIDTH) || MOUSE.y < piece.yPos || MOUSE.y > (piece.yPos + PIECE_HEIGHT)){
      //PIECE NOT HIT
    }
    else{
      return piece;
    }
  }
  return null;
}

function updatePuzzle(e){
  CURRENT_DROPPIECE = null;
  if(e.layerX || e.layerX == 0){
    MOUSE.x = e.layerX - CONVAS.offsetLeft;
    MOUSE.y = e.layerY - CONVAS.offsetTop;
  }
  else if(e.offsetX || e.offsetX == 0){
    MOUSE.x = e.offsetX - CONVAS.offsetLeft;
    MOUSE.y = e.offsetY - CONVAS.offsetTop;
  }
  constGE.clearRect(0,0,PUZZLE_WIDTH,PUZZLE_HEIGHT);
  var i;
  var piece;
  for(i = 0;i < PIECES.length;i++){
    piece = PIECES[i];
    if(piece == CURRENT_PIECE){
      continue;
    }
    constGE.drawImage(IMAGE, piece.sx, piece.sy, PEICE_WIDTH, PIECE_HEIGHT, piece.xPos, piece.yPos, PEICE_WIDTH, PIECE_HEIGHT);
    constGE.strokeRect(piece.xPos, piece.yPos, PEICE_WIDTH,PIECE_HEIGHT);
    if(CURRENT_DROPPIECE == null){
      if(MOUSE.x < piece.xPos || MOUSE.x > (piece.xPos + PEICE_WIDTH) || MOUSE.y < piece.yPos || MOUSE.y > (piece.yPos + PIECE_HEIGHT)){
        //NOT OVER
      }
      else{
        CURRENT_DROPPIECE = piece;
        constGE.save();
        constGE.globalAlpha = .4;
        constGE.fillStyle = PUZZLE_HOVER_TINT;
        constGE.fillRect(CURRENT_DROPPIECE.xPos,CURRENT_DROPPIECE.yPos,PEICE_WIDTH, PIECE_HEIGHT);
        constGE.restore();
      }
    }
  }
  constGE.save();
  constGE.globalAlpha = .6;
  constGE.drawImage(IMAGE, CURRENT_PIECE.sx, CURRENT_PIECE.sy, PEICE_WIDTH, PIECE_HEIGHT, MOUSE.x - (PEICE_WIDTH / 2), MOUSE.y - (PIECE_HEIGHT / 2), PEICE_WIDTH, PIECE_HEIGHT);
  constGE.restore();
  constGE.strokeRect( MOUSE.x - (PEICE_WIDTH / 2), MOUSE.y - (PIECE_HEIGHT / 2), PEICE_WIDTH,PIECE_HEIGHT);
}

function pieceDropped(e){
  _clickWrapper.onmousemove = null;
  _clickWrapper.onmouseup = null;
  if(CURRENT_DROPPIECE != null){
    var tmp = {xPos:CURRENT_PIECE.xPos,yPos:CURRENT_PIECE.yPos};
    CURRENT_PIECE.xPos = CURRENT_DROPPIECE.xPos;
    CURRENT_PIECE.yPos = CURRENT_DROPPIECE.yPos;
    CURRENT_DROPPIECE.xPos = tmp.xPos;
    CURRENT_DROPPIECE.yPos = tmp.yPos;
  }
  resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin(){
  constGE.clearRect(0,0,PUZZLE_WIDTH,PUZZLE_HEIGHT);
  var gameWin = true;
  var i;
  var piece;
  for ( i = 0; i < PIECES.length; i++ ){
    piece = PIECES[i];
    constGE.drawImage(IMAGE, piece.sx, piece.sy, PEICE_WIDTH, PIECE_HEIGHT, piece.xPos, piece.yPos, PEICE_WIDTH, PIECE_HEIGHT);
    constGE.strokeRect(piece.xPos, piece.yPos, PEICE_WIDTH,PIECE_HEIGHT);
    if (piece.xPos != piece.sx || piece.yPos != piece.sy){
      gameWin = false;
    }
  }
  if (gameWin){
    setTimeout(gameOver,500);
  }
}

function gameOver(){
  _clickWrapper.onmousedown = null;
  _clickWrapper.onmousemove = null;
  _clickWrapper.onmouseup = null;
  _frame.style.display = "none";
  document.getElementsByTagName('html')[0].style.backgroundColor = "palevioletred";
  document.getElementById("clock_container").style.display = "none";
  document.getElementById("word_puzzle_input_container").style.display = "flex";
  initWordPuzzle(HIDDEN_RIDDLE);
}

// COUNTDOWN TIMER adapted from https://github.com/sanographix/css3-countdown

const COUNTDOWN_LENGTH_SECONDS = 100;

function countdownTimer(elm,tl,executeAtEnd){
 this.initialize.apply(this,arguments);
}
countdownTimer.prototype={
 initialize:function(elm, tl, executeAtEnd) {
  this.elem = document.getElementById(elm);
  this.tl = tl;
  this.executeAtEnd = executeAtEnd;
  this.elem.innerHTML = '<span class="number-wrapper"><div class="line"></div><span class="number min">00</span></span><span class="number-wrapper"><div class="line"></div><span class="number sec">00</span></span>';
 },countDown:function(){
  var timer='';
  var today=new Date();
  // var day=Math.floor((this.tl-today)/(24*60*60*1000));
  // var hour=Math.floor(((this.tl-today)%(24*60*60*1000))/(60*60*1000));
  var min=Math.floor(((this.tl-today)%(24*60*60*1000))/(60*1000))%60;
  var sec=Math.floor(((this.tl-today)%(24*60*60*1000))/1000)%60%60;
  var me=this;

  if( ( this.tl - today ) > 0 ){
  //  timer += '<span class="number-wrapper"><div class="line"></div><div class="caption">DAYS</div><span class="number day">'+day+'</span></span>';
  //  timer += '<span class="number-wrapper"><div class="line"></div><div class="caption">HOURS</div><span class="number hour">'+hour+'</span></span>';
   timer += '<span class="number-wrapper"><div class="line"></div><span class="number min">'+this.addZero(min)+'</span></span><span class="number-wrapper"><div class="line"></div><span class="number sec">'+this.addZero(sec)+'</span></span>';
   this.elem.innerHTML = timer;
   tid = setTimeout( function(){me.countDown();},10 );
  }else{
  //  this.elem.innerHTML = this.mes;
   return this.executeAtEnd();
  }
 },addZero:function(num){ return ('0'+num).slice(-2); }
}
function countDown(startDelayMS = 0){ 

 // Set countdown limit
 var tl = new Date((new Date()).getTime() + 1000 * COUNTDOWN_LENGTH_SECONDS);

 // You can add time's up message here
 var timer = new countdownTimer('CDT', tl ,resetPuzzle);
 setTimeout(function(){
  timer.countDown();
 }, startDelayMS)
}

function resetPuzzle(){
  shufflePuzzle();
  countDown(1000);
}