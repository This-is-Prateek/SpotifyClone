let currentSong = new Audio();
let currfolder = "My_Songs";
let songs = [];
let vol = 100;

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/music/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1].split(".")[0]);
        }
    }
    let musicUL = document.querySelector(".music").getElementsByTagName("ul")[0];
    musicUL.innerHTML = "";
    for (const song of songs) {
        musicUL.innerHTML = musicUL.innerHTML + `<li>
                                <img class="invert" src="img/music.svg" alt="music">
                                <div class="songinfo">
                                    <div class="songname">${song.split("-")[0].replaceAll("%20", " ")}</div>
                                    <div class="artistname">${song.split("-")[1].replaceAll("%20", " ")}</div>
                                </div>
                                <div class="songplay">
                                    <div class="playnow">Play Now</div>
                                    <img class="invert" src="img/play.svg" alt="play">
                                </div>
                            </li> `;
    };

    Array.from(document.querySelector(".music").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            playMusic((e.querySelector(".songinfo").firstElementChild.innerHTML+"-"+e.querySelector(".songinfo").lastElementChild.innerHTML).trim());
            console.log((e.querySelector(".songinfo").firstElementChild.innerHTML+"-"+e.querySelector(".songinfo").lastElementChild.innerHTML).trim());
        });
        e.addEventListener("mouseover", element=>{
            e.querySelector(".songplay").style.visibility = "visible";
        });
        e.addEventListener("mouseleave", element=>{
            e.querySelector(".songplay").style.visibility = "hidden";
        });
        
    });
    return songs;
}

const playMusic = (track)=>{
    currentSong.src = `/music/${currfolder}/`+track+".mp3";
    currentSong.play();
    play.src = "img/pause.svg";
    document.querySelector(".songinfoplaybar").innerHTML = track;
}

function formatSecondsToMMSS(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60); // Get the integral part
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayfolder(){
    let a = await fetch("http://127.0.0.1:5500/music");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let playlistcards = document.querySelector(".playlistcards");
    let array = Array.from(anchors);
    for(let index= 0; index<array.length; index++){
        const e = array[index];
        if(e.href.includes("music/")){
            let folder = e.href.split("music/")[1];
            let a = await fetch(`http://127.0.0.1:5500/music/${folder}/info.json`);
            let response = await a.json();
            playlistcards.innerHTML = playlistcards.innerHTML + `<div class="card" data-playlist = "${folder}">
                                    <div class="play">
                                        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
                                            class="Svg-sc-ytk21e-0 bneLcE">
                                            <path
                                                d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="coverimg">
                                        <img src="/music/${folder}/cover.jpg"
                                            alt=${response.title}>
                                    </div>
                                    <span>${response.title}</span>
                                    <span>${response.description}</span>
                                </div>
            `
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" , async (a)=>{
            songs = await getSongs(a.currentTarget.getAttribute("data-playlist"));
            playMusic(songs[0].replaceAll("%20" , " "));
        })
    })
}

    
async function main() {
    await getSongs(currfolder);
    currentSong.src = `/music/${currfolder}/`+songs[0]+".mp3";
    
    displayfolder();

    play.addEventListener("click" , ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "img/pause.svg";
            document.querySelector(".songinfoplaybar").innerHTML = currentSong.src.split(`${currfolder}/`)[1].split(".mp3")[0].replaceAll("%20"," ");
        }
        else{
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate" , ()=>{
        document.querySelector(".songtime").innerHTML = `${formatSecondsToMMSS(currentSong.currentTime)}/${formatSecondsToMMSS(currentSong.duration)}`;
        let circlemovement = (currentSong.currentTime/currentSong.duration)*100;
        document.querySelector(".circle").style.left = circlemovement + "%";
    })

    document.querySelector(".seekbar").addEventListener("click" , e=>{
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
        currentSong.currentTime = (e.offsetX/e.target.getBoundingClientRect().width)*currentSong.duration;
    })

    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-100%";
    })

    document.querySelector(".content").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-100%";
    })

    previous.addEventListener("click" , ()=>{
        let index = songs.indexOf(currentSong.src.split(`${currfolder}/`)[1].split(".")[0]);
        let previousTrack;
        if(index!=0){
            previousTrack = songs[--index].replaceAll("%20" , " ");
        }
        else{
            previousTrack = songs[songs.length-1].replaceAll("%20" , " ");
        }
        playMusic(previousTrack);
    })

    next.addEventListener("click" , ()=>{
        let index = songs.indexOf(currentSong.src.split(`${currfolder}/`)[1].split(".")[0]);
        let nextTrack;
        if(index<songs.length-1){
            nextTrack = songs[++index].replaceAll("%20" , " ");
        }
        else{
            nextTrack = songs[0].replaceAll("%20" , " ");
        }
        playMusic(nextTrack);
    })

    document.querySelector(".vol").getElementsByTagName("img")[0].addEventListener("click" , ()=>{
        if(currentSong.muted){
            document.querySelector(".vol").getElementsByTagName("img")[0].src = "img/volume.svg";
            currentSong.muted = false;
            document.querySelector(".vol").getElementsByTagName("input")[0].value = vol;
        }
        else{
            document.querySelector(".vol").getElementsByTagName("img")[0].src = "img/mute.svg";
            vol = document.querySelector(".vol").getElementsByTagName("input")[0].value;
            currentSong.muted = true; 
            document.querySelector(".vol").getElementsByTagName("input")[0].value = 0;
        }
    })

    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
        let change = e.target.value/100;
        currentSong.volume = change;
    })

    
}

main();
