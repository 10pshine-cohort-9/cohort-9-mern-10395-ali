export const debounce = (fn, delay = 0) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Debounce expected a function as the first argument');
  }

  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};