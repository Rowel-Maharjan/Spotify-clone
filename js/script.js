let currentSong = new Audio;
let play = document.getElementById("playSong");
let shuffle = document.getElementById("shuffle");
let repeat = document.getElementById("repeat");
let index;
let isShuffle = false;
let isrepeat = false;
let previousNumber = [];
let volume = document.getElementById("Volume")
let songs;


function secondsToTime(seconds) {
    if (isNaN(seconds) || (seconds) < 0) {
        return "00:00";
    }
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
async function getSongs(folder) {
    // let a = await fetch(`http://127.0.0.1:5500/songs/${folder}`)
    let a = await fetch(`/songs/${folder}/`)
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
                // songsName.push(element.title.slice(0, -4));
                songsName.push(element.innerText.slice(0, -4))
                songs.push(element.href)
            }
        }
    }
    return { songsName: songsName, song: songs };
}

//To change the color of playlist songs
function changecolor(change) {
    if (0 <= change && change < songs.song.length) {
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(item => {
            item.style.backgroundColor = "";
        })
        document.querySelector(".songList").getElementsByTagName("li")[change].style.backgroundColor = "black";
    }
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
    <div class="music-infos">
        <div class="songName f-5">${songName}</div>
        <div class="songArtist f-2-light">${ArtistName}</div>
    </div>`
}

function loadPlaylist() {
    //Load Playlist
    let SongUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    SongUl.innerHTML = "";
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
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", element => {
            Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(item => {
                item.style.backgroundColor = "";
            })
            e.style.backgroundColor = "black";
            playMusic(songs.song[index], songs.songsName[index])
        })
    });
}

async function displayAlbums() {
    // let a = await fetch("http://127.0.0.1:5500/songs/")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    for (const key in as) {
        if (Object.hasOwnProperty.call(as, key)) {
            const element = as[key];
            if (element.href.includes("/songs") && !element.href.includes(".htaccess")) {
                // let folders = element.title;
                let folders = element.innerText.slice(0,);

                //Get the metadata of the folder
                // let a = await fetch(`http://127.0.0.1:5500/songs/${folders}/info.json`)
                let a = await fetch(`/songs/${folders}/info.json`)
                let response = await a.json();

                let cards = document.querySelector(".cardContainer")
                cards.insertAdjacentHTML("beforeend",
                    `<div data-folder="${folders}" class="card rounded flex-c">
                    <div data-folder="${folders}" class="play">
                        <img src="/images/playbutton.svg" alt="">
                    </div>
                    <img class="rounded-1" src="/songs/${folders}/cover.jpg" alt="">
                    <div class="f-1">${response.title}</div>
                    <div class="f-2-light">${response.description}</div>
                </div>`)
            }
        }
    }

    //Load the playlist when the card is clicked
    document.querySelectorAll(".card").forEach(item => {
        item.addEventListener("click", async event => {
            songs = await getSongs(event.currentTarget.dataset.folder);
            loadPlaylist();
            let currentPlay = document.querySelector(".music-infos").querySelector(".songName").innerText
            let songNames = Array.from(document.querySelector(".songList").getElementsByClassName("songName")).map(item => item.innerText)

            let index = songNames.indexOf(currentPlay);
            if (index != -1) {
                changecolor(index);
            }
            const hamburgerButton = document.querySelector(".hamburger");
            if (hamburgerButton) {
                hamburgerButton.click();
            }
        })
    })

    document.querySelectorAll(".play").forEach(item => {
        item.addEventListener("click", async event => {
            event.stopPropagation();
            songs = await getSongs(event.currentTarget.dataset.folder);
            loadPlaylist();
            document.querySelector(".songList").getElementsByTagName("li")[0].style.backgroundColor = "black";
            playMusic(songs.song[0], songs.songsName[0])
        })
    })

    document.querySelectorAll(".card").forEach(item => {
        item.addEventListener("click", e => {
            document.querySelectorAll(".card").forEach(item => {
                item.style.backgroundColor = "";
            })
            item.style.backgroundColor = "#232323";
        })
    })

}

async function main() {

    // Get the list of all Songs 
    songs = await getSongs("Arjit_Singh");
    playMusic(songs.song[0], songs.songsName[0], true);


    // Show all songs in the playlist
    loadPlaylist();

    displayAlbums();

    document.querySelector(".songList").getElementsByTagName("li")[0].style.backgroundColor = "black";


    // Attach event listener to play
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
            index = songs.song.indexOf(currentSong.src)
            if (isrepeat) {
                playMusic(songs.song[index], songs.songsName[index])
            }
            else if (isShuffle) {
                shuffling();
            }
            else {
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


    //For shuffle
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

    //For repeat
    document.getElementById("repeat").addEventListener("click", () => {
        if (isrepeat) {
            repeat.src = "/images/repeat.svg";
            isrepeat = false;
        }
        else {
            isrepeat = true;
            repeat.src = "/images/repeatclick.svg";
        }
    })

    //For spacebar
    document.addEventListener("keydown", (e) => {
        if (e.key == " ") {
            if (currentSong.paused) {
                currentSong.play();
                play.src = "/images/pause.svg"

            }
            else {
                currentSong.pause();
                play.src = "/images/playbutton.svg"
            }
        }
    })

    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowRight") {
            currentSong.currentTime += 10;
        }
    })
    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowLeft") {
            currentSong.currentTime -= 10;
        }
    })


    // For Volume 
    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowDown") {
            if (currentSong.volume < 0.1) {
                currentSong.volume = 0;
            }
            else {
                currentSong.volume -= 0.1;
            }
        }
    })
    document.addEventListener("keydown", (e) => {
        if (e.key == "ArrowUp") {
            if (currentSong.volume > 0.9) {
                currentSong.volume = 1
            }
            else {
                currentSong.volume += 0.1;
            }
        }
    })

    currentSong.volume = 0.4;

    document.querySelector(".forheights").addEventListener("click", e => {
        const forheights = document.querySelector(".forheights");
        if (!e.target.classList.contains('circles')) {

            // Calculate the percentage based on the width of .forheight
            let percent = (e.offsetX / forheights.getBoundingClientRect().width) * 75;
            document.querySelector(".circles").style.left = percent + "%";
            document.querySelector(".colors").style.width = percent + "%";
            currentSong.volume = percent / 80;

        }
    });
    currentSong.addEventListener("volumechange", () => {
        if (currentSong.volume == 0) {
            volume.src = "/images/mute.svg"
        }
        else if (currentSong.volume < 0.6) {
            volume.src = "images/volume_low.svg"
        }
        else {
            volume.src = "images/volume_high.svg"
        }
        document.querySelector(".circles").style.left = (currentSong.volume) * 100 + "%";

        document.querySelector(".colors").style.width = (currentSong.volume) * 100 + "%";
    })

    //Hover effect for volume bar
    document.querySelector(".forheights").addEventListener("mouseenter", () => {
        document.querySelector(".circles").style.height = "11px";
        document.querySelector(".colors").style.backgroundColor = "green";
    })

    document.querySelector(".forheights").addEventListener("mouseleave", () => {
        document.querySelector(".circles").style.height = "";
        document.querySelector(".colors").style.backgroundColor = "";
    })

    //Mute Volume
    let currentVolume = 0.4;
    document.getElementById("Volume").addEventListener("click", () => {
        if (currentSong.volume > 0) {
            currentVolume = currentSong.volume
            currentSong.volume = 0;
        }
        else {
            currentSong.volume = currentVolume;
        }
    })
}
main();

