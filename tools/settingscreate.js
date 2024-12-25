class SettingsCreate {
  /**
   * Creates an instance of SettingsCreate.
   *
   * @constructor
   * @param {string} [dbName="settingsDB"]
   * @param {string} [storeName="settingsStore"]
   */
  constructor(dbName = "settingsDB", storeName = "settingsStore") {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore(this.storeName, { keyPath: "id" });
        store.createIndex("id", "id", { unique: true });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        reject("Error opening IndexedDB:", event.target.error);
      };
    });
  }

  async get(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.value);
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject("Error retrieving setting:", event.target.error);
      };
    });
  }

  async set(id, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const setting = { id, value };

      const request = store.put(setting);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {
        reject("Error saving setting:", event.target.error);
      };
    });
  }

  async toggle(id) {
    const currentValue = await this.get(id);

    if (currentValue === null || typeof currentValue !== "boolean") {
      throw new Error("Setting is not a boolean or does not exist");
    }

    return this.set(id, !currentValue);
  }

  async enable(id) {
    const currentValue = await this.get(id);

    if (currentValue !== null && typeof currentValue !== "boolean") {
      throw new Error("Setting is not a boolean");
    }

    return this.set(id, true);
  }

  async disable(id) {
    const currentValue = await this.get(id);

    if (currentValue !== null && typeof currentValue !== "boolean") {
      throw new Error("Setting is not a boolean");
    }

    return this.set(id, false);
  }

  /**
   *
   *
   * @async
   * @param {string} id
   * @param {File} file
   * @returns {string}
   */
  async saveFile(id, file) {
    const blob = new Blob([file], { type: file.type });
    await this.set(id, blob);
    return URL.createObjectURL(blob);
  }

  async getFileURL(id) {
    const blob = await this.get(id);
    return URL.createObjectURL(blob);
  }
}

class ToggleElem {
  constructor(...selectors) {
    this.selectors = selectors
      .flat()
      .map((selector) =>
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector
      );
    this.defaultDisplay = this.selectors.map((selector) => {
      const elem = selector;
      if (elem) {
        const style = window.getComputedStyle(elem);
        return style.display;
      }
      return "block";
    });
    this.onOpen = null;
    this.onClose = null;
  }

  setOnOpen(callback) {
    if (typeof callback === "function") {
      this.onOpen = callback;
    }
  }

  setOnClose(callback) {
    if (typeof callback === "function") {
      this.onClose = callback;
    }
  }

  show(arg) {
    let index;
    if (typeof arg === "number") {
      index = arg;
    } else if (typeof arg === "string") {
      const elementToShow = document.querySelector(arg);
      index = this.selectors.indexOf(elementToShow);
    } else {
      index = this.selectors.indexOf(arg);
    }

    if (index !== undefined && this.selectors[index]) {
      this.selectors.forEach((elem, i) => {
        if (elem && elem.style.display !== "none") {
          elem.style.display = "none";
          elem.dispatchEvent(new CustomEvent("toggle-off", { detail: elem }));
          if (this.onClose) {
            this.onClose(elem);
          }
        }
      });

      const elementToShow = this.selectors[index];
      if (elementToShow) {
        elementToShow.style.display = this.defaultDisplay[index] || "block";
        elementToShow.dispatchEvent(
          new CustomEvent("toggle-on", { detail: elementToShow })
        );
        if (this.onOpen) {
          this.onOpen(elementToShow);
        }
      }
    }
  }

  showBySelector(selector) {
    this.show(selector);
  }

  hideAll() {
    this.selectors.forEach((elem) => {
      if (elem && elem.style.display !== "none") {
        elem.style.display = "none";
        elem.dispatchEvent(new CustomEvent("toggle-off", { detail: elem }));
        if (this.onClose) {
          this.onClose(elem);
        }
      }
    });
  }

  toggle(index) {
    const elementToToggle = this.selectors[index];
    if (elementToToggle) {
      if (elementToToggle.style.display === "none") {
        elementToToggle.style.display = this.defaultDisplay[index] || "block";
        elementToToggle.dispatchEvent(
          new CustomEvent("toggle-on", { detail: elementToToggle })
        );
        if (this.onOpen) {
          this.onOpen(elementToToggle);
        }
      } else {
        elementToToggle.style.display = "none";
        elementToToggle.dispatchEvent(
          new CustomEvent("toggle-off", { detail: elementToToggle })
        );
        if (this.onClose) {
          this.onClose(elementToToggle);
        }
      }
    }
  }

  getVisibleIndex() {
    return this.selectors.findIndex(
      (elem) => elem && elem.style.display !== "none"
    );
  }

  /**
   * Description placeholder
   *
   * @returns {*}
   */
  getVisible() {
    const visibleIndex = this.getVisibleIndex();
    return visibleIndex !== -1 ? this.selectors[visibleIndex] : null;
  }
}

export { SettingsCreate, ToggleElem };
