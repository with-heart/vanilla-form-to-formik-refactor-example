import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {Form, FormProps} from '.'

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

test('displays initial field values', () => {
  const {elements} = setup({initialValues: {name: 'Mark'}})
  expect(elements.name).toHaveValue('Mark')
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

function setup(props: Partial<FormProps> = {}) {
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
