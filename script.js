const colors = [
  '#fef08a', '#fca5a5', '#a5f3fc', '#c4b5fd', '#bbf7d0',
  '#fde68a', '#e9d5ff', '#fdba74', '#fcd34d', '#86efac'
];

// Save note to Supabase
async function saveNoteToDB(note) {
  const { error } = await supabaseClient
    .from("notes")
    .insert([note]);

  if (error) console.error("Error saving note:", error);
}

// Load notes from Supabase
async function loadNotesFromDB() {
  const { data, error } = await supabaseClient
    .from("notes")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading notes:", error);
    return;
  }

  data.forEach(noteData => {
    displayNote(noteData);
  });
}

// Display a note on the wall
function displayNote(noteData) {
  const wall = document.getElementById("wall");
  const newNote = document.createElement("div");
  newNote.className = "sticky-note";
  if (noteData.rotated) newNote.classList.add("rotated");
  newNote.innerText = noteData.text;

  // ✅ Ensure background color exists (fallback to random if missing)
  newNote.style.background = noteData.color || colors[Math.floor(Math.random() * colors.length)];

  // ✅ Allow auto-expanding height for long text
  newNote.style.minHeight = "150px";
  newNote.style.height = "auto";

  newNote.style.left = noteData.pos_x;
  newNote.style.top = noteData.pos_y;

  wall.appendChild(newNote);
}

// Add a new note
async function addNote() {
  const text = document.getElementById("userInput").value.trim();
  if (text !== "") {
    // Pick a random color every time
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNote = {
      text: text,
      color: randomColor,
      pos_x: Math.random() * (window.innerWidth - 220) + "px",
      pos_y: Math.random() * (window.innerHeight - 170) + "px",
      rotated: Math.random() > 0.5
    };

    // Show instantly
    displayNote(newNote);

    // Save to Supabase
    await saveNoteToDB(newNote);

    // Clear input
    document.getElementById("userInput").value = "";
  }
}

// Enter key support
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  });

  loadNotesFromDB();
});




