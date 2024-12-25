console.log("Starting LiaWeb");
import { ContextMenu } from "../tools/contextmenu.js";
import { FileHandler } from "../tools/file.js";
import { ModernAudio } from "../tools/modern-components.js";
import LiaSparkSYS from "../tools/parse-app.js";
import { SettingsCreate, ToggleElem } from "../tools/settingscreate.js";
import { Colors, delay } from "../tools/tools.js";
window.ToggleElem = ToggleElem;
window.isMobile = function isPortraitAndMaxWidth768() {
  return window.matchMedia("(max-width: 768px) and (orientation: portrait)")
    .matches;
};

window.addEventListener("contextmenu", (e) => e.preventDefault());
window.addEventListener("dragstart", (e) => e.preventDefault());

const Settings = new SettingsCreate();
window.Settings = Settings;
window.backgroundURL = null;

window.changeBackground = async (url, load) => {
  const isFile = url instanceof File;
  window.backgroundURL = url;
  if (isFile && load !== "load") {
    const file = url;
    const blob = new Blob([file], { type: file.type });

    await Settings.set("wallpaperBlob", blob);

    window.backgroundURL = URL.createObjectURL(blob);
    window.location.href = window.location.href;
  }
  /**
   * @type {Colors}
   */
  const bgColor = await Colors.extractDominantColor(window.backgroundURL);
  // loading.style.backgroundColor = bgColor.applyHsl(0, 0, -10).getHex();

  document.documentElement.style.setProperty(
    "--accent",
    bgColor.absSL(255, 70).getHex()
  );

  const screen = document.querySelector("lia-screen");
  screen.style.backgroundImage = `url("${window.backgroundURL}")`;

  await Colors.autoYou(window.backgroundURL);
};

