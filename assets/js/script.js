function pastSearches() {
    var pastSearch = document.querySelector("#search-input").value;
    console.log(pastSearch)

    localStorage.setItem("city", JSON.stringify(pastSearch));

    for (var i=0; i < pastSearch.length; i++) {
        var pastSearch = JSON.parse(localStorage.getItem("city")) || [];

        var pastSearchesEl = document.querySelector(".past-searches-list");

        var pastSearchesLi = document.createElement("li")
        pastSearchesLi.innerHTML = pastSearch;
        pastSearchesEl.appendChild(pastSearchesLi);

    };
    
};

function search() {

var textInput = document.querySelector("#search-input").value;

var locationApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + textInput + "&appid=b579564ec60f2efd0d30f05fbccce8ee";

    fetch(locationApiUrl)
    .then(function(locationResponse) {
        return locationResponse.json();
    })
    .then(function(locationResponse) {
        var longitude = locationResponse.coord.lon
        var latitude = locationResponse.coord.lat

        return fetch(
            "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&appid=b579564ec60f2efd0d30f05fbccce8ee"
        )
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log (response);
        
        var resultsTodayEl = document.querySelector(".results-today");
        resultsTodayEl.innerHTML = "";
        var resultsToday = document.createElement("p")
        resultsToday.innerHTML = response.timezone;
        resultsTodayEl.appendChild(resultsToday);
        pastSearches();
    })
};
