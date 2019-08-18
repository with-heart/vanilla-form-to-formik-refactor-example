import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {isEmpty, size} from 'lodash/fp'
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
  const {getByText, elements} = setup({
    validate: values => {
      const errors: Partial<typeof values> = {}

      if (isEmpty(values.name)) {
        errors.name = 'Name is a required field'
      }

      if (isEmpty(values.email)) {
        errors.email = 'Email is a required field'
      }

      if (size(values.password) < 8) {
        errors.password = 'Password must be at least 8 characters'
      }

      return errors
    },
  })

  // simulate blur for validation and asserts each field's message
  fireEvent.blur(elements.name)
  getByText(/name.+required/i)
  fireEvent.blur(elements.email)
  getByText(/email.+required/i)
  fireEvent.change(elements.password, {target: {value: 'pw1'}})
  fireEvent.blur(elements.password)
  getByText(/password.*at least 8/i)
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
