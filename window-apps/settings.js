export const menuBarClass = ["lm-menubar"];
export const extraMenuClass = ["ml-ctxmenu"];

const { $ } = window;

import LiaSparkSYS from "../tools/parse-app.js";
import { ToggleElem } from "../tools/settingscreate.js";
import { Colors } from "../tools/tools.js";

const toggles = new ToggleElem();

export const config = {
  showLoadingIcon: true,
};

export function firstOpen() {
  const sidepanel = document.querySelector("#lss-panel");
  const safeArea = document.querySelector("#lss-safe");
  showPanel();

  // $(sidepanel).resizable({
  //   handle: "e",
  // });

  for (const config of configs) {
    const result = createPage(config);
    loadedData.push(result);
  }

  toggles.show(0);
}

export function everyOpen({ page = 0 } = {}) {
  toggles.show(page);
  const target = toggles.getVisible();
  target.scrollIntoView();
}

const { Settings } = window;

const loadedData = [];

const configs = [
  {
    name: "Preferences",
    data: [
      {
        labelText: "Window",
        type: "label",
      },
      {
        labelText: "Smooth Borders",
        type: "switch",
        id: "smooth-border",
        default: true,
        async on() {
          document.body.classList.remove("notSmoothW");
        },
        async off() {
          document.body.classList.add("notSmoothW");
        },
      },

      {
        labelText: "Windows Inspired",
        type: "switch",
        id: "win-mode",
        default: false,
        on() {
          document.body.classList.add("winMode");
        },
        off() {
          document.body.classList.remove("winMode");
        },
      },
      {
        labelText: "Texts & Labels",
        type: "label",
      },
      {
        labelText: "Roboto Font",
        type: "switch",
        id: "roboto-font",
        default: false,
        on() {
          document.body.classList.add("roboto");
        },
        off() {
          document.body.classList.remove("roboto");
        },
      },
      {
        labelText: "Shadows",
        type: "switch",
        id: "font-shadow",
        default: false,
        on() {
          document.body.classList.add("fontShadow");
        },
        off() {
          document.body.classList.remove("fontShadow");
        },
      },
    ],
  },
  {
    name: "Themes & Design",
    data: [
      {
        labelText: "Material Recreation",
        type: "label",
      },
      {
        labelText: "Dark Mode",
        type: "switch",
        id: "dark-mode",
        default: false,
        on() {
          // document.body.setAttribute("ml-dark", "");
          Colors.toggleDarkMode();
        },
        off() {
          // document.body.removeAttribute("ml-dark");
          Colors.toggleLightMode();
        },
      },
      {
        labelText: "Adaptive Theme",
        type: "switch",
        id: "adapt-mode",
        default: true,
        on() {
          // document.body.setAttribute("ml-dark", "");
          Colors.enableAdaptiveMode();
        },
        off() {
          // document.body.removeAttribute("ml-dark");
          Colors.disableAdaptiveMode();
        },
      },
      {
        labelText: "CSS Manipulation",
        type: "label",
      },
      // {
      //   labelText: "No Round Corners",
      //   type: "switch",
      //   id: "no-round",
      //   default: false,
      //   async on() {
      //     document.body.classList.add("noRound");
      //   },
      //   async off() {
      //     document.body.classList.remove("noRound");
      //   },
      // },
      // {
      //   labelText: "No Animations",
      //   type: "switch",
      //   id: "no-anim",
      //   default: false,
      //   async on() {
      //     document.body.classList.add("noAnimation");
      //   },
      //   async off() {
      //     document.body.classList.remove("noAnimation");
      //   },
      // },
      {
        labelText: "Render Settings",
        type: "external",
        open: ["render-settings.html"],
      },
    ],
  },
  {
    name: "Images",
    data: [
      {
        labelText: "Wallpaper",
        type: "label",
      },
      {
        labelText: "Gradient Dim",
        type: "switch",
        id: "dark-gr-bg",
        default: false,
        on() {
          document.querySelector("lia-screen").classList.add("grad");
        },
        off() {
          document.querySelector("lia-screen").classList.remove("grad");
        },
      },
      {
        labelText: "Image",
        type: "custom",
        id: "wall-paper",
        onCreate({ strong, div }) {
          const file = document.createElement("input");
          file.type = "file";
          file.id = "lss-file-wallpaper";
          file.style.display = "none";
          const label = document.createElement("label");
          label.setAttribute("for", file.id);
          file.accept = "image/*";
          label.classList.add("ml-btn", "contained", "large");
          label.textContent = "Choose File";
          div.append(strong, file, label);
          file.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file) {
              return;
            }
            await window.changeBackground(file);
          });
        },
      },
      {
        labelText: "Reset Image",
        type: "custom",
        id: "wall-paper-reset",
        onCreate({ div }) {
          const btn = document.createElement("button");
          btn.className = "ml-btn outlined large";
          btn.textContent = "Reset Image";
          div.append(btn);
          btn.onclick = async () => {
            await Settings.set("wallpaperBlob", "");
            window.changeBackground("/css/win.jpg");
          };
        },
      },
    ],
  },
  {
    name: "Apps",
    onOpen() {
      const container = document.querySelector("#lss-app-settings");
      const apps = LiaSparkSYS.apps;

      for (const app of apps) {
        // const div = document.createElement("div");
        // div.classList.add("option");
        const a = createOption({
          labelText: app.name,
          type: "external",
          id: `app-${app.id}`,
          default: true,
          onClick() {},
          open: ["properties.html", { info: app }],
        });

        container.appendChild(a);
      }
    },
    onClose() {
      const container = document.querySelector("#lss-app-settings");
      container.innerHTML = "";
    },
    data: [
      {
        type: "label",
        labelText: "Installed",
      },
      {
        type: "custom",
        onCreate({ div: con }) {
          const div = document.createElement("div");
          div.id = "lss-app-settings";
          div.classList.add("lss-app-list");
          con.append(div);
          con.classList.remove("option");
        },
      },
    ],
  },
  {
    name: "LiaSpark",
    data: [],
  },
  {
    name: "Devtools",
    data: [
      {
        labelText: "Configuration",
        type: "label",
      },
      {
        labelText: "Allow F12 Shortcut",
        type: "switch",
        id: "allow-dev-shortcut",
        default: false,
        on() {
          window.allowDevTools = true;
        },
        off() {
          window.allowDevTools = false;
        },
      },
      {
        labelText: "Enable Eruda",
        type: "switch",
        id: "allow-dev-eruda",
        default: false,
        on() {
          if (!window.eruda) {
            throw new Error("Eruda is not available offline!");
          }
          window.eruda?.init();
        },
        off() {
          if (window.eruda?._devTools) {
            window.eruda.destroy();
          }
        },
      },
    ],
  },
  {
    name: "System Tools",
    data: [
      {
        labelText: "Run a file",
        type: "external",
        open: ["ls-run.html"],
      },
    ],
  },
];

