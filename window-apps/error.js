import LiaSparkSYS from "../tools/parse-app.js";

export const windowClass = ["old-container", "clean"];

export async function everyOpen({ elem } = {}) {
  let x = this.querySelector("#ls-error-div");
  const card = document.createElement("div");
  card.classList.add("old-container");

  if (elem instanceof Node) {
    card.appendChild(elem);
  } else {
    const p = document.createElement("p");
    p.textContent = `${elem?.stack ?? elem}`;
    card.appendChild(p);
  }

  const button = document.createElement("button");
  button.textContent = "Okay";
  // button.onclick = () =>
  //   LiaSparkSYS.closeElem(document.querySelector("#error"));
  button.onclick = () => {
    card.remove();
    if (x.childNodes.length === 0) {
      LiaSparkSYS.closeElem(this);
    }
  };
  card.appendChild(button);
  // while (!x) {
  //   x = this.querySelector("#ls-error-div");
  // }
  if (!x) {
    LiaSparkSYS.closeElem(this);
    // setTimeout(() => {
    //   LiaSparkSYS.openApp("error.html", { elem });
    // }, 200);
    return;
  }
  x.appendChild(card);

  console.log(this);
}

export async function onClose() {
  const x = this.querySelector("#ls-error-div");
  x.innerHTML = "";
}
