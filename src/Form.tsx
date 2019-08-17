import * as React from 'react'

export type FormValues = {
  name: string
  email: string
  password: string
}

export type State = {
  values: FormValues
  errors?: {[k in keyof FormValues]?: string}
}

export type Action =
  | {type: 'updateField'; field: keyof FormValues; value: string}
  | {type: 'setError'; field: keyof FormValues; value: string}

export type Props = {
  onSubmit: (data: FormValues) => void
}

export function Form(props: Props) {
  // state
  const [state, dispatch] = React.useReducer(reducer, {
    values: {
      name: '',
      email: '',
      password: '',
    },
  })

  // callbacks
  const onChange = (field: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({type: 'updateField', field, value: event.target.value})
  }

  const onBlur = (field: keyof FormValues) => (
    event: React.FocusEvent<HTMLInputElement>,
  ) => {
    const hasValue = !!event.target.value.trim().length

    if (!hasValue) {
      dispatch({type: 'setError', field, value: `${field} is required`})
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit({
      name: state.values.name,
      email: state.values.email,
      password: state.values.password,
    })
  }

  // render helpers
  const error = (field: keyof FormValues) =>
    state.errors ? state.errors[field] : ''
  const hasError = (field: keyof FormValues) =>
    !!(state.errors && state.errors[field])

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
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
          onChange={onChange('password')}
          onBlur={onBlur('password')}
        />
        {hasError('password') && <div>{error('password')}</div>}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'updateField':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      }
    case 'setError':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.value,
        },
      }
    default:
      return state
  }
}
