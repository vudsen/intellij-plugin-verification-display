import {test, expect} from "@jest/globals";
import {parseWithWebLink} from "../../src/template/web";


test('Test basic usage', () => {
  expect(parseWithWebLink('./tests/__resources__/verifyResult', 'https://foo.bar')).toMatchSnapshot()
})