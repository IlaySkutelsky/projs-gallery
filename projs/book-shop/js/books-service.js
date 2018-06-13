
var BOOKS_KEY = 'bookShopDB'
var gSortType = 'Title';
var gBooks = [];

function createBooks() {
    var books = loadFromStorage(BOOKS_KEY);
    if (!books || books.length === 0) {
        books = [];
        books.push(createBook('Kaspion', 20))
        books.push(createBook('Milon Sapir', 30))
        books.push(createBook('Matkonim Labait', 45))
    } 
    gBooks = books;
    saveBooks()
}

function createBook(title, price) {
    return {
        id: makeId(),
        title: title,
        price: price,
        img: 'img/' + title + '.png',
        rate: 0
    }
}

function addBook(title, price) {
    var newBook = createBook(title, price);
    gBooks.unshift(newBook);
    saveBooks();
}

function deleteBook(id) {
    var bookIdx = getBookIdxById(id)
    if (bookIdx === -1) return;
    gBooks.splice(bookIdx, 1);
    saveBooks();
}

function updateBookPrice(bookId, bookPrice) {
    var book = getBookById(bookId);
    book.price = bookPrice;
    saveBooks();
}

function rateBook(bookId, rating) {
    var book = getBookById(bookId);
    book.rate += rating;
    saveBooks();
}

function saveBooks() {
    saveToStorage(BOOKS_KEY, gBooks);
}

function setSortType(strSortType) {
    gSortType = strSortType;
}

function getBooksForDisplay() {
    var books = gBooks.slice();
    if (gSortType === 'Title' ) return books.sort(sortByTitle)
    if (gSortType  === 'Price') return books.sort(sortByPrice)
}

function sortByTitle(a, b) {
    var titleA = a.title.toUpperCase()
    var titleB = b.title.toUpperCase()
    
    if (titleA < titleB) {
        return -1;
    }
    if (titleA > titleB) {
        return 1;
    }
    return 0;
}

function sortByPrice(a, b) {
    return a.price - b.price
}

function getBookById(id) {
    for (var i = 0; i < gBooks.length; i++) {
        var Book = gBooks[i];
        if (Book.id === id) return Book;
    }
    return null;
}

function getBookIdxById(id) {
    for (var i = 0; i < gBooks.length; i++) {
        var book = gBooks[i];
        if (book.id === id) return i;
    }
    return -1;
}
