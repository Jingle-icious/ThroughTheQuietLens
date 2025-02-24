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
        text: "The lobby is filled with students rushing in and out, some chatting in groups, others heading up the stairs to their rooms. There's a bulletin board with colorful flyers, announcements about clubs and events, and a desk with a student worker. Sage approaches the elevator, her gaze a little lower as she walks past the people around her.",
        choices: [
            { text: "Stay Silent", next: "stay_silent" },
            { text: "Greet the Student", next: "greet_student" }
        ],
        sprite: "SageVar1_frown.png"
    },
    stay_silent: {
        text: "The sounds around her blur into background noise as Sage steps into the elevator. She presses the button for her floor, her reflection in the glass doors staring back at her. The weight of everything—the stress, the self-doubt—seems heavier now. She takes a deep breath, trying to calm her racing thoughts.",
        choices: [{ text: "Continue", next: "dorm_scene" }],
        sprite: "Sage_OFFICIAL.png"
    },
    greet_student: {
        text: "Sage offers a weak smile to a passing student, their brief exchange barely enough to make her feel less isolated. The student gives a distracted wave in return, and Sage's gaze quickly shifts back to the floor. The moment passes, and Sage steps into the elevator alone.",
        choices: [{ text: "Continue", next: "dorm_scene" }],
        sprite: "Sage_OFFICIAL.png"
    },
    dorm_scene: {
        text: "The elevator dings as it reaches the floor, and Sage steps out into the hall. Her room is a few doors down, and she makes her way to it, unlocking the door. It creaks open, and she steps inside. The room is small, but familiar—her bed is unmade, textbooks are scattered on her desk, and a few empty coffee cups line the windowsill. The soft glow of the afternoon sun filters through the window, casting long shadows across the room.",
        choices: [],
        background: "Dorm_WIP.png",
        sprite: "Sage_OFFICIAL.png"
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
        crossFade('Campus_WIP.png', () => {
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
    const currentBackground = document.body.style.backgroundImage;
    const newBackground = scene.background ? `url('${scene.background}')` : currentBackground;

    if (newBackground !== currentBackground) {
        crossFade(scene.background, () => {
            updateSceneContent(scene);
        });
    } else {
        updateSceneContent(scene);
    }
}

function updateSceneContent(scene) {
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

    // Handle sprite
    const foregroundImage = document.getElementById('foreground-image');
    if (scene.sprite) {
        foregroundImage.src = scene.sprite;
        foregroundImage.style.display = 'block';
    } else {
        foregroundImage.style.display = 'none';
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

document.getElementById('reset-game-btn').addEventListener('click', function() {
    // Reset game state
    // Hide game container
    document.getElementById('game-container').style.display = 'none';
    // Show title screen
    document.getElementById('title-screen').style.display = 'flex';
    // Reset background to title screen
    document.body.style.backgroundImage = "url('Title_Official.png')";
    // Hide Sage's sprite if it's visible
    document.getElementById('foreground-image').style.display = 'none';
    // Reset any other game state variables you might have
});

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


