const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const r = require('rethinkdb')

const connectionProps = {
  host: 'rdb',
  port: 28015,
  authKey: '',
  db: 'demo'
}

const typeDefs = `
  type Query { todos: [Todo] }
  type Todo { id: Int, name: String, isComplete: Boolean}
`

const resolvers = {
  Query: {
    todos: () => {
      return r.connect(connectionProps).then((conn) => {
        return r.table('todos')
          .orderBy({index: 'id'})
          .run(conn)
          .then(cursor => cursor.toArray())
      })
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const app = express()

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// connect to rethink and expose on req._rdbConn
app.use(createConnection)

app.get('/', (req, res) => {
  res.send({hello: 'world'})
})

app.get('/todos', (req, res) => {
  r.table('todos')
    .orderBy({index: 'id'})
    .run(req._rdbConn)
    .then(cursor => cursor.toArray())
    .then(result => res.send(result))
})

app.post('/setup', (req, res) => {
  const conn = req._rdbConn
  const todos = [
    {id: 1, name: 'Todo - 1', isComplete: false},
    {id: 2, name: 'Todo - 2', isComplete: false},
    {id: 3, name: 'Todo - 3', isComplete: false}
  ]
  r.dbCreate('demo').run(conn)
    .finally(() => r.tableCreate('todos').run(conn))
    .finally(() => r.table('todos').insert(todos).run(conn, (err, result) => {
      if (err) { res.sendStatus(500)}
      res.send(result)
    }))
})

// Close db connection after running route
app.use(closeConnection)

app.listen(3000, () => {
  console.log('GraphQL server is running on port 3000')
})

function createConnection(req, res, next) {
  const connectionProps = {
    host: 'rdb',
    port: 28015,
    authKey: '',
    db: 'demo'
  }
  r.connect(connectionProps).then(function(conn) {
      req._rdbConn = conn
      next()
  }).error(handleError(res))
}

function closeConnection(req, res, next) {
  req._rdbConn.close()
}

function handleError(res) {
  return function(error) {
      res.send(500, {error: error.message});
  }
}
