const BASE_URL = "https://api.themoviedb.org/3";
const USE_API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDhlNDkyNDBmODllYjQ1MjMzODY1MDFlYjMzOWI0ZiIsIm5iZiI6MTc1MDQyNjUzNC41Mzc5OTk5LCJzdWIiOiI2ODU1NjNhNjJmMDI1ZTU1NzgwY2Y4MTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.66hdtCH3nPlZaYm1HBg8UxunF5F7OiGcoO0nJuGi9F4";

const getConfig = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${USE_API_TOKEN}`,
  },
};

let movie_id = 552524;

async function getMovieInformation(movie_id) {
  const res = await fetch(
    `${BASE_URL}/movie/${movie_id}?language=pt-BR`,
    getConfig
  );
  const data = await res.json();
  console.log(data, "getMovieInformation");

  const statusTraduzido = {
    Released: "Lançado",
    Canceled: "Cancelado",
  };

  const idiomasTraduzidos = {
    en: "Inglês",
    pt: "Português",
    "pt-BR": "Português (Brasil)",
    es: "Espanhol",
    fr: "Francês",
    de: "Alemão",
    it: "Italiano",
    ja: "Japonês",
    ko: "Coreano",
    zh: "Chinês",
  };

  const statusOriginal = data.status;
  const statusEmPt = statusTraduzido[statusOriginal] || statusOriginal;
  const idioma =
    idiomasTraduzidos[data.original_language] || data.original_language;

  document.querySelector("#movie h1").textContent = data.title;

  const poster = document.querySelector(".posterImage");
  poster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  poster.alt = `Pôster de ${data.title}`;
  poster.style.borderRadius = "10px";
  poster.style.boxShadow = "0px 4px 20px rgba(16, 44, 87, 0.2)";

  const genresText = data.genres.map((p) => p.name).join(", ");
  document.getElementById("genre").textContent = genresText;
  document.getElementById("sinopse").textContent = data.overview
    ? data.overview
    : "-";

  const formatarDinheiro = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "USD",
    });

  document.getElementById("orcamento").textContent = formatarDinheiro(
    data.budget
  );
  const releaseDate = data.release_date || "N/A";
  const year = releaseDate !== "N/A" ? releaseDate.split("-")[0] : "N/A";
  document.getElementById("movieYear").textContent = year;
  document.getElementById("receita").textContent = formatarDinheiro(
    data.revenue
  );
  document.getElementById("status").textContent = statusEmPt;
  document.getElementById("idioma").textContent = idioma;
}

async function getMovieCredits(movie_id) {
  const res = await fetch(
    `${BASE_URL}/movie/${movie_id}/credits?language=pt-BR`,
    getConfig
  );
  const data = await res.json();

  const diretor = data.crew.find((person) => person.job === "Director");
  document.getElementById("diretor").textContent = diretor
    ? ` ${diretor.name}`
    : " Indisponível";
  const roteirista = data.crew.find(
    (person) => person.job === "Writer" || person.job === "Screenplay"
  );
  document.getElementById("roteirista").textContent = roteirista
    ? ` ${roteirista.name}`
    : " Indisponível";

  const elenco = data.cast.splice(0, 10);
  const container = document.getElementById("carouselElenco");
  container.innerHTML = "";
  elenco.forEach((ator) => {
    const card = document.createElement("div");
    card.className = "text-center";
    card.style.scrollSnapAlign = "start";
    card.style.minWidth = "190px";

    const img = document.createElement("img");
    img.src = ator.profile_path
      ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
      : "https://placehold.co/185x278?text=Sem+foto&font=roboto";
    img.alt = `Foto de ${ator.name}`;
    img.style.width = "190px";
    img.style.height = "190px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "50%";
    img.style.display = "block";
    img.style.margin = "0 auto";

    const nome = document.createElement("p");
    nome.textContent = ator.name;
    nome.className = "mt-2 fw-bold mb-1";

    const personagem = document.createElement("p");
    personagem.textContent = ator.character;
    personagem.className = "text-muted mb-0";

    card.appendChild(img);
    card.appendChild(nome);
    card.appendChild(personagem);

    container.appendChild(card);
  });
}

document.getElementById("carouselElenco").addEventListener("wheel", (event) => {
  event.preventDefault();
  const scrollAmount = event.deltaY * 5;
  event.currentTarget.scrollLeft += scrollAmount;
});

document.addEventListener("DOMContentLoaded", () => {
  const carrosseis = [
    "carouselElenco",
    "movie-list",
    "backdropContainer",
    "posterContainer",
    "videoContainer",
    "reviewsContainer",
  ];
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.textContent = "☰";
      });
    });
  }
  carrosseis.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.addEventListener("wheel", (event) => {
        event.preventDefault();
        const scrollAmount = event.deltaY * 5;
        event.currentTarget.scrollLeft += scrollAmount;
      });
    }
  });

  const carrosselElenco = document.getElementById("carouselElenco");
  if (carrosselElenco) {
    carrosselElenco.addEventListener("scroll", atualizarFadesElenco);
  }
  setTimeout(atualizarFadesElenco, 200);
});

function atualizarFadesElenco() {
  const carrossel = document.getElementById("carouselElenco");
  const esquerda = document.querySelector(".lateral-esquerda");
  const direita = document.querySelector(".lateral-direita");
  if (!carrossel || !esquerda || !direita) return;
  const scrollEsquerda = carrossel.scrollLeft;
  const scrollDireita =
    carrossel.scrollWidth - carrossel.clientWidth - carrossel.scrollLeft;
  esquerda.style.display = scrollEsquerda > 0 ? "block" : "none";
  direita.style.display = scrollDireita > 1 ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const carrossel = document.getElementById("carouselElenco");
  if (carrossel) {
    carrossel.addEventListener("scroll", atualizarFadesElenco);
  }
  setTimeout(atualizarFadesElenco, 200);
});

async function getReviews(movie_id) {
  const res = await fetch(
    `${BASE_URL}/movie/${movie_id}/reviews?language=pt-BR`,
    getConfig
  );
  const data = await res.json();
  console.log(data, "getReviews");

  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "";

  if (data.results.length === 0) {
    container.innerHTML = "<p>Nenhuma resenha encontrada.</p>";
    return;
  }

  data.results.forEach((review) => {
    const { author, content, created_at, author_details } = review;
    const nota = author_details.rating ?? "–";
    const dataFormatada = new Date(created_at).toLocaleDateString("pt-BR");

    const card = document.createElement("div");
    card.className = "cardContainer";

    card.innerHTML = `
    <div class="reviewText">${content}</div>
      <div class="reviewFooter">
        <div>por <span class="highlightFont">${author}</span></div>
        <div class="d-flex justify-content-between">
          <p>${dataFormatada}</p>
          <p>Nota: <span class="highlightFont">${nota}</span>/10</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

