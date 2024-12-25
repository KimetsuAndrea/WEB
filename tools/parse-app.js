import { ContextMenu } from "./contextmenu.js";
import { delay } from "./tools.js";

class LiaSparkSYS {
  static get windowChilds() {
    const allChild = [...document.querySelectorAll(".desktop .wrapperApp")];
    return allChild;
  }
  static currentFocus = null;
  static apps = [];
  static tabindex = 0;
  static current = null;
  static hasCustom = false;
  static async startLoading(screen) {
    const res = await fetch("/window-apps/config.json");
    const array = await res.json();
    console.log(array);
    const params = new URLSearchParams(window.location.search);
    const customApp = params.get("customapp");
    if (customApp) {
      console.log("custom app detected!", customApp);
      try {
        await this.loadApp(customApp, { type: "string" });
        this.hasCustom = true;
        await LiaSparkSYS.openApp("custom.html");
      } catch (error) {
        console.error(error);
      }
    }
    let i = 0;
    for (const fileName of array) {
      try {
        await this.loadApp(fileName);
      } catch (error) {
        console.error(error);
        LiaSparkSYS.error(error);
      }
      i++;
      screen.innerHTML = `<h6>Loading: [ ${i} / ${array.length} ]</h6>`;
    }
  }
  static taskBarActives = [];
  static async taskBar(id) {
    if (this.taskBarActives.some((i) => i.id === id)) {
      return;
    }
    const { doc, fileName } = this.getApp(id + ".html");
    const app = document.querySelector(".wrapperApp#" + id);
    console.log(app);
    if (!app) {
      // Promise.reject("Missing app");
      return;
    }
    const iconSrc =
      doc.querySelector("lia-meta lia-icon")?.getAttribute("src") ??
      "/css/icons/exe_OneDrive_icon.svg.png";
    const name =
      doc.querySelector("lia-meta lia-appname")?.textContent ?? "Unknown App";
    const taskbarUL = document.querySelector("div.taskBar ul");
    const iconItem = document.createElement("li");
    const img = document.createElement("img");
    img.src = iconSrc;
    img.title = name;
    iconItem.appendChild(img);
    iconItem.addEventListener("click", () => {
      if (app.classList.contains("windowFocus")) {
        // iconItem.classList.remove("itemFocus");
        // iconItem.classList.add("itemUnfocus");
        LiaSparkSYS.closeElem(id);
      } else {
        LiaSparkSYS.focus(app);
      }
    });
    taskbarUL.appendChild(iconItem);
    this.taskBarActives.push({ id, doc, iconItem });
    const desMenu = new ContextMenu(iconItem, {
      items: [
        {
          label: "Close (Alt + x)",
          callback() {
            LiaSparkSYS.closeElem(id);
          },
          svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`,
        },
      ],
      onOpen(e) {
        if (!desMenu.visible) {
          const taskBar = document.querySelector(".taskBar");
          const rect = taskBar.getBoundingClientRect();
          const rect2 = iconItem.getBoundingClientRect();

          desMenu.show({
            clientX: rect2.left,
            clientY: rect.top - taskBar.clientHeight,
          });
          for (const app of LiaSparkSYS.apps) {
            if (app.fileName === fileName) {
              continue;
            }
            app.desMenu?.hide();
          }
        } else {
          desMenu.hide();
        }
      },
    });
    desMenu.init();
    return () => this.untaskBar(id);
  }
  static async untaskBar(id) {
    const match = this.taskBarActives.find((i) => i.id === id);
    if (match) {
      match.iconItem.remove();
      this.taskBarActives.splice(this.taskBarActives.indexOf(match), 1);
      return true;
    }
    return false;
  }
  static async loadApp(fileNam, { type = "filename", hide } = {}) {
    let fileName = `${fileNam}`;
    let baseurl = `/window-apps/`;
    if (fileName.startsWith("http")) {
      const arr = fileName
        .split("/")
        .map((i) => i.trim())
        .filter(Boolean);
      baseurl = arr.slice(-1);
      console.log(`Loading external module from `, baseurl);
    }
    let html;
    if (type === "filename") {
      const res = await fetch(`${baseurl}${fileName}`);
      html = await res.text();
    } else if (type === "string") {
      html = fileName;
      fileName = "custom.html";
    }
    // console.log(html);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const shortcuts = [
      ...(doc.querySelector("lia-meta lia-shortcut")?.attributes ?? []),
    ].map((i) => [i?.name, i?.value]);
    const properties = [
      ...(doc.querySelector("lia-meta lia-properties")?.attributes ?? []),
    ].map((i) => [i?.name, i?.value]);

    hide ??= doc.querySelector("lia-meta lia-hidden")?.textContent === "true";

    const doctype = doc.doctype.name;
    if (doctype !== "window") {
      throw new Error("DOCTYPE Must be a window, received: " + doctype);
    }

    const appDoc = document.createElement("div");
    const iconSrc =
      doc.querySelector("lia-meta lia-icon")?.getAttribute("src") ??
      "/css/icons/exe_OneDrive_icon.svg.png";
    const name =
      doc.querySelector("lia-meta lia-appname")?.textContent ?? "Unknown App";
    const content = doc.querySelector("main");
    if (content?.style) {
      content.style.zIndex = 29;
    }
    if (content === null) {
      throw new Error("Missing main tag");
    }
    // const main = content.attachShadow({ mode: "closed" });
    const main = content;
    // main.innerHTML = content.innerHTML;
    // content.innerHTML = "";
    // const styles = doc.querySelectorAll("style");
    // main.append(...styles);

    // <ul>
    //       <li>
    //         <img src="css/icons/app-list.svg" alt="" title="App List" />
    //         <p>App List</p>
    //       </li>
    //     </ul>
    const desktopUL = document.querySelector("div.desktopIcons ul");
    const desItem = document.createElement("li");
    const pL = document.createElement("p");
    pL.textContent = name;

    const taskbarUL = document.querySelector("div.taskBar ul");
    const iconItem = document.createElement("li");
    const img = document.createElement("img");
    const colorWindow =
      doc.querySelector("color-window")?.textContent ?? "white";
    const colorName = doc.querySelector("color-name")?.textContent ?? "black";
    const colorBg = doc.querySelector("color-bg")?.textContent;
    img.src = iconSrc;
    img.title = name;
    const img2 = document.createElement("img");

    img2.src = iconSrc;
    desItem.title = name;
    iconItem.appendChild(img);
    desItem.appendChild(img2);
    desItem.appendChild(pL);

    desItem.id = `${fileName.replace(".html")}-desitem`.replaceAll(".", "-");
    iconItem.id = `${fileName.replace(".html")}-iconitem`.replaceAll(".", "-");
    const items = [
      {
        label: "Open",
        callback() {
          LiaSparkSYS.openApp(fileName);
          desMenu.hide();
        },
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M520-400h200v-240H520v240ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>`,
      },
      {
        label: "Open in Settings",
        callback() {
          LiaSparkSYS.openApp("settings.html", { page: 3 });
        },
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M440-280h80l12-60q12-5 22.5-10.5T576-364l58 18 40-68-46-40q2-14 2-26t-2-26l46-40-40-68-58 18q-11-8-21.5-13.5T532-620l-12-60h-80l-12 60q-12 5-22.5 10.5T384-596l-58-18-40 68 46 40q-2 14-2 26t2 26l-46 40 40 68 58-18q11 8 21.5 13.5T428-340l12 60Zm40-120q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>`,
      },
      {
        label: "Open in Browser",
        callback() {
          window.open(
            `?app_name=${info.id}`,
            "_blank",
            `width=600,height=400,status=no,menubar=no,location=no,toolbar=no,directories=no`
          );
        },
        svgIcon: `<svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
        >
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"
          />
        </svg>`,
      },
      {
        label: "Properties",
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M686-132 444-376q-20 8-40.5 12t-43.5 4q-100 0-170-70t-70-170q0-36 10-68.5t28-61.5l146 146 72-72-146-146q29-18 61.5-28t68.5-10q100 0 170 70t70 170q0 23-4 43.5T584-516l244 242q12 12 12 29t-12 29l-84 84q-12 12-29 12t-29-12Zm29-85 27-27-256-256q18-20 26-46.5t8-53.5q0-60-38.5-104.5T386-758l74 74q12 12 12 28t-12 28L332-500q-12 12-28 12t-28-12l-74-74q9 57 53.5 95.5T360-440q26 0 52-8t47-25l256 256ZM472-488Z"/></svg>`,
        callback() {
          LiaSparkSYS.openApp("properties.html", { info });
        },
      },
    ];
    const desMenu = new ContextMenu(desItem, {
      items,
      onOpen(e) {
        if (!desMenu.visible) {
          const rect = desItem.getBoundingClientRect();
          desMenu.show({ clientX: rect.left, clientY: rect.bottom });
          for (const app of LiaSparkSYS.apps) {
            if (app.fileName === fileName) {
              continue;
            }
            app.desMenu?.hide();
          }
        } else {
          desMenu.hide();
        }
      },
    });
    const taskMenu = new ContextMenu(iconItem, {
      items,
      allowance: taskbarUL.clientHeight,
    });
    taskMenu.init();

    const openLogic = () => {
      const target = info;
      const [...existing] = document.querySelectorAll(".desktop .wrapperApp");
      let aa = 0;
      for (const ex of existing) {
        const chi = ex?.querySelector(".windowApp");
        if (chi && chi.id === target.id) {
          this.closeElem(ex);
          aa++;
        }
      }
      if (!aa) {
        LiaSparkSYS.openApp(fileName);
      }
    };

    iconItem.addEventListener("click", openLogic);
    desItem.addEventListener("dblclick", () => {
      LiaSparkSYS.openApp(fileName);
    });

    if (shortcuts.length > 0) {
      window.addEventListener("keydown", (event) => {
        event.ctrl = event.ctrlKey;
        event.shift = event.shiftKey;
        console.log(event);
        if (
          shortcuts.every((i) => {
            return String(event[i[0]]) == i[1];
          })
        ) {
          event.preventDefault();
          LiaSparkSYS.openApp(fileName);
        }
      });
    }
    this.tabindex++;
    desItem.tabIndex = this.tabindex;
    const liaPin = doc.querySelector("lia-meta lia-pin");
    if (liaPin?.textContent === "true" && !hide) {
      taskbarUL.appendChild(iconItem);
    }
    if (!hide) {
      desktopUL.appendChild(desItem);
    }
    desMenu.init();
    appDoc.appendChild(content);
    let script;

    let scriptModule = null;
    try {
      scriptModule = await import(
        `${baseurl}${fileName.replaceAll("html", "")}js`
      );
    } catch (error) {
      console.error(error);
      // LiaSparkSYS.error(error.stack);
    }
    let scriptStr;

    try {
      const r2 = await fetch(`${baseurl}${fileName.replaceAll("html", "")}js`);
      const txt = await r2.text();
      scriptModule ? null : (script = txt);
      scriptStr = txt;
    } catch (error) {
      console.error(error);
      // LiaSparkSYS.error(error);
    }

    if (type === "string") {
      try {
        const params = new URLSearchParams(window.location.search);
        const customScript = params.get("customscript");
        const blob = new Blob([customScript], {
          type: "application/javascript",
        });
        const url = URL.createObjectURL(blob);

        scriptModule = await import(url);
      } catch (error) {
        console.error("CUSTOM:", error);
        LiaSparkSYS.error(error);
      }
    }

    if (typeof scriptModule?.onLoad === "function") {
      try {
        await scriptModule.onLoad();
      } catch (error) {
        console.error(error);
        LiaSparkSYS.error(error);
      }
    }

    const allMenus = [...doc.querySelectorAll("lia-meta lia-menu")];

    const info = {
      doc,
      allMenus,
      colorName,
      colorWindow,
      content,
      main,
      host: content,
      name,
      scriptStr: scriptStr ?? "",
      html,
      iconSrc,
      colorBg,
      scriptModule,
      appDoc,
      iconElem: iconItem,
      imgElem: img,
      type: doctype,
      fileName,
      script,
      id: fileName.replaceAll(".html", ""),
      desMenu,
      hidden: hide,
      shortcuts,
      properties,
      configModule: scriptModule?.config ?? {},
    };
    this.apps.push(info);
    console.log(info);
    this.apps.sort((a, b) => String(a.name).localeCompare(b.name));
  }
  static createApp({
    fileName = `custom_${Date.now()}.html`,
    name = "Unknown App",
    iconSrc = "/css/icons/exe_OneDrive_icon.svg.png",
    colorWindow = "white",
    colorName = "black",
    colorBg = null,
    hide = false,
    type = "window",
    scriptModule = null,
    doc = null,
    ...restParams
  } = {}) {
    const backgroundColor = colorBg || "transparent";

    const info = {
      doc,
      colorName,
      colorWindow,
      colorBg: backgroundColor,
      name,
      iconSrc,
      type,
      fileName,
      id: fileName.replaceAll(".html", ""),
      ...restParams,
    };

    this.apps.push(info);

    return info;
  }

  static getApp(fileName) {
    return (
      [...this.apps]
        .reverse()
        .find((i) => i.fileName === fileName || i.id === fileName) ?? null
    );
  }
  static async openApp(fileName, ...args) {
    document.body.style.cursor = "wait";

    const { $ } = window;
    let target = this.getApp(fileName);
    if (!target) {
      console.log(`App ${fileName} not found, loading it automatically.`);
      try {
        await LiaSparkSYS.loadApp(fileName, { hide: true });
        target = this.getApp(fileName);
      } catch (error) {
        LiaSparkSYS.error(error);
        document.body.style.cursor = "unset";
      }
    }
    if (!target) {
      // throw new Error("App not found.");
      document.body.style.cursor = "unset";
      return LiaSparkSYS.error("App not found.");
    }
    console.log("Opening " + fileName);
    /**
     * <!-- <div class="windowApp">
          <header style="background-color: #aabeff; color: black">
            <img src="/css/icons/globe.png" alt="" class="icon" />
            <h1>Example</h1>
          </header>
          <main>Contents here</main>
        </div> -->
     */
    const [...existing] = document.querySelectorAll(".desktop .wrapperApp");
    let aa = 0;
    for (const ex of existing) {
      const chi = ex?.querySelector(".windowApp");
      if (chi && chi.id === target.id) {
        this.closeElem(ex);
        aa++;
      }
    }
    // if (aa) {
    //   return;
    // }
    // if (existing) {
    //   existing.remove();
    // }

    if (aa) {
      // return;
      // await LiaSparkSYS.loadApp(fileName, { hide: true });
      // target = this.getApp(fileName);
    }
    const isLockFull = args[0] === "lock:full";
    const extraMenu = target.scriptModule?.extraMenu ?? [];

    const header = document.createElement("header");
    const img = document.createElement("img");
    img.src = target.iconSrc;
    const h1 = document.createElement("h1");
    h1.style.color = target.colorName;
    header.style.background = target.colorWindow;
    h1.textContent = target.name;
    const main = document.createElement("main");
    main.appendChild(target.content);
    const xButton = document.createElement("button");
    const max = document.createElement("button");
    const defaults =
      target.doc.querySelector("lia-meta lia-defaults") ??
      document.createElement("lia-defaults");
    // max.textContent = "▢";
    // max.textContent = "◨⁝";
    max.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${target.colorName}"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>`;
    // max.title = "Toggle Maximize";
    max.title = "Menu";
    // xButton.textContent = "✕";
    xButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${target.colorName}"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
    const span = document.createElement("span");
    span.classList.add("opts");
    max.classList.add("max", "not-mobile");
    xButton.classList.add("x");
    xButton.style.color = target.colorName;
    max.style.color = target.colorName;
    xButton.title = "Close (Alt + x)";
    const xFunc = async () => {
      LiaSparkSYS.closeElem(wrapper, updateCurrent);
      if (isFull) {
        const taskBar = document.querySelector(".taskBar");

        document.exitFullscreen();
        isFull = false;
        taskBar.classList.remove("none");
        wrapper.classList.remove("maximiX");
        wrapper.classList.remove("maximized");
      }
      if (target.scriptModule) {
        const { onClose } = target.scriptModule;
        if (typeof onClose === "function") {
          try {
            await onClose.bind(wrapper)(...args);
          } catch (error) {
            console.error(error);
            LiaSparkSYS.error(error);
          }
        }
      }
      // removeT();
    };
    xButton.addEventListener("click", xFunc);
    span.append(max, xButton);
    // span.append(xButton);
    target.host.classList.add("off");
    header.append(img, h1, span);

    const loadingScreen = document.createElement("div");
    loadingScreen.classList.add("loadingScreen");

    const loadingIMG = document.createElement("img");

    loadingIMG.src = target.iconSrc;

    loadingScreen.append(loadingIMG);

    const div = document.createElement("div");
    if (target.configModule.showLoadingIcon === true) {
      div.append(loadingScreen);
    }

    if (target.scriptModule) {
      const { windowClass } = target.scriptModule;
      if (windowClass) {
        div.classList.add(...windowClass);
      }
    }
    if (isLockFull) {
      div.style.animation = "none";
    }
    div.classList.add("windowApp");
    div.id = target.id;
    div.appendChild(header);
    const maxFunc = () => {
      if (window.isMobile()) {
        return;
      }
      wrapper.classList.add("tran");
      div.classList.add("tran");

      // wrapper.classList.toggle("maximized");
      if (wrapper.classList.contains("maximized")) {
        wrapper.classList.remove("maximized");
      } else {
        const onA = (e) => {
          header.removeEventListener("mousedown", onA);
          // wrapper.style.top = `${e.clientY - 30}px`;
          // wrapper.style.left = `${e.clientX - 30}px`;
          maxFunc();
        };
        wrapper.classList.add("maximized");
        // header.addEventListener("mousedown", onA);
      }
      setTimeout(() => {
        div.classList.remove("tran");
        setTimeout(() => {
          wrapper.classList.remove("tran");
        }, 200);
      }, 100);
    };
    header.addEventListener("dblclick", (e) => {
      e.stopImmediatePropagation();

      maxFunc();
    });
    // max.addEventListener("click", (e) => {
    //   e.stopImmediatePropagation();
    //   maxFunc();
    // });

    const lockFull = () => {
      const taskBar = document.querySelector(".taskBar");

      taskBar.classList.add("none");
      wrapper.classList.add("maximiX");
      wrapper.classList.remove("maximized");
    };
    const fullX = () => {
      const taskBar = document.querySelector(".taskBar");
      // taskBar.classList.toggle("none");
      // wrapper.classList.toggle("maximiX");
      // wrapper.classList.remove("maximized");
      if (isFull) {
        document.exitFullscreen();
        isFull = false;
        taskBar.classList.remove("none");
        wrapper.classList.remove("maximiX");
        wrapper.classList.remove("maximized");
      } else {
        document.body.requestFullscreen();
        isFull = true;
        taskBar.classList.add("none");
        wrapper.classList.add("maximiX");
        wrapper.classList.remove("maximized");
      }
    };
    const handleR = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const rect = max.getBoundingClientRect();
      ctxmenu.show({ clientX: rect.right, clientY: rect.top });
    };
    const handleR2 = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const rect = img.getBoundingClientRect();
      ctxmenu.show({ clientX: rect.left + 10, clientY: rect.bottom });
    };
    max.addEventListener("click", handleR);
    img.addEventListener("click", handleR2);

    this.current = {
      target,
      elem: div,
    };
    const updateCurrent = () => {
      this.current = {
        target,
        elem: div,
      };
      LiaSparkSYS.focus(target);
      // console.log("Current window:", this.current);
    };
    // div.addEventListener("click", updateCurrent);
    // div.addEventListener("mousemove", updateCurrent);
    div.addEventListener("mousedown", updateCurrent);
    const desktop = document.querySelector(".desktop");
    if (target.colorBg) {
      div.style.background = target.colorBg;
    } else {
      delete div.style.background;
    }

    const wrapper = document.createElement("div");

    if (defaults) {
      const width = defaults.getAttribute("width");
      const height = defaults.getAttribute("height");
      if (width) {
        wrapper.style.width = width;
        // div.style.width = width;
      }
      if (height) {
        wrapper.style.height = height;
        // div.style.height = height;
      }
    }
    wrapper.id = target.id;
    wrapper.style.pointerEvents = "none";
    wrapper.style.position = "fixed";

    // wrapper.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    // wrapper.style.backgroundColor = "black";
    wrapper.appendChild(div);
    wrapper.classList.add("wrapperApp");

    const menuDiv = document.createElement("div");
    let isFull = false;
    let observerX = null;

    const mappingOpt = [
      {
        label: "Close (Alt + x)",
        callback: xFunc,
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`,
      },
      {
        label: "Toggle Maximize",
        callback: maxFunc,
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>`,
      },
      // {
      //   label: "Toggle Full Screen",
      //   callback() {
      //     // maxFunc();
      //     if (isFull) {
      //       document.exitFullscreen();
      //       isFull = false;
      //     } else {
      //       document.body.requestFullscreen();
      //       isFull = true;
      //     }
      //   },
      // },
      {
        label: "Enable Resize",
        id: "w-enablere",
        callback() {
          setTimeout(() => {
            ctxmenu.menu.querySelector("#w-enablere").remove();
            // ctxmenu.menu.querySelector("#w-snap").remove();
          }, 200);
          enableRe();
        },
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M760-600v-160H600v-80h240v240h-80ZM120-120v-240h80v160h160v80H120Zm0-320v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm160 0v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Z"/></svg>`,
      },
      {
        label: "Snap to Center",
        id: "w-snap",
        callback() {
          const rect = wrapper.getBoundingClientRect();
          wrapper.classList.add("tran");
          // wrapper.style.left = `${
          //   (innerWidth - target.content.offsetWidth) / 2
          // }px`;
          // wrapper.style.top = `${
          //   (innerHeight - target.content.offsetHeight) / 2 - 35
          // }px`;
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const taskBar = document.querySelector(".taskBar");

          const wrapperWidth = wrapper.offsetWidth;
          const wrapperHeight = wrapper.offsetHeight;

          wrapper.style.left = `${(viewportWidth - wrapperWidth) / 2}px`;
          wrapper.style.top = `${
            (viewportHeight - wrapperHeight) / 2 - taskBar.clientHeight / 2
          }px`;
          setTimeout(() => {
            // autoAdj();
            wrapper.classList.remove("tran");
          }, 200);
        },
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="m156-100-56-56 124-124H120v-80h240v240h-80v-104L156-100Zm648 0L680-224v104h-80v-240h240v80H736l124 124-56 56ZM120-600v-80h104L100-804l56-56 124 124v-104h80v240H120Zm480 0v-240h80v104l124-124 56 56-124 124h104v80H600Z"/></svg>`,
      },
      {
        label: "Restart (Alt + r)",
        callback() {
          xFunc();
          setTimeout(() => {
            LiaSparkSYS.openApp(fileName, ...args);
          }, 200);
        },
        svgIcon: `<svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
          >
            <path
              d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
            />
          </svg>`,
      },
      {
        label: "Simulate Freeze",
        callback() {
          const aa = " - Not Responding";
          if (div.classList.contains("frozen")) {
            div.classList.remove("frozen");
            // observerX?.disconnect();
          } else {
            div.classList.add("frozen");
          }
        },
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Zm320-80Zm0-640Z"/></svg>`,
      },
      {
        label: "Toggle Full Screen",
        callback: fullX,
        svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" ><path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"/></svg>`,
      },
      ...extraMenu,
    ];
    const ctxmenu = new ContextMenu(div, {
      menu: menuDiv,
      items: isLockFull
        ? [
            {
              label: "Reload App",
              callback() {
                window.location.reload();
              },
            },
          ]
        : mappingOpt,
    });
    if (target.scriptModule?.extraMenuClass) {
      menuDiv.className = target.scriptModule?.extraMenuClass.join(" ");
      ctxmenu.clean = true;
    }
    if (true) {
      ctxmenu.init();
    }
    // wrapper.style.left = `20px`;
    // wrapper.style.top = `20px`;

    const autoAdj = () => {
      const allApps = [...document.querySelectorAll(".desktop .wrapperApp")];
      wrapper.style.left = "10px";
      wrapper.style.top = "10px";
      wrapper.doc = target.doc;
      let currentX = parseInt(wrapper.style.left || "10");
      let currentY = parseInt(wrapper.style.top || "10");
      // console.log("Current: ", currentX, currentY);
      for (const app of allApps) {
        if (app === wrapper) {
          continue;
        }
        const com = getComputedStyle(app);
        const x = parseInt(com.left);
        const y = parseInt(com.top);
        // console.log("Other Current: ", x, y);
        if (currentX === x || currentY === y) {
          wrapper.style.left = `${currentX + 20}px`;
          currentX = parseInt(wrapper.style.left || "10");
          if (!this.isElementNotFullyInViewport(wrapper)) {
            wrapper.style.top = `${currentY + 20}px`;

            currentY = parseInt(wrapper.style.top || "10");
          } else {
            wrapper.style.top = `${currentY - 40}px`;

            currentY = parseInt(wrapper.style.top || "10");
          }
        }
      }
      // if (this.isElementNotFullyInViewport(wrapper)) {
      //   wrapper.style.left = `${parseInt(wrapper.style.left) - 20}px`;
      //   wrapper.style.top = `${parseInt(wrapper.style.top) - 20}px`;
      // }
    };
    autoAdj();
    target.wrapper = wrapper;

    const enableRe = () => {
      $(wrapper).resizable({
        handles: "n, e, s, w, ne, nw, se, sw",

        resize(event, ui) {
          target.content.style.marginTop = `${bar.clientHeight + 30}px`;
          // wrapper.style.height = div.style.height;
          // wrapper.style.width = div.style.width;
          // if (div.style.top) {
          //   // wrapper.style.top = `${
          //   //   parseFloat(div.style.top) + parseFloat(wrapper.style.top)
          //   // }px`;
          //   // div.style.top = "";
          // }
          // if (div.style.left) {
          //   wrapper.style.left = `${
          //     parseFloat(div.style.left) + parseFloat(wrapper.style.left)
          //   }px`;
          //   div.style.left = "";
          // }
          // // div.style.height = "";
          // // div.style.width = "";
        },
        minHeight: 60,
        minWidth: 120,
      });
    };

