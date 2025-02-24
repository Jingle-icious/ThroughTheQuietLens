const story = {
    first_day_dilemma: {
        text: "Sage arrives at the entrance of the academy. Her heart races as she sees students chatting in groups. She takes a deep breath, trying to steady herself.",
        choices: [
            { text: "Be Honest", next: "be_honest" },
            { text: "Fake Confidence", next: "fake_confidence" }
        ]
    },
    be_honest: {
        text: "Sage decides to be honest with herself. She lets out a sigh and steps forward, prepared to face the day as she truly is.",
        choices: [{ text: "Continue", next: "next_scene" }]
    },
    fake_confidence: {
        text: "Sage puts on a confident smile, hiding her nervousness as she walks toward the entrance, determined to make a strong first impression.",
        choices: [{ text: "Continue", next: "next_scene" }]
    },
    next_scene: {
        text: "She steps into the academy, feeling a mix of emotions as she begins a new chapter of her life.",
        choices: []
    }
};

let isMuted = false;

document.addEventListener('DOMContentLoaded', function() {
    const titleScreen = document.getElementById('title-screen');
    const startButton = document.getElementById('start-button');
    const gameElements = document.querySelectorAll('body > *:not(#title-screen, #audio-control-btn, #settings-btn)');
    const audioControlBtn = document.getElementById('audio-control-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const bgMusic = document.getElementById('background-music');

    // Play music immediately
    playMusic();

    startButton.addEventListener('click', function() {
        titleScreen.style.display = 'none';
        gameElements.forEach(el => el.style.display = '');
        makeChoice('first_day_dilemma');
    });

    audioControlBtn.addEventListener('click', function() {
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        audioControlBtn.querySelector('img').src = isMuted ? 'Audio_Off_Icon.svg' : 'Audio_On_Icon.svg';
    });

    settingsBtn.addEventListener('click', function() {
        document.getElementById('settings-modal').style.display = 'flex';
    });

    function playMusic() {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(error => {
            console.error("Audio play error:", error);
            // Attempt to play on user interaction if autoplay is blocked
            document.addEventListener('click', () => bgMusic.play(), {once: true});
        });
    }

    // Ensure the game starts with the first scene when not on title screen
    if (titleScreen.style.display === 'none') {
        makeChoice('first_day_dilemma');
    }
});

function makeChoice(choice) {
    if (!story[choice]) {
        console.error(`Scene "${choice}" not found in story.`);
        return;
    }

    const scene = story[choice];

    // Update the story text
    document.getElementById('story-text').innerText = scene.text;

    // Update choices
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    scene.choices.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('choice');
        button.innerText = option.text;
        button.onclick = () => makeChoice(option.next);
        choicesContainer.appendChild(button);
    });

    // Ensure the foreground sprite appears when entering the first scene
    if (choice === "first_day_dilemma") {
        document.getElementById('foreground-image').style.display = 'block';
    }
}

// Settings Modal Functionality
document.getElementById('settings-btn').onclick = function () {
    document.getElementById('settings-modal').style.display = 'flex';
};

document.querySelector('.close-btn').onclick = function () {
    document.getElementById('settings-modal').style.display = 'none';
};

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
    document.getElementById('game-container').style.background = 'rgba(100, 100, 100, 0.7)';
};

// Handle background music volume change
document.getElementById('bg-music-volume').oninput = function () {
    document.getElementById('background-music').volume = this.value;
};
