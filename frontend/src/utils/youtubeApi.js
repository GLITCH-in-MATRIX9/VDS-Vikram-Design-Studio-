let ytReadyPromise;

export function getYouTubeAPI() {
  if (ytReadyPromise) return ytReadyPromise;

  ytReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    const check = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(check);
        resolve(window.YT);
      }
    }, 50);
  });

  return ytReadyPromise;
}
