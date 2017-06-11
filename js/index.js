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
  } else {
    return createRevealedLetterElement(char);
  }
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
 
var _canvas;
var _stage;
 
var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;
 
var _mouse;

function init(){
    _img = new Image();
    _img.addEventListener('load', onImage, false);
    _img.src = "./images/flowercarrier.jpg";
}

function onImage(e){
    _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY)
    _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY)
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
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
    _canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
}

function initPuzzle(){
    _pieces = [];
    _mouse = { x: 0, y: 0 };
    _currentPiece = null;
    _currentDropPiece = null;
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    buildPieces();
}

function createTitle(msg){
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = .4;
    _stage.fillRect(100,_puzzleHeight - 40,_puzzleWidth - 200,40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg,_puzzleWidth / 2,_puzzleHeight - 20);
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
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
}

function shufflePuzzle(){
    _pieces = shuffleArray(_pieces);
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth,_pieceHeight);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
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
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _currentPiece = checkPieceClicked();
    if(_currentPiece != null){
        _stage.clearRect(_currentPiece.xPos,_currentPiece.yPos,_pieceWidth,_pieceHeight);
        _stage.save();
        _stage.globalAlpha = .9;
        _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();
        _clickWrapper.onmousemove = updatePuzzle;
        _clickWrapper.onmouseup = pieceDropped;
    }
}

function checkPieceClicked(){
  var i;
  var piece;
  for(i = 0;i < _pieces.length;i++){
    piece = _pieces[i];
    
    if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
      //PIECE NOT HIT
    }
    else{
      return piece;
    }
  }
  return null;
}

function updatePuzzle(e){
  _currentDropPiece = null;
  if(e.layerX || e.layerX == 0){
    _mouse.x = e.layerX - _canvas.offsetLeft;
    _mouse.y = e.layerY - _canvas.offsetTop;
  }
  else if(e.offsetX || e.offsetX == 0){
    _mouse.x = e.offsetX - _canvas.offsetLeft;
    _mouse.y = e.offsetY - _canvas.offsetTop;
  }
  _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
  var i;
  var piece;
  for(i = 0;i < _pieces.length;i++){
    piece = _pieces[i];
    if(piece == _currentPiece){
      continue;
    }
    _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
    if(_currentDropPiece == null){
      if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)){
        //NOT OVER
      }
      else{
        _currentDropPiece = piece;
        _stage.save();
        _stage.globalAlpha = .4;
        _stage.fillStyle = PUZZLE_HOVER_TINT;
        _stage.fillRect(_currentDropPiece.xPos,_currentDropPiece.yPos,_pieceWidth, _pieceHeight);
        _stage.restore();
      }
    }
  }
  _stage.save();
  _stage.globalAlpha = .6;
  _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
  _stage.restore();
  _stage.strokeRect( _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth,_pieceHeight);
}

function pieceDropped(e){
  _clickWrapper.onmousemove = null;
  _clickWrapper.onmouseup = null;
  if(_currentDropPiece != null){
    var tmp = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
    _currentPiece.xPos = _currentDropPiece.xPos;
    _currentPiece.yPos = _currentDropPiece.yPos;
    _currentDropPiece.xPos = tmp.xPos;
    _currentDropPiece.yPos = tmp.yPos;
  }
  resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin(){
  _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
  var gameWin = true;
  var i;
  var piece;
  for ( i = 0; i < _pieces.length; i++ ){
    piece = _pieces[i];
    _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
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