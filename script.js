const playlistContainer = document.getElementById("playlist-songs");
const shuffleButton = document.getElementById("shuffle");
const playButton = document.getElementById("play");
const backButton = document.getElementById("back");
const nextButton = document.getElementById("next");
const playerTitle = document.getElementById("player-song-title");
const playerArtist = document.getElementById("player-song-artist");
const audioPlayer = new Audio();
let isPlaying = false;
let currentSongIndex = null;
let songHistory = [];

const allSongs = [
    {
      id: 0,
      title: "Scratching The Surface",
      artist: "Quincy Larson",
      duration: "4:25",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
    },
    {
      id: 1,
      title: "Can't Stay Down",
      artist: "Quincy Larson",
      duration: "4:15",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
    },
    {
      id: 2,
      title: "Still Learning",
      artist: "Quincy Larson",
      duration: "3:51",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
    },
    {
      id: 3,
      title: "Cruising for a Musing",
      artist: "Quincy Larson",
      duration: "3:34",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
    },
    {
      id: 4,
      title: "Never Not Favored",
      artist: "Quincy Larson",
      duration: "3:35",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
    },
    {
      id: 5,
      title: "From the Ground Up",
      artist: "Quincy Larson",
      duration: "3:12",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
    },
    {
      id: 6,
      title: "Walking on Air",
      artist: "Quincy Larson",
      duration: "3:25",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
    },
    {
      id: 7,
      title: "Can't Stop Me. Can't Even Slow Me Down.",
      artist: "Quincy Larson",
      duration: "3:52",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
    },
    {
      id: 8,
      title: "The Surest Way Out is Through",
      artist: "Quincy Larson",
      duration: "3:10",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
    },
    {
      id: 9,
      title: "Chasing That Feeling",
      artist: "Quincy Larson",
      duration: "2:43",
      src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
    },
  ];

const displayPlaylist = () => {
    playlistContainer.innerHTML = "";

    allSongs.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.classList.add("song-item");

        const songName = document.createElement("span");
        songName.classList.add("song-name");
        songName.textContent = song.title;

        const songArtist = document.createElement("span");
        songArtist.classList.add("song-artist");
        songArtist.textContent = song.artist;

        const songDuration = document.createElement("span");
        songDuration.classList.add("song-duration");
        songDuration.textContent = song.duration;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        songItem.appendChild(songName);
        songItem.appendChild(songArtist);
        songItem.appendChild(songDuration);
        songItem.appendChild(deleteButton);

        songItem.addEventListener("click", () => {
            handleSongSelection(index, songItem);
        });

        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            allSongs.splice(index, 1);
            songItem.remove();
            if (currentSongIndex === index) {
                currentSongIndex = null;
                audioPlayer.pause();
            }
        });

        playlistContainer.appendChild(songItem);
    });
};

const handleSongSelection = (index, songItem) => {
    const allSongItems = playlistContainer.querySelectorAll(".song-item");
    allSongItems.forEach(item => item.classList.remove("selected"));
    songItem.classList.add("selected");

    if (currentSongIndex !== null) {
        songHistory.push(currentSongIndex);
    }
    currentSongIndex = index;
    playSong(allSongs[currentSongIndex]);
};

const shuffleSongs = () => {
    // Save the currently selected song's ID
    const currentSongId = currentSongIndex !== null ? allSongs[currentSongIndex].id : null;

    // Shuffle the playlist
    for (let i = allSongs.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allSongs[j], allSongs[i]] = [allSongs[i], allSongs[j]];
    }

    // Redisplay the playlist
    displayPlaylist();

    // Find and re-select the current song in the shuffled list
    if (currentSongId !== null) {
        const newIndex = allSongs.findIndex(song => song.id === currentSongId);
        currentSongIndex = newIndex;  // Update the index to the new location
        const selectedSongItem = playlistContainer.querySelectorAll(".song-item")[newIndex];
        if (selectedSongItem) {
            selectedSongItem.classList.add("selected");
        }
    }
};


const playSong = (song) => {
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    audioPlayer.src = song.src;
    audioPlayer.play();
    togglePlayPause(true);
    isPlaying = true;
};

const togglePlayPause = (forcePlayPause = false) => {
    const playPauseIcon = document.getElementById("play-pause-icon");

    // If no song has been selected yet, start with the first song
    if (currentSongIndex === null) {
        currentSongIndex = 0;  // Set to the first song
        playSong(allSongs[currentSongIndex]);  // Play the first song
        updateSelection(allSongs[currentSongIndex]);  // Update selection in the playlist
        return;
    }

    // Continue with play/pause toggling if a song is already selected
    if (!isPlaying || forcePlayPause) {
        audioPlayer.play();
        isPlaying = true;
        playPauseIcon.classList.remove("fa-play");
        playPauseIcon.classList.add("fa-pause");
    } else {
        audioPlayer.pause();
        isPlaying = false;
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
    }
};


const backSongClick = () => {
    if (currentSongIndex === 0) {
        // Wrap to the last song
        currentSongIndex = allSongs.length - 1;
    } else if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        return; // No song to play if currentSongIndex is null or undefined
    }

    songHistory.push(currentSongIndex);
    playSong(allSongs[currentSongIndex]);
    updateSelection(allSongs[currentSongIndex]);
};

const nextSongClick = () => {
    if (currentSongIndex === allSongs.length - 1) {
        // Wrap to the first song
        currentSongIndex = 0;
    } else if (currentSongIndex < allSongs.length - 1) {
        currentSongIndex++;
    } else {
        return; // No song to play if currentSongIndex is null or undefined
    }

    songHistory.push(currentSongIndex);
    playSong(allSongs[currentSongIndex]);
    updateSelection(allSongs[currentSongIndex]);
};

const updateSelection = (song) => {
    const allSongItems = playlistContainer.querySelectorAll(".song-item");
    allSongItems.forEach(item => item.classList.remove("selected"));
    const selectedSongItem = Array.from(allSongItems).find(
        item => item.querySelector(".song-name").textContent === song.title
    );
    if (selectedSongItem) selectedSongItem.classList.add("selected");
};

playButton.addEventListener("click", () => {
    togglePlayPause();
});

backButton.addEventListener("click", backSongClick);

nextButton.addEventListener("click", nextSongClick);

shuffleButton.addEventListener("click", shuffleSongs);

// Initialize playlist display
displayPlaylist();
