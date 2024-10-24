const global = {
  currentPage: window.location.pathname,
}


// Fetch data from TMDB API
const fetchApiData = async (endpoint) => {
  const API_KEY = '75379d6cabfbe95d5c7840dd6ebd49d7';
  const API_URL = 'https://api.themoviedb.org/3/';

  showSpinner();
  
  const res = await fetch(`
    ${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US
  `);

  const data = await res.json();

  hideSpinner();

  return data;
};

// Show spinner
const showSpinner = () => {
  document.querySelector('.spinner').classList.add('show');
};

const hideSpinner = () => {
  document.querySelector('.spinner').classList.remove('show');
};



// Display popular movies
const displayPopularMovies = async () => {
  const { results }  = await fetchApiData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `
              <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
              />
            `
            : `
              <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
              />
            `
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>
    `
    document.querySelector('#popular-movies').appendChild(div);
  });

  // console.log(results);
}

// Display popular TV Shows
const displayPopularTVShows = async () => {
  const { results } = await fetchApiData('tv/popular');
  // console.log(results);
  results.forEach((tvshow) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${tvshow.id}">
        ${
          tvshow.poster_path ?
          `
          <img
          src="https://image.tmdb.org/t/p/w500${tvshow.poster_path}"
          class="card-img-top"
          alt="${tvshow.name}"
          />
          `
          : 
          `
          <img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${tvshow.name}"
          />
          `
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${tvshow.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${tvshow.first_air_date
          }</small>
        </p>
      </div>
    `
    document.querySelector('#popular-shows').appendChild(div);
  });
};

// Display movie details
const displayMovieDetails = async () => {
  const movieId = window.location.search.split('=')[1];
  const movie = await fetchApiData(`movie/${movieId}`);
  // console.log(movie);
  // Overlayh for background image
  displayBackgroundImage('movie', movie.backdrop_path);
  const div = document.createElement('div');
  div.innerHTML = 
    `
      <div class="details-top">
          <div>
          ${
            movie.poster_path ?
            `
            <img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
            />
            `
            : 
            `
            <img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
            />
            `
          }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => 
                `<li>${genre.name}</li>`
              ).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} min</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
              ${movie.production_companies.map((company) =>
                `<span>${company.name}</span>`
              ).join(', ')}
          </div>
        </div>
    `
    document.querySelector('#movie-details').appendChild(div);
};

// Display backdrop on detail pages
const displayBackgroundImage = (type, backgroundPath) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 70%, rgba(255, 255, 255, 0) 100%), url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '93vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
};


// Highlight active link
const highlightActiveLink = () => {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
};

const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};



// Init App
const init = () => {
  switch(global.currentPage) {
    case '/flixx-web-movie-app/index.html':
      displayPopularMovies();
      break;
    case '/flixx-web-movie-app/shows.html':
      displayPopularTVShows();
      break;
    case '/flixx-web-movie-app/tv-details.html':
      console.log('Tv Details');
      break;
    case '/flixx-web-movie-app/movie-details.html':
      displayMovieDetails();
      break;
    case '/flixx-web-movie-app/search.html':
      console.log('Search');
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);