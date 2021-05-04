// ideally will get replaced with external dep
// when rafrex/detect-passive-events#4 and rafrex/detect-passive-events#5 get merged in
export const testPassiveEventSupport = () => {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    return;
  }

  let passive = false;

  const options = Object.defineProperty({}, 'passive', {
    get() {
      passive = true;
    },
  });

  const noop = () => {};

  window.addEventListener('testPassiveEventSupport', noop, options);
  window.removeEventListener('testPassiveEventSupport', noop, options);

  return passive;
};
