const songC = [];

export async function everyOpen({ elem } = {}) {
  const x = document.querySelector("#media-audio");
  for (const c of songC) {
    c.audio.pause();
    c.destroy();
    songC.splice(songC.indexOf(c), 1);
  }
  elem.appendTo(x);
  songC.push(elem);
}

export async function onClose() {
  for (const c of songC) {
    c.audio.pause();
    c.destroy();
    songC.splice(songC.indexOf(c), 1);
  }
}