window.addEventListener("resize", () => {
  if (window.isMobile()) {
    const no = document.querySelector("lia-nomobile");
    no.classList.add("active");
  } else {
    const no = document.querySelector("lia-nomobile");
    no.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  if (window.isMobile()) {
    const no = document.querySelector("lia-nomobile");
    no.classList.add("active");
  }
  window.FileHandler = FileHandler;
  await Settings.initDB();
  const screen = document.querySelector("lia-screen");
  const loading = document.querySelector("lia-loading");

  const retrievedBlob = await Settings.get("wallpaperBlob");

  if (retrievedBlob instanceof Blob) {
    await window.changeBackground(URL.createObjectURL(retrievedBlob));
  } else {
    await window.changeBackground("/css/win.jpg");
  }

  // applyImageColors("/css/win.jpg");
  // const desktopI = document.querySelector(".desktopIcons");
  // desktopI.addEventListener("click", () => {
  //   LiaSparkSYS.blur();
  // });
  // await delay(1500);
  await delay(300);
  const params = new URLSearchParams(window.location.search);

  const appName = params.get("app_name");
  screen.classList.remove("loading");

  if (typeof appName === "string") {
    await LiaSparkSYS.loadApp("settings.html");
    await LiaSparkSYS.openApp(appName + ".html", "lock:full");
  } else {
    await LiaSparkSYS.startLoading(loading);
  }

  loading.remove();

  if (LiaSparkSYS.hasCustom) {
    // await LiaSparkSYS.openApp("custom.html");
  } else {
    // await LiaSparkSYS.openApp("systeminfo.html");
    // await LiaSparkSYS.openApp("systeminfo.html");
    // await LiaSparkSYS.openApp("components.html");
    // await LiaSparkSYS.openApp("settings.html");
  }
  // await LiaSparkSYS.openApp("systeminfo.html");

  // try {
  //   const [...insideA] = document.querySelectorAll(".windowApp a");
  //   // console.log("Custom A:", insideA);

  //   for (const a of insideA) {
  //     a.addEventListener("click", (e) => {
  //       e.preventDefault();
  //       const chrome = LiaSparkSYS.getApp("chrome.html");
  //       if (chrome) {
  //         console.log("Chrme", chrome);
  //         chrome.scriptModule.methods.externalOpen(a.href);
  //       }
  //     });
  //   }
  // } catch (e) {
  //   console.error(e);
  // }
  const taskBar = document.querySelector(".taskBar");

  (function () {
    $(".desktopIcons ul").sortable({
      items: "li",
      placeholder: "state-hi",
      tolerance: "pointer",
      start: function (event, ui) {
        event.stopImmediatePropagation();
        ui.item.css("opacity", "0.5");
        ui.item.css("transition", "none");
        ui.item.css("pointer-events", "none");
      },
      stop: function (event, ui) {
        event.stopImmediatePropagation();

        ui.item.css("opacity", "1");
        ui.item.css("transition", "");
        ui.item.css("pointer-events", "");
      },
      update: function () {
        const order = [];
        $(this)
          .children("li")
          .each(function () {
            order.push({
              id: $(this).attr("id"),
              text: $(this).text(),
            });
          });
        localStorage.setItem("desktopIconsOrder", JSON.stringify(order));
      },
      revert: { duration: 100 },
      // cancel: "#app-list",
      tolerance: "pointer",
    });

    const savedOrder = localStorage.getItem("desktopIconsOrder");
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      const ul = $(".desktopIcons ul");
      order.forEach(function (item) {
        const listItem = $("#" + item.id);
        if (listItem.length) {
          ul.append(listItem);
        }
      });
    }

    $(".desktopIcons ul").disableSelection();
  })();
  (function () {
    $(".taskBar ul").sortable({
      items: "li",
      placeholder: "state-hi",
      tolerance: "pointer",
      start: function (event, ui) {
        event.stopImmediatePropagation();
        // ui.item.css("scale", "0.8");
        ui.item.css("transition", "none");
        ui.item.css("pointer-events", "none");
        ui.item.addClass("no-active");
      },
      stop: function (event, ui) {
        event.stopImmediatePropagation();

        // ui.item.css("scale", "1");
        ui.item.css("transition", "");
        ui.item.css("pointer-events", "");
        ui.item.removeClass("no-active");
      },
      axis: "x",
      update: function () {
        const order = [];
        $(this)
          .children("li")
          .each(function () {
            order.push({
              id: $(this).attr("id"),
              text: $(this).text(),
            });
          });
        localStorage.setItem("taskBarIconsOrder", JSON.stringify(order));
      },
      revert: { duration: 100 },
      // cancel: "#app-list",
      tolerance: "pointer",
    });

    const savedOrder = localStorage.getItem("taskBarIconsOrder");
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      const ul = $(".taskBar ul");
      order.forEach(function (item) {
        const listItem = $("#" + item.id);
        if (listItem.length) {
          ul.append(listItem);
        }
      });
    }

    $(".taskBar ul").disableSelection();
  })();
  // const taskBarWrap = document.querySelector(".taskBarWrap");
  // $(taskBar).resizable({
  //   handles: "s",
  // });
  // Object.assign(taskBar.style, {
  //   bottom: 0,
  // });
  const taskBarMenu = new ContextMenu(taskBar, {
    // bottom: true,
    menu: document.querySelector("#taskbarmenu"),
    allowance: 20,
    onOpen(e) {
      if (!taskBarMenu.visible) {
        const taskBar = document.querySelector(".taskBar");
        const rect = taskBar.getBoundingClientRect();

        taskBarMenu.show({
          clientX: e.clientX,
          clientY: rect.top - taskBar.clientHeight,
        });
      } else {
        taskBarMenu.hide();
      }
    },
  });
  taskBarMenu.init();

  const bgCTX = new ContextMenu(screen, {
    items: [
      {
        label: "Image Settings",
        callback() {
          LiaSparkSYS.openApp("settings.html", {
            page: 2,
          });
        },
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M360-440h400L622-620l-92 120-62-80-108 140ZM120-120q-33 0-56.5-23.5T40-200v-520h80v520h680v80H120Zm160-160q-33 0-56.5-23.5T200-360v-440q0-33 23.5-56.5T280-880h200l80 80h280q33 0 56.5 23.5T920-720v360q0 33-23.5 56.5T840-280H280Zm0-80h560v-360H527l-80-80H280v440Zm0 0v-440 440Z"/></svg>`,
      },
      {
        label: "Reset App Order",
        callback() {
          localStorage.removeItem("desktopIconsOrder");
          window.location.reload();
        },
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z"/></svg>`,
      },
    ],
  });
  bgCTX.init();

  const iOpt = [
    {
      label: "Copy",
      async callback(event, target) {
        if (target instanceof HTMLElement) {
          const text = target.textContent || target.value;

          await navigator.clipboard.writeText(text);
        }
      },
    },
    {
      label: "Copy as HTML",
      async callback(event, target) {
        if (!(target instanceof HTMLInputElement)) {
          const text = target.innerHTML;

          await navigator.clipboard.writeText(text);
        }
      },
    },
    {
      label: "Paste",
      async callback(event, target) {
        if (target instanceof HTMLInputElement) {
          const text = await navigator.clipboard.readText();
          target.value = text;
        }
      },
    },
  ];
  const inputRefs = [];
  const inputRef = () => {
    const allInput = [...document.querySelectorAll("input")];
    for (const input of allInput) {
      if (inputRefs.includes(input)) {
        continue;
      }
      const menu = new ContextMenu(input, { items: iOpt });
      allInput.ctxmenu = menu;
      menu.init();
      inputRefs.push(input);
    }
  };
  new MutationObserver(inputRef).observe(document.body, {
    childList: true,
    attributes: true,
    subtree: true,
    characterData: true,
  });

  const timeDisplay = document.createElement("li");
  timeDisplay.id = "time-display";
  const taskBarUL = document.querySelector(".taskBar ul");
  taskBar.appendChild(timeDisplay);

  function updateTime() {
    const now = new Date();

    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const dateString = now.toLocaleDateString("en-GB");

    document.querySelector(
      "#time-display"
    ).textContent = `${timeString}\n${dateString}`;
  }

  setInterval(updateTime, 1000);
  const desktop = document.querySelector(".desktop");

  ModernAudio.autoShow(desktop);
});

