const API_KEY = "api_key=fca026edba55620a077ed3bc436bfe11";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const searchURL = `${BASE_URL}/search/movie?${API_KEY}`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

getMovie(API_URL);

function getMovie(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showMovies(data.results);
    });
}

function showMovies(data) {
  main.innerHTML = ``;
  data.forEach((movie) => {
    const { title, vote_average, poster_path, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
        <img src="${IMG_URL + poster_path}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">

            <h3>Overview</h3>
            ${overview}
        </div>
        `;
    //Insertar los elementos de la api en el html
    main.appendChild(movieEl);
  });
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  if (searchTerm) {
    getMovie(searchURL + "&query=" + searchTerm);
  } else {
    getMovie(API_URL);
  }
});
