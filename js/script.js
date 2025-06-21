const BASE_URL = "https://api.themoviedb.org/3";

const getConfig = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDhlNDkyNDBmODllYjQ1MjMzODY1MDFlYjMzOWI0ZiIsIm5iZiI6MTc1MDQyNjUzNC41Mzc5OTk5LCJzdWIiOiI2ODU1NjNhNjJmMDI1ZTU1NzgwY2Y4MTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.66hdtCH3nPlZaYm1HBg8UxunF5F7OiGcoO0nJuGi9F4`,
  },
};

const movie_id = 1087192;

async function getTopRated() {
  const res = await fetch(
    `${BASE_URL}/movie/${movie_id}/recommendations?language=pt-BR`,
    getConfig
  );
  const data = await res.json();
  console.log(data, "data");
}

async function getMovieInformation() {
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

async function getMovieCredits() {
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
  const elencoContainer = document.getElementById("carouselElenco");

  elencoContainer.addEventListener("wheel", (e) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      elencoContainer.scrollLeft += e.deltaY;
    }
  });

  elenco.forEach((ator) => {
    const card = document.createElement("div");
    card.className = "text-center";
    card.style.scrollSnapAlign = "start";

    const img = document.createElement("img");
    img.src = ator.profile_path
      ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
      : "https://placehold.co/185x278?text=Sem+foto&font=roboto";
    img.alt = `Foto de ${ator.name}`;
    img.style.objectFit = "cover";
    card.style.minWidth = "190px";
    img.style.width = "190px";
    img.style.height = "190px";
    img.style.objectFit = "cover"; // mantém proporção e preenche a área
    img.style.borderRadius = "50%"; // deixa redondo
    img.style.display = "block";
    img.style.margin = "0 auto"; // centraliza horizontalmente

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

getTopRated();
getMovieInformation();
getMovieCredits();
