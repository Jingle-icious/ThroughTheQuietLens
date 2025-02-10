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

    // Change background if the user chooses "Be Honest"
    if (choice === "be_honest") {
        document.body.style.background = "url('Background_Color_NOSHADE.png') no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
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

// Ensure the game starts with the first scene
document.addEventListener('DOMContentLoaded', function () {
    makeChoice('first_day_dilemma');
});


document.addEventListener('DOMContentLoaded', function () {
    makeChoice('first_day_dilemma'); // Ensure game starts at the correct scene

    // Play background music
    const bgMusic = document.getElementById('background-music');
    
    // Ensure audio plays (Some browsers block autoplay, so we need a user interaction)
    function playMusic() {
        if (bgMusic.paused) {
            bgMusic.volume = 0.5; // Adjust volume if needed (0.0 to 1.0)
            bgMusic.play().catch(error => console.error("Audio play error:", error));
        }
    }

    // Play on user interaction (fixes autoplay issues on some browsers)
    document.body.addEventListener('click', playMusic, { once: true });

    // Also try playing music on load (in case autoplay is allowed)
    playMusic();
});

// Handle background music volume change
document.getElementById('bg-music-volume').oninput = function () {
    bgMusic.volume = this.value;
};

