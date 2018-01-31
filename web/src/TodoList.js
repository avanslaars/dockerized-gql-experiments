import React from 'react'
import { Connect, query } from 'urql'

const TodoQuery = query(`
  {
    todos {
      id,
      name,
      isComplete
    }
  }
`)

const TodoItem = (props) => {
  const color = props.isComplete ? 'green' : 'red'
  return (
    <div>
      <h1 style={{color: color}}>{props.name}</h1>
    </div>
  )
}

const renderTodos = ({ loaded, data }) => {
  return loaded
    ? (
      <div>
        {data.todos.map(todo => <TodoItem key={todo.id} {...todo} />)}
      </div>
      )
    : "loading..."
}

export default (props) => {
  return (
    <div>
      <Connect
        query={TodoQuery}
        render={renderTodos} />
    </div>
  )
}
