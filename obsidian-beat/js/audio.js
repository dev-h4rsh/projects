const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const notes = [
    261.63,  // C4
    277.18,  // C#4/Db4
    293.66,  // D4
    311.13,  // D#4/Eb4
    329.63,  // E4
    349.23,  // F4
    369.99,  // F#4/Gb4
    392.00,  // G4
    415.30,  // G#4/Ab4
    440.00,  // A4
    466.16,  // A#4/Bb4
    493.88,  // B4
    523.25,  // C5
    587.33,  // D5  
    659.25,  // E5
    698.46,  // F5  
];
let isPlaying = false;
let intervalID = null;
let isLooping = false;



document.addEventListener("click", () => {
    if (audioContext.state === "suspended") {
        audioContext.resume().then(() => console.log("🔊 AudioContext Resumed"));
    }
}, { once: true });

function playSequence() {
    if (isPlaying) return;
    isPlaying = true;

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    let bpm = document.getElementById("bpm").value || 120;
    let interval = (60 / bpm) * 1000;
    let volume = document.getElementById("volume").value;

    const stepWidth = document.querySelector(".note")?.offsetWidth || 60; // ✅ Ensure correct note width
    const totalSteps = sequence.length;
    const sequencerWidth = stepWidth * totalSteps; // ✅ Ensure playhead covers full width

    startTime = performance.now();
    let lastStep = -1; // ✅ Track last played step to avoid skipping

    function animatePlayhead(timestamp) {
        if (!isPlaying) return;

        let elapsed = timestamp - startTime;
        let preciseStep = (elapsed / interval) % totalSteps; // ✅ Smooth fractional step position
        let currentStep = Math.floor(preciseStep); // ✅ Convert to actual step index

        let playhead = document.querySelector(".playhead");
        if (!playhead) {
            playhead = document.createElement("div");
            playhead.classList.add("playhead");
            document.getElementById("sequencer").appendChild(playhead);
        }

        // ✅ Move playhead smoothly across the full grid
        let playheadPosition = (preciseStep / (totalSteps - 1)) * sequencerWidth;
        playhead.style.transform = `translateX(${playheadPosition.toFixed(2)}px)`;

        // ✅ Ensure sound plays at each new step
        if (currentStep !== lastStep) {
            lastStep = currentStep; // ✅ Update last played step

            sequence[currentStep]?.forEach((isActive, rowIndex) => {
                if (isActive) {
                    playSound(notes[rowIndex], volume);
                }
            });
        }

        requestAnimationFrame(animatePlayhead);
    }

    requestAnimationFrame(animatePlayhead);
}


function stopSequence() {
    clearInterval(intervalID);
    isPlaying = false;
    document.querySelectorAll(".playhead").forEach(el => el.remove());
}

function playSound(frequency, volume) {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // ✅ Get selected instrument type
    let instrument = document.getElementById("instrument")?.value || "default";

    // ✅ Apply different waveforms based on instrument choice
    switch (instrument) {
        case "piano":
            oscillator.type = "sine";
            break;
        case "synth":
            oscillator.type = "sawtooth";
            break;
        case "bass":
            oscillator.type = "square";
            break;
        default:
            oscillator.type = document.getElementById("waveform")?.value || "square";
            break;
    }

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

function toggleLoop() {
    isLooping = !isLooping;
}

function exportWAV() {a
    alert("Exporting as WAV is not implemented yet!");
}
