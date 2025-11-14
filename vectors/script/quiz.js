import { supabase } from "./supabaseClient.js";

const quizButtons = document.querySelectorAll(".quiz-btn");
const modal = document.getElementById("quiz-modal");
const summaryModal = document.getElementById("summary-modal");
const closeSummaryBtn = document.getElementById("close-summary");
const autoCloseText = document.getElementById("auto-close-text");
const instructionsModal = document.getElementById("instructions-modal");
const beginQuizBtn = document.getElementById("begin-quiz");

const progress = document.getElementById("progress");
const timeEl = document.getElementById("time");
const questionCount = document.getElementById("question-count");
const nextBtn = document.getElementById("next-btn");
const quizContent = document.querySelector(".quiz-content");
const choicesContainer = document.querySelector(".choices");
const questionText = document.getElementById("question-text");
const totalEl = document.getElementById("total-ques");
const correctEl = document.getElementById("correct-count");
const wrongEl = document.getElementById("wrong-count");
const finalScoreEl = document.getElementById("final-score");
const instructionBackBtn = document.getElementById("instruction-back");


const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");

let currentQuestion = 0, totalQuestions = 0, score = 0, correct = 0, wrong = 0;
let timerInterval, startTime, questions = [], answered = false;
let selectedTable = null;

// Get modal elements
const quizBackBtn = document.getElementById("quiz-back");
const confirmExitModal = document.getElementById("confirm-exit-modal");
const confirmExitBtn = document.getElementById("confirm-exit");
const cancelExitBtn = document.getElementById("cancel-exit");

// When the back button is clicked, show confirm modal
quizBackBtn.addEventListener("click", () => {
  console.log("hello")
  confirmExitModal.classList.add("active");
});


// If user confirms exit
confirmExitBtn.addEventListener("click", async () => {
  confirmExitModal.classList.remove("active");

   try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const quizNumber = getQuizNumber(selectedTable);
      const { error } = await supabase
        .from("vectors_leaderboard")
        .upsert([
          {
            user_id: user.id,
            score: score,
            quiz_number: quizNumber,
            correct: correct,
            wrong: wrong
          }
        ]);

      if (error) {
        console.error("❌ Error saving score:", error);
      } else {
        console.log("✅ Score saved successfully!");
                  // 🧩 Update progress table
  try {
    const quizNumber = getQuizNumber(selectedTable);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Determine which table to update
      let progressTable = null;
      let quizColumn = null;

      if (selectedTable.startsWith("measurement")) {
        progressTable = "measurement_progress";
        quizColumn = quizNumber === 1 ? "quiz1" : "quiz2";
      } else if (selectedTable.startsWith("vectors")) {
        progressTable = "vectors_progress";
        quizColumn = quizNumber === 3 ? "quiz3" : "quiz4";
      }

      if (progressTable && quizColumn) {
        // ✅ Upsert progress (only one row per user)
        const { error: progressError } = await supabase
          .from(progressTable)
          .upsert([
            {
              user_id: user.id,
              [quizColumn]: true
            }
          ], { onConflict: "user_id" });

        if (progressError) {
          console.error("❌ Error updating progress:", progressError);
        } else {
          console.log(`✅ Marked ${quizColumn} = true in ${progressTable}`);
        }
      }
    }
  } catch (err) {
    console.error("Error updating quiz progress:", err);
  }
      }

      
    } else {
      console.warn("⚠️ No user logged in. Score not saved.");
    }
  } catch (err) {
    console.error("Error storing quiz score:", err);
  }

  // Close modals and reset quiz state
  document.getElementById("quiz-modal").classList.add("hidden");
  selectedTable = null;
});

// If user cancels exit
cancelExitBtn.addEventListener("click", () => {
  confirmExitModal.classList.remove("active");
});

instructionBackBtn.addEventListener("click", () => {
  instructionsModal.classList.add("hidden");
  selectedTable = null; // reset selected quiz
  quizButtons.forEach((b) => (b.disabled = false)); // allow re-selection
});

// function for quiz number
function getQuizNumber(tableName) {
  const mapping = {
    measurement_quiz1: 1,
    measurement_quiz2: 2,
    vectors_quiz3: 3,
    vectors_quiz4: 4
  };
  return mapping[tableName] || 0;
}


