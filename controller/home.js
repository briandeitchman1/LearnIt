const faders = document.querySelectorAll(".fade-in");
const sliders = document.querySelectorAll(".slide-in")
const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -250px"
};

const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            //stop looking at target once we add the appear class
            appearOnScroll.unobserve(entry.target);
        }
    })
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
})
sliders.forEach(slider => {
    appearOnScroll.observe(slider);
})