const API_PATH = "http://localhost:8000/api/v1/titles/?format=json"

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

const getJSON = async (option) => {
    let xhrJSON = await xhr(option).then(JSON.parse)
    console.log(xhrJSON.results)
}
getJSON(option)