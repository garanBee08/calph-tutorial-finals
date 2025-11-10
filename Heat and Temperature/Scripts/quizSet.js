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

const questionText = document.querySelector(".actualQuestion");
const inputField = document.querySelector(".answerField input");
const sendButton = document.querySelector(".send");
const robotImg = document.querySelector(".roboPapa img");

const bgMusic = document.querySelector("audio");
const correctSound = new Audio("/Heat and Temperature/Musics/correctAns.mp3");
const wrongSound = new Audio("/Heat and Temperature/Musics/wrongAns.mp3");
const noAnsSound = new Audio("/Heat and Temperature/Musics/missingAns.mp3");

// Show current question
async function showQuestion() {
  if (index >= questions.length) {
    questionText.textContent = `Quiz Completed! Score: ${score}/${questions.length}`;
    inputField.disabled = true;

    // Store score in Supabase
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (user && user.user) {
      const userId = user.user.id;

      const { error } = await supabase
        .from('heatTemp_leaderboard')
        .insert([{ user_id: userId, score: score }]);

      if (error) {
        console.error("Error storing score:", error.message);
      } else {
        console.log("Score saved successfully!");
      }
    } else if(userError) {
      console.error("Error getting user:", userError.message);
    }

    return;
  }
  questionText.textContent = questions[index].q;
}

// Check user's answer
function checkAnswer() {
  const userAnswer = inputField.value.trim().toLowerCase();
  const correctAnswer = questions[index].a.toLowerCase();
  const oldImg = robotImg.src;

  // If input is empty
  if (userAnswer === "") {
    bgMusic.volume = 0;
    robotImg.src = "/Heat and Temperature/Images/noAnsBot.png";
    noAnsSound.play();

    setTimeout(() => {
      robotImg.src = oldImg;
      bgMusic.volume = 1;
    }, 2000);
    return; // Do not proceed
  }

  bgMusic.volume = 0;

  if (userAnswer === correctAnswer) {
    score++;
    robotImg.src = "/Heat and Temperature/Images/correctBot.png";
    correctSound.play();

    setTimeout(() => {
      robotImg.src = oldImg;
      bgMusic.volume = 1;
      index++;
      showQuestion();
    }, 2000);

  } else {
    robotImg.src = "/Heat and Temperature/Images/wrongBot.png";
    wrongSound.play();

    setTimeout(() => {
      robotImg.src = oldImg;
      bgMusic.volume = 1;
      index++;
      showQuestion();
    }, 4100);
  }

  inputField.value = "";
}

// Event listeners
sendButton.addEventListener("click", checkAnswer);
inputField.addEventListener("keydown", e => {
  if (e.key === "Enter") checkAnswer();
});

// Start quiz
showQuestion();
