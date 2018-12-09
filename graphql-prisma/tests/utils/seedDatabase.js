import prisma  from '../../src/prisma'
import bcrypt from 'bcryptjs'

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: {
            name: 'jen',
            email: 'jen@emaple.com',
            password: bcrypt.hashSync('09asdf0df')
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: "My first post",
            body: "man this is good",
            published: true,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: "My second post",
            body: "man this is not as good as the first one",
            published: false,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })
}

export {seedDatabase as default} 