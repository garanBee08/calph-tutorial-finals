import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://sjevsjchglepgctehvrr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZXZzamNoZ2xlcGdjdGVodnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTIzMzIsImV4cCI6MjA3NzEyODMzMn0.UpDnIBBQHC3R65uOGtnIN_5jOr40Zs2lAfOEdY1J45A";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== QUESTIONS ====================
const questions = [
    { q: "Water requires 41,860 J to heat from 20°C to 30°C.\nSpecific heat = 4186 J/kg°C\nFind mass.", a: ["1 kg","1kg","1"] },
    { q: "Convert 310 K to °C.", a: ["36.85°C","36.85 °C","36.85 C","36.85C","36.85"] },
    { q: "A steel rod initially 2.5 m long is heated by 50°C.\nCoefficient: 1.2 × 10⁻⁵ °C⁻¹\nFind ΔL.", a: ["0.0015 m","0.0015m"] },
    { q: "Convert 25°C to K.", a: ["298 K","298K", "298.15", "298", "298.15", "298.15K", "298.15 K"] },
    { q: "Brass rod expands 0.00144 m over 40°C.\nInitial length = 3 m.\nFind α.", a: ["1.2 × 10⁻⁵ °C⁻¹","1.2x10^-5","1.2 × 10⁻⁵","1.2x10^-5C^-1"] },
    { q: "Convert 98°F to °C.", a: ["36.67°C","36.67 °C","36.67C","36.67", "36.67 C"] },
    { q: "0.8 kg metal absorbs 12000 J, ΔT = 20°C.\nFind c.", a: ["750 J/kg°C","750J/kg°C","750 J/kgC","750J/kgC","750"] },
    { q: "Copper bar ΔL=0.009 m over 60°C.\nα = 1.7 × 10⁻⁵ °C⁻¹\nFind L₀.", a: ["8.82 m","8.82m","8.82"] },
    { q: "Convert 45°C to °F.", a: ["113°F","113F","113 °F","113"] },
    { q: "Metal sheet expands 0.00432 m.\nL₀ = 1.8 m, α = 1.2 × 10⁻⁵ °C⁻¹\nFind ΔT.", a: ["200°C","200 °C","200C","200"] }
];

let index = 0;
let score = 0;

// ==================== DOM Elements ====================
const questionText = document.querySelector(".actualQuestion");
const inputField = document.querySelector(".answerField input");
const sendButton = document.querySelector(".send");
const robotImg = document.querySelector(".roboPapa img");

const bgMusic = document.querySelector("audio");
const correctSound = new Audio("/Heat and Temperature/Musics/correctAns.mp3");
const wrongSound = new Audio("/Heat and Temperature/Musics/wrongAns.mp3");
const noAnsSound = new Audio("/Heat and Temperature/Musics/missingAns.mp3");

// ==================== SAVE SCORE TO SUPABASE ====================
async function saveScore(finalScore) {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.warn("User not authenticated! Skipping score save.");
            return;
        }

        const userId = user.id;

        // Check if a leaderboard row exists
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
            // Insert new row
            const { error: insertError } = await supabase
                .from("heatTemp_leaderboard")
                .insert([{ user_id: userId, score_quiz1: 0, score_quiz2: finalScore }]);
            if (insertError) console.error("Error inserting leaderboard row:", insertError.message);
            else console.log("Leaderboard row created with Quiz 2 score!");
        } else if (finalScore > existing.score_quiz2) {
            // Update only if new score is higher
            const { error: updateError } = await supabase
                .from("heatTemp_leaderboard")
                .update({ score_quiz2: finalScore })
                .eq("user_id", userId);
            if (updateError) console.error("Error updating Quiz 2 score:", updateError.message);
            else console.log("Quiz 2 score updated successfully!");
        } else {
            console.log("New score is not higher. Score retained:", existing.score_quiz2);
        }
    } catch (err) {
        console.error("Unexpected error:", err.message);
    }
}

// ==================== SHOW QUESTION ====================
async function showQuestion() {
    if (index >= questions.length) {
        questionText.textContent = `Quiz Completed! Score: ${score}/${questions.length}`;
        inputField.disabled = true;
        await saveScore(score);
        return;
    }
    questionText.textContent = questions[index].q;
}

// ==================== CHECK ANSWER ====================
function checkAnswer() {
    const userAnswer = inputField.value.trim().toLowerCase();
    const validAnswers = questions[index].a.map(a => a.toLowerCase());
    const oldImg = robotImg.src;

    if (!userAnswer) {
        bgMusic.volume = 0;
        robotImg.src = "/Heat and Temperature/Images/noAnsBot.png";
        noAnsSound.play();
        setTimeout(() => { robotImg.src = oldImg; bgMusic.volume = 1; }, 2000);
        return;
    }

    bgMusic.volume = 0;

    if (validAnswers.includes(userAnswer)) {
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

// ==================== EVENT LISTENERS ====================
sendButton.addEventListener("click", checkAnswer);
inputField.addEventListener("keydown", e => { if (e.key === "Enter") checkAnswer(); });

// ==================== START QUIZ ====================
showQuestion();
