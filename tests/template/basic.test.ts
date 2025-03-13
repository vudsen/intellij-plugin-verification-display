import {test, expect} from "@jest/globals";
import parseAsMarkdown from "../../src/template/basic";


test('Test basic usage', () => {
  expect(parseAsMarkdown('./tests/__resources__/verifyResult')).toMatchSnapshot()
})