export async function everyOpen() {}

export async function onClose() {}

export async function firstOpen() {
  const menuIcon = this.querySelector("#menu-icon");
  const nav = this.querySelector(".navbar");
  const sidebar = this.querySelector("#sidebar");
  const content = this.querySelector("#content");
  const fab = this.querySelector("#fab");

  fab.onclick = openSearch;

  menuIcon.onclick = toggleSidebar;

  const data = {
    eduAI: {
      gemini: {
        name: "Gemini",
        description: "Talk to Gemini Flash 1.5 developed by Google.",
        url: "/gemini?q=&img=",
      },
    },
    charAI: {
      gojo: {
        name: "Gojo Satorou",
        description: "Strongest sorcerer.",
        url: "/gojo?q=&u=",
      },
      itadori: {
        name: "Itadori Yuji",
        description: "Kind-hearted character.",
        url: "/yuji?q=&u=",
      },
      wednesday: {
        name: "Wednesday Adams",
        description: "A quiet and serious person",
        url: "/adams?q=&u=",
      },
    },
    tools: {
      aidetector: {
        name: "AI Detector",
        description:
          "Detects and scans the text if it is purely AI made or a purely Human made.",
        url: "/aidetector?q=",
      },
      recipe: {
        name: "Recipe",
        description: "Searches an recipe based on the given query by user.",
        url: "/recipe?q=",
      },
    },
  };
  const windowApp = this;

  function toggleSidebar() {
    sidebar.classList.toggle("active");
    menuIcon.classList.toggle("active");
    content.classList.toggle("active");
  }

  const xF = () => {
    const h = this.querySelector("header");
    sidebar.style.marginTop = `${nav.clientHeight + h.clientHeight}px`;
  };

  xF();
  window.addEventListener("resize", xF);

  const mapping = [
    {
      name: "Educational APIs",
      key: "eduAI",
    },
    {
      name: "Character AI APIs",
      key: "charAI",
    },
    {
      name: "Web Tools",
      key: "tools",
    },
  ];

  for (const item of mapping) {
    const anchor = document.createElement("a");

    anchor.textContent = item.name;

    anchor.addEventListener("click", () => {
      fetchEndpoints(item.key);
      toggleSidebar();
    });

    sidebar.appendChild(anchor);
  }

  function fetchEndpoints(category) {
    const endpoints = Object.entries(data[category]);
    content.innerHTML = `
        <h1>${category.toUpperCase()}</h1>
        <div class="endpoint-list">
          ${endpoints
            .map(
              ([key, details]) => `
              <div class="endpoint-item" onclick="window.LiaSparkSYS.openApp('chrome.html', { url: 'https://akhirosites.onrender.com${details.url}' })">
                <h3>${details.name}</h3>
                <p>${details.description}</p>
                <p><strong>Endpoint:</strong> <code >${details.url}</code></p>
              </div>
            `
            )
            .join("")}
        </div>
      `;
  }

  function openSearch() {
    alert("Search feature coming soon!");
  }
}
