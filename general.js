const story = {
    intro_1: {
        text: "Sage had made it through her first semester. Barely. Now, she was back—spring semester, her second ever—ready to face another round of assignments, tests, and deadlines. But instead of feeling more confident, more at ease, it all felt heavier. The campus around her seemed just as busy as before, but it felt foreign. The people bustling around her, chatting with friends and laughing, felt miles away. She didn't belong here—not in the way they did.",
        choices: [{ text: "Continue", next: "intro_2" }],
        background: "Campus_WIP.png"
    },
    intro_2: {
        text: "She had thought that after surviving her first semester, things would get easier. But the stress, the pressure, it hadn't let up. If anything, it had only intensified. The constant worry that she wasn't doing enough, that she wasn't meeting expectations—it gnawed at her every waking moment. Sage was already falling behind. Everyone else seemed so sure of themselves, so capable, and there she was, struggling to keep up. And it wasn't just the schoolwork. It was the feeling that no one truly understood. That no one knew how much she was holding inside.",
        choices: [{ text: "Continue", next: "next_scene" }]
    },
    next_scene: {
        text: "Next scene placeholder text.",
        choices: []
    }
};

let isMuted = false;

document.addEventListener('DOMContentLoaded', function() {
    const titleScreen = document.getElementById('title-screen');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const audioControlBtn = document.getElementById('audio-control-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const bgMusic = document.getElementById('background-music');

    // Play music immediately
    playMusic();

    startButton.addEventListener('click', function() {
        crossFade(titleScreen, 'Campus_WIP.png', () => {
            titleScreen.style.display = 'none';
            gameContainer.style.display = 'block';
            makeChoice('intro_1');
        });
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
            document.addEventListener('click', () => bgMusic.play(), {once: true});
        });
    }
});

function crossFade(elementToFadeOut, newBackgroundSrc, callback) {
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
        elementToFadeOut.style.opacity = '0';
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

    // Hide the foreground sprite for these narration scenes
    document.getElementById('foreground-image').style.display = 'none';

    // Change background if specified in the scene
    if (scene.background && choice !== 'intro_1') {
        crossFade(document.body, scene.background);
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
