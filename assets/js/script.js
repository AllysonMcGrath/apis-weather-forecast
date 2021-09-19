var pastSearchList = JSON.parse(localStorage.getItem("cityList")) || [];

function displayPastSearches() {
    var pastSearch = JSON.parse(localStorage.getItem("cityList")) || [];
    var pastSearchesEl = document.querySelector(".past-searches");

    for (var i=0; i < pastSearch.length; i++) {
        var pastSearchesLi = document.createElement("button");
        pastSearchesLi.classList.add("past-button");
        pastSearchesLi.setAttribute("id", pastSearch[i])
        pastSearchesLi.innerHTML = pastSearch[i];
        pastSearchesEl.appendChild(pastSearchesLi);

    };
};

function updatePastSearches() {
    var pastSearchesEl = document.querySelector(".past-searches");
    var pastSearch = document.querySelector("#search-input").value;
        if (pastSearchList.indexOf(pastSearch) == -1) {
            pastSearchList.push(pastSearch)
            localStorage.setItem("cityList", JSON.stringify(pastSearchList));
        }

    pastSearchesEl.innerHTML = "";

    displayPastSearches();
    
};

function forecast(response) {

    $(".forecast-title").append("<h3>5-Day Forecast:</h3>");
    var count = 0;

    $(".forecast-day").each(function() {
        var dayDate = moment().add(count + 1, 'days').format("MM/DD/YY");
        var htmlDay = "<p class='date'>" + dayDate + "</p>" + 
        "<img class='icon' id='wicon' src='http://openweathermap.org/img/wn/" + response.daily[count].weather[0].icon + "@2x.png' alt='Weather icon'>" +
        "<p>Temp: " + response.daily[count].temp.day + " F</p>" +
        "<p>Wind: " + response.daily[count].wind_speed + " mph</p>" +
        "<p>Humidity: " + response.daily[count].humidity + "</p>";
        $(this).append(htmlDay);
        count++;
      });
};

function search() {

    var textInput = document.querySelector("#search-input").value;
    var locationApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + textInput + "&appid=b579564ec60f2efd0d30f05fbccce8ee";
    var cityName = "";

    fetch(locationApiUrl)

        .then(function(locationResponse) {
            return locationResponse.json();

        })

        .then(function(locationResponse) {
            var longitude = locationResponse.coord.lon;
            var latitude = locationResponse.coord.lat;
            cityName = locationResponse.name;

            return fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=b579564ec60f2efd0d30f05fbccce8ee"
            )
        })

        .then(function(response) {
            return response.json();
        })

        .then(function(response) {
            clearContent();
            forecast(response);
            updatePastSearches();
            today(response, cityName);
        })
};

function today(response, cityName) {
    var currentDay = moment().format("MM/DD/YY");
    var htmlToday = "<h3 class='date-today'>"+ cityName + " (" + currentDay + ")</h3>" + 
                    "<img class='icon' id='wicon' src='http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png' alt='Weather icon'>" +
                    "<p>Temp: " + response.current.temp + " F</p>" +
                    "<p>Wind: " + response.current.wind_speed + "mph</p>" +
                    "<p>Humidity: " + response.current.humidity + "%</p>" +
                    "<p>UVI: <span id='uvi'>" + response.current.uvi + "<span> </p>";
    $(".today").append(htmlToday);


     
    if (response.current.uvi < 3) {
        $("#uvi").attr("class", "green");
    }
    else if (response.current.uvi > 2 && response.current.uvi < 6) {
        $("#uvi").attr("class", "yellow");  
    }
    else if (response.current.uvi > 5 && response.current.uvi < 11) {
        $("#uvi").attr("class", "red");
    }
    else {
        $("#uvi").attr("class", "purple");
    }
              
};

function clearContent() {
    $(".forecast-day").empty();
    document.querySelector(".today").innerHTML = "";
    document.querySelector(".forecast-title").innerHTML = "";
};

displayPastSearches();

$(".past-searches").on("click", "button", function() {
    var pastSearch = $(this).attr("id");
    document.querySelector("#search-input").value = pastSearch;
    document.querySelector(".search-btn").click();
  });
