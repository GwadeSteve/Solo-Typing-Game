const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".Input-and-try-again .input-field"),
    tryAgainBtn = document.querySelector(".Input-and-try-again button"),
    wpmTag = document.querySelector(".wpm span"),
    precisionTag = document.querySelector(".precision span"),
    timeTag = document.querySelector(".time span"),
    bike = document.querySelector(".moving-bicycle .bike");

function toggleTheme() {
    const body = document.body;

    if (body.classList.contains("Dark")) {
        body.classList.remove("Dark");
        body.classList.add("Light");
        localStorage.setItem("theme", "Light");
    } else {
        body.classList.remove("Light");
        body.classList.add("Dark");
        localStorage.setItem("theme", "Dark");
    }
}

const themeButton = document.getElementById("Theme");

if (localStorage.getItem("theme")) {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "Light") {
        document.body.classList.remove("Dark");
        document.body.classList.add("Light");
    } else {
        document.body.classList.remove("Light");
        document.body.classList.add("Dark");
    }
} else {
    document.body.classList.add("Light");
}

themeButton.addEventListener("click", toggleTheme);


let charIndex = mistakes = isTyping = 0;

const paragraphs = [
    "Programming is an art that involves creativity, logical thinking, and attention to detail. Whether you're building a website, developing a mobile app, or creating a machine learning algorithm, programming requires an innovative and resourceful approach to problem-solving.",
    "Life is a journey full of challenges and opportunities. Every day, we are faced with new experiences and obstacles that test our resilience and determination. However, with the right mindset, a strong support system, and a willingness to learn and grow, we can overcome any adversity and achieve our goals.",
    "Python is a dynamic and powerful programming language that is popular among developers and data scientists alike. With its clear and concise syntax, rich set of libraries and frameworks, and ease of use, Python has become the go-to language for many applications, including web development, data analysis, and machine learning.",
    "Artificial Intelligence (AI) is a rapidly evolving field that is transforming the way we live and work. From voice assistants and chatbots to self-driving cars and medical diagnosis systems, AI is revolutionizing industries across the board and has the potential to create a better future for all of us.",
    "Machine Learning (ML) is a subfield of AI that involves teaching computers to learn from data and make predictions based on patterns. By using algorithms and statistical models, ML can identify insights and correlations that humans may not be able to see, making it a valuable tool in fields such as finance, healthcare, and marketing.",
    "Programming can be both challenging and rewarding. Whether you're debugging a complex algorithm or building a new feature from scratch, programming requires a lot of patience, focus, and attention to detail. However, the feeling of satisfaction that comes from creating something new and solving a difficult problem is truly unparalleled.",
    "Life is a precious gift that should be cherished and celebrated. Every day is an opportunity to learn, grow, and make a positive impact on the world around us. By embracing new experiences, exploring our passions, and nurturing our relationships, we can create a life that is rich and fulfilling.",
    "Python's versatility and flexibility make it an ideal language for a wide range of applications. From building web applications and scientific computing to creating games and automating tasks, Python's vast ecosystem of libraries and tools make it an incredibly powerful language that can help you achieve your goals.",
    "AI has the potential to transform our world in ways we never thought possible. By automating tedious tasks, improving efficiency, and enhancing decision-making, AI can help us create a more sustainable and equitable future for all. However, we must also be mindful of the ethical implications of this technology and work to ensure that it is used for the greater good.",
    "Machine Learning models can be incredibly accurate and precise, but they are not infallible. Like any technology, ML is only as good as the data it's fed and the algorithms used to process that data. It's important to remain vigilant and continuously monitor ML models to ensure that they are performing as intended and not inadvertently perpetuating bias or discrimination.",
    "Programming requires a lot of dedication and hard work, but it can also be a lot of fun. Whether you're working on a personal project or collaborating with others on a team, programming allows you to unleash your creativity and bring your ideas to life. By embracing the challenges and opportunities that come with programming, you can develop valuable skills and create amazing things.",
    "Life is full of surprises, and sometimes the unexpected can lead to the greatest opportunities for growth and learning. By staying open-minded, resilient, and adaptable, we can navigate life's twists and turns with grace and poise. Whether we succeed or fail, it's important to always learn from our experiences and use them",
    "The intricacies of quantum mechanics have captivated the minds of physicists for decades, as they attempt to unravel the mysteries of the universe and the smallest particles that make it up.",
    "The art of storytelling is a timeless tradition that has been passed down through generations, capturing the hearts and minds of people from all walks of life with its power to inspire, educate, and entertain.",
];

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

let distance = 0;
let timerInterval;
let startTime; // Variable to store the start time

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value[charIndex];
    let Move = 815 / characters.length;

    if (charIndex < characters.length - 1) {
        if (!isTyping) {
            isTyping = true;
            startTime = performance.now();
            startTimer();
        }

        if (characters[charIndex].innerText == typedChar) {
            characters[charIndex].classList.remove("incorrect");
            characters[charIndex].classList.add("correct");
            prevCharIndex = charIndex; // Update prevCharIndex
            charIndex++; // Increment charIndex
            distance = distance + Move; // Move bike forward
            bike.style.marginLeft = `${distance}px`;
        } else {
            if (characters[charIndex].classList.contains("correct")) {
                characters[charIndex].classList.remove("correct");
                distance = distance - Move; // Move bike backward
                bike.style.marginLeft = `${distance}px`;
            }
            characters[charIndex].classList.add("incorrect");
            inpField.focus(); // Focus the input field
            return; // Do not proceed if the character is mistyped
        }
        characters.forEach((span, index) => {
            if (index <= charIndex) {
                span.classList.add("active");
            } else {
                span.classList.remove("active");
            }
            if (index > prevCharIndex && index < charIndex) {
                span.classList.add("correct");
            }
        });

        let elapsedTime = (performance.now() - startTime) / 1000; // Calculate elapsed time in seconds
        let correctChars = charIndex - mistakes;
        let wpm = Math.round((correctChars / 5) / (elapsedTime / 60));
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    }
    if (charIndex >= characters.length - 1) {
        stopTimer(); // Stop the timer
        isTyping = false;
    } else {
        inpField.value = "";
    }
}

function calculatePrecision() {
    const characters = typingText.querySelectorAll("span");
    const correctChars = typingText.querySelectorAll(".correct").length;
    const totalChars = characters.length;
    const precision = ((correctChars / totalChars) * 100).toFixed(2);
    precisionTag.innerText = precision;
}


function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return formattedTime;
}

function startTimer() {
    startTime = performance.now();
    timerInterval = setInterval(() => {
        let elapsedTime = (performance.now() - startTime) / 1000; // Calculate elapsed time in seconds
        timeTag.innerText = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}


function resetGame() {
    loadParagraph();
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    distance = 0;
    wpmTag.innerText = 0;
    bike.style.marginRight = `0px`;
    bike.style.marginLeft = `0px`;
    precision = 0;
    precisionTag.innerHTML = 0;
    stopTimer();
    timeTag.innerHTML = "00:00:00";
}


loadParagraph();
inpField.addEventListener("input", () => {
    initTyping();
    calculatePrecision();
});
tryAgainBtn.addEventListener("click", resetGame);