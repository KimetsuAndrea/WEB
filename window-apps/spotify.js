export async function everyOpen() {
  const iframe = document.querySelector("#spotify-iframe");

  return new Promise((r) => {
    iframe.onload = r;
  });
}

export async function onClose() {}
