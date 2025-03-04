let story;
let isMuted = false;

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

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

    // Fetch the story data from the JSON file
    fetch('./Capstone_Story.json')
        .then(response => response.json())
        .then(data => {
            console.log("JSON data loaded successfully");
            story = data.story; // Assign the story data
            // Now that the story is loaded, set up the game
            setupGame();
        })
        .catch(error => console.error('Error loading Capstone_Story.json:', error));

    function setupGame() {
        console.log("Setting up the game");
        bgMusic.src = "Audio/Quiet_Lens_Soundtrack_Option.wav";

        document.getElementById('blake-image').style.display = 'none';

        startButton.addEventListener('click', function () {
            console.log("Start button clicked");
            settingsModal.style.display = 'none';
            crossFade('Background_Images/Campus_WIP.png', () => {
                titleScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                makeChoice('campus_walk_1'); // Start with the first scene
            });
        });

        audioControlBtn.addEventListener('click', function () {
            console.log("Audio control button clicked");
            isMuted = !isMuted;
            bgMusic.muted = isMuted;
            audioControlBtn.querySelector('img').src = isMuted ? 'Icons/Audio_Off_Icon.svg' : 'Icons/Audio_On_Icon.svg';
        });

        settingsBtn.addEventListener('click', function () {
            console.log("Settings button clicked");
            settingsModal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function () {
            console.log("Close button clicked");
            settingsModal.style.display = 'none';
        });

        // Close modal if clicking outside
        window.addEventListener('click', function (event) {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });

        // Prevent closing when clicking inside the modal
        settingsModal.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', function () {
                console.log("Reset game button clicked");
                gameContainer.style.display = 'none';
                foregroundImage.style.display = 'none';
                titleScreen.style.display = 'flex';
                document.body.style.backgroundImage = "url('Background_Images/Title_Official.png')";
                makeChoice('campus_walk_1'); // Reset to the first scene
            });
        } else {
            console.error('Reset game button not found');
        }

        // Play music
        playMusic();
    }

    function playMusic() {
        bgMusic.volume = 0.5;
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
});

function crossFade(newBackgroundSrc, callback) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 1s ease-in-out';
    overlay.style.zIndex = '1000';
    document.body.appendChild(overlay);

    // Fade to black
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);

    // After fading to black, change the background and fade in
    setTimeout(() => {
        document.body.style.backgroundImage = `url('${newBackgroundSrc}')`;
        overlay.style.opacity = '0';
    }, 1100);

    // Remove overlay and execute callback
    setTimeout(() => {
        document.body.removeChild(overlay);
        if (callback) callback();
    }, 2100);
}

function makeChoice(choice) {
    if (!story[choice]) {
        console.error(`Scene "${choice}" not found in story.`);
        return;
    }

    const scene = story[choice];
    const currentBackground = document.body.style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
    const newBackground = scene.background;

    if (newBackground && newBackground !== currentBackground) {
        crossFade(newBackground, () => {
            updateSceneContent(scene);
        });
    } else {
        updateSceneContent(scene);
    }
}

function updateSceneContent(scene) {
    // Update the story text
    document.getElementById('story-text').innerHTML = scene.text;

    // Update choices
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    scene.choices.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('choice');
        button.innerText = option.text;
        button.onclick = () => makeChoice(option.next);
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

// Handle Blake's image
    const blakeImage = document.getElementById('blake-image');
    if (scene.blake) {
        blakeImage.src = scene.blake;
        blakeImage.style.display = 'block';

        // Force a reflow
        setTimeout(() => {
            blakeImage.style.opacity = 0.99; // Change opacity slightly
            setTimeout(() => {
                blakeImage.style.opacity = 1; // Reset opacity
            }, 10);
        }, 10);
    } else {
        blakeImage.style.display = 'none';
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


function positionNameBox() {
    const nameBox = document.getElementById('character-name-box');
    const gameContainer = document.getElementById('game-container');

    // Get the bounding rectangles of both elements
    const gameContainerRect = gameContainer.getBoundingClientRect();
    const nameBoxRect = nameBox.getBoundingClientRect();

    // Calculate the top position
    const topPosition = gameContainerRect.top - nameBoxRect.height - 10; // 10px spacing

    // Set the position using transform: translate()
    nameBox.style.transform = `translate(${gameContainerRect.left}px, ${topPosition}px)`;
}

// Call positionNameBox on window resize
window.addEventListener('resize', positionNameBox);

// Settings Adjustments
document.getElementById('text-size').onchange = function () {
    document.getElementById('story-text').style.fontSize = this.value;
};

document.getElementById('text-color').oninput = function () {
    document.getElementById('story-text').style.color = this.value;
};

document.getElementById('bg-opacity').oninput = function () {
    document.getElementById('game-container').style.background = `rgba(100, 100, 100, ${this.value})`;
};

// Reset Settings
document.getElementById('reset-btn').onclick = function () {
    document.getElementById('text-size').value = 'medium';
    document.getElementById('text-color').value = '#ffffff';
    document.getElementById('bg-opacity').value = '0.7';

    document.getElementById('story-text').style.fontSize = 'medium';
    document.getElementById('story-text').style.color = '#ffffff';
    document.getElementById('game-container').style.background = 'rgba(100, 100, 100, 0.7)'; // corrected to 100.
};

// Handle background music volume change
document.getElementById('bg-music-volume').oninput = function () {
    document.getElementById('background-music').volume = this.value;
};

function updateRange() {
    const sliders = document.querySelectorAll('input[type="range"]');

    sliders.forEach(slider => {
        const min = slider.min;
        const max = slider.max;
        const val = slider.value;

        slider.style.setProperty('--range-progress', (val - min) / (max - min) * 100 + '%');
    });
}

document.addEventListener('DOMContentLoaded', updateRange);
document.addEventListener('input', updateRange);