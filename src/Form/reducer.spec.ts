import {reducer, State, Action} from '.'

const baseState: State = {values: {name: '', email: '', password: ''}}

test('"setFieldValue" sets the value of a field', () => {
  const action: Action = {type: 'setFieldValue', field: 'name', value: 'Mark'}
  expect(reducer(baseState, action)).toMatchObject({values: {name: 'Mark'}})
})

test('"setFieldError" sets the error value of a field', () => {
  const action: Action = {
    type: 'setFieldError',
    field: 'name',
    error: 'we messed up',
  }
  expect(reducer(baseState, action)).toMatchObject({
    errors: {name: 'we messed up'},
  })
})
