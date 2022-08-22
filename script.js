// Code is Copyright Henry Lu 2022
"use strict";

// Data that changes
let state = {
  achievements: {
    zillion: ["state.clicks >= 10", false],
    gazillion: ["state.clicks >= 100", false],
    bazillion: ["state.clicks >= 1000", false],
    jillion: ["state.clicks >= 10000", false],
    bajillion: ["state.clicks >= 100000", false],
    squillion: ["state.clicks >= 1000000", false],
    mustmiljon: ["state.clicks >= 10000000", false],

    second: ["state.intervalAdd * (1000 / state.intervalWait) >= 50", false],
    millisecond: [
      "state.intervalAdd * (1000 / state.intervalWait) >= 75",
      false,
    ],
    microsecond: [
      "state.intervalAdd * (1000 / state.intervalWait) >= 100",
      false,
    ],
    nanosecond: [
      "state.intervalAdd * (1000 / state.intervalWait) >= 1000",
      false,
    ],
    picosecond: [
      "state.intervalAdd * (1000 / state.intervalWait) >= 25000",
      false,
    ],
    femtosecond: [
      "state.intervalAdd * (1000 / state.intervalWait) >= 50000",
      false,
    ],
    attosecond: [
      "state.intervalAdd * (1000 / state.intervalWait) >= 75000",
      false,
    ],

    clicks: ["state.add >= 50", false],
    clicker: ["state.add >= 75", false],
    clickers: ["state.add >= 100", false],
    clicking: ["state.add >= 125", false],
    clicked: ["state.add >= 150", false],
    clickable: ["state.add >= 175", false],
    clickstream: ["state.add >= 200", false],
  },
  achievementLevel: 0,
  clicks: 0,
  add: 1,
  clickLevel: 0,
  intervalLevel: 0,
  intervalWaitLevel: 0,
  intervalAdd: 1,
  intervalWait: 1000,
  intervalBought: false,
  clickPlusBought: false,
  cpsBought: false,
  terminalUnlocked: false,
  terminalOpen: false,
  tutorialPage: 0,
  cpsClickBought: false,
};

// Things that don't change
const config = {
  goldenCodeClicked: false,
  originalHTML: document.querySelector(".content").innerHTML,
  originalState: state,
  achievementCheckTime: 100,
  terminalTime: 100,
  intervalCost: 20,
  baseClick: 5,
  baseInterval: 10,
  baseIntervalWait: 20,
  clickPricePower: 2.15,
  intervalPricePower: 3.15,
  intervalWaitPricePower: 4.15,
  goldenCodeSpawnChance: 7,
  goldenCodeCheckTime: 14,
  darkModeWarningTime: 5000,
  typeSpeed: 100,
  saveTime: 10,
  offlineSaveTime: 100,
  mobileCheck: 10,
  tutorialMessages: [
    "",
    "The <strong>top</strong> part of this page it the output of the code below.",
    'The <strong>HTML</strong> section is the HTML code, which is for the content (text, images, videos etc.) of the page. In this game, the HTML upgrades (upgrades are <span class="upgrade" style="cursor:default">underlined in red</span>) add content, but the content will not be updated. We need Javascript to do that.',
    'The <strong>Javascript</strong> section is the Javascript code, which is the "brain" of the program because updates things and works with data. In this game, the Javscript upgrades work with the amount of clicks you have (data). Once you get 1,000 clicks, you can buy an upgrade that makes clicking give 10% of your CPS. Something you should be aware of is the <code>setInterval</code> loop has a minimum delay of 4 milliseconds.',
    'The <strong>CSS</strong> section is the CSS code, which is styling (color, border, arrangement etc.) of the page. CSS also has something called "pseudo classes" which in this game, deal with the events (hover, click, focus). In this game, the CSS upgrades improve the appearance of the page.',
    "The <strong>Console</strong> section is the console. In this game, we will use the console for achievements. In the console is a Javascript object which has a syntax of <code>{ achievement: value, achievement: value, ... }</code>. The next line is a function the calculates how much achievements you have because each time you get 7 achievements, you will get a copy of your <code>setInterval</code> (but it won't update). When you get an achievement, it will update the object and display a message in the console. Also, in the console, you will be able to see how much clicks you got offline.",
    'Occasionally, Golden Code will appear. Golden Code is a rare phenomenon where code colored <span style="color:goldenrod">golden</span> will appear on the screen. It will fade in, then out totalling 14 seconds visible. If you click on it, you will get a benefit.',
    "When you get 1 ten million clicks, you unlock the <strong>terminal</strong>. The terminal is where you can install packages that improve the page. The packages available in this game are jQuery and Bootstrap. ",
    '<strong>jQuery</strong> is a Javascript library that has built in tools that shorten vanilla Javascript (Javascript without libraries) code. These upgrades will be in <span style="text-decoration: underline wavy blue; -webkit-text-decoration: underline wavy blue; text-decoration-skip-ink: none;">blue</span>.',
    '<strong>Bootstrap</strong> is a CSS library that has predefined styles. In Bootstrap, you also have the option to add classes (identifiers) that Bootstrap has already applied styles to, to make elements look better. These free upgrades will be in <span style="text-decoration: underline wavy purple; -webkit-text-decoration: underline wavy purple; text-decoration-skip-ink: none;">purple</span>.',
  ],
  cpsClickTime: 10,
};

