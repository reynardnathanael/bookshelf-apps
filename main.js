const storageKey = 'STORAGE_KEY';
const submit = document.getElementById('inputBook');
const search = document.getElementById('searchBook');
const close = document.getElementById('close');
let book = [];

window.addEventListener('load', function () {
    if (typeof (Storage) !== 'undefined') {
        if (localStorage.getItem(storageKey) !== null) {
            book = JSON.parse(localStorage.getItem(storageKey));
            for (let i = 0; i < book.length; i++) {
                createElement(book[i], 'show');
            }
        }
    } else {
        alert('Browser yang Anda gunakan tidak mendukung Web Storage');
    }
});

search.addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('completeBookshelfList').innerHTML = '';
    document.getElementById('incompleteBookshelfList').innerHTML = '';

    let keyword = document.getElementById('searchBookTitle').value;
    if (keyword !== '') {
        for (let i = 0; i < book.length; i++) {
            if (book[i].title.includes(keyword)) {
                createElement(book[i], 'show');
            }
        }
    }
    else {
        for (let i = 0; i < book.length; i++) {
            createElement(book[i], 'show');
        }
    }
});

submit.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked ? true : false;
    const newBook = {
        id: +new Date(),
        title: title,
        author: author,
        year: parseInt(year),
        isComplete: isComplete,
    }

    saveBook(newBook);
    createElement(newBook, 'create');
});

function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("modal-content").innerHTML = "";
};

function saveBook(data) {
    if (typeof (Storage) !== 'undefined') {
        book.unshift(data);
        localStorage.setItem(storageKey, JSON.stringify(book));
    }
}

function changeStatus(id) {
    for (let i = 0; i < book.length; i++) {
        if (book[i].id === id) {
            book[i].isComplete = book[i].isComplete === true ? false : true;
            document.getElementById(id).remove();
            createElement(book[i], 'create');
        }
    }
    localStorage.setItem(storageKey, JSON.stringify(book));
}

function deleteModal(id, title, author, year) {
    const warning = document.createElement('h2');
    warning.innerText = 'Yakin hapus buku?';

    const titleElem = document.createElement('h3');
    titleElem.innerText = title;

    const authorElem = document.createElement('p');
    authorElem.innerText = 'Penulis: ' + author;

    const yearElem = document.createElement('p');
    yearElem.innerText = 'Tahun: ' + year;

    const grey = document.createElement('button');
    grey.classList.add('modal-btn');
    grey.style.background = 'lightgrey';
    grey.addEventListener('click', closeModal);
    grey.innerText = 'Batal';

    const red = document.createElement('button');
    red.classList.add('modal-btn');
    red.style.background = 'darkred';
    red.style.color = 'white';
    red.addEventListener('click', function() {
        deleteBook(id);
    });
    red.innerText = 'Hapus Buku';

    const subContainer = document.createElement('div');
    subContainer.classList.add('action');
    subContainer.append(grey, red);

    document.getElementById("modal-content").append(warning, document.createElement('br'), titleElem, authorElem, yearElem, document.createElement('br'), subContainer);

    document.getElementById("modal").style.display = "block";
}

function deleteBook(id) {
    for (let i = 0; i < book.length; i++) {
        if (book[i].id === id) {
            book.splice(i, 1)
            document.getElementById(id).remove();
        }
    }
    localStorage.setItem(storageKey, JSON.stringify(book));
    closeModal();
}

function createElement(data, type) {
    const title = document.createElement('h3');
    title.innerText = data.title;

    const author = document.createElement('p');
    author.innerText = 'Penulis: ' + data.author;

    const year = document.createElement('p');
    year.innerText = 'Tahun: ' + data.year;

    const green = document.createElement('button');
    green.classList.add('green');
    green.addEventListener('click', function() {
        changeStatus(data.id);
    });;
    green.innerText = data.isComplete === true ? 'Belum selesai dibaca' : 'Selesai dibaca';

    const red = document.createElement('button');
    red.classList.add('red');
    red.addEventListener('click', function() {
        deleteModal(data.id, data.title, data.author, data.year);
    });
    red.innerText = 'Hapus Buku';

    const subContainer = document.createElement('div');
    subContainer.classList.add('action');
    // subContainer.setAttribute('id', 'subcon-' + data.id);
    subContainer.append(green, red);

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.setAttribute('id', data.id);
    container.append(title, author, year, subContainer);

    if (type === 'show') {
        data.isComplete === true ? document.getElementById('completeBookshelfList').append(container) : document.getElementById('incompleteBookshelfList').append(container);
    }
    else {
        data.isComplete === true ? document.getElementById('completeBookshelfList').prepend(container) : document.getElementById('incompleteBookshelfList').prepend(container);
    }
}