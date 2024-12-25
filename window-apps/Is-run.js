import LiaSparkSYS from "../tools/parse-app.js";

export async function firstOpen() {
  const [runButton, input, cancelButton] = [
    "#ls-run-run",
    "#ls-run-input",
    "#ls-run-cancel",
  ].map((i) => this.querySelector(i));

  const run = (name) => {
    LiaSparkSYS.openApp(name);
  };

  runButton.addEventListener("click", () => {
    run(input.value);
  });

  input.addEventListener("focus", () => {
    input.setSelectionRange(0, input.value.length);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
    }
  });
}

export async function everyOpen() {
  const [runButton, input, cancelButton] = [
    "#ls-run-run",
    "#ls-run-input",
    "#ls-run-cancel",
  ].map((i) => this.querySelector(i));
  cancelButton.onclick = () => {
    LiaSparkSYS.closeElem(this);
  };

  input.focus();
}

export const windowClass = ["old-container", "clean"];