// Check for any achievements that have been unlocked
function checkAchievementUnlocked() {
  Object.values(state.achievements)
    .filter((achievement) => !achievement[1])
    .forEach((arr) => {
      if (Function(`return ${arr[0]}`)()) {
        const achievement = Object.keys(state.achievements)[
          Object.values(state.achievements).indexOf(arr)
        ];
        state.achievements[achievement][1] = true;
        document.querySelector(
          `.${achievement}-achievement`
        ).textContent = true;
        document.querySelector(
          ".achievement"
        ).textContent = ` achievements.${achievement} = true;`;
      }
    });
  if (
    Object.values(state.achievements).reduce(
      (a, achievement) => a + achievement[1],
      0
    ) >=
    (state.achievementLevel + 1) * 7
  ) {
    const setIntervalText = `<br>&nbsp;&nbsp;setInterval(function() {<br>
      &nbsp;&nbsp;clicks += ${state.intervalAdd};<br>
      &nbsp;&nbsp;}, ${state.intervalWait})<br>&nbsp;&nbsp;}`;
    document.querySelector(
      ".achievement-upgrade"
    ).innerHTML = `if (achievementsUnlocked() >= ${
      (state.achievementLevel + 1) * 7
    }) {
      ${setIntervalText}`;
    setInterval(() => {
      state.clicks += state.intervalAdd;
      document.querySelector(".clicks").textContent = state.clicks;
    }, state.intervalWait);
    state.achievementLevel++;

    let cps = Math.round(state.intervalAdd * (1000 / state.intervalWait));
    if (state.cpsClickBought) state.add = Math.round(0.1 * cps);
    if (state.clickPlusBought) {
      document.querySelector(".click-plus-num").textContent = state.add;
      document.querySelector(".click-plus").textContent = state.add;
    }
    document.querySelector(".cps-click-num").textContent = cps;
    switch (state.achievementLevel) {
      case 1:
        state.achievement1CPS = Math.round(
          state.intervalAdd * (1000 / state.intervalWait)
        );
        cps += state.achievement1CPS;
        break;
      case 2:
        state.achievement2CPS = Math.round(
          state.intervalAdd * (1000 / state.intervalWait)
        );
        cps += state.achievement1CPS;
        cps += state.achievement2CPS;
        break;
      case 3:
        state.achievement3CPS = Math.round(
          state.intervalAdd * (1000 / state.intervalWait)
        );
        cps += state.achievement1CPS;
        cps += state.achievement2CPS;
        cps += state.achievement3CPS;
        break;
    }
    document.querySelector(".cps-num").textContent = cps;
    if (document.querySelector(".cps"))
      document.querySelector(".cps").textContent = cps;

    setTimeout(() => {
      document.querySelector(".achievement-upgrade").textContent = "";
      document
        .querySelector(".js-sect")
        .insertAdjacentHTML(
          "beforeend",
          setIntervalText.replaceAll("&nbsp;", "")
        );
    }, 5000);
  }
}

// Check probability and spawn golden code
function spawnGoldenCode() {
  if (Math.random() * 100 > config.goldenCodeSpawnChance) return;
  state.goldenCodeMessages = [
    [
      `function click() {<br>
      clicks += ${state.add} * 3;<br>
      document.querySelector(".clicks").textContent = clicks;<br>
      }<br>`,
      "state.add *= 3",
    ],
    [
      `setInterval(function() {<br>
      clicks += ${state.intervalAdd} * 3;<br>
      document.querySelector(".clicks").textContent = clicks;<br>
      }, ${state.intervalWait})`,
      "state.intervalAdd *= 3",
    ],
    [
      `setInterval(function() {<br>
      clicks += ${state.intervalAdd};<br>
      document.querySelector(".clicks").textContent = clicks;<br>
      }, ${state.intervalWait} / 3)`,
      "state.intervalWait /= 3",
    ],
    [
      `clicks += 0.7 * clicks`,
      "state.clicks += Math.round(0.7 * state.clicks)",
    ],
  ];
  if (state.intervalWait !== 4) state.goldenCodeMessages.splice(2);
  config.goldenCodeClicked = false;
  const goldenCode = document.querySelector(".goldenCode");
  state.goldenCodeIndex = Math.floor(
    Math.random() * state.goldenCodeMessages.length
  );
  goldenCode.innerHTML = state.goldenCodeMessages[state.goldenCodeIndex][0];
  goldenCode.classList.remove("not-active");
  goldenCode.style.top =
    Math.random() * (document.documentElement.clientHeight - 77) + "px";
  goldenCode.style.left =
    Math.random() * (document.documentElement.clientWidth - 484) + "px";
  goldenCode.classList.add("active");
  new Promise((resolve) => setTimeout(resolve, 7000)).then(() => {
    if (config.goldenCodeClicked) return;
    goldenCode.classList.add("not-active");
    goldenCode.classList.remove("active");
    new Promise((resolve) => setTimeout(resolve, 7000)).then(() => {
      if (config.goldenCodeClicked) return;
      goldenCode.classList.remove("not-active");
      save();
    });
  });
}

// See if player has enough money and subtracts the amount
function checkSubtractCost(subtract) {
  if (state.clicks < subtract) return false;
  state.clicks -= subtract;
  document.querySelector(".clicks").textContent = state.clicks;
  return true;
}

// Player clicks the button
function clickButton() {
  state.clicks += state.add;
  document.querySelector(".clicks").textContent = state.clicks;
}

