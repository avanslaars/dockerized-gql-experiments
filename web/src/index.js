import React from 'react'
import { render } from 'react-dom'
import { Client, Provider } from 'urql'
import TodoList from './TodoList'

const client = new Client({
  url: '/graphql'
})

const App = () => (
  <Provider client={client}>
    <TodoList />
  </Provider>
)

render(<App />, document.getElementById('app'))
