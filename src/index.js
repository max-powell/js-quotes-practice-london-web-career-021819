const quotesUrl = 'http://localhost:3000/quotes'
const quoteListEl = document.querySelector('#quote-list')
const quoteFormEl = document.querySelector('#new-quote-form')
const editToggle = {'none': 'block', 'block': 'none'}

// SERVER SIDE ----------------------------------------------------------------

function getQuotes () {
  return fetch(quotesUrl)
    .then(res => res.json())
}

function postQuote (quote) {
  return fetch(quotesUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quote)
  })
    .then(res => res.json())
}

function patchQuote (quote) {
  return fetch(`${quotesUrl}/${quote.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quote)
  })
    .then(res => res.json())
}

function deleteQuote (quote) {
  return fetch(`${quotesUrl}/${quote.id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
}


//  CLIENT SIDE ---------------------------------------------------------------

// Display quote --------------------------------------------------------------

function createQuoteLiEl(quote) {
  liEl = document.createElement('li')
  liEl.classList.add('quote-card')
  liEl.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0" name='quote'>${quote.quote}</p>
    <footer class="blockquote-footer" name='author'>${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button class='btn-warning'>Edit</button>
    <button class='btn-danger'>Delete</button>
  </blockquote>
  <div>
    <form id="edit-quote-${quote.id}-form">
      <div class="form-group">
        <label for="edit-quote-${quote.id}">Edit Quote</label>
        <input type="text" class="form-control" name='quote' value="${quote.quote}">
      </div>
      <div class="form-group">
        <label for="Author">Edit Author</label>
        <input type="text" class="form-control" name='author' value="${quote.author}">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
  `

  // event listeners ----------------------------------------------------------

  const delBtn = liEl.querySelector('.btn-danger')
  delBtn.addEventListener('click', function(e) {
    deleteQuote(quote)
      .then(() => liEl.remove())
  })

  const editBtn = liEl.querySelector('.btn-warning')
  const editForm = liEl.querySelector('form')
  editForm.style.display = 'none'
  editBtn.addEventListener('click', function(e) {
    editForm.style.display = editToggle[editForm.style.display]
  })

  const likeBtn = liEl.querySelector('.btn-success')
  likeBtn.addEventListener('click', function(e) {
    let likeCount = e.target.parentElement.querySelector('span')
    like(quote)
      .then(quote => likeCount.innerText = quote.likes)
  })

  editForm.addEventListener('submit', function(e) {
    e.preventDefault()
    let quoteContent = liEl.querySelector('p')
    let quoteAuthor = liEl.querySelector('footer')
    editQuote(quote, e)
      .then(quote => {
        e.target.quote.value = quoteContent.innerText = quote.quote
        e.target.author.value = quoteAuthor.innerText = quote.author
        editForm.style.display = 'none'
      })
  })

  quoteListEl.appendChild(liEl)
}

// New Quote Form Submission --------------------------------------------------

quoteFormEl.addEventListener('submit', function(e) {
  e.preventDefault()
  postQuote(newQuote(e))
    .then(createQuoteLiEl)
})

function newQuote (event) {
  const quoteText = event.target.querySelector('#new-quote').value
  const quoteAuthor = event.target.querySelector('#author').value
  event.target.reset()
  return {author: quoteAuthor, quote: quoteText, likes: 0}
}

// Like quote -----------------------------------------------------------------

function like (quote) {
  quote.likes ++
  return patchQuote(quote)
}

// Edit quote form submission -------------------------------------------------

function editQuote (quote, event) {
  quote.author = event.target.author.value
  quote.quote = event.target.quote.value
  return patchQuote(quote)
}

// Init Page ------------------------------------------------------------------

function loadQuotes (quotes) {
  quotes.forEach(createQuoteLiEl)
}

function init () {
  getQuotes()
    .then(loadQuotes)
}

init()
