const API_PATH = "http://localhost:8000/api/v1/titles/?format=json"
const BEST_MOVIE = document.getElementById('best-movie')
const SCRIPT_TAG = document.getElementsByTagName("BODY")[0].getElementsByTagName("SCRIPT")[0]
const MODAL = document.getElementsByClassName('modal-background')[0]
const CLOSE = MODAL.getElementsByClassName('close')[0]

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
    section.classList.add('section-list')
    
    section.appendChild(document.createElement("P")).innerHTML = categorie.name
    content = section.appendChild(document.createElement("DIV"))
    content.classList.add('list', 'd-flex', 'align-center')
    
    const div_elements = ['arrow-previous', 'content', 'arrow-next']
    div_elements.forEach(element => {
        content.appendChild(document.createElement("DIV")).classList.add(element)
    })
    
    let div_content = content.getElementsByClassName('content')[0]
    div_content.classList.add('content-list', 'box-size', 'd-flex', 'just-between')
    
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

            div.addEventListener('click', () => {
                modal(element)
            });
        });
        
    }

    getList(categorie, div_content)

    // Scroll content on right
    const arrow_previous = content.getElementsByClassName('arrow-previous')[0]
    arrow_previous.addEventListener('click', () => {
        content_width = div_content.offsetWidth
        div_content.scrollLeft -= content_width
    });

    // Scroll content on left
    const arrow_next = content.getElementsByClassName('arrow-next')[0]
    arrow_next.addEventListener('click', () => {
        content_width = div_content.offsetWidth
        div_content.scrollLeft += content_width
    });

}

// Get modal informations of a movie
function modal(element) {
    MODAL.getElementsByTagName('IMG')[0].setAttribute("src", element.image_url)
    MODAL.getElementsByClassName('title')[0].innerHTML = element.title
    let list_gender = MODAL.getElementsByClassName('gender')[0].getElementsByTagName('UL')[0]
    element.genres.forEach(genre => {
        let li = list_gender.appendChild(document.createElement('LI'))
        li.innerHTML = genre
    })
    MODAL.getElementsByClassName('rated')[0].innerHTML = "Votes : " + element.votes
    MODAL.getElementsByClassName('score')[0].innerHTML = "Score Imdb : " + element.imdb_score
    let list_director = MODAL.getElementsByClassName('directors')[0].getElementsByTagName('UL')[0]
    element.directors.forEach(director => {
        let li = list_director.appendChild(document.createElement('LI'))
        li.innerHTML = director
    })
    let list_actor = MODAL.getElementsByClassName('actors')[0].getElementsByTagName('UL')[0]
    element.actors.forEach(actor => {
        let li = list_actor.appendChild(document.createElement('LI'))
        li.innerHTML = actor
    })

    MODAL.classList.add("active")
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
    document.getElementsByClassName('button-infos')[0].addEventListener('click', () => {
        modal(xhrJSON.results[0])
    })
    
    categories_list = [
        {'filter': '', 'tag_id': 'list-best-movies', 'name': 'Les mieux notés'},
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

// Close modal
CLOSE.addEventListener('click', () => {
    MODAL.classList.remove('active')
    let list_gender = MODAL.getElementsByClassName('gender')[0].getElementsByTagName('UL')[0]
    list_gender.innerHTML = ''
    let list_director = MODAL.getElementsByClassName('directors')[0].getElementsByTagName('UL')[0]
    list_director.innerHTML = ''
    let list_actor = MODAL.getElementsByClassName('actors')[0].getElementsByTagName('UL')[0]
    list_actor.innerHTML = ''
})