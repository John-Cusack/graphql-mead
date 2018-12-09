import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import prisma  from '../src/prisma'
import { extractFragmentReplacements } from 'prisma-binding';

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

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