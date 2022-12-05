async function getArtists() {
  const res = await $.get(
    "https://curious-parka-yak.cyclic.app/api/songs/get/artists"
  );
  let data = Object.values(res);
  for (index in data) {
    $(".slider-component-artist").append(`
      <div class="card" style="width: 8rem;background: #1a1a1a; padding: 10px;" onclick="redirectFunction('${data[index]}', 'artist')">
                <img src="/music-player/static/Logo.png" class="card-img-top" alt="..." style="border-radius: 50%;">
                <div class="card-body" style="padding: 6px;">
                    <p class="card-text subtitle">${data[index]}</p>
                </div>
            </div>
      `);
  }
  const res1 = await $.get(
    "https://curious-parka-yak.cyclic.app/api/songs/get/albums"
  );
  let data1 = Object.values(res);
  for (index in data1) {
    $(".slider-component-album").append(`
      <div class="card" style="width: 8rem;background: #1a1a1a; padding: 10px;" onclick="redirectFunction('${data1[index]}', 'album')">
                <img src="/music-player/static/Logo.png" class="card-img-top" alt="..." style="border-radius: 50%;">
                <div class="card-body" style="padding: 6px;">
                    <p class="card-text subtitle">${data1[index]}</p>
                </div>
            </div>
      `);
  }

  $(".slider-component-artist").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
  });
  $(".slider-component-album").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
  });
}
getArtists();

function redirectFunction(artist, type) {
  localStorage.setItem(type, artist);
  window.location.href = "/music-player/player/index.html";
}
