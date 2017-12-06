// ideally will get replaced with external dep
// when rafrex/detect-passive-events#4 and rafrex/detect-passive-events#5 get merged in
export const testPassiveEventSupport = () => {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    return;
  }

  let passive = false;
  const noop = () => {};

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        passive = true;
      },
    });

    window.addEventListener('testPassiveEventSupport', noop, options);
    window.removeEventListener('testPassiveEventSupport', noop, options);
  } catch (e) {
    // skip
  }

  return passive;
};
