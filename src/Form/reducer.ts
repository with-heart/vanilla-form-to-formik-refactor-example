import {set} from 'lodash/fp'
import {State, Action} from './types'

/** Modifies the current `State` based on the `type` of an `Action`. */
export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'setFieldValue':
      // set the `value` of `field`
      return set(`values.${action.field}`, action.value, state)

    case 'setFieldError':
      // set the error `value` of `field`
      return set(`errors.${action.field}`, action.error, state)

    default:
      // since we didn't match any action types, return unmodified state
      return state
  }
}
