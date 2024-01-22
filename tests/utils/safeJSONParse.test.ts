import { safeJSONParse } from '../../src/utils';

test('safeJSONParse()', () => {
  expect(safeJSONParse('"Hello World"')).toBe('Hello World');
  expect(safeJSONParse('Hello World')).toBe(null);
  expect(safeJSONParse('Hello World', 5566)).toBe(5566);
});
