async function getSongs(){
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
            console.log(element)
            if (element.href.endsWith(".mp3")|| element.href.endsWith(".m4a")){
                songsName.push(element.title.slice(0,-4));
                songs.push(element.href)
            }
        }
    }
    return {songsName : songsName,songs : songs};
}

async function main(){
    let songs = await getSongs();
    let SongUl= document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs.songsName) {
        SongUl.insertAdjacentHTML("afterbegin",`<li class = "flex">
        <img src="/images/music.svg" alt="">
        <div class="music-info flex-c">
            <div class="songName f-5">${song}</div>
            <div class="songArtist f-2-light">Rowel Maharjan</div>
        </div>
    </li>`)
    }


    let audio = new Audio(songs.songs[2]);
    console.log(audio)
    // audio.play();
    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration,audio.currentSrc,audio.currentTime);
      });
}    

main();
