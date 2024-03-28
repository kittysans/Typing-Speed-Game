const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quote-display')
const resetButton = document.getElementById('reset')

const timerBar = document.getElementById('timer-bar')
const timerLeft = document.getElementById('timeLeft')
const mistakeElement = document.getElementById('mistake')
const WpmSpan = document.getElementById('wpm')

let quoteValue = []
let mistake = 0

let countTimer = false
let timer = 30
let currTime = 0
let ratio

mistakeElement.innerText = mistake
timerLeft.innerText = timer

let timeRunning

function processWPM() {
    let typingCorr = 0

    quoteDisplayElement.querySelectorAll('span').forEach((span, i) => {
        if (quoteValue[i] && span.innerText == quoteValue[i] && span.innerText != ' ') typingCorr += 1
    });
    WpmSpan.innerText = Math.round((typingCorr / 5) / timer * 60)
}

function startTimer() {
    timerBar.style.width = `0px`

    timeRunning = setInterval(function() {
        // timer bar
        if (currTime < timer) {
            currTime += 1
            ratio = (currTime / timer) * 100
           
            timerBar.style.width = `${(ratio / 100) * document.querySelector('.display').clientWidth}px`
        }
        else {
            processWPM()
            clearInterval(timeRunning)
            window.removeEventListener('keydown', updateInputValue)
        }

        // time left
        timerLeft.innerText = timer - currTime
    }, 1000);
}

function updateInputValue(e) {
    if (!countTimer) {
        startTimer()
        countTimer = true
    }

    let inputValue = e.key
    if (inputValue == 'Shift') return
    if (inputValue == 'Backspace' && quoteValue) quoteValue.pop()
    else {
        if (quoteDisplayElement.querySelectorAll('span')[quoteValue.length].innerText != inputValue && quoteDisplayElement.querySelectorAll('span')[quoteValue.length].innerText != ' ') mistake += 1
        quoteValue.push(inputValue)

        let soundClickKeyboard = new Audio('./sounds/mixkit-slide-click-1130.wav')
        soundClickKeyboard.play()
    }


    quoteDisplayElement.querySelectorAll('span').forEach((chr, i) => {
        chr.classList.remove('curr')

        if (quoteValue[i] == null) {
            chr.classList.remove('corr')
            chr.classList.remove('incorr')
        }
        else if (chr.innerText == quoteValue[i]) {
            chr.classList.add('corr')
            chr.classList.remove('incorr')
        }
        else {
            chr.classList.remove('corr')
            chr.classList.add('incorr')
        }
    });

    mistakeElement.innerText = mistake
    if (quoteDisplayElement.querySelectorAll('span')[quoteValue.length]) quoteDisplayElement.querySelectorAll('span')[quoteValue.length].classList.add('curr')
    if (quoteDisplayElement.querySelectorAll('span').length == quoteValue.length) renderNewQuote()
}

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

async function renderNewQuote() {
    const quote = await getRandomQuote()

    let notAddCurrEffect = false
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        if (!notAddCurrEffect) characterSpan.classList.add('curr'), notAddCurrEffect = true
        quoteDisplayElement.appendChild(characterSpan)
    })
  
    window.addEventListener('keydown', updateInputValue)
}
  
renderNewQuote()

resetButton.addEventListener('click', () => {
    // reset value
    quoteValue = []
    mistake = 0

    countTimer = false
    currTime = 0
    timerBar.style.width = `0`

    mistakeElement.innerText = mistake
    timerLeft.innerText = timer

    quoteDisplayElement.innerText = null

    renderNewQuote()
})