const key = "ZjZlMzE5YjMtODhkNy00MGQ2LTkwOTktMTEzYWFiYTM3ZDRl";

const toggleButton = document.querySelector(".toggle");
const toggleIcon = toggleButton.querySelector("i");
const libraryContainer = document.querySelector(".library-container");
const audio = document.querySelector("audio");
const player = document.querySelector(".player");
const audioRange = document.querySelector(".music-range");
const playButton = document.querySelector(".play");
const muteButton = document.querySelector(".mute");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const playButtonIcon = playButton.querySelector("i");
const form = document.querySelector("form");
const titleSong = document.querySelector(".title");
const searchInput = form.querySelector("input");
const searchButton = form.querySelector("button");
const container = document.querySelector(".container");
const library = document.querySelector(".library");
const phoneMatch = window.matchMedia("(max-width: 768px)");
let query, src, duration, title, artist;
let isPlaying = false;
let savedSongs = [];
let songsNumber;

//Event Listeners
toggleButton.addEventListener("click", () => {
  libraryContainer.classList.toggle("active");
  library.classList.toggle("active");
  toggleButton.classList.toggle("active");
  if (toggleButton.classList.contains("active")) {
    toggleIcon.classList.remove("fa-chevron-right");
    toggleIcon.classList.add("fa-chevron-left");
  } else {
    toggleIcon.classList.remove("fa-chevron-left");
    toggleIcon.classList.add("fa-chevron-right");
  }
  if (library.classList.contains("active") && library.children.length > 0) {
    const libraryItems = document.querySelectorAll(".library-item");
    libraryItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        if (event.target.classList.contains("library-item")) {
          audio.src = event.target.children[0].href;
          isPlaying = false;
          playTrack(isPlaying);
          nowPlaying(
            event.target.children[2].innerText,
            event.target.children[3].innerText
          );
          if (phoneMatch.matches) {
            libraryContainer.classList.remove("active");
            library.classList.remove("active");
            toggleIcon.classList.remove("fa-chevron-left");
            toggleIcon.classList.add("fa-chevron-right");
          }
        }
      });
      const closeButton = item.querySelector("button");
      closeButton.addEventListener("click", (event) => {
        const parent = event.target.parentElement;
        library.removeChild(parent);
        const index = parent.getAttribute("id");
        deleteItemFromLocal(index);
      });
    });
  }
});

playButton.addEventListener("click", (event) => {
  isPlaying = !isPlaying;
  playTrack(isPlaying, event);
});

muteButton.addEventListener("click", () => {
  muteButton.classList.toggle("muted");
  let muteIcon = muteButton.querySelector("i");
  if (muteButton.classList.contains("muted")) {
    audio.volume = 0;
    muteIcon.classList.remove("fa-volume-mute");
    muteIcon.classList.add("fa-volume-up");
  } else {
    audio.volume = 1;
    muteIcon.classList.remove("fa-volume-up");
    muteIcon.classList.add("fa-volume-mute");
  }
});

searchInput.addEventListener("change", (event) => {
  query = event.target.value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchTrack();
});

audioRange.addEventListener("change", () => {
  audio.currentTime = audioRange.value;
});

nextButton.addEventListener("click", forwardPlay);
prevButton.addEventListener("click", backwardPlay);

window.addEventListener("keydown", (event) => {
  if (event.target.id !== "search-bar") {
    switch (event.code) {
      case "Space":
        event.preventDefault();
        isPlaying = !isPlaying;
        playTrack(isPlaying, event);
        break;
      case "ArrowLeft":
        backwardPlay();
        break;
      case "ArrowRight":
        forwardPlay();
        break;
    }
  }
});

//Functions
function forwardPlay() {
  audio.currentTime += 2;
}

function backwardPlay() {
  audio.currentTime -= 2;
}

function playTrack(isPlaying, event) {
  audio.addEventListener("timeupdate", (event) => {
    duration = Math.round(event.target.duration * 100) / 100;
    audioRange.value = audio.currentTime;
    audioRange.max = duration;
  });
  audioRange.value = audio.currentTime;
  if (isPlaying) {
    playButtonIcon.classList.remove("fa-play");
    playButtonIcon.classList.add("fa-pause");
    audio.play();
  } else {
    playButtonIcon.classList.remove("fa-pause");
    playButtonIcon.classList.add("fa-play");
    audio.pause();
  }
}

