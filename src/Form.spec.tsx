import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {Form, reducer, State, Action} from './Form'

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
  const onSubmit = jest.fn()
  const {getByText, getByLabelText} = render(<Form onSubmit={onSubmit} />)

  // assert/find the elements
  const name = getByLabelText(/name/i)
  const email = getByLabelText(/email/i)
  const password = getByLabelText(/password/i)
  const submit = getByText(/submit/i)

  // fill them out and submit
  const values = {name: 'Mark', email: 'mark@email.com', password: 'Password1'}
  fireEvent.change(name, {target: {value: values.name}})
  fireEvent.change(email, {target: {value: values.email}})
  fireEvent.change(password, {target: {value: values.password}})
  fireEvent.click(submit)

  // should have been called with the form values
  expect(onSubmit).toHaveBeenCalledWith(values)
})

test('displays validation errors', () => {
  const {getByLabelText, getByText} = render(<Form onSubmit={jest.fn()} />)

  // assert/find the elements
  const name = getByLabelText(/name/i)
  const email = getByLabelText(/email/i)
  const password = getByLabelText(/password/i)

  // simulate exiting each field
  fireEvent.blur(name)
  fireEvent.blur(email)
  fireEvent.blur(password)

  // assert each validation message
  getByText(/name.+required/i)
  getByText(/email.+required/i)
  getByText(/password .+required/i)
})
