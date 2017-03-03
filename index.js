const promptsAndAnswers = {
  "Too high in SF" : "RENT",
}
const letterElementHash = {};
const puzzleWordElement = document.getElementById("puzzle_words");
const cleansed = puzzleWordElement.dataset["puzzle_word"].replace(/\W/g, '');
each(cleansed, function(letter){
  if (!letterElementHash[letter]){
    letterElementHash[letter] = [];
  }
  let element = createLetterElement(letter)
  letterElementHash[letter].push(element);
  addElementToBody(element);
});

function addElementToBody(element){
  puzzleWordElement.appendChild(element);
  return element;
}

function revealCorrectGuess(word){
  each(word, function(letter){
    let options = letterElementHash[letter];
    let choice = options[Math.round(Math.random()*(options.length - 1))];
    choice.style.textShadow = "10px 10px 0 #ffd217, 20px 20px 0 #5ac7ff, 30px 30px 0 #ffd217, 40px 40px 0 #5ac7ff"
  });
}

function chooseRandomOptionAndMarkDone(options){
  let options = filter(letterElementHash[letter], handleOptions);
  let choice = options[Math.round(Math.random()*(options.length - 1))];
}

function handleOptions(item){
  if (option.dataSet.puzzle_word){
    option.dataSet.puzzle_word = null;
    return true;
  } else {
    return false;
  } 
}

function createLetterElement(letter){
  let letterElement = document.createElement("div");
  letterElement.dataset = letter;
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
  return map(array, function(item){
    if (filterFunction(item)){ return item; }
  });
}

function run(){
  let guess = prompt("Too high in SF");
  guess = guess.toUpperCase();
  if (guess === "RENT" || guess === "FARCE" || guess === "AWE" || guess === "YEN"){
    console.log(guess);
    revealCorrectGuess(guess);
  }
  setTimeout(function(){
    run();
  }, 300);
}
run();