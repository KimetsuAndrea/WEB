import LiaSparkSYS from "./parse-app.js";

export class ModernAudio {
  static cache = [];
  constructor(audioSource, name = audioSource.split("/").at(-1)) {
    this.audio = new Audio(audioSource);
    this.name = name.split("/").at(-1);
    this.elem = this.createElem();
    ModernAudio.cache.push(this);
  }

  createElem() {
    const audioContainer = document.createElement("div");
    audioContainer.classList.add("modern-audio", "lia-card");

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("audio-name");
    nameSpan.textContent = this.name.substring(0, 15) + "...";
    audioContainer.appendChild(nameSpan);

    const controlsContainer = document.createElement("div");
    controlsContainer.classList.add("audio-controls");
    audioContainer.appendChild(controlsContainer);

    const playPauseBtn = document.createElement("button");
    playPauseBtn.classList.add("play-pause-btn", "lia-button", "blue");
    playPauseBtn.textContent = "Play";
    controlsContainer.appendChild(playPauseBtn);

    const progressSlider = document.createElement("input");
    progressSlider.type = "range";
    progressSlider.min = 0;
    progressSlider.max = 100;
    progressSlider.value = 0;
    progressSlider.classList.add("progress-slider");
    controlsContainer.appendChild(progressSlider);

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.textContent = "0:00 / 0:00";
    controlsContainer.appendChild(timestamp);

    playPauseBtn.addEventListener("click", () =>
      this.togglePlayPause(playPauseBtn)
    );
    progressSlider.addEventListener("input", () =>
      this.updateProgress(progressSlider)
    );
    this.audio.addEventListener("timeupdate", () =>
      this.updateProgressBar(progressSlider, timestamp)
    );

    this.playPauseBtn = playPauseBtn;
    this.audio.addEventListener("play", () => {
      playPauseBtn.textContent = "Pause";
    });

    this.audio.addEventListener("pause", () => {
      playPauseBtn.textContent = "Play";
    });

    return audioContainer;
  }

  togglePlayPause(playPauseBtn = this.playPauseBtn) {
    if (this.audio.paused) {
      this.audio.play();
      // playPauseBtn.textContent = "Pause";
    } else {
      this.audio.pause();
      // playPauseBtn.textContent = "Play";
    }
  }

  updateProgress(progressSlider) {
    this.audio.currentTime = (progressSlider.value / 100) * this.audio.duration;
  }

  updateProgressBar(progressSlider, timestamp) {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    progressSlider.value = progress;

    const currentTime = this.formatTime(this.audio.currentTime);
    const duration = this.formatTime(this.audio.duration);
    timestamp.textContent = `${currentTime} / ${duration}`;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  }

  appendTo(parentElement) {
    parentElement.appendChild(this.elem);
  }

  destroy() {
    this.elem.remove();
  }

  static autoShow() {
    let elem;
    this.detectAudioPlay((i) => {
      elem = new ModernAudio(i.src);
      // elem.appendTo(parent);
      console.log("AUDIO PLAY");
      i.pause();
      setTimeout(() => {
        LiaSparkSYS.openApp("media.html", { elem });
      }, 200);

      elem.togglePlayPause();
      for (const a of this.cache) {
        if (!a.audio.paused) {
          if (a === elem) {
            continue;
          }
          a.audio.pause();
          a.destroy();
        }
      }
    });
    // this.detectAudioStop((i) => {
    //   elem.destroy();
    //   elem = new ModernAudio(i.src);
    //   elem.destroy();
    //   console.log("AUDIO STOP");
    //   i.pause();
    // });
  }

  static getPlayingAudio() {
    const playingAudio = [...document.querySelectorAll("audio")].find(
      (audio) => !audio.paused
    );
    return playingAudio || null;
  }

  static detectAudioPlay(callback) {
    document.querySelectorAll("audio").forEach((audioElement) => {
      audioElement.addEventListener("play", (event) => {
        const audioElement = event.target;
        if (audioElement) {
          callback(audioElement);
        }
      });
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("audio").forEach((audioElement) => {
        if (!audioElement._playListenerAttached) {
          audioElement.addEventListener("play", (event) => {
            const audioElement = event.target;
            if (audioElement) {
              callback(audioElement);
            }
          });
          audioElement._playListenerAttached = true;
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  static detectAudioStop(callback) {
    document.querySelectorAll("audio").forEach((audioElement) => {
      audioElement.addEventListener("pause", (event) => {
        const audioElement = event.target;
        if (audioElement) {
          callback(audioElement);
        }
      });

      audioElement.addEventListener("ended", (event) => {
        const audioElement = event.target;
        if (audioElement) {
          callback(audioElement);
        }
      });
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("audio").forEach((audioElement) => {
        if (!audioElement._stopListenerAttached) {
          audioElement.addEventListener("pause", (event) => {
            const audioElement = event.target;
            if (audioElement) {
              callback(audioElement);
            }
          });

          audioElement.addEventListener("ended", (event) => {
            const audioElement = event.target;
            if (audioElement) {
              callback(audioElement);
            }
          });

          audioElement._stopListenerAttached = true;
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}