    desktop.appendChild(wrapper);
    div.appendChild(target.host);
    this.taskBar(target.id);

    LiaSparkSYS.focus(target);

    await delay(300);
    // await delay(1000);

    const script = target.script;
    if (script && !script.trim().startsWith("<")) {
      const s = document.createElement("script");
      s.innerHTML = script;
      target.main.appendChild(s);
      // eval(script);
    }

    const exiBar = target.content.querySelector("#menubar-app");

    if (exiBar) {
      exiBar.remove();
    }
    const bar = document.createElement("ul");
    bar.id = "menubar-app";
    const allMenus = target.scriptModule?.menuBar ?? [];
    if (allMenus.length > 0) {
      bar.classList.add(
        ...(target.scriptModule?.menuBarClass ?? ["lia-menubar"])
      );
      target.content.appendChild(bar);

      let barActive = false;
      for (const barData of allMenus) {
        const opt = document.createElement("lia-menu");

        barData.opt = opt;

        const { data = [] } = barData;

        const li = document.createElement("li");
        li.textContent = barData.name || "Unknown";
        opt.style.display = "none";
        Object.assign(opt.style, {
          position: "absolute",
          top: `${bar.clientHeight + 10}px`,
        });
        opt.classList.add("content");
        opt.li = li;

        bar.appendChild(opt);
        window.addEventListener("click", () => {
          opt.li.classList.remove("active");
          opt.style.display = "none";
          barActive = false;
        });
        const liH = (e, f) => {
          e.stopPropagation();

          if (opt.style.display === "block" && !f) {
            opt.style.display = "none";
            li.classList.remove("active");
            barActive = false;
            opt.style.animation = "";
          } else {
            if (f) {
              // opt.style.animation = "none";
            } else {
              opt.style.animation = "";
            }
            if (!window.isMobile()) {
              opt.style.left = `${li.offsetLeft}px`;
            }

            opt.style.display = "block";
            if (window.isMobile()) {
              opt.style.top = 0;
              opt.style.transform = `translateY(-${opt.clientHeight}px)`;
              opt.style.maxWidth = "calc(100% - 10px)";
              opt.style.width = opt.style.maxWidth;
            }
            li.classList.add("active");
            for (const a of allMenus) {
              if (a.opt === opt) {
                continue;
              }
              a.opt.li.classList.remove("active");
              a.opt.style.display = "none";
            }
            barActive = true;
            // dataElems[0].focus();
            // console.log(dataElems[0]);
          }
        };
        li.addEventListener("mouseenter", (e) => {
          if (barActive) {
            return liH(e, true);
          }
        });
        li.addEventListener("click", liH);
        opt.style.maxHeight = `${target.content.clientHeight / 2}px`;
        let dataElems = [];
        let tabIndex = 1;
        for (const { label, callback, props = {}, html } of data) {
          const div = document.createElement("div");
          if (html) {
            div.innerHTML = html;
          } else {
            div.classList.add("item");
            div.textContent = label;
          }
          opt.appendChild(div);
          div.addEventListener("click", callback);
          for (const key in props) {
            div.setAttribute(key, props[key]);
          }

          if (!html) {
            ctxmenu.addOption({
              label: `${barData.name || "Unknown"} > ${label}`,
              callback,
            });
          }
          div.tabIndex = tabIndex;

          dataElems.push(div);
          tabIndex++;
        }

        // li.appendChild(opt)
        bar.appendChild(li);
      }

      const adapt = () => {
        const barHeight = bar.getBoundingClientRect().height;

        if (window.isMobile()) {
          target.content.style.marginBottom = `${barHeight}px`;
          target.content.style.height = `calc(100% - ${
            barHeight + header.clientHeight
          }px)`;
          bar.style.bottom = 0;

          bar.style.top = "unset";
          bar.style.height = `${header.clientHeight}px`;
        } else {
          bar.style.marginTop = `${header.clientHeight}px`;
          bar.style.top = 0;

          // console.log(bar.getBoundingClientRect());
          target.content.style.marginTop = `${
            barHeight + header.clientHeight
          }px`;
          target.content.style.height = `calc(100% - ${
            barHeight + header.clientHeight
          }px)`;
          delete bar.style.height;
        }
      };
      adapt();
      addEventListener("resize", () => adapt());
    }
    if (isLockFull) {
      lockFull();
    }
    // const removeT = this.taskBar(target.doc);
    if (target.scriptModule) {
      const { firstOpen, everyOpen } = target.scriptModule;
      console.log(target.scriptOpened, target.id, target.scriptModule);
      if (typeof firstOpen === "function" && !target.scriptOpened) {
        try {
          target.scriptOpened = true;

          await firstOpen.bind(wrapper)(...args);
          console.log(target.scriptOpened, target.id, target.scriptModule);
        } catch (error) {
          console.error(error);
          LiaSparkSYS.error(error);
        }
      }
      if (typeof everyOpen === "function") {
        try {
          await everyOpen.bind(wrapper)(...args);
        } catch (error) {
          console.error(error);
          LiaSparkSYS.error(error);
        }
      }
    }
    const childLim = 500;
    function checkChildren() {
      const childs = [...wrapper.querySelectorAll("*")];
      console.log("CHILDS: ", childs.length);
      if (childs.length > childLim) {
        div.classList.add("frozen");
      } else {
        div.classList.remove("frozen");
      }
    }