// Changes the interval text
function intervalUpgrades() {
  document.querySelector(".interval-level").innerHTML = document
    .querySelector(".interval-level")
    .innerHTML.replace("<br>", "");
  document
    .querySelector(".interval-level")
    .insertAdjacentHTML("beforeend", ` // ${config.baseInterval} clicks<br>`);
  document.querySelector(
    ".interval-wait"
  ).textContent += ` // ${config.baseIntervalWait} clicks`;
  intervalUpgradesListeners();

  if (localStorage.getItem("jquery", true)) {
    document.querySelectorAll(".jquery-upgrade").forEach((el) =>
      el.addEventListener(
        function (e) {
          if (e.target.classList.contains("jquery-add")) {
            if (state.clickPlusBought) {
              document.querySelector(".click-plus-num").textContent = state.add;
              document.querySelector(".click-plus").textContent = state.add;
            }

            document.querySelector(".click-level").innerHTML = `clicks += ${
              state.add
            }; // ${Math.ceil(
              config.baseClick * config.clickPricePower ** state.clickLevel
            ).toLocaleString()} clicks<br>`;
          } else if (e.target.classList.contains("jquery-interval")) {
            let cps = Math.round(
              state.intervalAdd * (1000 / state.intervalWait)
            );
            if (state.cpsClickBought) state.add = Math.round(0.1 * cps);
            if (state.clickPlusBought) {
              document.querySelector(".click-plus-num").textContent = state.add;
              document.querySelector(".click-plus").textContent = state.add;
            }
            document.querySelector(".cps-click-num").textContent = cps;
            if (state.cpsBought) {
              switch (state.achievementLevel) {
                case 1:
                  cps += state.achievement1CPS;
                  break;
                case 2:
                  cps += state.achievement1CPS;
                  cps += state.achievement2CPS;
                  break;
                case 3:
                  cps += state.achievement1CPS;
                  cps += state.achievement2CPS;
                  cps += state.achievement3CPS;
                  break;
              }
              document.querySelector(".cps-num").textContent = cps;
              if (document.querySelector(".cps"))
                document.querySelector(".cps").textContent = cps;
            }

            if (state.interval) {
              clearInterval(state.interval);
              state.interval = setInterval(() => {
                state.clicks += state.intervalAdd;
                document.querySelector(".clicks").textContent = state.clicks;
              }, state.intervalWait);
            }

            document.querySelector(".interval-level").innerHTML = `clicks += ${
              state.intervalAdd
            }; // ${Math.ceil(
              config.baseInterval *
                config.intervalPricePower ** state.intervalLevel
            ).toLocaleString()} clicks<br>`;
          }
        },
        { once: true }
      )
    );
    document.querySelectorAll(".queryselector").forEach((el) =>
      el.addEventListener("click", function (e) {
        this.textContent = "$";
        this.classList.remove("jquery-upgrade");
      })
    );
    document.querySelectorAll(".textcontent").forEach((el) =>
      el.addEventListener("click", function () {
        this.textContent = "html(clicks)";
        this.classList.remove("jquery-upgrade");
      })
    );
  }
}

// Sets the listeners for the upgrades within the interval
function intervalUpgradesListeners() {
  document
    .querySelector(".interval-level")
    .addEventListener("click", function () {
      const price = Math.ceil(
        config.baseInterval * config.intervalPricePower ** state.intervalLevel
      );
      if (!checkSubtractCost(price)) return;

      state.intervalLevel++;
      state.intervalAdd += state.intervalLevel;

      let cps = Math.round(state.intervalAdd * (1000 / state.intervalWait));
      if (state.cpsClickBought) state.add = Math.round(0.1 * cps);
      if (state.clickPlusBought) {
        document.querySelector(".click-plus-num").textContent = state.add;
        document.querySelector(".click-plus").textContent = state.add;
      }
      document.querySelector(".cps-click-num").textContent = cps;
      if (state.cpsBought) {
        switch (state.achievementLevel) {
          case 1:
            cps += state.achievement1CPS;
            break;
          case 2:
            cps += state.achievement1CPS;
            cps += state.achievement2CPS;
            break;
          case 3:
            cps += state.achievement1CPS;
            cps += state.achievement2CPS;
            cps += state.achievement3CPS;
            break;
        }
        document.querySelector(".cps-num").textContent = cps;
        if (document.querySelector(".cps"))
          document.querySelector(".cps").textContent = cps;
      }

      if (state.interval) {
        clearInterval(state.interval);
        state.interval = setInterval(() => {
          state.clicks += state.intervalAdd;
          document.querySelector(".clicks").textContent = state.clicks;
        }, state.intervalWait);
      }

      this.innerHTML = `clicks += ${state.intervalAdd}; // ${Math.ceil(
        config.baseInterval * config.intervalPricePower ** state.intervalLevel
      ).toLocaleString()} clicks<br>`;
    });
  document
    .querySelector(".interval-wait")
    .addEventListener("click", function intervalWait() {
      const price = Math.ceil(
        config.baseIntervalWait *
          config.intervalWaitPricePower ** state.intervalWaitLevel
      );
      if (!checkSubtractCost(price)) return;

      state.intervalWaitLevel++;
      if (
        Math.round(
          state.intervalWait / Math.sqrt(state.intervalWaitLevel + 1)
        ) <= 4
      ) {
        this.removeEventListener("click", intervalWait);
        this.innerHTML = "}, 4) // Minimum delay reached";
        state.intervalWait = 4;
        this.style.textDecoration = "none";
        return;
      } else state.intervalWait = Math.round(state.intervalWait / Math.sqrt(state.intervalWaitLevel + 1));

      let cps = Math.round(state.intervalAdd * (1000 / state.intervalWait));
      if (state.cpsClickBought) state.add = Math.round(0.1 * cps);
      if (state.clickPlusBought) {
        document.querySelector(".click-plus-num").textContent = state.add;
        document.querySelector(".click-plus").textContent = state.add;
      }
      document.querySelector(".cps-click-num").textContent = cps;
      if (state.cpsBought) {
        switch (state.achievementLevel) {
          case 1:
            cps += state.achievement1CPS;
            break;
          case 2:
            cps += state.achievement1CPS;
            cps += state.achievement2CPS;
            break;
          case 3:
            cps += state.achievement1CPS;
            cps += state.achievement2CPS;
            cps += state.achievement3CPS;
            break;
        }
        document.querySelector(".cps-num").textContent = cps;
        if (document.querySelector(".cps"))
          document.querySelector(".cps").textContent = cps;
      }

      if (state.interval) {
        clearInterval(state.interval);
        state.interval = setInterval(() => {
          state.clicks += state.intervalAdd;
          document.querySelector(".clicks").textContent = state.clicks;
        }, state.intervalWait);
      }

      this.innerHTML = `}, ${state.intervalWait}) // ${Math.ceil(
        config.baseIntervalWait *
          config.intervalWaitPricePower ** state.intervalWaitLevel
      ).toLocaleString()} clicks<br>`;
    });
  document.querySelector(".cps-select").addEventListener("click", function () {
    if (this.classList.contains("done")) return;
    if (!checkSubtractCost(+this.dataset.cost)) return;
    Function(`return ${this.dataset.eval}`)();
    if (this.dataset.js === "true") this.innerHTML = this.dataset.replace;
    else this.textContent = this.dataset.replace;
    if (this.dataset.eval2) Function(`return ${this.dataset.eval2}`)();
    if (this.dataset.eval3) Function(`return ${this.dataset.eval3}`)();
    this.classList.remove("upgrade");
    this.classList.add("done");
    if (this.dataset.unlock)
      document
        .querySelector(`.${this.dataset.unlock}`)
        .classList.remove("hidden");
  });
}

