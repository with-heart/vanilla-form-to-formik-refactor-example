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
 * Deeply merges an optional `FormValues` object with `defaultValues`.
 */
export const withDefaults = merge(defaultValues)

/**
 * Renders a form which can initialize its fields with values. Displays an "X
 * is required" error for any empty fields on blur.
 */
export function Form(props: FormProps) {
  // initialize `reducer` with our initial values
  const initialValues = withDefaults(props.initialValues)
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
   * A curried `onBlur` event handler that validates the given field using the
   * optional `validate` prop. If `validate` returns an error for this field,
   * signal to `reducer` that the field's `error` should be set.
   */
  const onBlur = (field: keyof FormValues) => (
    _event: React.FocusEvent<HTMLInputElement>,
  ) => {
    if (props.validate) {
      const errors = props.validate(state.values)
      const error = errors[field]

      if (error) {
        dispatch({type: 'setFieldError', field, error: error})
      }
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
  const errorFor = (field: keyof FormValues) =>
    get(`errors.${field}`, state) || ''

  // get the field's value
  const valueFor = (field: keyof FormValues) => get(`values.${field}`, state)

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={valueFor('name')}
          onChange={onChange('name')}
          onBlur={onBlur('name')}
        />
        {hasError('name') && <div>{errorFor('name')}</div>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={valueFor('email')}
          onChange={onChange('email')}
          onBlur={onBlur('email')}
        />
        {hasError('email') && <div>{errorFor('email')}</div>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={valueFor('password')}
          onChange={onChange('password')}
          onBlur={onBlur('password')}
        />
        {hasError('password') && <div>{errorFor('password')}</div>}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