// Load quiz data
async function loadQuestions(tableName) {
  const { data, error } = await supabase.from(tableName).select("*");
  if (error) {
    console.error("❌ Error loading questions:", error);
    alert("Error loading quiz questions.");
    return;
  }
  if (!data || data.length === 0) {
    alert("No questions found!");
    return;
  }

  questions = data.sort(() => 0.5 - Math.random());
  totalQuestions = questions.length;
  startQuiz();
}

quizButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    selectedTable = btn.getAttribute("data-table");
    const quizNumber = getQuizNumber(selectedTable);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to take a quiz.");
        return;
      }

      // 🧠 Check if user already took this quiz
      const { data, error } = await supabase
        .from("vectors_leaderboard")
        .select("id")
        .eq("user_id", user.id)
        .eq("quiz_number", quizNumber)
        .maybeSingle();

      if (error) {
        console.error("Error checking quiz record:", error);
        alert("Something went wrong while checking your quiz data.");
        return;
      }

      // 🟢 Show instruction modal
      instructionsModal.classList.remove("hidden");

      // ⚠️ If user already took the quiz, warn them
      const container = instructionsModal.querySelector(".quiz-container");
      let warningMsg = container.querySelector(".retake-warning");

      if (!warningMsg) {
        warningMsg = document.createElement("p");
        warningMsg.classList.add("retake-warning");
        warningMsg.style.color = "red";
        warningMsg.style.marginTop = "15px";
        container.appendChild(warningMsg);
      }

      if (data) {
        warningMsg.innerHTML = "⚠️ You have already taken this quiz. Your score will not be recorded.";
      } else {
        warningMsg.innerHTML = "";
      }

      // Save this info for later when submitting
      instructionsModal.dataset.retake = data ? "true" : "false";
    } catch (err) {
      console.error("Error verifying quiz status:", err);
    }
  });
});



function startQuiz() {
  currentQuestion = 0;
  score = 0;
  correct = 0;
  wrong = 0;
  progress.style.width = "0%";
  showQuestionWithDelay();
}

beginQuizBtn.addEventListener("click", async () => {
  if (!selectedTable) {
    alert("No quiz selected!");
    return;
  }
  instructionsModal.classList.add("hidden");
  modal.classList.remove("hidden");
  await loadQuestions(selectedTable);
});



// Show question with fade delay
function showQuestionWithDelay() {
  const q = questions[currentQuestion];
  if (!q) return;

  answered = false;
  nextBtn.disabled = true;
  nextBtn.classList.remove("visible");
  nextBtn.textContent = currentQuestion === totalQuestions - 1 ? "Finish" : "Next";

  // Fade out current question + choices
  questionText.classList.remove("visible");
  choicesContainer.classList.remove("visible");

  // Wait for fade-out before changing content
  setTimeout(() => {
    // Update question text
    questionText.textContent = q.question;
    questionText.classList.add("visible");

    // Clear and rebuild choices
    choicesContainer.innerHTML = "";
    const options = [q.option1, q.option2, q.option3, q.correct]
      .filter(Boolean)
      .sort(() => Math.random() - 0.5);

    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.classList.add("choice");
      btn.textContent = option;
      btn.addEventListener("click", () => handleAnswer(btn, q.correct));
      choicesContainer.appendChild(btn);
    });

    // Fade in choices
    setTimeout(() => {
      choicesContainer.classList.add("visible");
      startTimer();
    }, 1500); // fade-in delay after new content
  }, 600); // wait for fade-out to complete before switching question

  // Update progress
  questionCount.textContent = `Question ${currentQuestion + 1} out of ${totalQuestions}`;
  progress.style.width = `${((currentQuestion + 1) / totalQuestions) * 100}%`;
}


function handleAnswer(btn, correctAnswer) {
  if (answered) return;
  answered = true;
  stopTimer();

  const elapsedTime = (performance.now() - startTime) / 1000;
  const timeBonus = Math.max(0, 10 - elapsedTime);
  const isCorrect = btn.textContent === correctAnswer;

  document.querySelectorAll(".choice").forEach((b) => (b.disabled = true));

  if (isCorrect) {
    const gained = 10 + Math.ceil(timeBonus);
    score += gained;
    correct++;
    btn.classList.add("correct");
    soundCorrect.currentTime = 0;
    soundCorrect.play();
    showPointsIndicator(gained);
  } else {
    wrong++;
    btn.classList.add("wrong");
    soundWrong.currentTime = 0;
    soundWrong.play();
    document.querySelectorAll(".choice").forEach((b) => {
      if (b.textContent === correctAnswer) b.classList.add("correct");
    });
  }

  setTimeout(() => {
    nextBtn.disabled = false;
    nextBtn.classList.add("visible");
  }, 1000);
}