// Open terminal
function openTerminal(deleteText = false) {
  if (deleteText) document.querySelector(".terminal-text").innerHTML = "";
  document.querySelector(".achievement-upgrade").textContent = "";
  const terminalProceed = document.querySelector(".terminal-proceed");
  terminalProceed.closest("aside").style.opacity = "0";
  const footer = document.querySelector("footer");
  setTimeout(() => {
    terminalProceed.closest("aside").style.display = "none";
    footer.style.transition = "initial";
  }, 500);
  footer.style.height = "100vh";
  footer.style.borderRadius = "0";
  footer.style.backgroundColor = "black";
  document.querySelector(".up-arrow").style.display = "none";
  document.querySelector(".settings").style.color = "white";
  document.querySelector("footer hr").classList.remove("hidden");
  state.terminalOpen = true;
  typeTerminal();
}

// Types 'npm init \n npm install [input here]'
function typeTerminal(init = false) {
  setTimeout(() => {
    let i = 0;
    const text = `${init ? "" : "> npm init_"}> npm install `;
    const terminalText = document.querySelector(".terminal-text");
    (function type() {
      if (i < text.length) {
        terminalText.innerHTML +=
          text.charAt(i) === "_" ? "<br>" : text.charAt(i);
        i++;
        setTimeout(type, config.typeSpeed);
      } else
        terminalText.insertAdjacentHTML(
          "beforeend",
          '<input type="text" value="jQuery or bootstrap" onkeypress="libraryEntered(event)" autofocus="">'
        );
    })();
  }, 1000);
}

// Open and close settings menu
function toggleSettings() {
  document.querySelector(".settings").style.width =
    document.querySelector(".settings").style.width !== "250px" ? "250px" : "0";
}

// Save
function save() {
  const save = {
    state,
    body: document.body.innerHTML,
  };
  localStorage.setItem("save", JSON.stringify(save));
}

// Load save
function loadSave() {
  if (!localStorage.getItem("save")) return;
  const game = JSON.parse(localStorage.getItem("save"));
  state = game.state;
  document.body.innerHTML = game.body;
  if (localStorage.getItem("time") && state.intervalBought) {
    const add = Math.round(
      ((Date.now() - +localStorage.getItem("time")) / 1000) *
        (state.intervalAdd * (1000 / state.intervalWait))
    );
    state.clicks += add;
    document.querySelector(".clicks").textContent = state.clicks;
    document.querySelector(
      ".achievement-upgrade"
    ).textContent = `clicks += ${add}; // Offline progress`;
  }
  document.querySelector(".settings").style.width = "0";
  if (state.intervalBought) {
    state.interval = setInterval(() => {
      state.clicks += state.intervalAdd;
      document.querySelector(".clicks").textContent = state.clicks;
    }, state.intervalWait);
    intervalUpgradesListeners();
  }
  if (game.body.includes('value="Light mode"'))
    document.body.classList.add("dark-mode");
  if (game.state.terminalOpen) openTerminal(true);
}
loadSave();

// Delete save
function wipeSave() {
  localStorage.clear();
  location.reload();
}

