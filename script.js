import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const menu = document.querySelector(".menu");
const menuBg = document.querySelector(".menu-bg");
const menuItems = document.querySelectorAll(".menu-item");
const navToggler = document.querySelector(".nav-toggler");

const items = [...menuItems].map((item) => {
  const index = item.querySelector(".item-index");
  const label = item.querySelector(".item-label");
  const divider = item.querySelector(".item-divider");

  const chars = new SplitText(label, { type: "chars", mask: "chars" }).chars;
  const [firstChar, ...trailingChars] = chars;

  const trailingCharBox = document.createElement("span");
  trailingCharBox.className = "item-body";
  trailingChars.forEach((char) =>
    trailingCharBox.appendChild(char.parentElement),
  );
  label.after(trailingCharBox);

  const indexWord = new SplitText(index, { type: "words", mask: "words" })
    .words;

  gsap.set([indexWord, firstChar], { yPercent: 100 });
  gsap.set(trailingChars, { xPercent: 125 });
  gsap.set(trailingCharBox, { width: 0 });

  return { indexWord, firstChar, trailingChars, trailingCharBox, divider };
});

function flickerTextTo(element, text) {
  element.flickerSplit?.revert();
  element.textContent = text;
  element.flickerSplit = new SplitText(element, { type: "chars" });
  gsap.fromTo(
    element.flickerSplit.chars,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.05,
      ease: "power2.inOut",
      overwrite: true,
      stagger: { amount: 0.3, from: "random" },
    },
  );
}

const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

let isMenuOpen = false;

navToggler.addEventListener("click", () => {
  isMenuOpen = !isMenuOpen;
  menu.classList.toggle("is-menu-open", isMenuOpen);
  isMenuOpen ? tl.play() : tl.reverse();
  flickerTextTo(navToggler, isMenuOpen ? "Close" : "Menu");
});

tl.to(menuBg, { opacity: 1, duration: 0.75 }, 0);

items.forEach(
  ({ indexWord, firstChar, trailingChars, trailingCharBox, divider }, i) => {
    const startTime = 0.5 + i * 0.15;

    tl.to([indexWord, firstChar], { yPercent: 0, duration: 0.75 }, startTime)
      .to(
        divider,
        { scaleY: 1, duration: 1, ease: "power3.out" },
        startTime + 0.05,
      )
      .to(
        trailingCharBox,
        {
          width: trailingCharBox.scrollWidth,
          duration: 1,
          ease: "power4.inOut",
        },
        startTime + 0.25,
      )
      .to(
        trailingChars,
        { xPercent: 0, duration: 0.75, stagger: 0.05 },
        startTime + 0.5,
      );
  },
);
