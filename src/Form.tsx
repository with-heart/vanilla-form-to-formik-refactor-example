import * as React from 'react'
import {merge} from 'lodash/fp'

/** Represents the shape of the `values` object of `Form`. */
export type FormValues = {
  name: string
  email: string
  password: string
}

/** Represents the shape of the state of our component. */
export type State = {
  /** Object which contains the current `value` of each field. */
  values: FormValues

  /** Object which contains any current field errors. */
  errors?: {[k in keyof FormValues]?: string}
}

/**
 * An `Action` represents an event that the `reducer` reacts to in order to
 * determine changes to make to the current `State`.
 */
export type Action = UpdateFieldValue | SetFieldError

/**
 * Signals that the specified `field` was updated to the provided `value`.
 */
export type UpdateFieldValue = {
  type: 'updateField'
  field: keyof FormValues
  value: string
}

/**
 * Signals that the specified `field` has an `error`.
 */
export type SetFieldError = {
  type: 'setError'
  field: keyof FormValues
  value: string
}

/** The shape of the `props` that can be passed to `Form`. */
export type Props = {
  /**
   * Callback which receives the `values` when the "Submit" button is clicked.
   */
  onSubmit: (data: FormValues) => void

  /** Optional object of `values` the form should start with. */
  initialValues?: Partial<FormValues>
}

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
export function Form(props: Props) {
  // `defaultValues` overridden by any `initialValues` passed in to the
  // component
  const initialValues = merge(defaultValues, props.initialValues)

  // initialize `reducer` with our initial values
  const [state, dispatch] = React.useReducer(reducer, {
    values: initialValues,
  })

  /**
   * A curried `onChange` event handler that dispatches the `updateField` event
   * for the corresponding field and its value. This event signals to `reducer`
   * that the field's value in our `State` object should be updated.
   */
  const onChange = (field: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({type: 'updateField', field, value: event.target.value})
  }

  /**
   * A curried `onBlur` event handler that dispatches the `setError` event for
   * the corresponding field if it is empty. This event notifies `reducer` that
   * this field has a "required field" error.
   */
  const onBlur = (field: keyof FormValues) => (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    // does the field have a value after trimming whitespace?
    const hasValue = !!event.target.value.trim().length

    if (!hasValue) {
      dispatch({type: 'setError', field, value: `${field} is required`})
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
  const hasError = (field: keyof FormValues) =>
    !!(state.errors && state.errors[field])

  // get the field's error (or an empty string if it has no error)
  const error = (field: keyof FormValues) =>
    state.errors ? state.errors[field] : ''

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

/** Modifies the current `State` based on the `type` of an `Action`. */
export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'updateField':
      // update the `value` of `field`
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      }
    case 'setError':
      // set the error `value` of `field`
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.value,
        },
      }
    default:
      // since we didn't match any action types, return unmodified state
      return state
  }
}
