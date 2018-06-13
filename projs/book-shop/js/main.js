'use strict';

function init() {
    createBooks()
    renderBooks();
}

function renderBooks() {
    var books = getBooksForDisplay()

    var strHTML = `<tr>
                        <th> Id </th>
                        <th class="th-clickable" onclick="changeSorting(this)">Title</th>
                        <th class="th-clickable" onclick="changeSorting(this)">Price</th>
                        <th> Actions </th>
                    </tr>`
    var strHTMLs = books.map(function(book) {
        var strHTML = `<tr>
                        <td> ${book.id} </td>
                        <td> ${book.title} </td>
                        <td> ${book.price} </td>
                        <td>
                            <button class="btn btn-info" data-toggle="modal" data-target="#readModal" onclick=renderModal('${book.id}')> Read </button>    
                            <button class="btn btn-secondary" onclick="readAndUpdateBook('${book.id}')"> Update </button>    
                            <button class="btn btn-danger" onclick="onDeleteBook('${book.id}')"> Delete </button>    
                        </td>
                    </tr>`;
        return strHTML
    })
    document.querySelector('.books').innerHTML = strHTML + strHTMLs.join('');
}

function onDeleteBook(bookId) {
    deleteBook(bookId);
    renderBooks();
}

function readAndAddNewBook() {
    var newBookTitle = prompt('What is the book\'s name?');
    var newBookPrice = +prompt('What is the book\'s price?');
    addBook(newBookTitle, newBookPrice)
    renderBooks();
}

function readAndUpdateBook(bookId) {
    var updatedBookPrice = +prompt('What is the book\'s price?');
    updateBookPrice(bookId, updatedBookPrice);
    renderBooks();
}

function renderModal(bookId) {
    var book = getBookById(bookId);
    $('#readModal .modal-title').text(book.title);
    var modalBodyHTML = `<img src="${book.img}"/> </br>
                         <b>Price:</b> &#x20AA;${book.price} </br>
                         <b>Rate:</b> ${book.rate} </br>
                         <button class="btn btn-rate btn-light" onclick="onRateBook('${book.id}', 1)">👍</button>
                         <button class="btn btn-rate btn-light" onclick="onRateBook('${book.id}', -1)">👎</button>                         
                         `
    $('#readModal .modal-body').html(modalBodyHTML)
}

function onRateBook(bookId, rating) {
    rateBook(bookId, rating);
    renderModal(bookId);
}

function changeSorting(el) {
    setSortType($(el).text());
    renderBooks();
}