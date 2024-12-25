export class FileHandler {
  constructor() {
    this.listeners = {};
  }

  /**
   * Save a file with the given data and filename.
   * @param {string|Blob} data - The content to save.
   * @param {string} filename - The name of the file.
   * @returns {Promise<void>} Resolves when the file is triggered for download.
   */
  save(data, filename) {
    return new Promise((resolve, reject) => {
      try {
        const blob =
          data instanceof Blob
            ? data
            : new Blob([data], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);

        this._emit("save", { data, filename });
        resolve();
      } catch (error) {
        this._emit("error", error);
        reject(error);
      }
    });
  }

  /**
   * Open a file dialog to let the user select a file.
   * @param {string} accept - File types to accept (e.g., '.txt, .jpg').
   * @returns {Promise<File>} Resolves with the selected file object.
   */
  open(accept = "") {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;

      input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          this._emit("open", file);
          resolve(file);
        } else {
          const error = new Error("No file selected");
          this._emit("error", error);
          reject(error);
        }
      });

      input.click();
    });
  }

  /**
   * Read the content of a file.
   * @param {File} file - The file object to read.
   * @param {string} readType - The type of reading ('text', 'dataURL', 'arrayBuffer', 'binaryString').
   * @returns {Promise<any>} Resolves with the file content.
   */
  readFile(file, readType = "text") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        this._emit("read", { file, content: reader.result });
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        this._emit("error", error);
        reject(error);
      };

      switch (readType) {
        case "text":
          reader.readAsText(file);
          break;
        case "dataURL":
          reader.readAsDataURL(file);
          break;
        case "arrayBuffer":
          reader.readAsArrayBuffer(file);
          break;
        case "binaryString":
          reader.readAsBinaryString(file);
          break;
        default:
          const error = new Error(`Unsupported read type: ${readType}`);
          this._emit("error", error);
          reject(error);
      }
    });
  }

  /**
   * Add an event listener.
   * @param {string} event - The event name ('save', 'open', 'read', 'error').
   * @param {Function} callback - The callback function.
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Emit an event to all registered listeners.
   * @param {string} event - The event name.
   * @param {any} data - The data to pass to listeners.
   * @private
   */
  _emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}
