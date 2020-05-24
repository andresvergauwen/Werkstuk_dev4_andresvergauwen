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
    let genreArray = [];
    let targetArray = [];
    getAllData();

    // !ACTIONS
    //=======Click on genre=======//
    function clickBtnFilter() {
  
        $('.genre-btn, .age-btn').click(function (e) {
            e.preventDefault();
            $(this).toggleClass("btn-dark btn-primary");
            const name = $(this).data("name");
            $(this).attr('data-state', $(this).attr('data-state') == 'true' ? 'false' : 'true');
            let checkIfActive = $(this).attr('data-state');

            if (checkIfActive === 'true') {
                if (name != 'adult' && name != 'child') {
                    genreArray.push(name);
                } else {
                    targetArray.push(name);
                }
            } else {
                genreArray = removeElemFromArray(genreArray, name)
                targetArray = removeElemFromArray(targetArray, name)
            }

            $('.remove-filter').removeClass('d-none')
            cardsByFilter(genreArray, targetArray);
        });
    }

    function clickRemoveFilters(){
        $('.remove-filter').click(function (e) {

            $('.genre-btn').each(function(  ) {
                let checkIfActive = $(this).attr('data-state')
                if(checkIfActive == "true"){
                    $(this).toggleClass("btn-dark btn-primary");
                    $(this).attr('data-state', false);
                }
            });
            $('.age-btn').each(function() {
                let checkIfActive = $(this).attr('data-state')
                if(checkIfActive == "true"){
                $(this).toggleClass("btn-dark btn-primary");
                $(this).attr('data-state', false);
            }
            });
            $(this).removeClass('d-none')
            genreArray = [];
            targetArray = [];
            cardsByFilter(genreArray, targetArray);
        });
    }

 
    // !Filter
    //=======Get genre by main filter=======//
    function cardsByFilter(genreArray, targetArray) {
        let dataCards = [];
        let dataCardsArray;
        $(".filters-content").empty();
        if (genreArray.length === 0 && typeof genreArray !== 'undefined' && targetArray.length === 0 && typeof targetArray !== 'undefined') {
            makeRandomCards(allData)
            $('.filters-content').append("<p class='bold mr-2 font-weight-bold'>Random</p>");
            $('.remove-filter').addClass('d-none');
            dataCardsArray = [];
            dataCards = []
        } else {
            if (genreArray.length === 0 && typeof genreArray !== 'undefined') {
                for (let q of allData) {
                    dataCardsArray = cardsByTarget(dataCards, targetArray, q);
                }
            } else {
                dataCardsArray = cardsByGenre(dataCards, targetArray, genreArray);
            }
            $("#data").empty();
            makeCards(dataCardsArray);


            for (let target of targetArray) {
                $('.filters-content').append(`<p class='bold mr-2 font-weight-bold'>${target}</p>`);
            }
        }
    }

    function cardsByTarget(dataCards, targetArray, q) {
        let ageData = parseInt(q.age)
        console.log(ageData)
        for (let target of targetArray) {
            if (target === 'adult' && ageData >= 18 || target === 'adult' && ageData == NaN || target === 'adult' && ageData == "") {
                dataCards.push(q)
                
            } else if (target === 'child' && ageData < 18) {
                dataCards.push(q)
            }
          
        }
        return dataCards;
    }

    function cardsByGenre(dataCards, targetArray, genreArray) {
        for (let genre of genreArray) {
            $('.filters-content').append(`<p class='bold mr-2 font-weight-bold'>${genre},</p>`);
            for (let q of allData) {
                let genreData = capitalizeString(q.genre)
                if (genreData == genre) {
                    if (targetArray == "") {
                        dataCards.push(q)
                    } else {
                        dataCards = cardsByTarget(dataCards, targetArray, q);
                    }
                }
            }
        }
        return dataCards;
    }


    // !PRINT FUNCTIONS
    // create random cards
    function makeRandomCards(dataArray) {
        $("#data").empty();
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
            if (q.age == undefined) {
                q.age = "18+"
            }
            $card = `<div class="card mx-2 mb-4" style="width: 30%;"><img src="${q.thumbnail.url}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-age gray"><span class='badge'>${q.age}</span></h5>
                    <h5 class="card-title">${q.name}</h5>
                
                    <p class="card-text">${q["excerpt"]}</p>
                    <a href="${q["link-to-video"].url}" class="btn btn-primary">Read More</a>
                </div>
            </div>`;
            $('main #data').append($card);
        }
        countNumberOfCard();
    }
    // Make Filter with genres
    function makeFilterGenres(genres) {
        $('main .genre-filter').empty();
        for (let q of genres) {
            counter = countGenres(q);
            $('main .genre-filter').append(`<a href='#${q}' class="btn btn-dark genre-btn mr-2 mt-2" data-state="false" data-name="${q}">${q} <span class="numberofcards">${counter}</span></a>`);
        }
        clickBtnFilter();
        clickRemoveFilters();
    }


    // !STRING FUNCTIONS
    // Count genres
    let countGenres = (q) => {
        let counter = 0;
        for (let genre of allData) {
            let genreData = capitalizeString(genre.genre)
            if (q == genreData) {
                counter++;
            }
        }
        return counter;
    }

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
    // Remove element from array
    let removeElemFromArray = (array, name) => {
        return array = $.grep(array, function (value) {
            return value != name;
        });
    }

    function countNumberOfCard() {
        let card = $('#data .card').length;
        if (card === 0) {
            $('#data').append('<p>No results for this filter</p>')
        }
        $('.filter-number').text(`(${card})`)
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
    function getAllGenres() {
        let genres = [];
        for (let q of allData) {
            let data = q.genre;
            let capitalize = capitalizeString(data);
            let trimedString = trimString(capitalize);
            genres.push(trimedString);
        }
        genres = sortByString(filterDublicates(genres));
        makeFilterGenres(genres)
    }


    $("#loading").ajaxStart(function(){
        $(this).show();
      });
     
     $("#loading").ajaxComplete(function(){
        $(this).hide();
      });
});