let isHidden = true;

function hidePanel() {
  const sidepanel = document.querySelector("#lss-panel");
  if (!sidepanel) {
    return;
  }
  Object.assign(sidepanel.style, {
    minWidth: "0px",
    width: "0px",
    padding: "0",
    marginLeft: "-10px",
  });
}

function showPanel() {
  const sidepanel = document.querySelector("#lss-panel");
  if (!sidepanel) {
    return;
  }
  Object.assign(sidepanel.style, {
    minWidth: "",
    width: "",
    padding: "",
    marginLeft: "",
  });
  if (window.isMobile()) {
    Object.assign(sidepanel.style, {
      minWidth: "100%",
      width: "100%",
      padding: "",
    });
  }
}

/**
 * <!-- <div class="option label"><b>Window</b></div>
        <div class="option">
          <strong>Smooth Borders</strong>

          <input type="checkbox" class="ml-input-checkbox" />
        </div>
        <div class="option">
          <strong>Dark Mode</strong>

          <input type="checkbox" class="ml-input-checkbox" />
        </div> -->
*/

window.addEventListener("resize", () => {
  if (!window.isMobile()) {
    showPanel();
  } else {
    hidePanel();
  }
});

function createPage(config) {
  const img = document.createElement("img");
  img.src = "/css/icons/left.svg";
  img.classList.add("mobile", "lss-back");
  const sidepanel = document.querySelector("#lss-panel");
  const safeArea = document.querySelector("#lss-safe");
  const {
    name = "Unknown",
    data = [],
    onToggle = () => {},
    onOpen = () => {},
    onClose = () => {},
  } = config;
  const span = document.createElement("span");

  const frag = document.createElement("div");
  frag.classList.add("safeAreaS");
  const h2 = document.createElement("h2");
  h2.textContent = name;

  img.addEventListener("click", () => {
    showPanel();
  });

  span.append(img, h2);
  span.classList.add("lss-span-name");

  // frag.appendChild(img);
  // frag.appendChild(h2);
  frag.appendChild(span);

  const panelItem = document.createElement("div");
  panelItem.classList.add("item");
  panelItem.textContent = name;
  panelItem.addEventListener("click", () => {
    toggles.show(frag);
    if (window.isMobile()) {
      hidePanel();
    }
  });

  frag.addEventListener("toggle-on", () => {
    panelItem.classList.add("active");
    onToggle(frag);
    onOpen(frag);
  });

  frag.addEventListener("toggle-off", () => {
    panelItem.classList.remove("active");
    onClose(frag);
  });

  const childs = [];

  for (const conf of data) {
    const elem = createOption(conf);
    childs.push(elem);
    frag.appendChild(elem);
  }

  safeArea.appendChild(frag);
  sidepanel.appendChild(panelItem);
  toggles.selectors.push(frag);
  toggles.defaultDisplay.push("flex");
  return { config, frag, childs };
}

