const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')


let inputValue = []

function updateInputValue(e) {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span')

    // delete the last of input value
    if (e.key === 'Backspace') {
        inputValue.pop()
    }

    // put spacebar
    if (e.key === ' ') {
        inputValue.push(' ')
    }

    // check if this value is a-z
    if (/^[a-z,.\"'-;?]$/i.test(e.key)) {
        inputValue.push(e.key)
    }

    arrayQuote.forEach((characterSpan, index) => {
        characterSpan.classList.remove('curr')

        if (inputValue[index] == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
        } else if (inputValue[index] === characterSpan.innerText) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
        }
    });

    if (arrayQuote[inputValue.length]) arrayQuote[inputValue.length].classList.add('curr')

    if (arrayQuote.length == inputValue.length) renderNewQuote()
}

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()

  quote.split('').forEach((character, index) => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    if (index == 0) {
        characterSpan.classList.add('curr')
    }
    quoteDisplayElement.appendChild(characterSpan)
  })

  window.addEventListener('keydown', updateInputValue)
}

renderNewQuote()