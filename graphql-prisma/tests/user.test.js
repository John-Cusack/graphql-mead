import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma  from '../src/prisma'
import seedDatabase from './utils/seedDatabase'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

beforeEach(seedDatabase)

test('should create new user', async () => {
    const createUser = gql `
        mutation {
            createUser(
                data: {
                    name: "John",
                    email: "john@gmail.com",
                    password: "mypass123"
                }
            ){
                token,
                user {
                    id
                }
            }
        }
    `

    const response = await client.mutate({
        mutation:createUser
    })

    const exists = await prisma.exists.User({id: response.data.createUser.user.id})
    expect(exists).toBe(true)
})

test('should expose public author profiles', async () => {
    const getUsers = gql`
        query {
            users {
                id
                name
                email
            }
        }
    `
    const response = await client.query({query: getUsers})

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('jen')
})



test('should not login with bad creditials', async () => {
    const login = gql`
        mutation {
            login(
                data: {
                    email: "jeff@we.com",
                    password: "asdf;alkdfj"
                }
            ){
                    token
                }
        }
    `
    
    await expect(
        client.mutate({mutation: login})
        ).rejects.toThrow()
})

test('should not sign up suser with invalid pasword', async () => {
    const createUser = gql `
        mutation {
            createUser(
                data: {
                    name: "Laura",
                    email: "something@gmail.com",
                    password: "1"
                }
            ){
                token
            }
        }
    `
    await expect(
        client.mutate({mutation: createUser})
    ).rejects.toThrow()
})