export async function onLoad() {
  for (const { data } of configs) {
    for (const {
      id = "foo",
      on = () => {},
      off = () => {},
      default: isDefault,
    } of data) {
      const state = await Settings.get(`${id}_hasDef`);

      if (!state) {
        console.log("default", id, isDefault);
        if (isDefault) {
          Settings.set(id, true);
          on(true, id);
        } else {
          Settings.set(id, false);
          off(false, id);
        }
      } else {
        const xState = await Settings.get(id);
        xState ? on(true, id) : off(false, id);
      }
    }
  }
}

/* <div class="option label"><b>Window</b></div>
          <div class="option">
            <strong>Smooth Borders</strong>

            <input type="checkbox" class="ml-input-checkbox" />
          </div> */

function createOption(config) {
  const {
    labelText = "Unknown",
    type = "label",
    on,
    off,
    id = "foo",
    default: isDefault = false,
    onCreate,
    onClick = () => {},
    open = [],
  } = config;

  const div = document.createElement("div");
  div.classList.add("option");

  if (type === "label") {
    div.classList.add("label");
    const bold = document.createElement("b");
    bold.textContent = labelText;
    div.appendChild(bold);
  } else if (type === "switch") {
    const strong = document.createElement("strong");
    strong.textContent = labelText;
    const switchX = document.createElement("input");
    switchX.type = "checkbox";
    switchX.classList.add("ml-input-checkbox");
    (async () => {
      const xState = await Settings.get(id);
      switchX.checked = xState;
    })();

    switchX.addEventListener("input", async () => {
      const state = await Settings.get(id);
      await Settings.set(`${id}_hasDef`, true);
      if (state) {
        await Settings.set(id, false);
        await off(await Settings.get(id), id);
      } else {
        await Settings.set(id, true);
        await on(await Settings.get(id), id);
      }

      // console.log(id, await Settings.get(id));
    });

    div.append(strong, switchX);
  } else if (type === "custom") {
    const strong = document.createElement("strong");
    strong.textContent = labelText;
    onCreate({ strong, div });
  } else if (type === "item") {
    const strong = document.createElement("strong");
    strong.textContent = labelText;
    div.append(strong);
  } else if (type === "external") {
    const strong = document.createElement("strong");
    strong.textContent = labelText;
    div.append(strong);
    div.addEventListener("click", () => {
      LiaSparkSYS.openApp(...open);
    });
    const b = document.createElement("span");
    b.innerHTML = `<svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="var(--ml-2)"
          >
            <path
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"
            />
          </svg>`;
    div.appendChild(b);
  }
  div.addEventListener("click", onClick);

  return div;
}