// Save to a file
function saveFile() {
  const file = new Blob(
    [
      JSON.stringify({
        state,
        body: document.body.innerHTML,
      }),
    ],
    { type: "application/json" }
  );
  const a = document.createElement("a"),
    url = URL.createObjectURL(file);
  a.href = url;
  a.download = "save.json";
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

// Load from a file
async function loadFile() {
  try {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    localStorage.setItem("save", contents);
    loadSave();
  } catch (err) {}
}

// Saves the time for offline progress
function saveOfflineTime() {
  localStorage.setItem("time", Date.now());
}

// Check terminal unlocked
function checkTerminalUnlock() {
  if (state.terminalUnlocked) clearInterval(config.terminal);
  if (state.clicks >= 10000000) {
    state.terminalUnlocked = true;
    document.querySelector("footer").style.height = "110px";
    if (document.querySelector("input").value.split(" ")[0] === "Light")
      document.querySelector("footer").style.borderTop = "2px solid white";
  }
}

// Open terminal warning
function openTerminalWarning() {
  const terminalWarning = document.querySelector(".terminal-warning");
  terminalWarning.style.display = "initial";
  setTimeout(() => (terminalWarning.style.opacity = "100"), 0);
}

// Library has been entered into the input
function libraryEntered(e) {
  if (e.key !== "Enter") return;
  let text = document.querySelectorAll(".terminal-text>input");
  text = text[text.length - 1].value;
  const terminalText = document.querySelector(".terminal-text");
  const input = text;
  text = text.toLowerCase().trim();
  if (text !== "bootstrap" && text !== "jquery") {
    terminalText.innerHTML = terminalText.innerHTML.replace(
      '<input type="text" value="jQuery or bootstrap" onkeypress="libraryEntered(event)" autofocus="">',
      `${input}<br>< Error 404: Not Found<br>`
    );
    typeTerminal(true);
    return;
  }
  if (
    (localStorage.getItem("jquery") && text === "jquery") ||
    (localStorage.getItem("bootstrap") && text === "bootstrap")
  ) {
    terminalText.innerHTML = terminalText.innerHTML.replace(
      '<input type="text" value="jQuery or bootstrap" onkeypress="libraryEntered(event)" autofocus="">',
      `${input}<br>< Error 405: Already installed<br>`
    );
    typeTerminal(true);
    return;
  }
  terminalText.insertAdjacentHTML("beforeend", "<br>");
  terminalText.innerHTML = terminalText.innerHTML.replace(
    '<input type="text" value="jQuery or bootstrap" onkeypress="libraryEntered(event)" autofocus="">',
    input
  );
  if (text === "bootstrap") {
    fetch("bootstrap.txt")
      .then((response) => response.text())
      .then((text) => writeTerminal(text, "bootstrap"));
  } else if (text === "jquery") {
    fetch("jquery.txt")
      .then((response) => response.text())
      .then((text) => writeTerminal(text, "jquery"));
  }
}

// Write terminal text
function writeTerminal(text, library) {
  const footer = document.querySelector("footer");
  let filesDownloaded = 0;
  const terminalText = document.querySelector(".terminal-text");
  text.split(",").forEach((file, _, arr) =>
    setTimeout(() => {
      filesDownloaded++;
      terminalText.insertAdjacentHTML("beforeend", `< installing ${file}<br>`);
      footer.scrollBy(0, document.body.scrollHeight);
      if (filesDownloaded === arr.length) {
        setTimeout(() => {
          terminalText.insertAdjacentHTML(
            "beforeend",
            "<br>< Installation Complete"
          );
          footer.scrollBy(0, document.body.scrollHeight);
          setTimeout(() => {
            terminalText.insertAdjacentHTML(
              "beforeend",
              "<br>< Closing Terminal"
            );
            footer.scrollBy(0, document.body.scrollHeight);
            setTimeout(() => {
              footer.style.transition = "0.5s";
              footer.style.height = "0";
              document.querySelector(".settings").style.color = "black";
              state.terminalOpen = false;
              document.querySelector(".content").innerHTML =
                config.originalHTML;
              state = config.originalState;
              clearInterval(state.interval);
              setTimeout(() => {
                let jquery, bootstrap;
                if (localStorage.getItem("jquery")) {
                  jquery = true;
                }
                if (localStorage.getItem("bootstrap")) {
                  bootstrap = true;
                }
                localStorage.clear();
                if (jquery) localStorage.setItem("jquery", true);
                if (bootstrap) localStorage.setItem("bootstrap", true);
                localStorage.setItem(library, true);
                if (
                  document.querySelector("input").value.split(" ")[0] ===
                  "Light"
                )
                  localStorage.setItem("dark-mode", true);
                location.reload();
              }, 500);
            }, 1000);
          }, 1000);
        }, 1000);
      }
    }, Math.random() * 5000)
  );
}

// Activates library upgrades
function activateLibrary() {
  const jquery = localStorage.getItem("jquery");
  const bootstrap = localStorage.getItem("bootstrap");
  if (jquery || bootstrap) {
    document.querySelector("dialog").open = false;
    document.querySelector(".overlay").style.display = "none";
    if (localStorage.getItem("dark-mode")) {
      document.body.classList.toggle("dark-mode");
      document
        .querySelectorAll(".dark-mode-button img")
        .forEach((el) => el.classList.toggle("hidden"));
      darkMode();
    }
  }
  if (bootstrap) {
    document
      .querySelectorAll("header, .click-button")
      .forEach((el) => el.removeAttribute("style"));
    document.styleSheets[0].insertRule(
      ".with-bootstrap { display: flex; align-items: center; }",
      0
    );
    document.querySelector(".with-bootstrap").classList.remove("hidden");
    document.styleSheets[0].insertRule(
      'header{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#fff;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0)}',
      0
    );
    document.styleSheets[0].insertRule(
      ".click-button{-webkit-appearance:button;cursor:pointer;text-transform:none;border-radius:0;margin:0;font-family:inherit;font-size:inherit;line-height:inherit}",
      0
    );
    document.styleSheets[0].insertRule(
      ".click-button:focus:not(:focus-visible){outline:0}",
      0
    );
    document.styleSheets[0].insertRule(
      "button.btn{--bs-btn-padding-x:.75rem;--bs-btn-padding-y:.375rem;--bs-btn-font-family:;--bs-btn-font-size:1rem;--bs-btn-font-weight:400;--bs-btn-line-height:1.5;--bs-btn-color:#212529;--bs-btn-bg:transparent;--bs-btn-border-width:1px;--bs-btn-border-color:transparent;--bs-btn-border-radius:.375rem;--bs-btn-box-shadow:inset 0 1px 0 rgba(255,255,255,.15),0 1px 1px rgba(0,0,0,.075);--bs-btn-disabled-opacity:.65;--bs-btn-focus-box-shadow:0 0 0 .25rem rgba(var(--bs-btn-focus-shadow-rgb),.5);display:inline-block;padding:var(--bs-btn-padding-y) var(--bs-btn-padding-x);font-family:var(--bs-btn-font-family);font-size:var(--bs-btn-font-size);font-weight:var(--bs-btn-font-weight);line-height:var(--bs-btn-line-height);color:var(--bs-btn-color);text-align:center;text-decoration:none;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;border:var(--bs-btn-border-width) solid var(--bs-btn-border-color);border-radius:var(--bs-btn-border-radius);background-color:var(--bs-btn-bg);transition:color 0.15s ease-in-out,background-color 0.15s ease-in-out,border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out}",
      0
    );
    document.styleSheets[0].insertRule(
      "button.btn:hover{color:var(--bs-btn-hover-color);background-color:var(--bs-btn-hover-bg);border-color:var(--bs-btn-hover-border-color)}",
      0
    );
    document.styleSheets[0].insertRule(
      "button.btn:focus{color:var(--bs-btn-hover-color);background-color:var(--bs-btn-hover-bg);border-color:var(--bs-btn-hover-border-color);outline:0;box-shadow:var(--bs-btn-focus-box-shadow)}",
      0
    );
    document.styleSheets[0].insertRule(
      "button.btn:active{color:var(--bs-btn-active-color);background-color:var(--bs-btn-active-bg);border-color:var(--bs-btn-active-border-color)}",
      0
    );
    document.styleSheets[0].insertRule(
      "button.btn:active:focus{box-shadow:var(--bs-btn-focus-box-shadow)}",
      0
    );
    document.styleSheets[0].insertRule(
      "header button.btn-primary{--bs-btn-color:#fff;--bs-btn-bg:#0d6efd;--bs-btn-border-color:#0d6efd;--bs-btn-hover-color:#fff;--bs-btn-hover-bg:#0b5ed7;--bs-btn-hover-border-color:#0a58ca;--bs-btn-focus-shadow-rgb:49,132,253;--bs-btn-active-color:#fff;--bs-btn-active-bg:#0a58ca;--bs-btn-active-border-color:#0a53be;--bs-btn-active-shadow:inset 0 3px 5px rgba(0,0,0,.125);--bs-btn-disabled-color:#fff;--bs-btn-disabled-bg:#0d6efd;--bs-btn-disabled-border-color:#0d6efd}",
      0
    );
    document.styleSheets[0].insertRule(
      ".container{--bs-gutter-x:1.5rem;--bs-gutter-y:0;width:100%;padding-right:calc(var(--bs-gutter-x) * 0.5);padding-left:calc(var(--bs-gutter-x) * 0.5);margin-right:auto;margin-left:auto}",
      0
    );
    document
      .querySelectorAll(".bootstrap-upgrade")
      .forEach((el) => (el.style.display = "initial"));
    document
      .querySelector(".container-upgrade")
      .addEventListener("click", function () {
        this.classList.remove("bootstrap-upgrade");
        document.querySelector("header").classList.add("container");
        this.innerHTML = ' class="container"';
      });
    document
      .querySelector(".btn-upgrade")
      .addEventListener("click", function () {
        if (!this.classList.contains("bootstrap-upgrade")) return;
        this.classList.remove("bootstrap-upgrade");
        document.querySelector(".click-button").classList.add("btn");
        this.innerHTML =
          ' class="btn <span class="btn-primary-upgrade bootstrap-upgrade">&lt;!-- btn-primary --&gt;</span>"';
        document
          .querySelector(".btn-primary-upgrade")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            this.classList.remove("bootstrap-upgrade");
            document
              .querySelector(".click-button")
              .classList.add("btn-primary");
            this.innerHTML = "btn-primary";
          });
      });
  }
  if (jquery) {
    document.styleSheets[0].insertRule(
      ".with-jquery { display: flex; align-items: center; }",
      0
    );
    document.querySelector(".with-jquery").classList.remove("hidden");
    document.styleSheets[0].insertRule(
      ".jquery-upgrade { text-decoration: underline wavy blue; -webkit-text-decoration: underline wavy blue; text-decoration-skip-ink: none; cursor: pointer;"
    );
    document.querySelectorAll(".jquery-upgrade").forEach((el) =>
      el.addEventListener(
        "click",
        function (e) {
          if (e.target.classList.contains("jquery-add")) {
            if (state.clickPlusBought) {
              document.querySelector(".click-plus-num").textContent = state.add;
              document.querySelector(".click-plus").textContent = state.add;
            }

            document.querySelector(".click-level").innerHTML = `clicks += ${
              state.add
            }; // ${Math.ceil(
              config.baseClick * config.clickPricePower ** state.clickLevel
            ).toLocaleString()} clicks<br>`;
          }
          if (e.target.classList.contains("jquery-interval")) {
            let cps = Math.round(
              state.intervalAdd * (1000 / state.intervalWait)
            );
            if (state.cpsClickBought) state.add = Math.round(0.1 * cps);
            if (state.clickPlusBought) {
              document.querySelector(".click-plus-num").textContent = state.add;
              document.querySelector(".click-plus").textContent = state.add;
            }
            document.querySelector(".cps-click-num").textContent = cps;
            if (state.cpsBought) {
              switch (state.achievementLevel) {
                case 1:
                  cps += state.achievement1CPS;
                  break;
                case 2:
                  cps += state.achievement1CPS;
                  cps += state.achievement2CPS;
                  break;
                case 3:
                  cps += state.achievement1CPS;
                  cps += state.achievement2CPS;
                  cps += state.achievement3CPS;
                  break;
              }
              document.querySelector(".cps-num").textContent = cps;
              if (document.querySelector(".cps"))
                document.querySelector(".cps").textContent = cps;
            }

            if (state.interval) {
              clearInterval(state.interval);
              state.interval = setInterval(() => {
                state.clicks += state.intervalAdd;
                document.querySelector(".clicks").textContent = state.clicks;
              }, state.intervalWait);
            }

            document.querySelector(".interval-level").innerHTML = `clicks += ${
              state.intervalAdd
            }; // ${Math.ceil(
              config.baseInterval *
                config.intervalPricePower ** state.intervalLevel
            ).toLocaleString()} clicks<br>`;
          }
        },
        { once: true }
      )
    );
    document.querySelectorAll(".queryselector").forEach((el) =>
      el.addEventListener("click", function (e) {
        this.textContent = "$";
        this.classList.remove("jquery-upgrade");
      })
    );
    document.querySelectorAll(".textcontent").forEach((el) =>
      el.addEventListener("click", function () {
        this.textContent = "html(clicks)";
        this.classList.remove("jquery-upgrade");
      })
    );
  }
}

