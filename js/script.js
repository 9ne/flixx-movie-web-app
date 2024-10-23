const global = {
  currentPage: window.location.pathname,
}


// Fetch data from TMDB API
const fetchApiData = async (endpoint) => {
  const API_KEY = '75379d6cabfbe95d5c7840dd6ebd49d7';
  const API_URL = 'https://api.themoviedb.org/3/';
  
  const res = await fetch(`
    ${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US
  `);

  const data = await res.json();
  return data;
};


const displayPopularMovies = async () => {
  const { results }  = await fetchApiData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="${movie.id}">
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
              alt="Movie Title"
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

  console.log(results);
}

// Highlight active link
const highlightActiveLink = () => {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
};

// Init App
const init = () => {
  switch(global.currentPage) {
    case '/flixx-web-movie-app/index.html':
      displayPopularMovies();
      break;
    case '/flixx-web-movie-app/shows.html':
      console.log('Tv Shows');
      break;
    case '/flixx-web-movie-app/tv-details.html':
      console.log('Tv Details');
      break;
    case '/flixx-web-movie-app/movie-details.html':
      console.log('Movie Details');
      break;
    case '/flixx-web-movie-app/search.html':
      console.log('Search');
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);