import { debounce } from './debounce';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('only runs once after rapid calls', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 200);

  debounced('first');
  debounced('second');

  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(199);
  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('second');
});

test('throws when the argument is not a function', () => {
  expect(() => debounce(123)).toThrow(TypeError);
});
