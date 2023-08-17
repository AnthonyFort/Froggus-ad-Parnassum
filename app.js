const startButton = document.getElementById('start-button') // Start button
const demonstration = document.getElementById('demonstration') // Demonstration button

const grid = document.getElementById('grid') // Will be used with JS to generate a grid for the game
const keyGuide = document.getElementById('key-guide') // Visual guide for players so that they know how to move through the grid
const menu = document.getElementById('menu') // Left-hand nav bar
const navContent = document.querySelectorAll('.nav-content') // Content contained within the nav bar
const endScreen = document.getElementById('endscreen') // Displays when the game is over
const smile = document.getElementById('smile') // Displays if the player wins
const frown = document.getElementById('frown') // Displays if the player loses

const gridHeight = 7 // How many rows the grid has
const originalGridWidth = ['d', 'f', 'g', 'h', 'j', 'k', 'l', ';'] // All the possible keys that could be available in the game

let availableKeys = [] // The array of keys that are permitted for any given move
let sharkSquares = [] // The array of keys contained in originalGridWidth that are currently NOT in available keys (will be represented by sharks)
let currentMove = [] // Can only contain MAX 2 elements - stores the keys pressed by the player for each move
let currentOptions = [] // The array of possible currentMove arrays for a given move - to be randomly selected from in the demonstration
let frogMap = [] // The array of pixel locations within the grid, to allow frogs to glide to specific locations on the grid
let frogLocation = [] // Can only contain MAX 2 elements - stores information about the pixel locations of the frogs
let soundArray = [] // The array of musical notes, each of which will be paired with a specific key press
let topScores = [] // The array of the 10 highest scores, pulled from local storage


let currentRow
let frog1
let frog2
let frogLives // Each game starts with frogLives = 2. If the player uses an interval of a 5th or 8th in the midgame, a life will be lost. 0 lives means the game is over
let startTime
let stopTime
let finalTime // stopTime - startTime
let gridMade // Set to true or false - used to prevent new grids appearing each time the start button is pressed
let keyGuideMade // Set to true or false
let demoTimer // Used to trigger a setInterval method for the demonstration
let randomNumber

// A player class will be used to construct an object-like key-value pair in the highscores

class Player {
  constructor (playerName, playerTime) {
    this.playerName = playerName
    this.playerTime = playerTime
  }  
}

// Maps out an array of pixels that will be used to control frog movement - using pixels instead of a grid will allow the frogs to "glide" (transition) to their new locations

for (let i = 0; i < originalGridWidth.length; i++) {
  let x = 15 + i * 52
  frogMap.push(x)
}

// Creates <audio> elements and assigns each element a musical note

for (let i = 1; i < 9; i++) {
  let audio = document.createElement('audio')
  audio.src = `note-${i}.m4a`
  soundArray.push(audio)
}

showTopScores() // Automatically calling this function

function startGame () {
  smile.style.display = 'none' // Hides features of the endScreen once the game starts
  frown.style.display = 'none'
  endScreen.style.display = 'none'  
  grid.innerHTML = ''
  keyGuide.style.display = 'grid' // Makes the grid visible
  grid.style.display = 'grid'
  frog1 = document.createElement('div') // Creates the frogs and positions them on the grid
  frog2 = document.createElement('div')
  frog1.classList.add('frog')
  frog2.classList.add('frog')
  frog1.setAttribute('id','frog1')
  frog2.setAttribute('id','frog2')
  grid.appendChild(frog1)
  grid.appendChild(frog2)
  availableKeys = ['d', ';'] // Sets initial values for the start of the game
  currentRow = 0 
  frogLives = 2
  frogLocation = []
  gridMade = false // Ensures that it will be possible to execute the createGrid function
  keyGuideMade = false
  createGrid (originalGridWidth.length, gridHeight)
  hideText ()
}

