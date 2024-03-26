let currentSong = new Audio;
let play = document.getElementById("playSong");
let shuffle = document.getElementById("shuffle")
let index
let isShuffle = false;
let previousNumber = []


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

//Get songs
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    // let a = await fetch("http://192.168.1.101:3000/songs/")
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
                // songsName.push(element.innerText.slice(0,-4))
                songs.push(element.href)
            }
        }
    }
    return { songsName: songsName, song: songs };
}

//To play songs that is in the track
const playMusic = (track, name, pause = false) => {
    currentSong.src = track;
    if (!pause) {
        currentSong.play();
        play.src = "/images/pause.svg"
    }

    let parts = name.split("-")
    let songName = parts[0];
    let ArtistName = parts[1];

    document.querySelector(".songinfo").innerHTML = `<img src="/images/music.svg" alt="">
    <div class="music-info">
        <div class="songName f-5">${songName}</div>
        <div class="songArtist f-2-light">${ArtistName}</div>
    </div>`
}

async function main() {
    // Get the list of all Songs 
    let songs = await getSongs();
    playMusic(songs.song[0], songs.songsName[0], true);

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
    document.querySelector(".songList").getElementsByTagName("li")[0].style.backgroundColor = "black";

    //To change the color of playlist songs
    function changecolor(change) {
        if (0 <= change && change < songs.song.length) {
            Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(item => {
                item.style.backgroundColor = "";
            })
            document.querySelector(".songList").getElementsByTagName("li")[change].style.backgroundColor = "black";
        }
    }

    // Attach event listener to each songs 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", element => {
            Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(item => {
                item.style.backgroundColor = "";
            })
            e.style.backgroundColor = "black";
            playMusic(songs.song[index], songs.songsName[index])
        })
    });

    // Attach event listener to play, next and Previous
    play.addEventListener("click", (element) => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/images/pause.svg"
        }

        else {
            currentSong.pause();
            play.src = "/images/playbutton.svg"
        }

    })

    function shuffling() {
        index = songs.song.indexOf(currentSong.src)
        previousNumber.push(index)
        if (previousNumber.length == songs.song.length) {
            previousNumber = []
        }
        getRandomNumber = () => {
            let randomNumber
            do {
                randomNumber = Math.floor(Math.random() * songs.song.length)
            } while (previousNumber.includes(randomNumber));
            return randomNumber;
        }
        let indexx = getRandomNumber();
        changecolor(indexx);
        playMusic(songs.song[indexx], songs.songsName[indexx]);
    }

    // Listen for timeupdate event 
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".passedTime").innerHTML = secondsToTime(currentSong.currentTime);
        document.querySelector(".totalDuration").innerHTML = secondsToTime(currentSong.duration);

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 99 + "%";

        document.querySelector(".color").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";

        //To play next song when current Time completes
        if (currentSong.currentTime == currentSong.duration) {
            if (isShuffle) {
                shuffling();
            }
            else {
                index = songs.song.indexOf(currentSong.src)
                changecolor(index + 1);
                if (index + 1 < songs.song.length) {
                    playMusic(songs.song[index + 1], songs.songsName[index + 1]);
                }
                if (index + 1 == songs.song.length) {
                    currentSong.pause();
                    play.src = "/images/playbutton.svg"
                }
            }
        }
    })

    
    document.getElementById("shuffle").addEventListener("click", () => {
        if (isShuffle) {
            shuffle.src = "/images/shuffle.svg";
            isShuffle = false;
        }
        else {
            isShuffle = true;
            shuffle.src = "/images/shuffleafter.svg";
        }
    })

    // Event Listener to seekbar
    document.querySelector(".forheight").addEventListener("click", e => {
        const forheight = document.querySelector(".forheight");
        if (!e.target.classList.contains('circle')) {

            // Calculate the percentage based on the width of .forheight
            let percent = (e.offsetX / forheight.getBoundingClientRect().width) * 98;
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = (percent * currentSong.duration) / 98;
        }
    });

    //Hover effect
    document.querySelector(".forheight").addEventListener("mouseenter", () => {
        document.querySelector(".circle").style.height = "11px";
        document.querySelector(".color").style.backgroundColor = "green";
    })

    document.querySelector(".forheight").addEventListener("mouseleave", () => {
        document.querySelector(".circle").style.height = "";
        document.querySelector(".color").style.backgroundColor = "";
    })

    //Hamburger effect
    document.querySelector(".nav").addEventListener("click", () => {
        document.querySelector(".left").style.left = "1%";
    })

    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    //For next songs
    next.addEventListener("click", () => {
        if (isShuffle) {
            shuffling();
        }
        else {
            index = songs.song.indexOf(currentSong.src)
            changecolor(index + 1);
            if (index + 1 < songs.song.length) {
                play.src = "/images/pause.svg"
                playMusic(songs.song[index + 1], songs.songsName[index + 1]);
            }
        }
    })

    //For previous songs
    previous.addEventListener("click", () => {
        if (isShuffle) {
            shuffling();
        }
        else {
            index = songs.song.indexOf(currentSong.src)
            changecolor(index - 1);
            if (index - 1 > -1) {
                playMusic(songs.song[index - 1], songs.songsName[index - 1]);
            }
        }
    })

}

main();
