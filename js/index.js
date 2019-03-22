function show(elem) {
  setTimeout(() => {
    elem.classList.add("show");
  }, 750);
}

function lazyload(elem) {
  [...elem.children].forEach(child => {
    const src = child.getAttribute("src");
    const dataSrc = child.getAttribute("data-src");
    if (dataSrc && src === "") {
      child.setAttribute("src", dataSrc);
    }
    lazyload(child);
  });
}

function buildThresholdList(steps) {
  thresholds = [];
  for (i = 1.0; i <= steps; i++) {
    thresholds.push(i / steps);
  }
  thresholds.push(0);
  return thresholds;
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      lazyload(entry.target);
    }
    if (entry.intersectionRatio >= 0.75) {
      show(entry.target);
    }
  });
}

const options = {
  root: null,
  rootMargin: "0px",
  threshold: buildThresholdList(20)
};

const io = new IntersectionObserver(handleIntersection, options);

document.querySelectorAll(".js-lazy").forEach(elem => {
  io.observe(elem);
  setTimeout(() => {
    lazyload(elem);
  }, 5000);
});
