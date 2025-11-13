import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Initialize Supabase
const SUPABASE_URL = "https://sjevsjchglepgctehvrr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXZzamNoZ2xlcGdjdGVodnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTIzMzIsImV4cCI6MjA3NzEyODMzMn0.UpDnIBBQHC3R65uOGtnIN_5jOr40Zs2lAfOEdY1J45A";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Quiz questions
const questions = [
  { q: "Amount of heat needed to raise 1 gram of a substance by 1 degree.", a: "specific heat capacity" },
  { q: "Measure of how fast particles in a substance are moving.", a: "temperature" },
  { q: "Flow of thermal energy from a hot object to a cooler one.", a: "heat" },
  { q: "Material that resists temperature changes when heat is added.", a: "thermal insulator" },
  { q: "Standard unit used to quantify thermal energy.", a: "joule" },
  { q: "Temperature at which a liquid becomes a gas.", a: "boiling point" },
  { q: "Heat transfer through direct contact of objects.", a: "conduction" },
  { q: "Tool used to determine the temperature of a substance.", a: "thermometer" },
  { q: "Energy absorbed or released as an object’s temperature changes.", a: "heat energy" },
  { q: "Temperature scale where water freezes at 0 and boils at 100.", a: "celsius" },
  { q: "Transfer of heat by movement of fluids.", a: "convection" },
  { q: "State when two objects reach the same temperature.", a: "thermal equilibrium" },
  { q: "Temperature unit frequently used in science calculations.", a: "kelvin" },
  { q: "Effect that makes cold objects feel warmer near hot ones.", a: "heat radiation" },
  { q: "Energy form that increases molecular motion in matter.", a: "thermal energy" }
];

let index = 0;
let score = 0;

// DOM elements
const questionText = document.querySelector(".actualQuestion");
const inputField = document.querySelector(".answerField input");
const sendButton = document.querySelector(".send");
const robotImg = document.querySelector(".roboPapa img");
const bgMusic = document.querySelector("audio");
const correctSound = new Audio("/Heat and Temperature/Musics/correctAns.mp3");
const wrongSound = new Audio("/Heat and Temperature/Musics/wrongAns.mp3");
const noAnsSound = new Audio("/Heat and Temperature/Musics/missingAns.mp3");

// --- Save score to Supabase ---
async function saveScore(finalScore) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.warn("User not authenticated! Skipping score save.");
      return; // Prevent using invalid UUID
    }

    const userId = user.id;

    // Check if row exists
    const { data: existing, error: fetchError } = await supabase
      .from("heatTemp_leaderboard")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching leaderboard:", fetchError.message);
      return;
    }

    if (!existing) {
      const { error: insertError } = await supabase
        .from("heatTemp_leaderboard")
        .insert([{ user_id: userId, score_quiz1: finalScore, score_quiz2: 0 }]);
      if (insertError) console.error("Error inserting leaderboard row:", insertError.message);
      else console.log("Leaderboard row created with Quiz 1 score!");
    } else if (finalScore > existing.score_quiz1) {
      const { error: updateError } = await supabase
        .from("heatTemp_leaderboard")
        .update({ score_quiz1: finalScore })
        .eq("user_id", userId);
      if (updateError) console.error("Error updating Quiz 1 score:", updateError.message);
      else console.log("Quiz 1 score updated successfully!");
    } else {
      console.log("New score is not higher. Score retained.");
    }
  } catch (err) {
    console.error("Unexpected error:", err.message);
  }
}

// --- Show current question ---
async function showQuestion() {
  if (index >= questions.length) {
    questionText.textContent = `Quiz Completed! Score: ${score}/${questions.length}`;
    inputField.disabled = true;
    await saveScore(score);
    return;
  }
  questionText.textContent = questions[index].q;
}

// --- Check answer ---
function checkAnswer() {
  if (index >= questions.length) return; // Prevent errors after quiz ends

  const userAnswer = inputField.value.trim().toLowerCase();
  const correctAnswer = questions[index].a.toLowerCase();
  const oldImg = robotImg.src;

  if (!userAnswer) {
    bgMusic.volume = 0;
    robotImg.src = "/Heat and Temperature/Images/noAnsBot.png";
    noAnsSound.play();
    setTimeout(() => { robotImg.src = oldImg; bgMusic.volume = 1; }, 2000);
    return;
  }

  bgMusic.volume = 0;

  if (userAnswer === correctAnswer) {
    score++;
    robotImg.src = "/Heat and Temperature/Images/correctBot.png";
    correctSound.play();
    setTimeout(() => { robotImg.src = oldImg; bgMusic.volume = 1; index++; showQuestion(); }, 2000);
  } else {
    robotImg.src = "/Heat and Temperature/Images/wrongBot.png";
    wrongSound.play();
    setTimeout(() => { robotImg.src = oldImg; bgMusic.volume = 1; index++; showQuestion(); }, 4100);
  }

  inputField.value = "";
}

// --- Event listeners ---
sendButton.addEventListener("click", checkAnswer);
inputField.addEventListener("keydown", e => { if (e.key === "Enter") checkAnswer(); });

// --- Start quiz ---
showQuestion();
