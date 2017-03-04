const promptsAndAnswers = {
  "Too high in SF" : "RENT",
  "Currency of Japan" : "YEN",
  "Wonderment" : "AWE",
  "A production of buffoonery": "FARCE"
}
const characterElementHash = {};
const puzzleWordElement = document.getElementById("puzzle_words");
const words = puzzleWordElement.dataset["puzzle_word"];
each(words, function(char){
  let element;
  if (isSpaceCharacter(char)){
    element = createSpaceElement();
  } else {
    if (charInAnswer(char)){
      if (!characterElementHash[char]){
        characterElementHash[char] = [];
      }
      element = createGuessLetterElement(char);
      characterElementHash[char].push(element);
    } else {
      element = createRevealedLetterElement(char);
    }
  }
  addElementToBody(element);
});

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
  each(word, function(letter){
    let options = characterElementHash[letter];
    let choice = chooseRandomOptionAndMarkDone(options);
    choice.style.borderBottom = "none";
    choice.style.textShadow = "10px 10px 0 #ffd217, 20px 20px 0 #5ac7ff, 30px 30px 0 #ffd217, 40px 40px 0 #5ac7ff";
    choice.style.color = "white";
  });
}

function chooseRandomOptionAndMarkDone(options){
  options = filter(options, handleOption);
  let randomIndex = Math.floor(Math.random()*(options.length));
  let choice = options[randomIndex];
  choice.dataset.letter = "";
  return choice
}

function handleOption(option){
  if (option.dataset.letter.length){
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
    for (var i = 0; i < objOrArray.length; i++){
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
  each(array, function(item){
    if (filterFunction(item)){ filtered.push(item); }
  });
  return filtered;
}

function run(){
  let guess = prompt("Too high in SF");
  guess = guess.toUpperCase();
  if (guess === "RENT" || guess === "FARCE" || guess === "AWE" || guess === "YEN"){
    revealCorrectGuess(guess);
  }
}