import * as React from 'react'
import {merge, get, has} from 'lodash/fp'
import {FormProps, FormValues} from './types'
import {reducer} from './reducer'

/**
 * The default `values` object that the form uses unless overridden by
 * `initialValues`
 */
export const defaultValues = {
  name: '',
  email: '',
  password: '',
}

/**
 * Renders a form which can initialize its fields with values. Displays an "X
 * is required" error for any empty fields on blur.
 */
export function Form(props: FormProps) {
  // `defaultValues` overridden by any `initialValues` passed in to the
  // component
  const initialValues = merge(defaultValues, props.initialValues)

  // initialize `reducer` with our initial values
  const [state, dispatch] = React.useReducer(reducer, {
    values: initialValues,
  })

  /**
   * A curried `onChange` event handler that dispatches the `setFieldValue` event
   * for the corresponding field and its value. This event signals to `reducer`
   * that the field's value in our `State` object should be updated.
   */
  const onChange = (field: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({type: 'setFieldValue', field, value: event.target.value})
  }

  /**
   * A curried `onBlur` event handler that dispatches the `setFieldError` event for
   * the corresponding field if it is empty. This event notifies `reducer` that
   * this field has a "required field" error.
   */
  const onBlur = (field: keyof FormValues) => (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    // does the field have a value after trimming whitespace?
    const hasValue = !!event.target.value.trim().length

    if (!hasValue) {
      dispatch({type: 'setFieldError', field, error: `${field} is required`})
    }
  }

  /**
   * Callback handler for the `form`'s `onSubmit` event.
   */
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent `form` from refreshing the page (default browser behavior)
    event.preventDefault()

    // pass submitted `values` to the user-provided `onSubmit` handler
    props.onSubmit(state.values)
  }

  // determine if the field has an error
  const hasError = (field: keyof FormValues) => has(`errors.${field}`, state)

  // get the field's error (or an empty string if it has no error)
  const error = (field: keyof FormValues) => get(`errors.${field}`, state) || ''

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={state.values.name}
          onChange={onChange('name')}
          onBlur={onBlur('name')}
        />
        {hasError('name') && <div>{error('name')}</div>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={state.values.email}
          onChange={onChange('email')}
          onBlur={onBlur('email')}
        />
        {hasError('email') && <div>{error('email')}</div>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={state.values.password}
          onChange={onChange('password')}
          onBlur={onBlur('password')}
        />
        {hasError('password') && <div>{error('password')}</div>}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
