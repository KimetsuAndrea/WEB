import { ContextMenu } from "../tools/contextmenu.js";
import LiaSparkSYS from "../tools/parse-app.js";

let externalOpen;

const g = `https://programmablesearchengine.google.com/docs/element/two-page_results.html?query=`;

export const methods = {
  async externalOpen(url) {
    await LiaSparkSYS.openApp("chrome.html", { navigate: url });
  },
};

export const config = {
  showLoadingIcon: true,
};

export const extraMenuClass = ["ml-ctxmenu"];

export const extraMenu = [
  {
    label: "Toggle Page Full Screen",
    callback() {
      const iframe = document.getElementById("chrome-result");
      iframe.requestFullscreen({
        navigationUI: "show",
      });
    },
  },
];

export function validateUrl(query) {
  let url;
  try {
    if (!query.includes(".") || query.includes(" ")) {
      throw 1;
    }
    url = new URL(query.includes("://") ? query : "https://" + query);
  } catch {
    url = new URL(`${g}${encodeURIComponent(query)}`);
  }
  return url.href;
}

export function firstOpen({ navigate } = {}) {
  const urlbar = document.getElementById("chrome-urlbar");
  const iframe = document.getElementById("chrome-result");
  const backBtn = document.getElementById("chrome-back");
  const forwardBtn = document.getElementById("chrome-forward");
  const refreshBtn = document.getElementById("chrome-refresh");
  const desktop = document.querySelector(".desktop");
  const openIn = document.getElementById("chrome-opennew");
  const optB = document.getElementById("chrome-options");

  const handleBack = () => {
    if (currentIndex > 0) {
      currentIndex--;
      iframe.src = historyStack[currentIndex];
      urlbar.value = historyStack[currentIndex];
    }
    hideSearchUrl();
    updateButtons();
  };

  const handleForward = () => {
    if (currentIndex < historyStack.length - 1) {
      currentIndex++;
      iframe.src = historyStack[currentIndex];
      urlbar.value = historyStack[currentIndex];
    }
    hideSearchUrl();
    updateButtons();
  };

  const menuu = document.createElement("div");
  menuu.classList.add("ml-ctxmenu");

  const ctxmenu = new ContextMenu(optB, {
    clean: true,
    items: [
      {
        label: "Reload",
        id: "chrome-ctxreload",
        callback() {
          iframe.src = iframe.src;
        },
        svgIcon: `<svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="var(--ml-1)"
          >
            <path
              d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
            />
          </svg>`,
      },
      {
        label: "Back",
        id: "chrome-ctxback",
        callback() {
          handleBack();
        },
        svgIcon: ` <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="var(--ml-1)"
          >
            <path
              d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
            />
          </svg>`,
      },
      {
        label: "Forward",
        id: "chrome-ctxforward",
        callback() {
          handleForward();
        },
        svgIcon: `<svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="var(--ml-1)"
          >
            <path
              d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"
            />
          </svg>`,
      },
    ],
    menu: menuu,
    leftClick: true,
  });
  ctxmenu.init();

  // optB.addEventListener("click", (e) => {
  //   e.stopImmediatePropagation();
  //   const optR = optB.getBoundingClientRect();
  //   if (!ctxmenu.visible) {
  //     ctxmenu.show({ clientX: optR.left, clientY: optR.top });
  //   } else {
  //     ctxmenu.hide();
  //   }
  // });

  let urlCache = "";

  // ctxmenu.menu.onmouseleave = () => ctxmenu.hide();

  openIn.addEventListener("click", () => {
    window.open(iframe.src);
  });

  urlbar.addEventListener("focus", () => {
    urlCache = iframe.src;
    urlbar.value = urlCache;
    hideSearchUrl();
    urlbar.setSelectionRange(0, urlbar.value.length);
  });

  iframe.onerror = () => {
    console.log("Error url", iframe.src);
    const src = iframe.src;
    iframe.src = "/error?url=" + encodeURIComponent(src);
  };

  iframe.onload = () => {
    if (iframe.src.includes("/new-tab")) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      console.log(iframeDoc);
      try {
        const form = iframeDoc.querySelector("#chrome-form");
        form.addEventListener("submit", (e) => {
          try {
            e.preventDefault();
            const bar = iframeDoc.querySelector("#search-text");
            console.log("New tab search");
            urlCache = bar.value;
            const query = bar.value.trim();
            if (query) {
              navigateTo(validateUrl(query));
            }
            hideHttp();
          } catch (error) {
            console.error(e);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  urlbar.addEventListener("blur", () => {
    urlbar.value = urlCache;
    hideSearchUrl();
  });

  const historyStack = [];
  let currentIndex = -1;

  function navigateTo(url) {
    if (currentIndex === -1 || historyStack[currentIndex] !== url) {
      historyStack.splice(currentIndex + 1);
      historyStack.push(url);
      currentIndex++;
    }
    iframe.src = url;
    hideSearchUrl();
    console.log(iframe.src);
    updateButtons();
  }

  methods.navigateTo = navigateTo;

  function updateButtons() {
    backBtn.disabled = currentIndex <= 0;

    forwardBtn.disabled = currentIndex >= historyStack.length - 1;
    try {
      document.querySelector("#chrome-ctxback").disabled = currentIndex <= 0;
      document.querySelector("#chrome-ctxforward").disabled =
        currentIndex >= historyStack.length - 1;
    } catch (E) {
      // console.error(e)
    }
  }
  function hideSearchUrl() {
    let url = iframe.src;
    if (url.startsWith(g)) {
      urlbar.value = decodeURIComponent(url.replace(g, ""));
    } else {
      urlbar.value = url;
    }
    if (urlbar.value.endsWith("/new-tab")) {
      urlbar.value = "";
    }
  }

  function hideHttp() {
    // const url = iframe.src;
    // const slashes = url
    //   .split("/")
    //   .map((i) => i.trim())
    //   .filter(Boolean);
    // urlbar.value = slashes.slice(2).join("/");
  }

  urlbar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      urlCache = urlbar.value;
      const query = urlbar.value.trim();
      if (query) {
        navigateTo(validateUrl(query));
      } else {
        navigateTo("/new-tab");
      }
      hideHttp();
      urlbar.blur();
    }
  });

  refreshBtn.addEventListener("click", () => {
    iframe.src = iframe.src;
  });

  backBtn.addEventListener("click", handleBack);

  forwardBtn.addEventListener("click", handleForward);

  updateButtons();

  navigateTo(navigate || "/new-tab");
}

export function everyOpen({ url } = {}) {
  if (url && methods.navigateTo) {
    methods.navigateTo(url);
  }
}