async function getVideoAssets(movie_id) {
  const videoResponse = await fetch(
    `${BASE_URL}/movie/${movie_id}/videos?language=pt-BR`,
    getConfig
  );
  const videoData = await videoResponse.json();

  const videoContainer = document.getElementById("videoContainer");
  const videoCount = document.getElementById("videoCount");

  if (!videoContainer || !videoCount) {
    console.warn("Elementos de vídeo não encontrados.");
    return;
  }

  const youtubeVideos = videoData.results.filter((v) => v.site === "YouTube");
  videoCount.textContent = `(${youtubeVideos.length})`;

  videoContainer.innerHTML = "";

  if (youtubeVideos.length === 0) {
    videoContainer.innerHTML = "<p class='p-2'>Nenhum vídeo disponível.</p>";
    return;
  }

  videoContainer.style.display = "flex";
  videoContainer.style.overflowX = "auto";
  videoContainer.style.scrollSnapType = "x mandatory";
  videoContainer.style.gap = "1rem";
  videoContainer.style.whiteSpace = "nowrap";
  videoContainer.style.height = "fit-content";
  videoContainer.style.webkitOverflowScrolling = "touch";

  youtubeVideos.forEach((video) => {
    const item = document.createElement("div");
    item.className = "video-thumb";
    item.style.scrollSnapAlign = "start";
    item.style.flex = "0 0 auto";
    item.style.minWidth = "300px";
    item.style.height = "170px";
    item.style.marginRight = "1rem";

    item.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${video.key}" 
        allowfullscreen
        allow="picture-in-picture"
        title="${video.name}"
        style="width: 100%; height: 100%; border: none; border-radius: 8px;"
      ></iframe>
    `;
    videoContainer.appendChild(item);
  });

  videoContainer.addEventListener(
    "wheel",
    (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      videoContainer.scrollLeft += e.deltaY;
    },
    { passive: false }
  );
}

async function getImagesAssets(movie_id) {
  try {
    const imageResponse = await fetch(
      `${BASE_URL}/movie/${movie_id}/images`,
      getConfig
    );
    if (!imageResponse.ok) {
      throw new Error(
        `Erro na requisição: ${imageResponse.status} ${imageResponse.statusText}`
      );
    }
    const imageData = await imageResponse.json();
    console.log(imageData, "imageData");
    displayImages(imageData);
    ativarScrollHorizontalComRoda();
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    document.getElementById("posterContainer").innerHTML =
      "<p class='p-2'>Erro ao carregar pôsteres: " + error.message + "</p>";
    document.getElementById("backdropContainer").innerHTML =
      "<p class='p-2'>Erro ao carregar imagens de fundo: " +
      error.message +
      "</p>";
  }
}

function displayImages(imageData) {
  const posterContainer = document.getElementById("posterContainer");
  const backdropContainer = document.getElementById("backdropContainer");
  const posterCount = document.getElementById("posterCount");
  const backdropCount = document.getElementById("backdropCount");

  posterCount.textContent = `(${imageData.posters.length})`;
  backdropCount.textContent = `(${imageData.backdrops.length})`;

  posterContainer.innerHTML = "";
  backdropContainer.innerHTML = "";

  function createImageElement(path, altText) {
    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500${path}`;
    img.alt = altText;
    img.className = "img-fluid rounded shadow-sm";
    img.style.maxHeight = "300px";
    img.style.marginRight = "1rem";
    img.style.scrollSnapAlign = "start";
    return img;
  }

  imageData.posters.forEach((poster) => {
    if (poster.file_path) {
      const img = createImageElement(poster.file_path, "Pôster do filme");
      posterContainer.appendChild(img);
    }
  });

  imageData.backdrops.forEach((backdrop) => {
    if (backdrop.file_path) {
      const img = createImageElement(
        backdrop.file_path,
        "Imagem de fundo do filme"
      );
      backdropContainer.appendChild(img);
    }
  });
}
function ativarScrollHorizontalComRoda() {
  const carrosseis = document.querySelectorAll(".horizontal-scroll");
  carrosseis.forEach((carrossel) => {
    carrossel.addEventListener(
      "wheel",
      (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        carrossel.scrollLeft += e.deltaY;
      },
      { passive: false }
    );
  });
}
async function getTopRated(movie_id) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movie_id}/recommendations?language=pt-BR`,
      getConfig
    );
    const data = await res.json();
    console.log(data, "data");

    const movieList = document.getElementById("movie-list");

    if (data.results && data.results.length > 0) {
      movieList.innerHTML = "";

      data.results.map((movie) => {
        const posterPath = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://placehold.co/185x278?text=Sem+foto&font=roboto";
        const title = movie.title || "Título não disponível";
        const rating = movie.vote_average
          ? `${(movie.vote_average * 10).toFixed(1)}%`
          : "Sem avaliação";

        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";
        movieCard.setAttribute("data-id", movie.id);
        movieCard.innerHTML = `
              <div>
                <img src="${posterPath}" alt="Pôster de ${title}" />
                <div class="posterRecomendationText">
                <p class='recomendationTitle'>${title}</p>
                <p class='font-weight-normal'>${rating}</p>
                </div>
              </div>
            `;

        movieCard.addEventListener("click", () => {
          movie_id = movie.id;
          updateMovieData(movie_id);
        });

        movieList.appendChild(movieCard);
      });
    } else {
      movieList.innerHTML = `
            <div class="text-center">
              <p>Nenhuma recomendação encontrada</p>
            </div>
          `;
    }
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    movieList.innerHTML = `
          <div class="text-center">
            <p>Erro ao carregar recomendações</p>
          </div>
        `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ativarScrollHorizontalComRoda();
  const carrosselElenco = document.getElementById("carouselElenco");
  if (carrosselElenco) {
    carrosselElenco.addEventListener("scroll", atualizarFadesElenco);
  }
  setTimeout(atualizarFadesElenco, 200);
});
document.getElementById("movie-list").addEventListener("wheel", (event) => {
  event.preventDefault();
  const scrollAmount = event.deltaY * 5;
  event.currentTarget.scrollLeft += scrollAmount;
});
document
  .getElementById("backdropContainer")
  .addEventListener("wheel", (event) => {
    event.preventDefault();
    const scrollAmount = event.deltaY * 5;
    event.currentTarget.scrollLeft += scrollAmount;
  });
document
  .getElementById("posterContainer")
  .addEventListener("wheel", (event) => {
    event.preventDefault();
    const scrollAmount = event.deltaY * 5;
    event.currentTarget.scrollLeft += scrollAmount;
  });
document.getElementById("videoContainer").addEventListener("wheel", (event) => {
  event.preventDefault();
  const scrollAmount = event.deltaY * 5;
  event.currentTarget.scrollLeft += scrollAmount;
});
document
  .getElementById("reviewsContainer")
  .addEventListener("wheel", (event) => {
    event.preventDefault();
    const scrollAmount = event.deltaY * 5;
    event.currentTarget.scrollLeft += scrollAmount;
  });

async function updateMovieData(movie_id) {
  window.scrollTo({ top: 0, behavior: "smooth" });
  await Promise.all([
    getMovieInformation(movie_id),
    getMovieCredits(movie_id),
    getReviews(movie_id),
    getVideoAssets(movie_id),
    getImagesAssets(movie_id),
    getTopRated(movie_id),
  ]);
}

updateMovieData(movie_id);