// Mobile support
function mobile() {
  if (window.innerWidth <= 900) {
    document.querySelector("main").style.flexDirection = "column";
    document
      .querySelectorAll(".vertical-hr")
      .forEach((el) => (el.style.display = "none"));
  } else {
    document.querySelector("main").style.flexDirection = "initial";
    document
      .querySelectorAll(".vertical-hr")
      .forEach((el) => (el.style.display = "initial"));
  }
}

// Updates tutorial message
function updateTutorial() {
  document.querySelector(".tutorial-page").textContent = state.tutorialPage;
  document.querySelector(".tutorial-text").innerHTML =
    config.tutorialMessages[state.tutorialPage];
}

// Checks and displays upgrade to make clicking have a percent of cps
function cpsClick() {
  if (state.clicks >= 1000) {
    const el = document.querySelector(".cps-click-level");
    el.classList.remove("hidden");
    el.addEventListener("click", function () {
      if (!checkSubtractCost(1000) || state.cpsClickBought) return;
      document.querySelector(".click-level").style.display = "none";
      this.classList.remove("upgrade");
      this.innerHTML = this.innerHTML.replace("// 1,000 clicks: ", "");
      state.cpsClickBought = true;
      state.add = Math.round(0.1 * cps);
      if (state.clickPlusBought) {
        document.querySelector(".click-plus-num").textContent = state.add;
        document.querySelector(".click-plus").textContent = state.add;
      }
    });
  }
}

