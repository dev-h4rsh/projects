const columns = 16;
const rows = 16;

const sequencer = document.getElementById("sequencer");
let sequence = Array(columns).fill().map(() => Array(rows).fill(false));
let isMouseDown = false;
let history = [];
let redoStack = [];

// ✅ Create sequencer grid
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const button = document.createElement("div");
        button.classList.add("note");
        button.dataset.row = row;
        button.dataset.col = col;
        button.style.pointerEvents = "auto";
        button.addEventListener("mousedown", () => toggleNote(row, col, button));
        button.addEventListener("mouseover", () => {
            if (isMouseDown) toggleNote(row, col, button);
        });
        sequencer.appendChild(button);
    }
}

document.addEventListener("mousedown", () => isMouseDown = true);
document.addEventListener("mouseup", () => isMouseDown = false);

function toggleNote(row, col, button) {
    history.push(JSON.stringify(sequence)); 
    redoStack = []; 
    sequence[col][row] = !sequence[col][row];
    button.classList.toggle("active");
}

function undo() {
    if (history.length > 0) {
        redoStack.push(JSON.stringify(sequence));
        sequence = JSON.parse(history.pop());
        updateUI();
    }
}

function redo() {
    if (redoStack.length > 0) {
        history.push(JSON.stringify(sequence));
        sequence = JSON.parse(redoStack.pop());
        updateUI();
    }
}

function updateUI() {
    document.querySelectorAll(".note").forEach(note => {
        let row = note.dataset.row;
        let col = note.dataset.col;
        note.classList.toggle("active", sequence[col]?.[row]);
    });
}

function clearSequence() {
    history.push(JSON.stringify(sequence));
    sequence = Array(columns).fill().map(() => Array(rows).fill(false));
    updateUI();
}

// ✅ Save sequence to selected slot
function saveSequence() {
    let slot = document.getElementById("save-slot").value;
    localStorage.setItem(slot, JSON.stringify(sequence));
    alert(`Sequence saved to ${slot}!`);
}

// ✅ Load sequence from selected slot
function loadSequence() {
    let slot = document.getElementById("save-slot").value;
    let savedData = localStorage.getItem(slot);
    
    if (savedData) {
        sequence = JSON.parse(savedData);
        updateUI();
        alert(`Sequence loaded from ${slot}!`);
    } else {
        alert("No saved sequence in this slot.");
    }
}

// ✅ Clear the selected slot
function clearSavedSequence() {
    let slot = document.getElementById("save-slot").value;
    localStorage.removeItem(slot);
    alert(`Sequence in ${slot} cleared!`);
}
