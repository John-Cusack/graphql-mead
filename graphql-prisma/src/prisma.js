import {Prisma} from 'prisma-binding'

const prisma = new Prisma({
    typeDefs:'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

// prisma.query.users(null, '{id name posts { id title}}').then((data)=> {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{id text author{id name}}').then((data)=> {
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.createPost({
//     data: {
//         title: "stuff 101",
//         body:"hey man this is pretty good",
//         published: true,
//         author: {
//             connect:{
//                 id:"cjp3a2bva000s08434ynndijq"
//             }
//         }
//     }
// }, '{id title published}').then((data) =>{
//     console.log(data)
//     return prisma.query.users(null, '{id name posts{id title}}')
// }).then((data) =>{
//     console.log(JSON.stringify(data, undefined, 2))
// })

prisma.mutation.updatePost({
    data:{
        body:"this is a very good article",
        published:false
    }, where:{id:"cjp3cu0uz002y0843f6jw2fwx"}
}, '{id body}').then((data) => {
    console.log(data)
    return prisma.query.posts(null, '{id body published}')
}).then((data)=> {
    console.log(JSON.stringify(data, undefined, 2))
})