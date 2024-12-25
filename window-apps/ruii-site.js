import LiaSparkSYS from "../tools/parse-app.js";

const audio = new Audio(
  "https://ia802208.us.archive.org/4/items/webcore-internetcore-music-playlist/webcore%20internetcore%20music%20playlist.mp3"
);

export function firstOpen() {
  const musicPromptWindow = document.getElementById("ruii-musicPrompt");
  audio.muted = true;

  musicPromptWindow.querySelectorAll("button").forEach((item) => {
    item.onclick = function () {
      playAudio(item.value === "1");
      // musicPromptWindow.remove();
    };
  });

  async function playAudio(doPlayAudio) {
    audio.muted = !doPlayAudio;
    if (doPlayAudio) {
      try {
        await audio.play();
      } catch (error) {
        LiaSparkSYS.error(error);
      }
    }
  }

  musicPromptWindow.appendChild(audio);
}

// export function everyOpen() {
//   throw new TypeError("");
// }