function darkMode() {
  const input = document.querySelector("input");
  const terminalWarning = document.querySelector(".terminal-warning");
  const settings = document.querySelector(".settings");
  input.value = "Light mode";
  terminalWarning.style.borderColor = "white";
  terminalWarning.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  if (state.terminalUnlocked)
    document.querySelector("footer").style.borderTop = "2px solid white";
  settings.style.color = "white";
  settings.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  document.documentElement.style.setProperty("--box-shadow-color", "white");
}

// Buy interval
document
  .querySelector(".interval")
  .addEventListener("click", function buyInterval() {
    if (state.intervalBought || !checkSubtractCost(config.intervalCost)) return;

    state.interval = setInterval(() => {
      state.clicks += state.intervalAdd;
      document.querySelector(".clicks").textContent = state.clicks;
    }, state.intervalWait);

    this.innerHTML = this.innerHTML
      .replace("// 20 clicks<br>", "")
      .replaceAll("//", "");
    this.classList.remove("upgrade");
    const cpsSelect = document.querySelector(".cps-select");
    cpsSelect.innerHTML =
      '// 1,000,000 clicks<br> // document.querySelector(".cps").textContent = <span class="cps-num">0</span>;</span>';
    cpsSelect.classList.add("upgrade");

    state.intervalBought = true;
    this.removeEventListener("click", buyInterval);
    intervalUpgrades();

    document.querySelectorAll(".interval .jquery-upgrade").forEach((el) =>
      el.addEventListener(
        "click",
        function (e) {
          if (e.target.classList.contains("jquery-interval")) {
            let cps = Math.round(
              state.intervalAdd * (1000 / state.intervalWait)
            );
            if (state.cpsClickBought) state.add = Math.round(0.1 * cps);
            if (state.clickPlusBought) {
              document.querySelector(".click-plus-num").textContent = state.add;
              document.querySelector(".click-plus").textContent = state.add;
            }
            document.querySelector(".cps-click-num").textContent = cps;
            if (state.cpsBought) {
              switch (state.achievementLevel) {
                case 1:
                  cps += state.achievement1CPS;
                  break;
                case 2:
                  cps += state.achievement1CPS;
                  cps += state.achievement2CPS;
                  break;
                case 3:
                  cps += state.achievement1CPS;
                  cps += state.achievement2CPS;
                  cps += state.achievement3CPS;
                  break;
              }
              document.querySelector(".cps-num").textContent = cps;
              if (document.querySelector(".cps"))
                document.querySelector(".cps").textContent = cps;
            }

            if (state.interval) {
              clearInterval(state.interval);
              state.interval = setInterval(() => {
                state.clicks += state.intervalAdd;
                document.querySelector(".clicks").textContent = state.clicks;
              }, state.intervalWait);
            }

            document.querySelector(".interval-level").innerHTML = `clicks += ${
              state.intervalAdd
            }; // ${Math.ceil(
              config.baseInterval *
                config.intervalPricePower ** state.intervalLevel
            ).toLocaleString()} clicks<br>`;
          }
        },
        { once: true }
      )
    );
  });

// Upgrade the click
document.querySelector(".click-level").addEventListener("click", function () {
  const price = Math.ceil(
    config.baseClick * config.clickPricePower ** state.clickLevel
  );
  if (!checkSubtractCost(price)) return;

  state.clickLevel++;
  state.add += state.clickLevel;
  if (state.clickPlusBought) {
    document.querySelector(".click-plus-num").textContent = state.add;
    document.querySelector(".click-plus").textContent = state.add;
  }

  this.innerHTML = `clicks += ${state.add}; // ${Math.ceil(
    config.baseClick * config.clickPricePower ** state.clickLevel
  ).toLocaleString()} clicks<br>`;
});

// Click golden code
document.querySelector(".goldenCode").addEventListener("click", function () {
  this.classList.remove("active");
  this.classList.remove("not-active");
  config.goldenCodeClicked = true;
  Function(`return ${state.goldenCodeMessages[state.goldenCodeIndex][1]}`)(); // Better than eval
  document.querySelector(".click-level").innerHTML = `clicks${
    state.add === 1 ? "++" : ` += ${state.add}`
  }; // ${Math.ceil(
    config.baseClick * config.clickPricePower ** state.clickLevel
  ).toLocaleString()} clicks<br>`;
  document.querySelector(".interval-level").innerHTML = `${
    state.intervalBought ? "" : "// "
  }clicks${state.intervalAdd === 1 ? "++" : ` += ${state.intervalAdd}`};${
    state.intervalBought
      ? ` // ${Math.ceil(
          config.baseInterval * config.intervalPricePower ** state.intervalLevel
        ).toLocaleString()} clicks`
      : ""
  }<br>`;

  let cps = Math.round(state.intervalAdd * (1000 / state.intervalWait));
  if (state.cpsClickBought) state.add = Math.round(0.1 * cps);
  if (state.clickPlusBought) {
    document.querySelector(".click-plus-num").textContent = state.add;
    document.querySelector(".click-plus").textContent = state.add;
  }
  document.querySelector(".cps-click-num").textContent = cps;
  if (state.cpsBought) {
    switch (state.achievementLevel) {
      case 1:
        cps += state.achievement1CPS;
        break;
      case 2:
        cps += state.achievement1CPS;
        cps += state.achievement2CPS;
        break;
      case 3:
        cps += state.achievement1CPS;
        cps += state.achievement2CPS;
        cps += state.achievement3CPS;
        break;
    }
    document.querySelector(".cps-num").textContent = cps;
    if (document.querySelector(".cps"))
      document.querySelector(".cps").textContent = cps;
  }

  document.querySelector(".interval-wait").innerHTML = `${
    state.intervalBought ? "" : "// "
  }}, ${state.intervalWait})${
    state.intervalBought
      ? ` // ${Math.ceil(
          config.baseIntervalWait *
            config.intervalWaitPricePower ** state.intervalWaitLevel
        ).toLocaleString()} clicks<br>`
      : ""
  }`;
  document.querySelector(".clicks").textContent = state.clicks;
  save();
});

