"use strict";

export default class LazyLoad {
  constructor(
    elemsToWatch,
    classToAdd,
    lazyTimeout = 5000,
    intersectionRatio = 0.5
  ) {
    this.elemsToWatch = elemsToWatch;
    this.lazyTimeout = lazyTimeout;
    this.classToAdd = classToAdd;
    this.intersectionRatio = intersectionRatio;
    this.options = {
      root: null,
      rootMargin: "0px",
      threshold: this.buildThresholdList(20)
    };

    this.io = new IntersectionObserver(entries => {
      this.handleIntersection(entries);
    }, this.options);
  }

  load() {
    document.querySelectorAll(this.elemsToWatch).forEach(elem => {
      this.io.observe(elem);
      setTimeout(() => {
        this.lazyload(elem);
      }, this.lazyTimeout);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.lazyload(entry.target);
      }
      if (entry.intersectionRatio >= this.intersectionRatio) {
        this.show(entry.target);
      }
    });
  }

  show(elem) {
    setTimeout(() => {
      elem.classList.add(this.classToAdd);
    }, 750);
  }

  lazyload(elem) {
    [...elem.children].forEach(child => {
      const src = child.getAttribute("src");
      const dataSrc = child.getAttribute("data-src");
      if (dataSrc && src === "") {
        child.setAttribute("src", dataSrc);
      }
      this.lazyload(child);
    });
  }

  buildThresholdList(steps) {
    const thresholds = [];
    for (var i = 1.0; i <= steps; i++) {
      thresholds.push(i / steps);
    }
    thresholds.push(0);
    return thresholds;
  }
}
