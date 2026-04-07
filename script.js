const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navDropdown = document.querySelector(".nav-dropdown");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark" || savedTheme === "light") {
    document.body.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.setAttribute("data-theme", "dark");
}

const updateThemeToggle = () => {
    if (!themeToggle) {
        return;
    }

    const isDark = document.body.getAttribute("data-theme") === "dark";
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
};

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark = document.body.getAttribute("data-theme") === "dark";
        const nextTheme = isDark ? "light" : "dark";

        if (nextTheme === "light") {
            document.body.removeAttribute("data-theme");
        } else {
            document.body.setAttribute("data-theme", nextTheme);
        }

        localStorage.setItem("theme", nextTheme);
        updateThemeToggle();
    });
}

updateThemeToggle();

if (menuToggle && navDropdown) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navDropdown.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        if (!navDropdown.contains(event.target)) {
            navDropdown.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
    }
});

const reveals = document.querySelectorAll(".reveal");

reveals.forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 420)}ms`);
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach((element) => revealObserver.observe(element));
} else {
    reveals.forEach((element) => element.classList.add("is-visible"));
}

const countElements = document.querySelectorAll("[data-count]");

const animateCount = (element) => {
    const target = Number(element.dataset.count);

    if (!target || element.dataset.counted === "true") {
        return;
    }

    element.dataset.counted = "true";
    let current = 0;
    const duration = 1200;
    const stepTime = 30;
    const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));

    const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        element.textContent = `${current}${target === 100 ? "%" : "+"}`;

        if (current >= target) {
            clearInterval(timer);
            element.textContent = `${target}${target === 100 ? "%" : "+"}`;
        }
    }, stepTime);
};

const progressFills = document.querySelectorAll("[data-progress]");

const animateProgress = (element) => {
    if (element.dataset.filled === "true") {
        return;
    }

    element.dataset.filled = "true";
    element.style.width = `${element.dataset.progress}%`;
};

const animatedElements = [...countElements, ...progressFills];

if ("IntersectionObserver" in window) {
    const dataObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            if (entry.target.hasAttribute("data-count")) {
                animateCount(entry.target);
            }

            if (entry.target.hasAttribute("data-progress")) {
                animateProgress(entry.target);
            }

            dataObserver.unobserve(entry.target);
        });
    }, { threshold: 0.35 });

    animatedElements.forEach((element) => dataObserver.observe(element));
} else {
    countElements.forEach(animateCount);
    progressFills.forEach(animateProgress);
}

const typingTarget = document.querySelector("[data-typing]");

if (typingTarget) {
    const phrases = [
        "Building thoughtful front-end experiences.",
        "Turning ideas into clean, responsive pages.",
        "Learning, designing, and improving every day."
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const phrase = phrases[phraseIndex];
        typingTarget.textContent = isDeleting
            ? phrase.slice(0, charIndex--)
            : phrase.slice(0, charIndex++);

        if (!isDeleting && charIndex > phrase.length) {
            isDeleting = true;
            setTimeout(type, 1300);
            return;
        }

        if (isDeleting && charIndex < 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            charIndex = 0;
        }

        setTimeout(type, isDeleting ? 40 : 70);
    };

    type();
}

document.querySelectorAll(".hover-lift").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
    });

    card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
    });
});
