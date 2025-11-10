const chatbotQueries = {
    help: `Available commands:
🔍 Basic Concepts:
- heat: Learn about heat energy
- temperature: Understand temperature
- transfer: Heat transfer mechanisms
- conversion: Temperature conversion help


🧪 Learning Tools:
- experiment: Simple heat experiments
- quiz: Take a heat & temperature quiz
- simulate: Run virtual experiments


🛠️ Practical Help:
- calculate: Temperature calculations
- convert: Quick temperature converter
- safety: Heat safety guidelines


📚 Additional Resources:
- examples: Real-world examples
- facts: Interesting heat facts
- history: History of thermodynamics
- careers: Related career paths


💡 Study Tips:
- study: Study strategies
- practice: Practice problems
- visualize: Visual learning aids


Type any command or ask a question!`,
   
    heat: `Heat is a form of energy that flows between objects due to temperature differences. Key points:
1. Measured in Joules (J) or calories (cal)
2. Always flows from hot to cold
3. Can change temperature or state of matter`,
   
    temperature: `Temperature measures the average kinetic energy of particles in a substance. Important scales:
- Celsius (°C): Water freezes 0°C, boils 100°C
- Fahrenheit (°F): Water freezes 32°F, boils 212°F
- Kelvin (K): Absolute scale, 0K = -273.15°C`,
   
    transfer: `Heat transfers through three mechanisms:
1. Conduction: Direct contact (e.g., touching hot pan)
2. Convection: Fluid movement (e.g., hot air rising)
3. Radiation: Electromagnetic waves (e.g., sunlight)`,
   
    conversion: `To convert between temperature scales:
°F = (°C × 9/5) + 32
°C = (°F - 32) × 5/9
K = °C + 273.15`,
   
    experiment: `Try these simple heat experiments:
1. Ice melting rates in different conditions
2. Water boiling observation
3. Heat conduction through different materials
4. Solar heating demonstration`,
   
    safety: `Heat safety guidelines:
1. Use protective gear when handling hot objects
2. Never leave heat sources unattended
3. Keep flammable materials away
4. Know emergency procedures`,
   
    calculate: `I can help with temperature calculations:
1. Converting between scales
2. Heat energy transfer
3. Specific heat capacity
Just ask your question!`,
   
    examples: `Real-world heat transfer examples:
1. Cooking: All three mechanisms in action
2. Home heating systems
3. Car engine cooling
4. Solar water heaters`,


    quizQuestions: [
        {
            q: "What is the primary difference between heat and temperature?",
            hint: "Think about energy transfer vs. measurement..."
        },
        {
            q: "Name the three mechanisms of heat transfer.",
            hint: "One involves direct contact, another fluid movement..."
        },
        {
            q: "What unit is used to measure temperature in the Kelvin scale?",
            hint: "It's named after the scientist who proposed it..."
        },
        {
            q: "Why does metal feel colder than wood at room temperature?",
            hint: "Think about thermal conductivity..."
        },
        {
            q: "What happens to most materials when they are heated?",
            hint: "Think about size and volume..."
        },
        {
            q: "What is the difference between conduction and convection?",
            hint: "One requires a fluid, the other doesn't..."
        },
        {
            q: "What is thermal equilibrium?",
            hint: "Think about what happens when hot and cold objects meet..."
        },
        {
            q: "How does a thermos keep hot things hot and cold things cold?",
            hint: "Think about heat transfer prevention..."
        }
    ],


    quiz: function() {
        const randomIndex = Math.floor(Math.random() * this.quizQuestions.length);
        const question = this.quizQuestions[randomIndex];
        return `🎓 Quiz Time!\n\nQuestion: ${question.q}\n\nNeed a hint? Type 'hint'!\nReady for the answer? Type 'answer'!`;
    },


    hint: function() {
        return `💡 Hint: ${this.quizQuestions[this.currentQuestionIndex]?.hint || "Try asking for a new quiz question first by typing 'quiz'!"}`;
    },


    currentQuestionIndex: 0,


    simulations: [
        {
            title: "Thermal Expansion Simulation",
            description: "Watch how different materials expand when heated. Compare metals, liquids, and gases.",
            interaction: "🔍 Observe: Metal bridge expands in summer, contracts in winter.\n📊 Data: Steel expands by about 0.001% per degree Celsius!"
        },
        {
            title: "Phase Change Visualization",
            description: "See how molecules behave during melting, freezing, evaporation, and condensation.",
            interaction: "🧊 Example: Ice melting process\n📈 Energy remains constant during phase change!"
        },
        {
            title: "Heat Flow Direction Demo",
            description: "Interactive demonstration of heat flowing from hot to cold regions.",
            interaction: "🌡️ Try: Put a hot spoon in cold water\n⚡ Heat always flows from hot to cold!"
        },
        {
            title: "Temperature Equilibrium",
            description: "Watch how objects of different temperatures reach thermal equilibrium.",
            interaction: "🔥 Example: Hot coffee in room temperature\n⏱️ Rate depends on temperature difference!"
        },
        {
            title: "Convection Currents",
            description: "Visualize how fluids move when heated from below.",
            interaction: "🌊 Like: Hot air rising above a radiator\n♨️ Creates circular flow patterns!"
        },
        {
            title: "Radiation Heat Transfer",
            description: "See how heat travels through space without a medium.",
            interaction: "☀️ Example: Feeling the sun's warmth\n📡 Travels at speed of light!"
        }
    ],


    simulate: function() {
        const randomIndex = Math.floor(Math.random() * this.simulations.length);
        const sim = this.simulations[randomIndex];
        return `🔬 Virtual Lab: ${sim.title}\n\n${sim.description}\n\n${sim.interaction}\n\nType 'simulate' again for another experiment!`;
    },


    // Array of facts that we'll randomly select from
    factsList: [
        "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA.",
        "Absolute zero (-273.15°C) is the lowest possible temperature in the universe.",
        "The Sun's surface temperature is about 5,500°C, but its core is around 15 million°C!",
        "A lightning bolt can reach temperatures of 30,000°C, five times hotter than the Sun's surface!",
        "The human body generates about 100 watts of heat at rest, enough to power a bright LED bulb.",
        "The coldest place on Earth is Antarctica, with a record low of -89.2°C (-128.6°F).",
        "Metal feels colder than wood at room temperature because it conducts heat away from your hand faster.",
        "The hottest known exoplanet, KELT-9b, has a temperature of about 4,300°C, hot enough to vaporize metals!",
        "Plasma, the fourth state of matter, occurs at extremely high temperatures above 10,000°C.",
        "Heat can move through empty space via radiation, which is how the Sun warms the Earth.",
        "The first thermometer was invented by Galileo Galilei in 1593.",
        "The speed of sound changes with temperature because sound travels faster in warmer air.",
        "The Leidenfrost effect occurs when a liquid comes in contact with a surface far hotter than its boiling point.",
        "A microwave oven doesn't actually heat your food - it makes the water molecules in the food vibrate!",
        "The average temperature of the universe is just 2.7 Kelvin (-270.45°C)."
    ],


    // Function to get a random fact
    facts: function() {
        const randomIndex = Math.floor(Math.random() * this.factsList.length);
        return `🔥 Did you know? \n\n${this.factsList[randomIndex]}\n\nType 'facts' again for another interesting fact!`;
    },


    history: `Timeline of Thermodynamics:
1. Ancient Greeks: First theories about heat
2. 1600s: Invention of the thermometer
3. 1700s: Development of specific heat concepts
4. 1800s: Laws of thermodynamics established
5. Modern era: Quantum thermodynamics`,


    careers: `Career Paths in Thermal Sciences:
1. Thermal Engineer
2. HVAC Specialist
3. Energy Efficiency Consultant
4. Materials Scientist
5. Environmental Engineer
6. Research Physicist`,


    study: `Effective Study Strategies:
1. Create mind maps of heat transfer concepts
2. Use analogies for complex ideas
3. Practice with real-world examples
4. Draw diagrams and flowcharts
5. Solve varied problem types`,


    practice: `Practice Problem Categories:
1. Basic Calculations
2. Heat Transfer Analysis
3. Temperature Conversion
4. Thermal Equilibrium
5. Phase Changes


Type 'practice 1-5' for specific problems!`,


    visualize: `Visual Learning Resources:
1. Interactive Heat Flow Diagrams
2. Temperature Scale Comparisons
3. Phase Change Animations
4. Molecular Motion Models
5. Heat Transfer Infographics`,


    convert: `Quick Temperature Converter:
Enter in format: '25C to F' or '98F to K'
Examples:
- "100C to F"
- "212F to C"
- "300K to C"`,


    sim1: `Thermal Expansion Simulation:
Watch how different materials expand when heated. Compare metals, liquids, and gases.`,


    sim2: `Phase Change Visualization:
See how molecules behave during melting, freezing, evaporation, and condensation.`,


    sim3: `Heat Flow Direction Demo:
Interactive demonstration of heat flowing from hot to cold regions.`,


    sim4: `Temperature Equilibrium:
Watch how objects of different temperatures reach thermal equilibrium when in contact.`,


    "answer 1": `Heat is the transfer of thermal energy between objects, while temperature measures the average kinetic energy of particles in a substance. Think of heat as the process and temperature as the measurement!`,


    "answer 2": `The three mechanisms are:
1. Conduction (through direct contact)
2. Convection (through fluid movement)
3. Radiation (through electromagnetic waves)`,


    "answer 3": `The Kelvin scale uses Kelvins (K) as its unit. The scale starts at absolute zero (0K = -273.15°C) and uses the same size degrees as Celsius.`
};