function nowPlaying(artist, title) {
  titleSong.innerText = `${artist} - ${title}`;
}

async function searchTrack() {
  container.innerHTML = "";
  const fetchData = await fetch(
    `https://api.napster.com/v2.2/search?query=${query}&per_type_limit=50`,
    {
      method: "GET",
      headers: {
        apikey: key,
      },
    }
  );
  const result = await fetchData.json();
  tracks = result.search.data.tracks;
  tracks.forEach((track) => {
    src = track.previewURL;
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");
    container.append(itemContainer);
    const titleElement = document.createElement("h2");
    const artistElement = document.createElement("h1");
    const addToLibrary = document.createElement("button");
    addToLibrary.classList.add("add-to-library");
    const addIcon = document.createElement("i");
    const srcLink = document.createElement("a");
    srcLink.href = src;
    srcLink.target = "_blank";
    srcLink.innerText = "Download";
    addIcon.classList.add("fas");
    addIcon.classList.add("fa-plus");
    addToLibrary.appendChild(addIcon);
    artistElement.innerText = track.artistName;
    titleElement.innerText = track.name;
    itemContainer.appendChild(artistElement);
    itemContainer.appendChild(titleElement);
    itemContainer.appendChild(addToLibrary);
    itemContainer.appendChild(srcLink);
  });
  const itemContainers = document.querySelectorAll(".item-container");
  itemContainers.forEach((itemContainer) => {
    const addButton = itemContainer.querySelector("button");
    itemContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("item-container")) {
        const href = event.target.children[3].href;
        audio.src = href;
        artist = event.target.children[0].textContent;
        title = event.target.children[1].textContent;
        isPlaying = false;
        playTrack(isPlaying);
        nowPlaying(artist, title);
      }
    });
    addButton.addEventListener("click", (event) => {
      const artist = event.target.parentElement.children[0].innerText;
      const title = event.target.parentElement.children[1].innerText;
      const src = event.target.parentElement.children[3].href;
      saveLibrary(artist, title, src);
      createLibraryItem(
        artist,
        title,
        src,
        JSON.parse(localStorage.getItem("songs")).length - 1
      );
    });
  });
}

function saveLibrary(artist, title, src) {
  //Save to local storage

  if (localStorage.getItem("songs") === null) {
    songsNumber = savedSongs.length;
  } else {
    const songsArray = JSON.parse(localStorage.getItem("songs"));
    songsNumber = songsArray.length;
  }
  const songObject = { artist, title, nr: songsNumber, src };
  savedSongs.push(songObject);
  let songs = JSON.parse(localStorage.getItem("songs"));
  songsNumber = songs.length;
  saveToLocalStorage(songObject);
}

function saveToLocalStorage(object) {
  let localSongs;
  if (localStorage.getItem("songs") === null) {
    localSongs = [];
  } else {
    localSongs = JSON.parse(localStorage.getItem("songs"));
  }
  localSongs.push(object);
  localStorage.setItem("songs", JSON.stringify(localSongs));
}

function createLibraryItem(artist, title, src, index) {
  const libraryItem = document.createElement("div");
  const artistItem = document.createElement("h2");
  const titleItem = document.createElement("h2");
  const srcItem = document.createElement("a");
  const closeItem = document.createElement("button");
  artistItem.innerText = artist;
  titleItem.innerText = title;
  srcItem.href = src;
  srcItem.style.display = "none";
  closeItem.innerHTML = "&times;";
  libraryItem.classList.add("library-item");
  libraryItem.setAttribute("id", index);

  libraryItem.appendChild(srcItem);
  libraryItem.appendChild(closeItem);
  libraryItem.appendChild(artistItem);
  libraryItem.appendChild(titleItem);
  library.appendChild(libraryItem);
}

function getLocal() {
  let localSongs;
  if (localStorage.getItem("songs") === null) {
    localSongs = [];
  } else {
    localSongs = JSON.parse(localStorage.getItem("songs"));
  }
  if (localSongs.length > 0) {
    localSongs.forEach((song, index) => {
      createLibraryItem(song.artist, song.title, song.src, index);
    });
  }
}

function deleteItemFromLocal(index) {
  const songsObjects = JSON.parse(localStorage.getItem("songs"));
  songsObjects.splice(index, 1);
  localStorage.setItem("songs", JSON.stringify(songsObjects));
}

getLocal();
