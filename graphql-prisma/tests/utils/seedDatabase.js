import prisma  from '../../src/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userOne = {
    input: {
        name: 'jen',
        email: 'jen@emaple.com',
        password: bcrypt.hashSync('09asdf0df')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: "My second post",
        body: "man this is not as good as the first one",
        published: false
    },
    post: undefined
}

const postTwo = {
    input: {
        title: "My first post",
        body: "man this is good",
        published: true,
    },
    post: undefined
}

const seedDatabase = async () => {
    //delete old test data
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    //create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET)
    //create postOne
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
}

export {seedDatabase as default, userOne, postOne, postTwo} 