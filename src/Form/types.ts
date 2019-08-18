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
export type Action = SetFieldValue | SetFieldError

/**
 * Signals that the specified `field` was updated to the provided `value`.
 */
export type SetFieldValue = {
  type: 'setFieldValue'
  field: keyof FormValues
  value: string
}

/**
 * Signals that the specified `field` has an `error`.
 */
export type SetFieldError = {
  type: 'setFieldError'
  field: keyof FormValues
  error: string
}

/** The shape of the `props` that can be passed to `Form`. */
export type FormProps = {
  /**
   * Callback which receives the `values` when the "Submit" button is clicked.
   */
  onSubmit: (data: FormValues) => void

  /** Optional object of `values` the form should start with. */
  initialValues?: Partial<FormValues>
}
