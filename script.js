
let currentSong = new Audio;

function secondsToTime(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    var minutesString = minutes < 10 ? '0' + minutes : minutes;
    var secondsString = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Concatenate minutes and seconds with a colon
    return minutesString + ':' + secondsString;
}

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

const playMusic = (track,name,pause = false)=>{
    currentSong.src = track;
    if(!pause){
        currentSong.play();
    }

    // Listen for timeupdate event 
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".passedTime").innerHTML= secondsToTime(currentSong.currentTime);
        document.querySelector(".totalDuration").innerHTML= secondsToTime(currentSong.duration);

        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*98 + "%";
    })

    let parts = name.split("-")
    let songName = parts[0];
    let ArtistName = parts[1];

    document.querySelector(".songinfo").innerHTML = `<img src="/images/music.svg" alt="">
    <div class="music-info flex-c">
        <div class="songName f-5">${songName}</div>
        <div class="songArtist f-2-light">${ArtistName}</div>
    </div>`
}

async function main() {
    // Get the list of all Songs 
    let songs = await getSongs();
    playMusic(songs.songs[0],songs.songsName[0],true);
    
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

    // Attach event listener to each songs 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e,index)=>{
        e.addEventListener("click",element=>{
            play.src = "/images/pause.svg"; 
            playMusic(songs.songs[index], songs.songsName[index])
        });
    });

    // Attach event listener to play, next and Previous
    let play = document.getElementById("playSong");
    play.addEventListener("click",(element)=>{
        if (currentSong.paused){
            currentSong.play();
            play.src = "/images/pause.svg"
        }

        else{
            currentSong.pause();
            play.src = "/images/playbutton.svg"
        }

    })

    document.querySelector(".forheight").addEventListener("click",e=>{
        
    })
}

main();
