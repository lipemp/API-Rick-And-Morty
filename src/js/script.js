let currentPage = 1;
let statusInfo = "";

const charactersList = document.getElementById("lista-personagens");
const searchInput = document.getElementById("input-pesquisa");
const searchButton = document.getElementById("botao-pesquisa");
const pagesInfo = document.getElementById("pagesInfo");

const linkCharacter = "https://rickandmortyapi.com/api/character";
const linkEpisode = "https://rickandmortyapi.com/api/episode";
const linkLocation = "https://rickandmortyapi.com/api/location";

function searchCharacters(page, name = "") {
  const link = `${linkCharacter}?page=${page}&name=${name}`;

  axios
    .get(link)
    .then(function (response) {
      const characters = response.data.results;
      const infos = response.data.info;

      charactersList.innerHTML = "";

      characters.slice(0, 12).forEach(async function (characters) {
        const listItem = document.createElement("li");
        listItem.classList.add("character-item");

        const image = document.createElement("img");
        image.classList.add("character-image");
        image.src = characters.image;

        const name = document.createElement("h2");
        name.classList.add("characters-name");
        name.textContent = characters.name;

        const status = document.createElement("p");
        status.classList.add("characters-status");

        if (characters.status === "Alive") {
          statusInfo = "🟢 Vivo";
        } else {
          statusInfo = "🔴 Morto";
        }
        status.textContent = statusInfo + " - " + characters.species;

        const locationDescription = document.createElement("span");
        locationDescription.classList.add("locationDescription");

        locationDescription.textContent = "Última localização conhecida";

        const lastLocation = document.createElement("p");
        lastLocation.classList.add("characterLastLocation");

        lastLocation.textContent = characters.location.name;

        const finalEpDescription = document.createElement("span");
        finalEpDescription.classList.add("finalEpDescription");

        finalEpDescription.textContent = "Visto pela última vez em:";

        const lastEp = document.createElement("p");
        lastEp.classList.add("characterLastEp");

        const epName = await axios.get(characters.episode[0]);
        lastEp.textContent = epName.data.name;

        const parentDivInfo = document.createElement("div");
        parentDivInfo.classList.add("character-info");

        parentDivInfo.appendChild(name);
        parentDivInfo.appendChild(status);
        parentDivInfo.appendChild(locationDescription);
        parentDivInfo.appendChild(lastLocation);
        parentDivInfo.appendChild(finalEpDescription);
        parentDivInfo.appendChild(lastEp);

        listItem.appendChild(image);
        listItem.appendChild(parentDivInfo);

        charactersList.appendChild(listItem);
      });

      pagesInfo.innerHTML = "";

      if (infos && infos.prev) {
        const prevButton = document.createElement("button");
        prevButton.classList.add("nextButton");

        prevButton.textContent = "Anterior";

        prevButton.addEventListener("click", function () {
          searchCharacters(infos.prev.split("=")[1], name);
        });
        pagesInfo.appendChild(prevButton);
      }

      if (infos && infos.next) {
        const nextButton = document.createElement("button");
        nextButton.classList.add("nextButton");

        nextButton.textContent = "Próximo";

        nextButton.addEventListener("click", function () {
          searchCharacters(infos.next.split("=")[1], name);
        });
        pagesInfo.appendChild(nextButton);
      }
    })
    .catch(function (erro) {
      console.log(erro);
    });
}

function footerCounter() {
  axios.get(linkCharacter).then((response) => {
    const numberOfCharacters = response.data.info.count;
    const numberOfCharactersFooter =
      document.getElementById("totalPersonagens");

    if (numberOfCharactersFooter) {
      numberOfCharactersFooter.textContent =
        "PERSONAGENS: " + numberOfCharacters;
    }
  });

  axios.get(linkLocation).then((response) => {
    const charactersLocation = response.data.info.count;
    const charactersLocationFooter = document.getElementById("localizacoes");

    if (charactersLocationFooter) {
      charactersLocationFooter.textContent =
        "LOCALIZAÇÕES: " + charactersLocation;
    }
  });

  axios.get(linkEpisode).then((response) => {
    const episode = response.data.info.count;
    const numberOfCharactersFooter = document.getElementById("episodios");

    if (numberOfCharactersFooter) {
      numberOfCharactersFooter.textContent = "EPISÓDIOS: " + episode;
    }
  });
}

searchButton.addEventListener("click", function () {
  const search = searchInput.value;
  searchCharacters(currentPage, search);
});

searchButton.addEventListener("input", function () {
  const search = searchInput.value;
  searchCharacters(currentPage, search);
});

searchCharacters(currentPage);
footerCounter();
