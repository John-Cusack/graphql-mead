import 'cross-fetch/polyfill'
import {gql} from 'apollo-boost'
import prisma  from '../src/prisma'
import seedDatabase, {userOne} from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)
const createUser = gql `
    mutation($data: CreateUserInput) {
        createUser(
            data: $data
        ){
            token
            user {
                token
                name
                email
            }
        }
    }
`
test('should create new user', async () => {
    const variables = {
        data: {
            name: 'andrew',
            email: 'andrew@gmail.com',
            password: 'asdfoaudfafas'
        }
    }

    const response = await client.mutate({
        mutation:createUser,
        variables
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
                    password: "asdfasfalkdfj"
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

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    const getProfile = gql`
        query {
            me {
                id
                name
                email
            }
        }
    `
    const {data} = await client.query({query: getProfile})
    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})