function createGrid (width, height) {
  if (gridMade === false) {
    grid.style.gridTemplateRows = `repeat(${height}, 1fr)`
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`
    for (let i = 0; i < width * height; i++){
      const square = document.createElement('div')
      square.classList.add('square')
      square.id = i
      if (i === 0 || i === width - 1 || i === width * (height - 1) || i === width * height - 1 || i === width + 1 || i === width * 2 - 2) {
        square.classList.add('lilypad')
      }
      grid.appendChild(square)
    }
  }
  gridMade = true
}



function createSharks () {
  let removeCurrentSharks = document.querySelectorAll('.shark')
  removeCurrentSharks.forEach(item => {
    item.classList.remove('shark')
  })
  sharkSquares = originalGridWidth.filter(item => {
    return !availableKeys.includes(item)
  })
  sharkSquares = sharkSquares.map(item => {
    return originalGridWidth.indexOf(item)
  })
  sharkSquares = sharkSquares.map(item => {
    return (gridHeight - (currentRow + 1)) * originalGridWidth.length + item
  })
  sharkSquares.forEach(item => {
    shark = document.getElementById(`${item}`)
    shark.classList.add('shark')
  })
}

function makeRandomRow () {
  let randomNum = (Math.floor(Math.random() * originalGridWidth.length))
  if (!availableKeys.includes(originalGridWidth[randomNum]) && availableKeys.length < 5) {
    availableKeys.push(originalGridWidth[randomNum])
    makeRandomRow ()
  } else if (availableKeys.includes(originalGridWidth[randomNum]) && availableKeys.length < 5) {
    makeRandomRow ()
  }
  else if (availableKeys.length === 5) {
    createSharks()
  }
}

function changeAvailableKeys () {
  if (currentRow === 0 || currentRow === gridHeight - 1) {
    availableKeys = ['d', ';']
  }
  else if (currentRow === gridHeight - 2) {
    availableKeys = ['f', 'l']
  }
  else if (currentRow > 0 && currentRow < gridHeight - 2) {
    availableKeys = []
    makeRandomRow ()
  }  
}

function checkMove (event) {
  if (availableKeys.includes(event.key)){
    currentMove.push(originalGridWidth.indexOf(event.key))
    if (currentMove.length === 2) {
      if (currentRow === 0 ) {
        startTime = new Date ()
        startTime = startTime.getTime()
        currentRow++
      } 
      else if (currentRow > 0 && currentRow < gridHeight - 2) {
        if ((currentMove[1] - currentMove[0]) ** 2 === 4 || (currentMove[1] - currentMove[0]) ** 2 === 25) {
          currentRow++
        } 
        else if ((currentMove[1] - currentMove[0]) ** 2 === 16 || (currentMove[1] - currentMove[0]) ** 2 === 49) {
          currentRow++
          frogLives--
        }
        else {
          loseScreen()
        }
      }
      else if (currentRow === gridHeight - 2) {
        currentRow++
      }
      else if (currentRow === gridHeight - 1) {
        currentRow++
        stopTime = new Date ()
        stopTime = stopTime.getTime()
        winScreen()
        setTimeout(calculateTime, 1000)
      }
      else {
        loseScreen()
      } 
      changeAvailableKeys()
    }
  }
  else {
    loseScreen() 
  }  
}

function emptyCurrentMove () {
  currentMove = []
}

function lifeCheck () {
  if (frogLives === 0) {
    loseScreen()
  }
}
  
function makeMove (event) {
  frogLocation.push(originalGridWidth.indexOf(event.key))
  if (frogLocation.length === 2) {
    frogLocation.sort()
    frog1.style.left = `${frogMap[frogLocation[0]]}px`
    frog2.style.left = `${frogMap[frogLocation[1]]}px`
    frog1.style.bottom = `${frogMap[currentRow - 1]}px`
    frog2.style.bottom = `${frogMap[currentRow - 1]}px`
    frogLocation = []
  }
}

function playSound (event) {
  soundArray[originalGridWidth.indexOf(event.key)].play ()
}

function stopSound (event) {
  soundArray[originalGridWidth.indexOf(event.key)].pause ()
}

function winScreen () {
  returnFrogs()
  smile.style.display = 'block'
}

function calculateTime () {
  finalTime = stopTime - startTime
  finalTime = parseFloat(finalTime / 1000).toFixed(2)
  addTopScore (finalTime)
}

function showTopScores () {
  let highScoreTable = JSON.parse(localStorage.getItem('highscores')) || 'initialHighScore: 100.0' 
  if (typeof highScoreTable === 'string') {
    highScoreTable = highScoreTable.split(',')
  }
  for (let i = 0; i < highScoreTable.length; i++) {
    let position = document.getElementById(`list${i}`)
    position.innerText = `${highScoreTable[i]}s`
  }
}

function addTopScore (time) {
  let highScoreTable = JSON.parse(localStorage.getItem('highscores')) || 'initialHighScore: 100.0' 
  if (typeof highScoreTable === 'string') {
    highScoreTable = highScoreTable.split(',')
  }
  let highScoreNumbers = highScoreTable.map(item => {
    return parseFloat(item.match(/\d+\.\d+/))
  })
  if (highScoreTable.length < 10 || time < highScoreNumbers[highScoreNumbers.length - 1]) {
    let player = prompt('Congratulations! Please enter your name to be added to the leaderboard: ')
    let newHighScore = new Player (player, time)
    newHighScore = JSON.stringify(newHighScore)
    newHighScore = newHighScore.split('"')
    newHighScore = newHighScore.filter(item => {
      return item === newHighScore[3] || item === newHighScore[7]
    })
    newHighScore = newHighScore.toString()
    newHighScore = newHighScore.replace(',', ': ')
    highScoreTable = JSON.parse(localStorage.getItem('highscores')) || 'initialHighScore: 100.0' 
    if (typeof highScoreTable === 'string') {
      highScoreTable = highScoreTable.split(',')
    }
    highScoreTable.push(newHighScore)
    highScoreNumbers = highScoreTable.map(item => {
      return parseFloat(item.match(/\d+\.\d+/))
    })

    let numberHolder
    let allInfoHolder
    for (let i = 0; i < highScoreNumbers.length; i++) {
      for (let j = 0; j < highScoreNumbers.length - 1; j++) {
        if (highScoreNumbers[j] > highScoreNumbers[j + 1]) {
          numberHolder = highScoreNumbers[j]
          highScoreNumbers[j] = highScoreNumbers[j + 1]
          highScoreNumbers[j + 1] = numberHolder
          allInfoHolder = highScoreTable[j]
          highScoreTable[j] = highScoreTable[j + 1]
          highScoreTable[j + 1] = allInfoHolder
        }
      }
    }
    if (highScoreTable.length > 10) {
      highScoreTable.pop()
    }
    for (let i = 0; i < highScoreTable.length; i++) {
      let position = document.getElementById(`list${i}`)
      position.innerText = `${highScoreTable[i]}s`
    }
    localStorage.setItem('highscores', JSON.stringify(highScoreTable)) 
  }
}

function loseScreen () {
  returnFrogs()
  frown.style.display = 'block'
}

function returnFrogs () {
  endScreen.style.display = 'block'
  frog1.style.left = `${frogMap[0]}px`
  frog2.style.left = `${frogMap[7]}px`
  frog1.style.bottom = `${frogMap[6]}px`
  frog2.style.bottom = `${frogMap[6]}px`
  frogLocation = []
}

function getMenu (event) {
  event.preventDefault()
  if (event.target.classList.contains('menu-item')) {
    navContent.forEach(item => {
      item.style.display = 'none'
    })
    let clickedNav = `${event.target.id}-content`
    clickedNav = document.getElementById(clickedNav)
    clickedNav.style.display = 'block'
    clickedNav.classList.add('clicked')
  }
}

function hideText () {
  navContent.forEach(item => {
  item.style.display = 'none'
  })
}

function playDemo () {
  startGame()
  demoTimer = setInterval(demoMove, 1000)
  demonstration.removeEventListener('click', playDemo)
  startButton.removeEventListener('click', startGame)
}

function demoMove () {
  currentMove = []
  if (currentRow === 0 || currentRow === gridHeight - 2 || currentRow === gridHeight - 1) {
    currentMove[0] = availableKeys[0]
    currentMove[1] = availableKeys[1]
  }
  else if (currentRow > 0 && currentRow < gridHeight - 2) {
    currentMove = []
    currentOptions = []
    for (let i = 0; i < availableKeys.length; i++) {
      for (let j = 0; j < availableKeys.length; j++) { 
        if( i !== j) {
          let current1 = originalGridWidth.indexOf(availableKeys[i])
          let current2 = originalGridWidth.indexOf(availableKeys[j])
          let answer = (current1 - current2) ** 2  
          if (answer === 4 || answer === 25) {
            currentMove[0] = availableKeys[i]
            currentMove[1] = availableKeys[j]
            currentOptions.push(currentMove)
          }
        }        
      }
    }
    createRandomNumber()
    currentMove = currentOptions[randomNumber]   
  }
  if (currentRow === gridHeight) {
    winScreen()
    clearInterval(demoTimer) 
    demonstration.addEventListener('click', playDemo) 
    startButton.addEventListener('click', startGame)
  }
  playDemoSound ()
  demoFrogMove ()
  currentRow++
  changeAvailableKeys()
}

function playDemoSound () {
  currentMove.forEach(item => {
    soundArray[originalGridWidth.indexOf(item)].play ()
  })  
  setTimeout(stopDemoSound, 900)
}

function stopDemoSound () {
  currentMove.forEach(item => {
    soundArray[originalGridWidth.indexOf(item)].pause ()
  }) 
}

function demoFrogMove () {
  if (currentRow < gridHeight) {
    frogLocation = currentMove.map(item => {
      return (originalGridWidth.indexOf(item))
    })
    frogLocation.sort()
    frog1.style.left = `${frogMap[frogLocation[0]]}px`
    frog2.style.left = `${frogMap[frogLocation[1]]}px`
    frog1.style.bottom = `${frogMap[currentRow]}px`
    frog2.style.bottom = `${frogMap[currentRow]}px`
    frogLocation = []
  } 
}

function createRandomNumber () {
  randomNumber = Math.floor(Math.random() * currentOptions.length)
}

startButton.addEventListener('click', startGame)
demonstration.addEventListener('click', playDemo)
menu.addEventListener('click', getMenu)
document.addEventListener('keydown', playSound)
document.addEventListener('keyup', stopSound)
document.addEventListener('keydown', checkMove)
document.addEventListener('keydown', makeMove)
document.addEventListener('keyup', emptyCurrentMove)
document.addEventListener('keyup', lifeCheck)