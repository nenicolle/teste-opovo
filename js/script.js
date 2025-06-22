const BASE_URL = "https://api.themoviedb.org/3";

const getConfig = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDhlNDkyNDBmODllYjQ1MjMzODY1MDFlYjMzOWI0ZiIsIm5iZiI6MTc1MDQyNjUzNC41Mzc5OTk5LCJzdWIiOiI2ODU1NjNhNjJmMDI1ZTU1NzgwY2Y4MTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.66hdtCH3nPlZaYm1HBg8UxunF5F7OiGcoO0nJuGi9F4`,
  },
};

const movie_id = 552524;

async function getTopRated(movie_id) {
  const res = await fetch(
    `${BASE_URL}/movie/${movie_id}/recommendations?language=pt-BR`,
    getConfig
  );
  const data = await res.json();
  console.log(data, "data");
}

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
  document.getElementById("sinopse").textContent = data.overview;

  const formatarDinheiro = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "USD",
    });

  document.getElementById("orcamento").textContent = formatarDinheiro(
    data.budget
  );
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

  const elenco = data.cast;
  const container = document.getElementById("carouselElenco");
  container.innerHTML = "";

  container.addEventListener(
    "wheel",
    (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    },
    { passive: false }
  );

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

async function getMovieAssets(movie_id) {
  const videoResponse = await fetch(
    `${BASE_URL}/movie/${movie_id}/videos?language=pt-BR`,
    getConfig
  );
  const imageResponse = await fetch(
    `${BASE_URL}/movie/${movie_id}/images`,
    getConfig
  );

  const videoData = await videoResponse.json();
  const imageData = await imageResponse.json();

  const videoContainer = document.getElementById("videoScroller");
  const videoCount = document.getElementById("videoCount");

  if (!videoContainer || !videoCount) {
    console.warn("Elementos de vídeo não encontrados no DOM.");
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
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

getTopRated(movie_id);
getMovieInformation(movie_id);
getMovieCredits(movie_id);
getReviews(movie_id);
getMovieAssets(movie_id);
