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
    let choice = chooseRandomOptionAndMarkDone(options);
    choice.style.textShadow = "10px 10px 0 #ffd217, 20px 20px 0 #5ac7ff, 30px 30px 0 #ffd217, 40px 40px 0 #5ac7ff";
    choice.style.color = "white";
  });
}

function chooseRandomOptionAndMarkDone(options){
  console.log(options)
  options = filter(options, handleOption);
  console.log(options)
  let choice = options[Math.floor(Math.random()*(options.length))];
  return choice
}

function handleOption(option){
  console.log(option);
  if (option.dataset.letter){
    option.dataset.letter = "";
    return true;
  } else {
    return false;
  } 
}

function createLetterElement(letter){
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
    console.log(guess);
    revealCorrectGuess(guess);
  }
  setTimeout(function(){
    run();
  }, 300);
}
run();