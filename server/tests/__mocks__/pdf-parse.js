/**
 * Jest manual mock for pdf-parse.
 *
 * Place this file at:
 *   tests/__mocks__/pdf-parse.js
 *
 * Jest will automatically use this mock whenever any module calls
 *   require('pdf-parse')
 * during the test run — no more DOMMatrix / browser-global crashes.
 *
 * In your test file you can optionally call:
 *   jest.mock('pdf-parse')
 * to be explicit, but with automatic mocking via __mocks__ it isn't
 * strictly required when the mock lives next to node_modules.
 */
module.exports = jest.fn(async () => ({
  text: 'Mock PDF Content',
  numpages: 1,
  info: {},
  metadata: null,
  version: 'mock',
}))