window.addEventListener("keydown", (e) => {
  // console.log(e.key);
  if (e.altKey && e.key.toLowerCase() === "x") {
    e.preventDefault();
    const current = LiaSparkSYS.getApp(LiaSparkSYS.currentFocus);
    if (current) {
      LiaSparkSYS.closeElem(current.wrapper);
    }
  }
});
window.addEventListener("keydown", (e) => {
  // console.log(e.key);
  if (e.altKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    const current = LiaSparkSYS.getApp(LiaSparkSYS.currentFocus);
    if (current) {
      LiaSparkSYS.closeElem(current.wrapper);
    }
    setTimeout(() => {
      LiaSparkSYS.openApp(current.fileName);
    }, 200);
  }
});
// window.addEventListener("keydown", (e) => {
//   // console.log(e.key);
//   if (e.altKey && e.key.toLowerCase() === "m") {
//     e.preventDefault();
//     const current = LiaSparkSYS.getApp(LiaSparkSYS.currentFocus);
//     if (current) {
//       LiaSparkSYS.minimizeElem(current.wrapper);
//     }
//   }
// });

// window.onerror = (...i) => {
//   console.error(...i);
//   LiaSparkSYS.error(i);
// };

window.addEventListener("error", (e) => {
  console.error(e);
  LiaSparkSYS.error(e.error);
});

const originalQuerySelector = Document.prototype.querySelector;

Document.prototype.querySelector = function (selector, newest = false) {
  if (newest) {
    const elements = this.querySelectorAll(selector);
    return elements[elements.length - 1] || null;
  }

  return originalQuerySelector.call(this, selector);
};

window.allowDevTools = false;

document.addEventListener("keydown", (e) => {
  if (window.allowDevTools && !e.shiftKey) {
    return;
  }
  if (
    e.key === "F12" ||
    (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === "i")
  ) {
    e.preventDefault();
    LiaSparkSYS.openApp("settings.html", {
      page: 5,
    });
  }
});

// setInterval(() => {
//   detectDev(() => {
//     window.location.href = window.location.href;
//   });
// }, 1000);

// function detectDev(callback = function () {}) {
//   if (window.allowDevTools) {
//     return;
//   }
//   const devToolsDetector = new Function("'FUCK YOU'; debugger;");
//   const start = performance.now();
//   devToolsDetector();
//   const duration = performance.now() - start;
//   if (duration > 50) {
//     callback(duration);
//   }
// }

document.addEventListener("keydown", (e) => {
  if (
    e.key === "F5" ||
    (e.ctrlKey && e.key === "r") ||
    (e.ctrlKey && e.shiftKey && e.key === "r")
  ) {
    e.preventDefault();
    window.location.href = window.location.href;
  }

  if (e.ctrlKey && e.key === "i") {
    e.preventDefault();
    LiaSparkSYS.openApp("settings.html");
  }
});

window.addEventListener("unhandledrejection", function (event) {
  LiaSparkSYS.error(event.reason);
});
