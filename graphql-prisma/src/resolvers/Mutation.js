import bcrypt from 'bcryptjs'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        if (args.data.password.length <8) {
            throw new Error('password must be 8 characters or longer')
        }

        const password = await bcrypt.hash(args.data.password, 10)

        return prisma.mutation.createUser({ 
            data:{
                ...args.data,
                password
            }
        }, info)
    },
    async deleteUser(parent, args, { prisma }, info) {
        return prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateUser(parent, args, { prisma }, info) {
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { prisma }, info) {
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            }
        }, info)
    },
    deletePost(parent, args, {prisma}, info) {
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    updatePost(parent, args, {prisma }, info) {
        return prisma.mutation.updatePost({
            where:{
                id: args.id
            },
            data: args.data
        }, info)

    },
    createComment(parent, args, { prisma}, info) {
        return prisma.mutation.createComment({
            data:{
                text: args.data.text,
                author:{
                    connect:{
                        id: args.data.author
                    }
                },
                post:{
                    connect: {
                        id:args.data.post
                    }
                }
            }
        }, info)
        // const userExists = db.users.some((user) => user.id === args.data.author)
        // const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        // if (!userExists || !postExists) {
        //     throw new Error('Unable to find user and post')
        // }

        // const comment = {
        //     id: uuidv4(),
        //     ...args.data
        // }

        // db.comments.push(comment)
        // pubsub.publish(`comment ${args.data.post}`, {
        //     comment: {
        //         mutation: 'CREATED',
        //         data: comment
        //     }
        // })

        // return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found')
        }

        const [deletedComment] = db.comments.splice(commentIndex, 1)
        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }