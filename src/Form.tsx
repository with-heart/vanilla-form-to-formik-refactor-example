import * as React from 'react'

type FormData = {
  name: string
  email: string
  password: string
}

type Props = {
  onSubmit: (data: FormData) => void
}

export const Form = (props: Props) => {
  // state
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  // callbacks
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props.onSubmit({name, email, password})
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          onChange={event => setName(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={event => setEmail(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={event => setPassword(event.target.value)}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
