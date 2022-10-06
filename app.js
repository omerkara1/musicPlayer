const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const play = document.querySelector("#controls #play");
const prev = document.querySelector("#controls #prev");
const next = document.querySelector("#controls  #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");

const player = new MusicPlayer(musicList);

//sayfa yüklendiğinde ekranda gösterme
window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  // müzik listesi
  displayMusicList(player.musicList);
  isPlayingNow();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");
  isMusicPlay ? pauseMusic() : playMusic();
});

// geri(önceki butonu)
prev.addEventListener("click", () => {
  prevMusic();
});

// next(sonraki butonu)
next.addEventListener("click", () => {
  nextMusic();
});

// prev function
const prevMusic = () => {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  playMusic(music);
  isPlayingNow();
};

// next function
const nextMusic = () => {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  playMusic(music);
  isPlayingNow();
};

// playing classı var ise silme ve müziği durdurma
const pauseMusic = () => {
  container.classList.remove("playing");
  // icon degistirme
  play.querySelector("i").classList = "fa-solid fa-play";
  audio.pause();
};

// müzik çalıyorsa playing classını ekleyerek aktif hale getirme
const playMusic = () => {
  container.classList.add("playing");
  // icon degistirme
  play.querySelector("i").classList = "fa-solid fa-pause";
  audio.play();
};

//  şarkı sürelerini ekranda gösterme
const calculateTime = (totalSeconds) => {
  const minute = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const updateSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const result = `${minute}:${updateSeconds}`;
  return result;
};

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
});

// saniye bilgisini progress barda gösterme
audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime);
  currentTime.textContent = calculateTime(progressBar.value);
});

// süre kontrolü -  ileri geri sarma
progressBar.addEventListener("input", () => {
  currentTime.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});

// ses kontrolü
let muteState = "unMuted";

// slider kontrol
volumeBar.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;
  if (value == 0) {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
  } else {
    audio.muted = false;
    muteState = "unMuted";
    volume.classList = "fa-solid fa-volume-high";
  }
});

// ses icon kontrol
volume.addEventListener("click", () => {
  if (muteState === "unMuted") {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    muteState = "unMuted";
    volume.classList = "fa-solid fa-volume-high";
    volumeBar.value = 100;
  }
});

// card footer da müzik listesini ekleme

const displayMusicList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let liTag = `
        <li li-index="${i}" onclick="selectedMusic(this)"
          class="list-group-item d-flex justify-content-between align-items-center">            
          <span>${list[i].getName()}</span>
          <span id="music-${i}" class="badge bg-primary rounded-pill">3:40</span>
          <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
        </li>
    
    `;

    ul.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ul.querySelector(`#music-${i}`);
    let liAudioTag = ul.querySelector(`.music-${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};

// seçilen müziğin başlatılması
const selectedMusic = (li) => {
  player.index = li.getAttribute("li-index");
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
};

// playing class'ı nı ekleme bg işlemi

const isPlayingNow = () => {
  for (let li of ul.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }

    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
};

// müzik bittiğinde sonraki müziğe geçme

audio.addEventListener("ended", () => {
  nextMusic();
});
