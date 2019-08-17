import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {Form, reducer, State, Action, Props} from './Form'

describe('reducer', () => {
  const baseState: State = {values: {name: '', email: '', password: ''}}

  test('"updateField" updates a field with a value', () => {
    const action: Action = {type: 'updateField', field: 'name', value: 'Mark'}
    expect(reducer(baseState, action)).toMatchObject({values: {name: 'Mark'}})
  })

  test('"setError" sets an error value for a field', () => {
    const action: Action = {
      type: 'setError',
      field: 'name',
      value: 'we messed up',
    }
    expect(reducer(baseState, action)).toMatchObject({
      errors: {name: 'we messed up'},
    })
  })
})

test('displays the form and handles submit', () => {
  const {elements, onSubmit} = setup()
  const values = {name: 'Mark', email: 'mark@email.com', password: 'Password1'}

  // fill out the fields and submit
  fireEvent.change(elements.name, {target: {value: values.name}})
  fireEvent.change(elements.email, {target: {value: values.email}})
  fireEvent.change(elements.password, {target: {value: values.password}})
  fireEvent.click(elements.submit)

  // should have been called with the form values
  expect(onSubmit).toHaveBeenCalledWith(values)
})

test('displays validation errors', () => {
  const {getByText, elements} = setup()

  // simulate leaving each field
  fireEvent.blur(elements.name)
  fireEvent.blur(elements.email)
  fireEvent.blur(elements.password)

  // assert each validation message
  getByText(/name.+required/i)
  getByText(/email.+required/i)
  getByText(/password .+required/i)
})

function setup(props: Partial<Props> = {}) {
  const onSubmit = props.onSubmit || jest.fn()
  const utils = render(<Form {...props} onSubmit={onSubmit} />)

  return {
    ...utils,
    onSubmit,
    elements: {
      name: utils.getByLabelText(/name/i),
      email: utils.getByLabelText(/email/i),
      password: utils.getByLabelText(/password/i),
      submit: utils.getByText(/submit/i),
    },
  }
}