// Buy a css upgrade
document.querySelectorAll(".css").forEach(function (upgrade) {
  upgrade.addEventListener("click", function () {
    if (this.classList.contains("done")) return;
    if (!checkSubtractCost(+this.dataset.cost)) return;
    Function(`return ${this.dataset.eval}`)();
    this.innerHTML =
      this.innerHTML.trim().slice(2, -2).replace(this.dataset.remove, "") +
      (!(
        this.parentElement.id === "button_active" ||
        this.parentElement.id === "button_hover" ||
        this.parentElement.id === "button_focus" ||
        this.classList.contains("last")
      )
        ? "<br>"
        : "");
    this.classList.remove("upgrade");
    this.classList.add("done");
    Function(
      this.dataset.unlock
        ? `return document.querySelector('#${this.dataset.unlock}').classList.remove('hidden')`
        : ""
    )();
    if (this.id === "font-size-button")
      document
        .querySelectorAll("#transition, #button_active")
        .forEach((el) => el.classList.remove("hidden"));
    if (this.id === "button-active")
      document.querySelector("#button_hover").classList.remove("hidden");
    if (this.id === "button-hover")
      document.querySelector("#button_focus").classList.remove("hidden");
    if (this.id === "button-focus") {
      document.styleSheets[0].insertRule(
        ".click-button:focus:active { transform: translateY(3px) scale(125%) !important; }",
        0
      );
      document.styleSheets[0].insertRule(
        ".click-button:focus:hover { transform: translateY(-3px) scale(125%) !important; }",
        0
      );
    }
  });
});

// Buy a html upgrade
document.querySelectorAll(".html").forEach(function (el) {
  el.addEventListener("click", function () {
    if (this.classList.contains("done")) return;
    if (!checkSubtractCost(+this.dataset.cost)) return;
    Function(`return ${this.dataset.eval}`)();
    if (this.dataset.js === "true") this.innerHTML = this.dataset.replace;
    else this.textContent = this.dataset.replace;
    if (
      document
        .querySelector(`.${this.dataset.unlock}`)
        ?.classList.contains("cps-select")
    )
      document.querySelector(`.${this.dataset.unlock}`).style.display = "block";
    if (this.dataset.eval2) Function(`return ${this.dataset.eval2}`)();
    if (this.dataset.eval3) Function(`return ${this.dataset.eval3}`)();
    this.classList.remove("upgrade");
    this.classList.add("done");
    if (this.dataset.unlock)
      document
        .querySelector(`.${this.dataset.unlock}`)
        .classList.remove("hidden");
  });
});

// Dark mode
document.querySelector("input").addEventListener("click", function () {
  if (
    document.querySelector(".dark-mode-warning")?.textContent ===
    "You can not go into dark mode when the terminal is open"
  )
    return;
  if (state.terminalOpen) {
    this.insertAdjacentHTML(
      "afterend",
      '<span class="dark-mode-warning" style="font-family:sans-serif"><br>You can not go into dark mode when the terminal is open</span>'
    );
    return setTimeout(
      () => document.querySelector(".dark-mode-warning").remove(),
      config.darkModeWarningTime
    );
  }
  document.body.classList.toggle("dark-mode");
  document
    .querySelectorAll(".dark-mode-button img")
    .forEach((el) => el.classList.toggle("hidden"));
  const input = document.querySelector("input");
  const terminalWarning = document.querySelector(".terminal-warning");
  const settings = document.querySelector(".settings");
  if (document.querySelector("input").value.split(" ")[0] === "Dark") {
    darkMode();
  } else {
    input.value = "Dark mode";
    terminalWarning.style.borderColor = "black";
    settings.style.color = "black";
    settings.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    document.documentElement.style.setProperty("--box-shadow-color", "white");
  }
});

// Opening terminal
document
  .querySelector(".terminal-proceed")
  .addEventListener("click", openTerminal);

// Canceling terminal
document
  .querySelector(".terminal-cancel")
  .addEventListener("click", function () {
    this.closest("aside").style.opacity = "0";
    setTimeout(() => (this.closest("aside").style.display = "none"), 500);
  });

// Closes tutorial
document
  .querySelector(".tutorial-close")
  .addEventListener("click", function () {
    const arr = [
      document.querySelector(".overlay"),
      document.querySelector("dialog"),
    ];
    arr.forEach((el) => (el.style.opacity = 0));
    setTimeout(() => {
      arr[0].style.display = "none";
      arr[1].open = false;
    }, 500);
  });

// Open tutorial
document
  .querySelector(".tutorial-button")
  .addEventListener("click", function () {
    const arr = [
      document.querySelector(".overlay"),
      document.querySelector("dialog"),
    ];
    arr[0].style.display = "initial";
    arr[1].open = "true";
    setTimeout(() => arr.forEach((el) => (el.style.opacity = 100)));
  });

// Next step in the tutorial
document.querySelector(".tutorial-next").addEventListener("click", function () {
  state.tutorialPage++;
  if (state.tutorialPage >= config.tutorialMessages.length)
    state.tutorialPage = 1;
  updateTutorial();
});

// Previous step in the tutorial
document
  .querySelector(".tutorial-before")
  .addEventListener("click", function () {
    state.tutorialPage--;
    if (state.tutorialPage < 1)
      state.tutorialPage = config.tutorialMessages.length - 1;
    updateTutorial();
  });

function init() {
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    document.querySelector(".click-button").style.marginTop = "1rem";

  activateLibrary();
  setInterval(spawnGoldenCode, config.goldenCodeCheckTime * 1000);
  setInterval(checkAchievementUnlocked, config.achievementCheckTime);
  config.terminal = setInterval(checkTerminalUnlock, config.terminalTime);
  setInterval(save, config.saveTime * 1000);
  setInterval(saveOfflineTime, config.offlineSaveTime);
  setInterval(mobile, config.mobileCheck);
  setInterval(cpsClick, config.cpsClickTime);
}
init();
