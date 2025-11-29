let timerId = null;
let timeLeft = 0;

self.onmessage = (event) => {
  const { action, duration } = event.data;

  if (action === 'start') {
    clearInterval(timerId);
    timeLeft = duration ?? 0;

    timerId = setInterval(() => {
      timeLeft--;
      self.postMessage({ type: 'tick', timeLeft });

      if (timeLeft <= 0) {
        clearInterval(timerId);
        self.postMessage({ type: 'expired' });
      }
    }, 1000);
  }

  if (action === 'stop') {
    clearInterval(timerId);
  }
};
