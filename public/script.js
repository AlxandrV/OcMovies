const API_PATH = "http://localhost:8000/api/v1/titles/?format=json"
const BEST_MOVIE = document.getElementById('best-movie')

const FILTERS = {
    0: "&year=",
    1: "&min_year=",
    2: "&max_year=",
    3: "&imdb_score=",
    4: "&imdb_score_min=",
    5: "&imdb_score_max=",
    6: "&title=",
    7: "&title_contains=",
    8: "&genre=",
    9: "&genre_contains=",
    10: "&sort_by=",
    11: "&director=",
    12: "&director_contains=",
    13: "&writer=",
    14: "&writer_contains=",
    15: "&actor=",
    16: "&actor_contains=",
    17: "&country=",
    18: "&country_contains=",
    19: "&lang=",
    20: "&lang_contains=",
    21: "&company=",
    22: "&company_contains=",
    23: "&rating=",
    24: "&rating_contains="
}

// Ajax
function xhr(option) {
    return new Promise(function(resolve) {
        let xhr = new XMLHttpRequest();
        xhr.open(option.type, option.url);
        xhr.send(option.data);
        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                let response = xhr.response;
                return resolve(response);
            }
        };
    });
}

// Request max score IMDB
const option = {
    "type": "GET",
    "url": API_PATH.concat(FILTERS[10], "-imdb_score")
} 
const getJSON = async (option) => {
    let xhrJSON = await xhr(option).then(JSON.parse)
    console.log(xhrJSON.results[0])
    BEST_MOVIE.getElementsByClassName('categorie')[0].innerHTML = xhrJSON.results[0].genres[0]
    BEST_MOVIE.getElementsByClassName('year')[0].innerHTML = xhrJSON.results[0].year
    BEST_MOVIE.getElementsByClassName('title')[0].innerHTML = xhrJSON.results[0].title
    BEST_MOVIE.getElementsByTagName('IMG')[0].setAttribute("src", xhrJSON.results[0].image_url)
}
getJSON(option)
