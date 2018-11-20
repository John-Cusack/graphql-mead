import {GraphQLServer} from 'graphql-yoga';

const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`
// Resolvers
const resolvers = {
    Query: {
        hello() {
            return "this my my query"
        },
        name() {
            return "john"
        },
        location() {
            return "fl"
        },
        bio() {
            return "cool"
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('server is up')
})