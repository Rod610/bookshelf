//test.todo('formatDate formats the date to look nice')

import {formatDate} from '../misc'

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date('October 18, 1988'))).toBe('Oct 88')
})
