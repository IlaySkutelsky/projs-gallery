var gProjs = [
    {
        id: 'minesweeper',
        name: 'Minesweeper',
        title: 'New feel to the classic game!',
        desc: 'The fascinating game of Minesweeper opens up an entire war-fantasy world, where you as a player must deduce where the mines are on the field. If you want you can flag the mine, making sure from now on everyone will know this is a dangerous spot. Try to beat the hughest score!',
        url: 'projs/minesweeper/index.html',
        publishedAt: 1527770928000,
        labels: ['Matrixes', 'keyboard events'],
    },
    {
        id: 'book-shop',
        name: 'Book Shop Manager',
        title: 'Easily manage your database of books',
        desc: 'The work of a book shop manager was never easier! Get a full layout of your books, sorted by name (alphabet) or by price. Update your book\'s prices, delete unwanted books, add new books and even rate them with the lovable like/unlike buttons!',
        url: 'projs/book-shop/index.html',
        publishedAt: 1528721328000,
        labels: ['Dynamically rendering pages', 'Sorting functions'],
    },
    
]

function getProjsForDisplay() {
    return gProjs
}    
    
function getProjByIdx(projIdx) {
    return gProjs[projIdx]
}

function timeConverter(timestamp){
    var a = new Date(timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
  }