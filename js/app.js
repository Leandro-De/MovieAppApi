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

//Paginacion
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = "";
var totalPages = 100;

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
  clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const SelectTag = document.getElementById(id);
      SelectTag.classList.add("highling");
    });
  }
}

function clearBtn() {
  let clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.classList.add("highling");
  } else {
    let clear = document.createElement("div");
    clear.classList.add("tag", "highling");
    clear.id = "clear";
    clear.innerText = "Clear all";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenere();
      getMovie(API_URL);
    });
    tagsEl.append(clear);
  }
}

getMovie(API_URL);

function getMovie(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length !== 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

        if (currentPage <= 1) {
          prev.classList.add("disable");
          next.classList.remove("disable");
        } else if (currentPage >= totalPages) {
          prev.classList.remove("disable");
          next.classList.add("disable");
        } else {
          prev.classList.remove("disable");
          next.classList.remove("disable");
        }
        tagsEl.scrollIntoView({ behavior: "smooth" });
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
  selectedGenre = [];
  setGenere();
  if (searchTerm) {
    getMovie(searchURL + "&query=" + searchTerm);
  } else {
    getMovie(API_URL);
  }
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
  }
});

function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovie(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplit[0] + "?" + b;
    getMovie(url);
  }
}
