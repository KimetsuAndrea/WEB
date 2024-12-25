/**
 * ContextMenu class for creating customizable and dynamic context menus.
 *
 * @author Liane Cagara
 */
export class ContextMenu {
  static cache = [];
  /**
   * Creates a new ContextMenu instance.
   *
   * @param {HTMLElement} element - The target element to attach the context menu to.
   * @param {{
   *   menu?: HTMLElement,
   *   bottom?: boolean,
   *   allowance?: number,
   *   clean?: boolean,
   *   leftClick?: boolean,
   *   items?: Array<{ label: string, callback: Function }>
   *   onOpen: Function,
   * }} [options] - Options to customize the context menu.
   */
  constructor(
    element,
    {
      menu,
      bottom,
      allowance = 0,
      items = [],
      clean = false,
      leftClick = false,
      onOpen,
    } = {}
  ) {
    this.leftClick = leftClick;
    this.target = element;
    this.clean = clean;
    if (!menu) {
      menu = document.createElement("div");
      menu.classList.add("lia-ctxmenu");
    }
    this.isBottom = !!bottom;
    this.menu = menu;
    this.allowance = allowance;
    this.items = items;
    this.visible = false;
    this.onOpen = onOpen;
    this.isHovered = false;
    this.optionsElem = [];

    menu.addEventListener("mouseenter", () => {
      this.isHovered = true;
    });
    menu.addEventListener("mouseleave", () => {
      this.isHovered = false;
    });
  }

  /**
   * Adds an option to the context menu.
   *
   * @param {{
   *   label: string,
   *   callback: Function,
   *   [etc]: Object
   * }} option - The menu option to add.
   */
  addOption({ label, callback, svgIcon, ...etc }) {
    const e = document.createElement("div");
    e.classList.add("item");

    if (svgIcon) {
      const span = document.createElement("span");
      span.innerHTML = svgIcon;
      const txt = document.createElement("span");
      txt.textContent = label;
      e.addEventListener("click", (e) => {
        callback(e, this.target);
      });
      e.append(span, txt);
      e.style.display = "flex";
      e.style.gap = "10px";
      e.style.alignItems = "center";
      e.classList.add("menusvg");
      span.style.display = "flex";
    } else {
      e.textContent = label;
      e.addEventListener("click", (e) => {
        callback(e, this.target);
      });
    }

    Object.assign(e, etc);

    this.menu.appendChild(e);
    this.optionsElem.push(e);
  }

  /**
   * Clears all options from the context menu.
   */
  clearOptions() {
    this.menu.innerHTML = "";
    this.optionsElem = [];
  }

  /**
   * Removes a specific option from the context menu by label.
   *
   * @param {string} label - The label of the option to remove.
   */
  removeOption(label) {
    // const items = this.menu.querySelectorAll(".item");
    const items = this.optionsElem;
    for (const item of items) {
      if (item.textContent === label) {
        this.menu.removeChild(item);
        this.optionsElem.splice(this.optionsElem.indexOf(item), 1);
        break;
      }
    }
  }

  /**
   * Updates an existing option in the context menu.
   *
   * @param {string} oldLabel - The label of the option to update.
   * @param {{
   *   label: string,
   *   callback: Function,
   *   [etc]: Object
   * }} newOption - The new properties for the updated option.
   */
  updateOption(oldLabel, { label, callback, ...etc }) {
    const items = this.menu.querySelectorAll(".item");
    for (const item of items) {
      if (item.textContent === oldLabel) {
        item.textContent = label;
        item.onclick = (e) => callback(e, this.target);
        Object.assign(item, etc);
        break;
      }
    }
  }

  /**
   * Initializes the context menu and attaches necessary event listeners.
   */
  init() {
    if (!this.clean) {
      this.menu.classList.add("lia-ctxmenu");
    }
    Object.assign(this.menu.style, {
      position: "fixed",
      zIndex: "10000",
      display: "none",
      overflowY: "auto",
      maxHeight: "90vh",
    });
    const { target, menu } = this;
    for (const data of this.items) {
      this.addOption(data);
    }

    if (this.leftClick) {
      target.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.visible) {
          this.hide();
        } else {
          this.show(e);
        }
      });
      window.addEventListener("click", () => this.hide());
      window.addEventListener("contextmenu", () => this.hide());
      // target.addEventListener("contextmenu", (e) => {
      //   // e.stopPropagation();
      //   this.hide();
      // });
    } else if (!this.onOpen) {
      target.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.isHovered) {
          this.hide();
        } else {
          this.show(e);
        }
      });

      window.addEventListener("click", () => this.hide());
      window.addEventListener("contextmenu", () => this.hide());
    } else {
      target.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.onOpen(e);
      });
      window.addEventListener("click", () => this.hide());
      window.addEventListener("contextmenu", () => this.hide());
    }

    // Calibration
    this.show();
    this.menu.style.display = "none";
    this.visible = false;
    ContextMenu.cache.push(this);
  }

  /**
   * Hides the context menu with an animation.
   */
  hide() {
    this.menu.style.animation = "closeApp 0.2s ease-out forwards";

    setTimeout(() => {
      this.menu.style.animation = "";

      this.menu.style.display = "none";
      this.visible = false;
    }, 200);
  }

  /**
   * Displays the context menu at the specified position.
   *
   * @param {{ clientX?: number, clientY?: number }} [position] - The position to show the menu at.
   */
  show({ clientX = 0, clientY = 0 } = {}) {
    const { menu, isBottom, allowance } = this;
    const { innerWidth, innerHeight } = window;
    this.menu.style.animation = "openApp 0.2s ease-out forwards";

    setTimeout(() => {
      this.menu.style.animation = "";
    }, 200);

    // Temporarily make the menu visible to calculate dimensions
    Object.assign(menu.style, {
      visibility: "hidden",
      display: "block",
    });

    if (this.leftClick) {
      const rect = this.target.getBoundingClientRect();
      clientX = rect.right - menu.clientWidth;
      clientY = rect.bottom;
    }

    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    // Hide it again until properly positioned
    Object.assign(menu.style, {
      visibility: "",
      display: "none",
    });

    let left = clientX;
    let top = clientY;

    // Handle bottom positioning logic
    if (isBottom) {
      const bottomSpace = innerHeight - clientY;

      if (menuHeight > bottomSpace) {
        top = innerHeight - menuHeight - allowance;
      } else {
        top = clientY;
      }

      Object.assign(menu.style, {
        bottom: `${innerHeight - top - menuHeight}px`,
        top: "unset",
      });
    } else {
      // Ensure the menu doesn't overflow the viewport vertically
      if (clientY + menuHeight > innerHeight) {
        top = innerHeight - menuHeight - allowance;
      }

      // Prevent menu from going off-screen on the top side
      if (top < 0) top = allowance;

      Object.assign(menu.style, {
        top: `${top}px`,
        bottom: "unset",
      });
    }

    // Ensure the menu doesn't overflow the viewport horizontally
    if (clientX + menuWidth > innerWidth) {
      left = innerWidth - menuWidth - allowance;
    }

    Object.assign(menu.style, {
      left: `${left}px`,
      display: "block",
    });

    document.body.appendChild(menu);
    this.visible = true;
    for (const c of ContextMenu.cache) {
      if (c === this) {
        continue;
      }
      c.hide();
    }
  }
}
