
let currentSong = new Audio;

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songsName = [];
    let songs = []
    for (const key in as) {
        if (Object.hasOwnProperty.call(as, key)) {
            const element = as[key];
            if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
                songsName.push(element.title.slice(0, -4));
                songs.push(element.href)
            }
        }
    }
    return { songsName: songsName, songs: songs };
}

const playMusic = (track)=>{
    currentSong.src = track;
    currentSong.play();
}

async function main() {
    // Get the list of all Songs 
    let songs = await getSongs();

    // Show all songs in the playlist
    let SongUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs.songsName) {
        let parts = song.split("-")
        let songName = parts[0];
        let ArtistName = parts[1];
        SongUl.insertAdjacentHTML("beforeend", `<li class = "flex">
        <img src="/images/music.svg" alt="">
        <div class="music-info flex-c">
            <div class="songName f-5">${songName}</div>
            <div class="songArtist f-2-light">${ArtistName}</div>
        </div></li>`)
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e,index)=>{
        e.addEventListener("click",element=>{
            playMusic(songs.songs[index])
        });
    });
}

main();
