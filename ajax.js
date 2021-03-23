window.onload = function(){
const planetsURL = "https://swapi.dev/api/planets/"
const filmsURL = `http://swapi.dev/api/films/`
const residentsURL = "http://swapi.dev/api/people/"
const input = document.getElementsByClassName("search")[0];
const listElements = document.querySelector("li");
const infoWindow = document.querySelector(".infoWindow");

let ul = document.getElementsByClassName("suggestions")[0];
let li = ul.getElementsByTagName("li");
let cloneUl, cloneLi;
let items;





function sendRequest(method, url) {
const headers = {
    'Content-Type': 'application/json'
}

    return fetch(url).then(response => {
        if(response.ok) {
            return response.json()
        }

        return response.json().then(error => {
            const e = new Error('Something went wrong')
            e.data = error
            throw e
        })
    })
}



//Получаем все планеты
sendRequest('GET',planetsURL)
  .then(data => {
    items = data.results;
    ul.removeChild(document.getElementById("li1"));
      
    createLi();

    cloneUl = ul.cloneNode(true);
    cloneLi = cloneUl.getElementsByTagName("li");

    })
  .catch(err => console.log(err))

//Создаем список планет
function createLi(){

    items.forEach( (item,i,items) => {
        let li = document.createElement("li");
        let span1 = document.createElement("span");
        let span2 = document.createElement("span");

        li.setAttribute('id',`${i}`);

        span1.classList.add("name");
        span2.classList.add("population");

        span1.innerHTML = items[i].name;
        span2.innerHTML = items[i].population;

        li.appendChild(span1);
        li.appendChild(span2);
        ul.appendChild(li);
      });
}


//Ищем совпадения строки ввода с нашим содержимым 
function findMatch(){
    var cloneSpan, cloneSpanValue, realSpan, i, inputValue, inputValueUpper;
 
    inputValue = input.value;
    inputValueUpper = inputValue.toUpperCase();


     for (i = 0; i < cloneLi.length; i++) {
        cloneSpan = cloneLi[i].getElementsByClassName("name")[0];

        if (cloneSpan) {
        var cloneSpanValue = cloneSpan.innerHTML;
        var cloneSpanValueUpper = cloneSpanValue.toUpperCase();
        var index = cloneSpanValueUpper.indexOf(inputValueUpper);

        if (index > -1) {
            var newStr = wrapLetters(inputValue, cloneSpanValue, index);

            li[i].style.display = "";
            realSpan = li[i].getElementsByClassName("name")[0];
            realSpan.innerHTML = newStr;

        } else {
            li[i].style.display = "none";
          }
        }
    }
    

}

function wrapLetters(input,temp,index) {
    if (input.length === 0){
        return temp;
    }


    var before, after, searched, extractLen, extractedVal, newString;

    extractLen = index + input.length;
    before = temp.substring(0, index);
    after = temp.substring(extractLen, temp.length);

    var newIndex = after.indexOf(input);
                 
    
    if (newIndex > -1) {
        after = wrapLetters(input, after, newIndex);
    }

    extractedVal = temp.substring(index, extractLen);

    newString = before + "<span class=\"match\">" + extractedVal + "</span>" + after;


    return newString;
}


//Получаем названия и имена жителей и фильмов с сервера и выводим их вместе со всем остальным в окно с информацией
const myFunc = function(event) {
    let filmStr='', resStr='';

    for(let i = 0 ; i < items[event.target.id].films.length; i++)
    {
    sendRequest('GET',items[event.target.id].films[i])
     .then(data => {
        filmStr = data.title + ' , ' + filmStr;
        //document.querySelector("#planetFilms").textContent = filmStr;
        return filmStr;
     })
     .catch(err => console.log(err))

   }

   for(let i = 0 ; i < items[event.target.id].residents.length; i++)
    {
    sendRequest('GET',items[event.target.id].residents[i])
     .then(data => {
        resStr = data.name + ' , ' + resStr;
        document.querySelector("#planetResidents").textContent = resStr;
     }).catch(err => console.log(err))

   }

    if(items[event.target.id].residents.length === 0){
        document.querySelector("#planetResidents").textContent = 'not yet known';
    }

    if(items[event.target.id].films.length === 0){
        document.querySelector("#planetResidents").textContent = 'not mentioned';
    }

    if(event.target.tagName === "LI") { 
    infoWindow.style.display = 'block';
    document.querySelector("#planetName").textContent = items[event.target.id].name;
    document.querySelector("#planetCreated").textContent = items[event.target.id].created;
    document.querySelector("#planetClimat").textContent = items[event.target.id].climate;
    document.querySelector("#planetDiameter").textContent = items[event.target.id].diameter;
    document.querySelector("#planetGravity").textContent = items[event.target.id].gravity;
    document.querySelector("#planetOrbPeriod").textContent = items[event.target.id].orbital_period;
    document.querySelector("#planetPopulation").textContent = items[event.target.id].population;
    document.querySelector("#planetRotPeriod").textContent = items[event.target.id].rotation_period;
    document.querySelector("#planetSurfWater").textContent = items[event.target.id].surface_water;
    document.querySelector("#planetTerrain").textContent = items[event.target.id].terrain;
    }
  };



ul.addEventListener("click", myFunc);
input.addEventListener('input',findMatch)


infoWindow.addEventListener('click', event => {
    if(!event.target.matches('button')) {
        infoWindow.style.display = 'none'
    }
})

}







  