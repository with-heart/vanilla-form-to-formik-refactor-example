import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {Form, reducer, State, Action} from './Form'

describe('reducer', () => {
  const baseState: State = {values: {name: '', email: '', password: ''}}

  test('"updateField" updates a field with a value', () => {
    const action: Action = {type: 'updateField', field: 'name', value: 'Mark'}
    expect(reducer(baseState, action)).toMatchObject({values: {name: 'Mark'}})
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
