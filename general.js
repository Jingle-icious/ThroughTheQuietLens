let story;
let isMuted = false;
const npcs = ['npc1', 'npc2', 'blake-image', 'sharma-image'];
let sfxVolume = 0.75;
let currentBackgroundMusic; // Variable to store the current background music

function playSfx(audioFile) {
    const sfx = new Audio(audioFile);
    sfx.volume = sfxVolume;
    sfx.play().then(() => {
        console.log("Playing sound:", audioFile);
    }).catch(error => {
        console.error("Error playing sound:", audioFile, error);
    });
}

function scaleBody(aspectRatio) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let newWidth, newHeight;

    if (windowWidth / windowHeight > aspectRatio) {
        newHeight = windowHeight;
        newWidth = windowHeight * aspectRatio;
    } else {
        newWidth = windowWidth;
        newHeight = windowWidth / aspectRatio;
    }

    const outerContainer = document.getElementById('outer-container');

    document.body.style.width = `${newWidth}px`;
    document.body.style.height = `${newHeight}px`;
    outerContainer.style.width = `${newWidth}px`;
    outerContainer.style.height = `${newHeight}px`;
}

scaleBody(16 / 9);

window.addEventListener('resize', () => {
    scaleBody(16 / 9);
});

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const outerContainer = document.getElementById('outer-container');
    const titleScreen = document.getElementById('title-screen');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const audioControlBtn = document.getElementById('audio-control-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const bgMusic = document.getElementById('background-music');
    const resetGameBtn = document.getElementById('reset-game-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const foregroundImage = document.getElementById('foreground-image');

    const disclaimerPopup = document.getElementById('disclaimer-popup');
    const disclaimerAcceptButton = document.getElementById('disclaimer-accept-button');

    const overlay = document.createElement('div');
    overlay.id = 'disclaimer-popup-overlay';
    outerContainer.appendChild(overlay);

    disclaimerAcceptButton.addEventListener('click', function () {
        disclaimerPopup.style.display = 'none';
        overlay.style.display = 'none';
        startButton.style.display = 'block';
        outerContainer.removeChild(overlay);
    });

    fetch('./Capstone_Story.json')
        .then(response => response.json())
        .then(data => {
            console.log("JSON data loaded successfully");
            story = data.story;
            setupGame();
        })
        .catch(error => console.error('Error loading Capstone_Story.json:', error));

    function setupGame() {
        console.log("Setting up the game");
        bgMusic.src = "Audio/Quiet_Lens_Soundtrack_Option.wav";
        bgMusic.loop = true;

        document.getElementById('blake-image').style.display = 'none';

        startButton.addEventListener('click', function () {
            console.log("Start button clicked");
            playSfx("Audio/Startfx.mp3");
            settingsModal.style.display = 'none';
            crossFade('Background_Images/Campus_Main.png', () => {
                titleScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                makeChoice('campus_walk_1');
                bgMusic.pause();
                bgMusic.currentTime = 0;
            });
        });

        audioControlBtn.addEventListener('click', function () {
            console.log("Audio control button clicked");
            isMuted = !isMuted;
            bgMusic.muted = isMuted;
            if (currentBackgroundMusic) {
                currentBackgroundMusic.muted = isMuted;
            }
            audioControlBtn.querySelector('img').src = isMuted ? 'Icons/Audio_Off_Icon.svg' : 'Icons/Audio_On_Icon.svg';
        });

        settingsBtn.addEventListener('click', function () {
            console.log("Settings button clicked");
            playSfx("Audio/Settingsfx.mp3");
            settingsModal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function () {
            console.log("Close button clicked");
            settingsModal.style.display = 'none';
        });

        window.addEventListener('click', function (event) {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });

        settingsModal.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        playMusic();
    }

    const storyNavBtn = document.getElementById('story-nav-btn');
    const navModal = document.getElementById('nav-modal');
    const navCloseBtn = navModal.querySelector('.close-btn');
    const navTitleScreenBtn = document.getElementById('nav-title-screen');
    const navAct1Btn = document.getElementById('nav-act1');
    const navAct2Btn = document.getElementById('nav-act2');
    const navAct3Btn = document.getElementById('nav-act3');

    storyNavBtn.addEventListener('click', () => {
        playSfx("Audio/Settingsfx.mp3");
        navModal.style.display = 'block';
    });

    navCloseBtn.addEventListener('click', () => {
        navModal.style.display = 'none';
        playSfx("Audio/clickfx2.mp3");
    });

    function navigateTo(section) {
        playSfx("Audio/Navigationfx.mp3");
        if (section === 'Title Screen') {
            titleScreen.style.display = 'flex';
            gameContainer.style.display = 'none';
            foregroundImage.style.display = 'none';
            const outerContainer = document.getElementById('outer-container');
            outerContainer.style.backgroundImage = "url('Background_Images/Title_Official.png')";
            bgMusic.src = "Audio/Quiet_Lens_Soundtrack_Option.wav";
            bgMusic.loop = true;
            bgMusic.play();
        } else if (section === 'Act 1 Start' || section === 'Act 2 Start' || section === 'Act 3 Start') {
            makeChoice(section === 'Act 1 Start' ? 'campus_walk_1' : section === 'Act 2 Start' ? 'dream_seq_transition' : 'dorm_finalProj_1');
            titleScreen.style.display = 'none';
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
        navModal.style.display = 'none';
    }

    navTitleScreenBtn.addEventListener('click', () => navigateTo('Title Screen'));
    navAct1Btn.addEventListener('click', () => navigateTo('Act 1 Start'));
    navAct2Btn.addEventListener('click', () => navigateTo('Act 2 Start'));
    navAct3Btn.addEventListener('click', () => navigateTo('Act 3 Start'));

    function playMusic() {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(error => {
            console.error("Audio play error:", error);
            console.log("Attempting to play audio on user interaction");
            document.addEventListener('click', () => {
                bgMusic.play().catch(retryError => {
                    console.error("Second audio play attempt failed:", retryError);
                });
            }, { once: true });
        });
    }

    document.getElementById('sfx-volume').addEventListener('input', function () {
        sfxVolume = parseFloat(this.value);
        this.style.setProperty('--range-progress', `${sfxVolume * 100}%`);
    });

    document.getElementById('text-size').addEventListener('change', function () {
        playSfx("Audio/clickfx2.mp3");
        const fontSize = this.value === 'small' ? '1em' : this.value === 'large' ? '1.6em' : '1.3em';
        document.getElementById('story-text').style.fontSize = fontSize;
    });

    // Set initial progress bar style for Text Box Opacity
    const initialOpacity = document.getElementById('bg-opacity').value;
    document.getElementById('bg-opacity').style.setProperty('--range-progress', `${initialOpacity * 100}%`);

    document.getElementById('bg-opacity').addEventListener('input', function () {
        const opacity = this.value;
        document.getElementById('game-container').style.backgroundColor = `rgba(50, 50, 50, ${opacity})`;
        this.style.setProperty('--range-progress', `${opacity * 100}%`);
    });

   // Set initial progress bar style for music volume
   const initialMusicVolume = document.getElementById('bg-music-volume').value;
   document.getElementById('bg-music-volume').style.setProperty('--range-progress', `${initialMusicVolume * 100}%`);

   document.getElementById('bg-music-volume').addEventListener('input', function () {
       const volume = parseFloat(this.value);
       bgMusic.volume = volume;
       this.style.setProperty('--range-progress', `${volume * 100}%`);
   });

    // Reset Settings
    document.getElementById('reset-btn').addEventListener('click', function () {
        playSfx("Audio/clickfx2.mp3");
        document.getElementById('text-size').value = 'medium';
        document.getElementById('bg-opacity').value = '0.8';
        document.getElementById('bg-music-volume').value = '0.5';
        document.getElementById('sfx-volume').value = '0.75';

        document.getElementById('story-text').style.fontSize = '1.3em';
        document.getElementById('story-text').style.color = '#ffffff';
        document.getElementById('game-container').style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
        document.getElementById('background-music').volume = '0.5';

        document.getElementById('bg-opacity').style.setProperty('--range-progress', '80%');
        document.getElementById('bg-music-volume').style.setProperty('--range-progress', '50%');
        document.getElementById('sfx-volume').style.setProperty('--range-progress', '75%');
    });

    // Close Modal(s)
    document.getElementById('settings-modal').querySelector('.close-btn').addEventListener('click', function () {
        playSfx("Audio/clickfx2.mp3");
        document.getElementById('settings-modal').style.display = 'none';
    });

    document.getElementById('nav-modal').querySelector('.close-btn').addEventListener('click', function () {
        playSfx("Audio/clickfx2.mp3");
        document.getElementById('nav-modal').style.display = 'none';
    });
});

function crossFade(newBackgroundSrc, callback) {
    const outerContainer = document.getElementById('outer-container');
    document.getElementById('foreground-image').style.display = 'none';
    npcs.forEach(npc => document.getElementById(npc).style.display = 'none');

    outerContainer.classList.add('hidden');

    setTimeout(() => {
        outerContainer.classList.remove('hidden');
        outerContainer.classList.add('visible');
        outerContainer.style.backgroundImage = `url('${newBackgroundSrc}')`;
        if (callback) callback();
    }, 1000);
}

// Choice making logic and Audio for scenes
function makeChoice(choice) {
    if (!story[choice]) {
        console.error(`Scene "${choice}" not found in story.`);
        return;
    }

    const scene = story[choice];
    const outerContainer = document.getElementById('outer-container');
    const currentBackground = outerContainer.style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
    const newBackground = scene.background;
    
    if (newBackground && newBackground !== currentBackground) {
        crossFade(newBackground, () => {
            updateSceneContent(scene);
            // Check for art images
            if (newBackground === 'Background_Images/StressArt.png') {
                playBackgroundMusic('Audio/Stressed_Drawing_Loop.mp3');
            } else if (newBackground === 'Background_Images/HappyArt.png') {
                playBackgroundMusic('Audio/Happy_Drawing_Loop.mp3');
            } else if (newBackground === 'Background_Images/Dream1.png' ||
                newBackground === 'Background_Images/Dream1_banner.png' ||
                newBackground === 'Background_Images/Dream1_Tent.png' ||
                newBackground === 'Background_Images/Dream_Eatery_Main.png' ||
                newBackground === 'Background_Images/Dream_Ferris_Main.png' ||
                newBackground === 'Background_Images/Dream_PerfContest_Main.png' ||
                newBackground === 'Background_Images/Dream_Pie_Main.png') {
                playBackgroundMusic('Audio/Dream_Carnival_Song.mp3');
            } else if (newBackground === 'Background_Images/Classroom_WIP.png') {
                playBackgroundMusic('Audio/Mentor_Song.mp3');
            } else if (newBackground === 'Background_Images/Dorm_Main.png' ||
                newBackground === 'Background_Images/Dorm_Sage_Sleeping.png' ||
                newBackground === 'Background_Images/Dorm_Sage_Sitting.png' ||
                newBackground === 'Background_Images/Lobby_Main.png') {
                playBackgroundMusic('Audio/Dorm_Room_Loop.mp3');
            } else if (newBackground === 'Background_Images/Campus_Main.png') {
                playBackgroundMusic('Audio/Outside_Loop.mp3');
            } else {
                stopBackgroundMusic();
            }
        });
    } else {
        updateSceneContent(scene);
        // Check for art images
        if (newBackground === 'Background_Images/StressArt.png') {
                playBackgroundMusic('Audio/Stressed_Drawing_Loop.mp3');
            } else if (newBackground === 'Background_Images/HappyArt.png') {
                playBackgroundMusic('Audio/Happy_Drawing_Loop.mp3');
            } else if (newBackground === 'Background_Images/Dream1.png' ||
                newBackground === 'Background_Images/Dream1_banner.png' ||
                newBackground === 'Background_Images/Dream1_Tent.png' ||
                newBackground === 'Background_Images/Dream_Eatery_Main.png' ||
                newBackground === 'Background_Images/Dream_Ferris_Main.png' ||
                newBackground === 'Background_Images/Dream_PerfContest_Main.png' ||
                newBackground === 'Background_Images/Dream_Pie_Main.png') {
            playBackgroundMusic('Audio/Dream_Carnival_Song.mp3');
        } else if (newBackground === 'Background_Images/Classroom_WIP.png') {
            playBackgroundMusic('Audio/Mentor_Song.mp3');
        } else if (newBackground === 'Background_Images/Dorm_Main.png' ||
            newBackground === 'Background_Images/Dorm_Sage_Sleeping.png' ||
            newBackground === 'Background_Images/Dorm_Sage_Sitting.png' ||
            newBackground === 'Background_Images/Lobby_Main.png') {
            playBackgroundMusic('Audio/Dorm_Room_Loop.mp3');
        } else if (newBackground === 'Background_Images/Campus_Main.png') {
            playBackgroundMusic('Audio/Outside_Loop.mp3');
        } else {
            stopBackgroundMusic();
        }
    }
}

function playBackgroundMusic(audioFile) {
    if (!currentBackgroundMusic || currentBackgroundMusic.src.includes(audioFile) === false) { // Check if the music is already playing
        if (currentBackgroundMusic) {
            currentBackgroundMusic.pause();
        }
        currentBackgroundMusic = new Audio(audioFile);
        currentBackgroundMusic.loop = true;
        currentBackgroundMusic.volume = 0.5; // Adjust volume as needed
        currentBackgroundMusic.muted = isMuted; // Set muted state
        currentBackgroundMusic.play().catch(error => {
            console.error("Error playing background music:", error);
        });
    }
}

function stopBackgroundMusic() {
    if (currentBackgroundMusic) {
        currentBackgroundMusic.pause();
        currentBackgroundMusic = null;
    }
}

function updateSceneContent(scene) {
    // Set text container visible
    document.getElementById('game-container').style.display = 'block';

    // Update the story text
    document.getElementById('story-text').innerHTML = scene.text;

    // Update choices
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    scene.choices.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('choice');
        button.innerText = option.text;
        button.onclick = () =>  {
          // Play sound effects based on the option text
          if (option.text === "Continue") {
            playSfx("Audio/Continuefx.mp3");
          } else {
            playSfx("Audio/Choicefx.mp3");
          }
          makeChoice(option.next);
        }
        choicesContainer.appendChild(button);
    });


    // Handle sprite
    const foregroundImage = document.getElementById('foreground-image');
    if (scene.sprite) {
        foregroundImage.src = scene.sprite;
        foregroundImage.style.display = 'block';
    } else {
        foregroundImage.style.display = 'none';
    }

    // Update Blake's image
    const npcBlake = document.getElementById('blake-image');
    if (scene.npcBlake) {
        npcBlake.src = scene.npcBlake;
        npcBlake.style.display = 'block';
    } else {
        npcBlake.style.display = 'none';
    }

    // Update Sharma's image
    const npcSharma = document.getElementById('sharma-image');
    if (scene.npcSharma) {
        npcSharma.src = scene.npcSharma;
        npcSharma.style.display = 'block';
    } else {
        npcSharma.style.display = 'none';
    }

    // Handle NPCs
    const npc1 = document.getElementById('npc1');
    const npc2 = document.getElementById('npc2');

    if (scene.npc1 && scene.npc2) {
        npc1.src = scene.npc1;
        npc2.src = scene.npc2;
        npc1.style.display = 'block';
        npc2.style.display = 'block';
    } else {
        npc1.style.display = 'none';
        npc2.style.display = 'none';
    }

    // Update the Sages image

    const imposterSage = document.getElementById('imposter-image');
    if (scene.imposterSage) {
        imposterSage.src = scene.imposterSage;
        imposterSage.style.display = 'block';
    } else {
        imposterSage.style.display = 'none';
    }

    const perfectionistSage = document.getElementById('perfectionist-image');
    if (scene.perfectionistSage) {
        perfectionistSage.src = scene.perfectionistSage;
        perfectionistSage.style.display = 'block';
    } else {
        perfectionistSage.style.display = 'none';
    }

    const pleaserSage = document.getElementById('pleaser-image');
    if (scene.pleaserSage) {
        pleaserSage.src = scene.pleaserSage;
        pleaserSage.style.display = 'block';
    } else {
        pleaserSage.style.display = 'none';
    }

    const antiSocialSage = document.getElementById('antiSocial-image');
    if (scene.antiSocialSage) {
        antiSocialSage.src = scene.antiSocialSage;
        antiSocialSage.style.display = 'block';
    } else {
        antiSocialSage.style.display = 'none';
    }

    // Handle hover effect for Sages (Added here)
    if (scene.imposterSage) {
        imposterSage.addEventListener('mouseover', () => {
            imposterSage.src = 'Sage_Images/SageVar6_imposter_bubble.png';
            playSfx("Audio/Imposter_Sound.mp3");
        });
        imposterSage.addEventListener('mouseout', () => {
            imposterSage.src = scene.imposterSage;
        });
    }

    if (scene.perfectionistSage) {
        perfectionistSage.addEventListener('mouseover', () => {
            perfectionistSage.src = 'Sage_Images/SageVar5_perfectionist_bubble.png';
            playSfx("Audio/Perfect_Sound.mp3");
        });
        perfectionistSage.addEventListener('mouseout', () => {
            perfectionistSage.src = scene.perfectionistSage;
        });
    }

    if (scene.pleaserSage) {
        pleaserSage.addEventListener('mouseover', () => {
            pleaserSage.src = 'Sage_Images/SageVar7_Pleaser_bubble.png';
        });
        pleaserSage.addEventListener('mouseout', () => {
            pleaserSage.src = scene.pleaserSage;
        });
    }

    if (scene.antiSocialSage) {
        antiSocialSage.addEventListener
        antiSocialSage.addEventListener('mouseover', () => {
            antiSocialSage.src = 'Sage_Images/SageVar4_antisocial_bubble.png';
        });
        antiSocialSage.addEventListener('mouseout', () => {
            antiSocialSage.src = scene.antiSocialSage;
        });
    }

    // Handle character name box
    const nameBox = document.getElementById('character-name-box');
    const text = scene.text;

    console.log("Scene text:", text);
    console.log("Name box:", nameBox);

    if (scene.speaker) {
        nameBox.innerText = scene.speaker;
        nameBox.style.display = "block";
    } else if (text.startsWith("<em>")) {
        nameBox.innerText = "Sage";
        nameBox.style.display = "block";
        console.log("Name box display: block, name:", nameBox.innerText);
    } else {
        nameBox.style.display = "none";
        console.log("Name box display: none");
    }

    // Calculate and set the position of the character name box
    positionNameBox();
}

// Logic to position the name box correctly
function positionNameBox() {
    const nameBox = document.getElementById('character-name-box');
    const gameContainer = document.getElementById('game-container');

    // This gets bounding elements of both rectangles
    const gameContainerRect = gameContainer.getBoundingClientRect();
    const nameBoxRect = nameBox.getBoundingClientRect();

    // This calculates the top position
    const topPosition = gameContainerRect.top - nameBoxRect.height - 10;

    // This sets the position using transform: translate()
    nameBox.style.transform = `translate(${gameContainerRect.left}px, ${topPosition}px)`;
}

// Call positionNameBox on window resize
window.addEventListener('resize', positionNameBox);