    const observer = new MutationObserver(() => {
      checkChildren();
    });

    const config = {
      childList: true,
      subtree: true,
    };

    observer.observe(wrapper, config);

    checkChildren();

    // console.log(childs.length, "W apps", LiaSparkSYS.windowChilds);
    document.body.style.cursor = "";

    loadingScreen.remove();
    target.host.classList.remove("off");
    let previousPosition = { top: 0, left: 0 };
    $(wrapper).draggable({
      handle: header,
      // containment: $(".desktop"),
      containment: "window",
      drag(event, ui) {
        const deltaY = ui.position.top - previousPosition.top;
        ctxmenu.hide();
        const top = wrapper.offsetTop;
        const containerTop = document.documentElement.scrollTop;
        // console.log(`${top} < ${containerTop + 10}`);
        if (wrapper.classList.contains("maximized")) {
          maxFunc();
          // wrapper.style.left = event.clientX;
        }
        if (deltaY <= 0 && top <= containerTop) {
          // console.log("Hit the top of the containment!");
          // event.preventDefault();
          if (!wrapper.classList.contains("maximized")) {
            maxFunc();
          }
        }
        previousPosition = { left: ui.position.left, top: ui.position.top };
      },
      start() {
        header.classList.add("dragging");
      },
      stop() {
        header.classList.remove("dragging");
      },
    });