function initChatbot() {
    const container = document.querySelector('.chatbot-container');
    const chatbot = document.querySelector('.chatbot');
    const messages = document.querySelector('.chat-messages');
    const input = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const minimizeBtn = document.querySelector('.minimize-btn');


    function toggleExpand() {
        chatbot.classList.toggle('expanded');
        if (chatbot.classList.contains('expanded')) {
            input.focus();
        }
    }


    function addMessage(text, isUser = false) {
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }


    function handleQuery(query) {
        const normalizedQuery = query.toLowerCase().trim();
       
        if (normalizedQuery === '') return;
       
        addMessage(query, true);
       
        // Handle special commands
        let response;
        if (normalizedQuery === 'facts') {
            response = chatbotQueries.facts();
        } else {
            // Check for function or static responses
            response = typeof chatbotQueries[normalizedQuery] === 'function'
                ? chatbotQueries[normalizedQuery]()
                : chatbotQueries[normalizedQuery] ||
                  "I'm not sure about that. Try 'help' to see what I can do!";
        }
       
        setTimeout(() => {
            addMessage(response);
           
            // For quiz answers, show a follow-up prompt
            if (normalizedQuery.startsWith('answer')) {
                setTimeout(() => {
                    addMessage("Type 'quiz' for another question or 'help' to see other commands!");
                }, 1000);
            }
        }, 500);
    }


    function handleInput(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const query = input.value.trim();
            if (query) {
                handleQuery(query);
                input.value = '';
            }
        }
    }


    // Event listeners
    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleExpand();
    });
   
    chatbot.addEventListener('click', (e) => {
        if (!chatbot.classList.contains('expanded')) {
            toggleExpand();
        }
    });
   
    sendBtn.addEventListener('click', () => {
        const query = input.value.trim();
        if (query) {
            handleQuery(query);
            input.value = '';
        }
    });


    input.addEventListener('keypress', handleInput);


    // Initial message
    addMessage("👋 Hi! I'm your Heat & Temperature assistant. Type 'help' to see what I can do!");
}


// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', initChatbot);

