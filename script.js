const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
    }
});

const reveals = document.querySelectorAll(".reveal");

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
