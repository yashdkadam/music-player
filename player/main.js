let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

let curr_track = document.createElement("audio");
$(window).scroll(function () {
  if (window.innerWidth < 1000) {
    $(".player").css("opacity", `${1 - pageYOffset / 3000}`);
  }
});
var track_list = [
  {
    name: "{{song}}",
    artist: "",
    image: "{{ imgUrl }}",
    path: "{{ mp3Url }}",
  },
];
async function getTrackResponse() {
  let artist = localStorage.getItem("artist");
  const res = await $.get(
    "https://curious-parka-yak.cyclic.app/api/songs/byartist/" + artist
  );
  let data = Object.values(res);
  var i = 1;
  data.reverse();
  for (index in data) {
    track_list.push(data[index]);
    $("#playlist").append(`
                <div class="card mb-3" style="max-width: 540px;" onclick="getTrack(${i})">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${data[index]["imgUrl"]}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${data[index]["name"]}</h5>
                <p class="card-text">${data[index]["name"]}</p>
              </div>
            </div>
          </div>
        </div>`);
    i++;
  }
  now_playing.textContent =
    "PLAYING " + (track_index + 1) + " OF " + track_list.length;
}
getTrackResponse();
function search() {
  let q = jQuery(".form-control.me-2").val();
  window.open("/music/?q=" + q, (target = "_self"));
}
function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();

  curr_track.src = track_list[track_index].previewUrl;
  curr_track.load();

  track_art.style.backgroundImage =
    "url(" + track_list[track_index].imgUrl + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent =
    "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);

  curr_track.addEventListener("ended", nextTrack);

  random_bg_color();
}

function random_bg_color() {
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  let bgColor = "rgb(" + red + ", " + green + ", " + blue + ")";

  document.body.style.background = bgColor;
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}
function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;

  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;

  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < track_list.length - 1) track_index += 1;
  else track_index = 0;

  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0) track_index -= 1;
  else track_index = track_list.length - 1;

  loadTrack(track_index);
  playTrack();
}
function seekTo() {
  seekto = curr_track.duration * (seek_slider.value / 100);

  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
function getTrack(index) {
  track_index = index;
  loadTrack(track_index);
  playTrack();
}

loadTrack(track_index);