nextBtn.addEventListener("click", () => {
  if (!answered) return;

  currentQuestion++;
  if (currentQuestion >= totalQuestions) showSummary();
  else { resetTimer(); showQuestionWithDelay(); }
});

async function showSummary() {
    // Only save if not retaking
    const isRetake = instructionsModal.dataset.retake === "true";
    if (!isRetake) {
                // Only save if not retaking
        const isRetake = instructionsModal.dataset.retake === "true";
        if (!isRetake) {
        // existing supabase upsert logic here ✅
        } else {
        console.log("Retake detected — score not recorded.");
        }

    } else {
    console.log("Retake detected — score not recorded.");
    }

  modal.classList.add("hidden");
  summaryModal.classList.remove("hidden");

  totalEl.textContent = totalQuestions;
  correctEl.textContent = correct;
  wrongEl.textContent = wrong;
  finalScoreEl.textContent = `+${score} points`;

  // 🧠 Save score to Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const quizNumber = getQuizNumber(selectedTable);
      const { error } = await supabase
        .from("vectors_leaderboard")
        .upsert([
          {
            user_id: user.id,
            score: score,
            quiz_number: quizNumber,
            correct: correct,
            wrong: wrong
          }
        ]);

      if (error) {
        console.error("❌ Error saving score:", error);
      } else {
        console.log("✅ Score saved successfully!");

          // 🧩 Update progress table
  try {
    const quizNumber = getQuizNumber(selectedTable);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Determine which table to update
      let progressTable = null;
      let quizColumn = null;

      if (selectedTable.startsWith("measurement")) {
        progressTable = "measurement_progress";
        quizColumn = quizNumber === 1 ? "quiz1" : "quiz2";
      } else if (selectedTable.startsWith("vectors")) {
        progressTable = "vectors_progress";
        quizColumn = quizNumber === 3 ? "quiz3" : "quiz4";
      }

      if (progressTable && quizColumn) {
        // ✅ Upsert progress (only one row per user)
        const { error: progressError } = await supabase
          .from(progressTable)
          .upsert([
            {
              user_id: user.id,
              [quizColumn]: true
            }
          ], { onConflict: "user_id" });

        if (progressError) {
          console.error("❌ Error updating progress:", progressError);
        } else {
          console.log(`✅ Marked ${quizColumn} = true in ${progressTable}`);
        }
      }
    }
  } catch (err) {
    console.error("Error updating quiz progress:", err);
  }


      }
    } else {
      console.warn("⚠️ No user logged in. Score not saved.");
    }
  } catch (err) {
    console.error("Error storing quiz score:", err);
  }

  // Auto-close after 10 seconds
  let countdown = 10;
  autoCloseText.textContent = `Closing in ${countdown}...`;

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      autoCloseText.textContent = `Closing in ${countdown}...`;
    } else {
      clearInterval(interval);
      closeSummary();
    }
  }, 1000);
}


// Manual close button
closeSummaryBtn.addEventListener("click", closeSummary);

function closeSummary() {
  summaryModal.classList.add("hidden");
  quizButtons.forEach((b) => (b.disabled = false));
}

// Floating points indicator
function showPointsIndicator(points) {
  const indicator = document.createElement("div");
  indicator.classList.add("points-float");
  indicator.textContent = `+${points} pts`;
  quizContent.appendChild(indicator);
  setTimeout(() => indicator.remove(), 1000);
}

// Timer
function startTimer() { startTime = performance.now(); timerInterval = setInterval(updateTimeDisplay, 10); }
function stopTimer() { clearInterval(timerInterval); }
function resetTimer() { stopTimer(); timeEl.textContent = "0.00"; }
function updateTimeDisplay() {
  const elapsed = (performance.now() - startTime) / 1000;
  timeEl.textContent = elapsed.toFixed(2);
}