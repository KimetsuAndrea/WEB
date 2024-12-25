export function firstOpen() {
  const urlbar = document.getElementById("cassidybrowser-urlbar");
  const iframe = document.getElementById("cassidybrowser-result");
  const backBtn = document.getElementById("cassidybrowser-back");
  const forwardBtn = document.getElementById("cassidybrowser-forward");
  const refreshBtn = document.getElementById("cassidybrowser-refresh");
  const desktop = document.querySelector(".desktop");
  const g = `https://programmablesearchengine.google.com/docs/element/two-page_results.html?query=`;

  const historyStack = [];
  let currentIndex = -1;

  function navigateTo(url) {
    if (currentIndex === -1 || historyStack[currentIndex] !== url) {
      historyStack.splice(currentIndex + 1);
      historyStack.push(url);
      currentIndex++;
    }
    iframe.src = url;
    if (url.startsWith(g)) {
      urlbar.value = decodeURIComponent(url.replace(g, ""));
    } else {
      urlbar.value = url;
    }
    console.log(iframe.src);
    updateButtons();
  }

  function updateButtons() {
    backBtn.disabled = currentIndex <= 0;
    forwardBtn.disabled = currentIndex >= historyStack.length - 1;
  }

  urlbar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = urlbar.value.trim();
      if (query) {
        let url;
        try {
          if (!query.includes(".") || query.includes(" ")) {
            throw 1;
          }
          url = new URL(query.includes("://") ? query : "https://" + query);
        } catch {
          url = new URL(`${g}${encodeURIComponent(query)}`);
        }
        navigateTo(url.href);
      }
      urlbar.blur();
    }
  });

  refreshBtn.addEventListener("click", () => {
    iframe.src = iframe.src;
  });

  backBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      iframe.src = historyStack[currentIndex];
      urlbar.value = historyStack[currentIndex];
    }
    updateButtons();
  });

  forwardBtn.addEventListener("click", () => {
    if (currentIndex < historyStack.length - 1) {
      currentIndex++;
      iframe.src = historyStack[currentIndex];
      urlbar.value = historyStack[currentIndex];
    }
    updateButtons();
  });

  updateButtons();
}

export function everyOpen() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 5000);
  });
}

export const config = {
  showLoadingIcon: true,
};