    await delay(200);
    this.taskBar(target.id);
    const matchBar = this.taskBarActives.find((i) => i.id === target?.id);

    matchBar.iconItem.classList.add("itemFocus");
    matchBar.iconItem.classList.remove("itemUnfocus");
  }
  static async closeElem(existing) {
    if (typeof existing === "string") {
      for (const a of this.windowChilds) {
        const app = a.querySelector(".windowApp");
        console.log(a, app.id);
        if (existing === app.id) {
          existing = a;
          break;
        }
      }
    }

    const matchBar = this.taskBarActives.find((i) => i.id === existing?.id);

    existing.style.animation = "closeApp 0.2s ease-out forwards";

    let i = -2;

    document.body.style.cursor = "unset";

    let next = this.windowChilds?.at(i)?.querySelector(".windowApp");
    // console.log(next);

    while (!next && this.windowChilds.length > 0) {
      i++;
      next = this.windowChilds?.at(i)?.querySelector(".windowApp");
      // console.log(next);
    }

    await delay(200);
    if (matchBar) {
      matchBar.iconItem.classList.remove("itemFocus");
      matchBar.iconItem.classList.add("itemUnfocus");
    }

    await delay(200);

    LiaSparkSYS.focus(next);
    existing.remove();
    this.current = null;
    delete existing.style.animation;
    this.untaskBar(existing.querySelector(".windowApp").id);
  }
  static focus(target, f) {
    const all = this.windowChilds;
    for (const child of all) {
      const app = child.querySelector(".windowApp");
      if (!app) {
        continue;
      }
      const matchBar = this.taskBarActives.find((i) => i.id === target?.id);
      if (app.id === target?.id) {
        this.taskBar(app.id);
        child.classList.add("windowFocus");
        child.classList.remove("windowUnfocus");
        f?.();
        const appInfo = LiaSparkSYS.getApp(app.id + ".html");
        if (!appInfo) {
          continue;
        }
        this.currentFocus = app.id;
        this.changeTitle(appInfo.name);
        this.changeFavicon(appInfo.iconSrc);
        if (matchBar) {
          setTimeout(() => {
            matchBar.iconItem.classList.add("itemFocus");
            matchBar.iconItem.classList.remove("itemUnfocus");
          }, 200);
        }
      } else {
        child.classList.add("windowUnfocus");
        child.classList.remove("windowFocus");
        // this.untaskBar(app.id);
        const matchBar = this.taskBarActives.find((i) => i.id === child.id);
        if (matchBar) {
          matchBar.iconItem.classList.remove("itemFocus");
          matchBar.iconItem.classList.add("itemUnfocus");
        }
      }
    }
  }
  static isOpen(fileName) {
    return this.windowChilds.some(
      (i) => i.id === fileName.replaceAll(".html", "")
    );
  }
  static blur() {
    const all = this.windowChilds;
    for (const child of all) {
      const app = child.querySelector(".windowApp");
      if (!app) {
        continue;
      }

      child.classList.add("windowUnfocus");
      child.classList.remove("windowFocus");
    }
  }

  static isElementNotFullyInViewport(element) {
    const rect = element.getBoundingClientRect();

    return (
      rect.top < 0 ||
      rect.left < 0 ||
      rect.bottom >
        (window.innerHeight || document.documentElement.clientHeight) ||
      rect.right > (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  static error(data) {
    setTimeout(() => {
      LiaSparkSYS.openApp("error.html", { elem: data });
    }, 200);
  }

  static origTitle = document.title;

  static changeTitle(newTitle) {
    document.title = newTitle;
  }

  static changeFavicon(newIconURL) {
    let link = document.querySelector("link[rel~='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = newIconURL;
  }

  static getStringSizeInUnit(str, unit = "KB") {
    const encoder = new TextEncoder();
    const byteArray = encoder.encode(str);
    const sizeInBytes = byteArray.length;

    let size;
    if (unit === "KB") {
      size = sizeInBytes / 1000;
    } else if (unit === "KiB") {
      size = sizeInBytes / 1024;
    } else {
      throw new Error('Invalid unit. Use "KB" or "KiB".');
    }

    return size;
  }
}

window.LiaSparkSYS = LiaSparkSYS;
export default LiaSparkSYS;
