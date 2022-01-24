const API_PATH = "http://localhost:8000/api/v1/titles/?format=json"
const BEST_MOVIE = document.getElementById('best-movie')
const SCRIPT_TAG = document.getElementsByTagName("BODY")[0].getElementsByTagName("SCRIPT")[0]

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
        console.log(option.url)
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

// Create section elements
function create_section(categorie) {
    let section = document.getElementsByTagName("BODY")[0].insertBefore(document.createElement("section"), SCRIPT_TAG)
    section.setAttribute("id", categorie.tag_id)
    
    const div_elements = ['arrow-previous', 'list', 'arrow-next']
    div_elements.forEach(element => {
        section.appendChild(document.createElement("DIV")).classList.add(element)
    })
    
    let div_content = section.getElementsByClassName('list')[0]
    div_content.appendChild(document.createElement("P")).innerHTML = categorie.name
    let content_elements = div_content.appendChild(document.createElement("DIV"))
    content_elements.classList.add('section-list', 'box-size', 'd-flex', 'just-between')
    
    const getList = async (categorie, div_content) => {
        const option = {
            "type": "GET",
            "url": API_PATH.concat(FILTERS[10], "-imdb_score")
        } 

        option.url = option.url.concat(FILTERS[8], categorie.filter)
        let xhrJSON = await xhr(option).then(JSON.parse)
        option.url = option.url.concat("&page=2")
        let xhrJSON2 = await xhr(option).then(JSON.parse)
        xhrJSON.results = xhrJSON.results.concat(xhrJSON2.results)
        xhrJSON.results.length = 7
        xhrJSON.results.forEach(element => {
            div = div_content.appendChild(document.createElement("div"))
            div.appendChild(document.createElement("img")).setAttribute("src", element.image_url)
            div.appendChild(document.createElement("p")).innerHTML = element.title
        });
        
    }
    getList(categorie, content_elements)
}

// Request max score IMDB
const getJSON = async () => {
    // List best movies
    const option = {
        "type": "GET",
        "url": API_PATH.concat(FILTERS[10], "-imdb_score")
    } 
    option.url = API_PATH.concat(FILTERS[10], "-imdb_score")
    let xhrJSON = await xhr(option).then(JSON.parse)
    BEST_MOVIE.getElementsByClassName('categorie')[0].innerHTML = xhrJSON.results[0].genres[0]
    BEST_MOVIE.getElementsByClassName('year')[0].innerHTML = xhrJSON.results[0].year
    BEST_MOVIE.getElementsByClassName('title')[0].innerHTML = xhrJSON.results[0].title
    BEST_MOVIE.getElementsByClassName('score')[0].innerHTML = "Score Imdb : " + xhrJSON.results[0].imdb_score
    BEST_MOVIE.getElementsByTagName('IMG')[0].setAttribute("src", xhrJSON.results[0].image_url)
    
    create_section({'filter': '', 'tag_id': 'list-best-movies', 'name': 'Les mieux notés'})

    categories_list = [
        {'filter': 'action', 'tag_id': 'list-action', 'name': 'Action'},
        {'filter': 'animation', 'tag_id': 'list-animation', 'name': 'Animation'},
        {'filter': 'biography', 'tag_id': 'list-biograpgy', 'name': 'Biography'},
    ]
    // Request foreach categories
    categories_list.forEach(categorie => {
        create_section(categorie)
    });
}
getJSON()