/*
....###....##....##.########..########..########..######.
...##.##...###...##.##.....##.##.....##.##.......##....##
..##...##..####..##.##.....##.##.....##.##.......##......
.##.....##.##.##.##.##.....##.########..######....######.
.#########.##..####.##.....##.##...##...##.............##
.##.....##.##...###.##.....##.##....##..##.......##....##
.##.....##.##....##.########..##.....##.########..######.
*/ 
$(document).ready(function () {
    let allData = [];
    getAllData();

    // !ACTIONS
    //=======Click on genre=======//
    function clickedGenre() {
        let genreArray = [];
        $('.genre-btn').click(function (e) {
            e.preventDefault();
            $(this).toggleClass("btn-dark btn-primary");
            const genreId = $(this).data("name");
            $(this).attr('data-state', $(this).attr('data-state') == 'true' ? 'false' : 'true');
            let checkIfActive = $(this).attr('data-state');
            if (checkIfActive === 'true') {
                genreArray.push(genreId);
            } else {
                genreArray = $.grep(genreArray, function (value) {
                    return value != genreId;
                });
            }
            genresById(genreArray);
        });
    }

    // !API CALLS
    //=======Get  all data=======//
    function getAllData() {
        $.ajax({
            url: 'http://localhost:3000/allData',
            method: 'get',
            type: 'json',
            success: function (data) {
                allData = data;
                getAllGenres(makeRandomCards(data));
            },
            error: function (request, error) {
                console.error("Request: " + JSON.stringify(request));
            }
        });
    }
    //=======Get all genres=======//
    function getAllGenres(data) {
        let genres = [];
        for (let q of allData) {
            let data = q.genre;
            let capitalize = capitalizeString(data);
            let trimedString = trimString(capitalize);
            genres.push(trimedString);
        }
        console.log(genres);
        genres = sortByString(filterDublicates(genres));
        makeFilterGenres(genres)
    }
    //=======Get  genre by id=======//
    function genresById(genreArray) {
        let dataGenre = [];
        for (let array in genreArray) {
            for (let q of allData) {
                let genre = capitalizeString(q.genre)
                if (genre == genreArray[array]) {
                    dataGenre.push(q)
                }
            }
        }
    
        $("#data").empty();
        makeCards(dataGenre);
    }

    // !PRINT FUNCTIONS
    // create random cards
    function makeRandomCards(dataArray) {
        const number = 10;
        let randomArray = [];
        for (let i = 0; i < number; i++) {
            randomArray.push(dataArray[Math.floor(Math.random() * dataArray.length)]);
        }
        randomArray = filterDublicates(randomArray);
        makeCards(randomArray);
    }
    // Make Cards by genre
    function makeCards(dataGenre) {
        dataGenre = sortByName(dataGenre, "name", "asc");
        for (let q of dataGenre) {
            $card = `<div class="card m-2" style="width: 18rem;"><img src="${q.thumbnail.url}" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">${q.name}</h5><p class="card-text">${q["social-share-description"]}</p>
                    <a href="${q["link-to-video"].url}" class="btn btn-primary">Go somewhere</a>
                </div>
                </div>`;
            $('main #data').append($card);
        }
    }
    // Make Filter with genres
    function makeFilterGenres(genres) {
        for (let q of genres) {
            $('main .genre-filter').append(`<a href='#${q}' class="btn btn-dark genre-btn m-2" data-state="false" data-name="${q}">${q}</a>`);
        }
        clickedGenre();
    }

    // !STRING FUNCTIONS
    // Filter Dublicate
    let filterDublicates = (array) => {
        let filtered = _.uniq(array);
        filtered = removeEmpty(filtered, "");
        return filtered;
    }
    // Remove empty
    let removeEmpty = (array, e) => {
        return _.without(array, e);
    }
    // Trim string
    let trimString = (str) => {
        return str.trim()
    }
    // Capitalize Dublicate
    let capitalizeString = (str) => {
        return _.capitalize(str);
    }
    // Sort by string
    let sortByString = (str) => {
        return _.sortBy(str);
    }
    // Sort by name
    let sortByName = (str, param, sort) => {
        return _.orderBy(str, [param], [sort]);
    }
});