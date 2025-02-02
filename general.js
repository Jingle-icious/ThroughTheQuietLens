/* general.js */
const story = {
    first_day_dilemma: {
        text: "Sage arrives at the entrance of the academy. Her heart races as she sees students chatting in groups. She takes a deep breath, trying to steady herself.",
        choices: [
            { text: "Be Honest", next: "be_honest" },
            { text: "Fake Confidence", next: "fake_confidence" }
        ]
    }
};

function makeChoice(choice) {
    const scene = story[choice];
    document.getElementById('story-text').innerText = scene.text;
    
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    
    scene.choices.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('choice');
        button.innerText = option.text;
        button.onclick = () => makeChoice(option.next);
        choicesContainer.appendChild(button);
    });
}

document.getElementById('settings-btn').onclick = function() {
    document.getElementById('settings-modal').style.display = 'flex';
};

document.querySelector('.close-btn').onclick = function() {
    document.getElementById('settings-modal').style.display = 'none';
};

document.getElementById('text-size').onchange = function() {
    document.getElementById('story-text').style.fontSize = this.value;
};

document.getElementById('text-color').oninput = function() {
    document.getElementById('story-text').style.color = this.value;
};

document.getElementById('bg-opacity').oninput = function() {
    document.getElementById('game-container').style.background = `rgba(100, 100, 100, ${this.value})`;
};

document.getElementById('reset-btn').onclick = function() {
    document.getElementById('text-size').value = 'medium';
    document.getElementById('text-color').value = '#ffffff';
    document.getElementById('bg-opacity').value = '0.7';
    
    document.getElementById('story-text').style.fontSize = 'medium';
    document.getElementById('story-text').style.color = '#ffffff';
    document.getElementById('game-container').style.background = 'rgba(100, 100, 100, 0.7)';
};