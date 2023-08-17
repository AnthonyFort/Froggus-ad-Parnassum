const startButton = document.getElementById('start-button') // Start button
const demonstration = document.getElementById('demonstration') // Demonstration button

const grid = document.getElementById('grid') // Will be used with JS to generate a grid for the game
const keyGuide = document.getElementById('key-guide') // Visual guide for players so that they know how to move through the grid
const menu = document.getElementById('menu') // Left-hand nav bar
const navContent = document.querySelectorAll('.nav-content') // Content contained within the nav bar
const endScreen = document.getElementById('endscreen') // Displays when the game is over
const smile = document.getElementById('smile') // Displays if the player wins
const frown = document.getElementById('frown') // Displays if the player loses

let  h1 = document.getElementById('h1')
let livesText = document.getElementById('lives') // This will visually update the number of lives the player has remaining

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

showTopScores() // Automatically calling this function to ensure that the highscores are always visible as soon as the page has loaded

function startGame () {
  smile.style.display = 'none' // Hides features of the endScreen once the game starts
  frown.style.display = 'none'
  endScreen.style.display = 'none'  
  grid.innerHTML = ''
  keyGuide.style.display = 'grid' // Makes the grid visible
  grid.style.display = 'grid'
  h1.innerText = 'FROGGUS AD PARNASSUM!'
  frog1 = document.createElement('div') // Creates the frogs and positions them on the grid
  frog2 = document.createElement('div')
  frog1.classList.add('frog')
  frog2.classList.add('frog')
  frog1.setAttribute('id','frog-left')
  frog2.setAttribute('id','frog-right')
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

// Create a dynamic grid with CSS and JS

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

// The next 3 functions combine to randomly mark 5 keys as valid and 3 keys as invalid (all keys being selected from the originalGridWidth array)
// Following musical convention, the keys for the first row, the last row, and the row before last are predetermined
// Therefore, randomness will only be introduced in the middle rows

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

// makeRandomRow uses recursion to fill the availableKeys array with 5 unique keys from originalGridWidth
// when this function has finished, it calls createSharks

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

// createSharks creates an array containing all the elements of originalGridWidth that were NOT selected for the availableKeys array
// Once made, createSharks targets specific squares on a row and styles them with the CSS class "shark"
// At the start of createSharks, any sharks from the previous go are removed

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

// checkMove checks the validity of the latest move.
// It receives individual key presses as arguments and uses those arguments to fill up the currentMove array
// The rest of the function only executes once currentMoves.length === 2
// This function also updates several variables, including: startTime, currentRow, frogLives

function checkMove (event) {
  if (availableKeys.includes(event.key)){
    currentMove.push(originalGridWidth.indexOf(event.key))
    if (currentMove.length === 2) {
      if (currentRow === 0 ) {
        startTime = new Date ()
        startTime = startTime.getTime() // The starts a timer from the moment player takes their first move
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
        stopTime = stopTime.getTime() // Records what time the player completed the game
        winScreen()
        setTimeout(calculateTime, 1000) // This timeout is to ensure that the highscore prompt doesn't load too quickly after the game has finished
      }
      else {
        loseScreen()
      } 
      changeAvailableKeys() // Calling changeAvailableKeys here ensures that a new set of availableKeys is generated for each of the middle rows
    }
  }
  else {
    loseScreen() 
  }  
}

// emptyCurrentMove was implemented to ensure that the player holds down two keys at once, as if they are actually playing a musical keyboard
// This function is triggered by a 'keyup'. If a player presses one key first, and then lifts up that key befores adding their second key, the currentMoves array will be emptied and they will have to make that move again

function emptyCurrentMove () {
  currentMove = []
}

// lifeCheck is included to implement a "soft" rule of classical music counterpoint
// A "soft" rule doesn't forbid a particular musical interval, but only permits them sparingly
// This function allows for the player to use the interval of a 5th or 8th on just one occasion in the midgame

function lifeCheck () {
  livesText.innerHTML = '🐸'.repeat(frogLives)
  if (frogLives === 0) {
    loseScreen()
  }
}

// makeMove moves the frogs to their new location, based on the player input
// Valid or not, a complete move will result in the frogs moving upwards by one square

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

// The next three functions determine the appearance of the endScreen.
// winScreen reveals a smile, loseScreen reveals a frown
// returnFrogs moves the frogs to the top lilypads so that they look like eyes
// returnFrogs also makes the rest of the large frog face visible

function winScreen () {
  returnFrogs()
  smile.style.display = 'block'
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

function calculateTime () {
  finalTime = stopTime - startTime
  finalTime = parseFloat(finalTime / 1000).toFixed(2)
  h1.innerText = `Your time was ${finalTime}s!`
  addTopScore (finalTime)
}

// addTopScore retrieves information from local storage (where the top 10 highscores are stored) and compares the latest time to the highscores
// In local storage, the entire table of highscores is stored as a single key-value pair, which, when retrieved returns as a string
// The first part of the function turns this string into array called highScoreTable
// Regexp is used to extract numbers (times) from highScoreTable - these numbers are then put into a new array (highScoreNumbers)
// The player's time is then compared to the last element in highScoreNumbers, to see if it qualifies for a highscore
// If they qualify, the player is prompted to add their name, and, along with their time, this information is used to create a new Player object
// After tidying up its appearance, this object is then added to the highScoreTable array (and the time is added to highScoreNumbers)
// highScoreNumbers (now containing 11 elements) is sorted from lowest to highest
// As highScoreNumbers is sorted, highScoreTable is sorted in parallel
// Finally, the 11th element in the sorted array is popped - the information is then used to update the visual table and also the local storage

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

// showTopScores is included to ensure that the highscores are always visible

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

// getMenu ensures that, when an item from the nav bar is clicked, its contents will become visible, while other content from the nav bar will be hidden

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

// hideText is called within the startGame function (ie, when the start button is clicked), and ensures that any content from the nav bar is hidden once the game has started

function hideText () {
  navContent.forEach(item => {
  item.style.display = 'none'
  })
}

// playDemo is triggered when the "demonstration" button is clicked
// This function starts the game and also calls the "demoMove" function once per second to simulate a complete randomized run through of the game
// The removeEventListeners ensure that, while the demonstration is happening, the demonstration can't restarted, nor can the game be started

function playDemo () {
  startGame()
  demoTimer = setInterval(demoMove, 1000)
  demonstration.removeEventListener('click', playDemo)
  startButton.removeEventListener('click', startGame)
}

// demoMove is triggered once per second after the demonstration button is clicked
// Like checkMove, it calls the changeAvailableKeys function to generate a random set of available keys
// It creates an array of currentOptions, which includes every possible valid move that could be made
// Then, it invokes createRandomNumber and randomly selects one option from currentOptions 
// It assigns that option to the currentMove array, which will be used to instruct the frogs where to move

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

function createRandomNumber () {
  randomNumber = Math.floor(Math.random() * currentOptions.length)
}

// demoFrogMove controls the movement of the frogs during the demonstration
// It is similar to makeMove, but its relation to currentRow is slightly different

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

// playDemoSound is invoked during demoMove
// A setTimeout is used to automatically call stopDemoSound after 900ms
// This is to ensure that, in the event that the same pair of notes are played in the next move, there will still be some audible separation between them

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

// These two functions listen for keydown and keyup respectively, and produce a specific musical note

function playSound (event) {
  soundArray[originalGridWidth.indexOf(event.key)].play ()
}

function stopSound (event) {
  soundArray[originalGridWidth.indexOf(event.key)].pause ()
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