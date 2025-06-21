const BASE_URL = "https://api.themoviedb.org/3";

const getConfig = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDhlNDkyNDBmODllYjQ1MjMzODY1MDFlYjMzOWI0ZiIsIm5iZiI6MTc1MDQyNjUzNC41Mzc5OTk5LCJzdWIiOiI2ODU1NjNhNjJmMDI1ZTU1NzgwY2Y4MTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.66hdtCH3nPlZaYm1HBg8UxunF5F7OiGcoO0nJuGi9F4`,
  },
};
// pegando filme selecionado
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

  const titleElement = document.querySelector("#movie h1");
  titleElement.textContent = data.title;

  const poster = document.querySelector(".posterImage");
  poster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  poster.alt = `Pôster de ${data.title}`;

  const genresText = data.genres.map((p) => p.name).join(", ");
  document.querySelectorAll(
    "#movie p.text-center"
  )[0].textContent = `Gênero: ${genresText}`;
  document.querySelectorAll(
    "#movie p.text-center"
  )[1].textContent = `Sinopse: ${data.overview}`;

  const formatarDinheiro = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "USD",
    });

  document.getElementById("orcamento").textContent = formatarDinheiro(
    data.budget
  );
  const idioma =
    idiomasTraduzidos[data.original_language] || data.original_language;

  const situacaoDoFilme = document.createElement("p");
  situacaoDoFilme.classList.add("text-center");
  situacaoDoFilme.textContent = `Situação: ${statusEmPt}, Idioma original: ${idioma}`;
  document.querySelector("#movie .mb-4").after(situacaoDoFilme);
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
}

getTopRated();
getMovieInformation();
getMovieCredits();
