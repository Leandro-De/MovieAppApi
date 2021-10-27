const API_KEY = "api_key=fca026edba55620a077ed3bc436bfe11";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const searchURL = `${BASE_URL}/search/movie?${API_KEY}`;

//Filtrar pot generos
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const tagsEl = document.getElementById("tags");
var selectedGenre = [];

setGenere();

function setGenere() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovie(API_URL + "&with_genres=" + selectedGenre.join(","));
      Selection();
    });
    tagsEl.append(t);
  });
}

function Selection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highling");
  });
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const SelectTag = document.getElementById(id);
      SelectTag.classList.add("highling");
    });
  }
}

getMovie(API_URL);

function getMovie(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length !== 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = `<h1 class="no-result">No Results Found</h1>`;
      }
    });
}

function showMovies(data) {
  main.innerHTML = ``;
  data.forEach((movie) => {
    const { title, vote_average, poster_path, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
        <img src="${
          poster_path
            ? IMG_URL + poster_path
            : "http://via.placeholder.com/1080x1580"
        }" alt="${title}">
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
