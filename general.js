const story = {
    first_day_dilemma: {
        text: "Sage arrives at the entrance of the academy. Her heart races as she sees students chatting in groups. She takes a deep breath, trying to steady herself.",
        choices: [
            { text: "Be Honest", next: "be_honest" },
            { text: "Fake Confidence", next: "fake_confidence" }
        ]
    },
    be_honest: {
        text: "Sage admits her worries to a fellow student. 'Honestly, I'm kind of nervous,' she says. The student smiles, 'Me too. First days are tough, but we'll get through it.'",
        choices: [{ text: "Continue", next: "mentor_advice" }]
    },
    fake_confidence: {
        text: "Sage straightens her back and puts on a confident smile. 'I got this,' she whispers to herself, even as her hands tremble slightly.",
        choices: [{ text: "Continue", next: "mentor_advice" }]
    },
    mentor_advice: {
        text: "Later that day, Sage meets her assigned mentor, a wise and patient instructor. 'First days can be overwhelming,' the mentor says, 'but trust in yourself. You're here for a reason.'",
        choices: [
            { text: "Trust Mentor", next: "trust_mentor" },
            { text: "Distance Herself", next: "distance_herself" }
        ]
    },
    trust_mentor: {
        text: "Sage nods, taking the mentor's words to heart. She feels a bit more reassured, knowing she has someone to rely on.",
        choices: [{ text: "Continue", next: "end_act1" }]
    },
    distance_herself: {
        text: "Sage politely listens but keeps her guard up. She's not sure she can fully trust anyone yet.",
        choices: [{ text: "Continue", next: "end_act1" }]
    },
    end_act1: {
        text: "As the day ends, Sage reflects on her choices and prepares for what lies ahead.",
        choices: [{ text: "To Be Continued...", next: null }]
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