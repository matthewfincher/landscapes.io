// post.js
import User from './user'

const Landscape = `
    type Landscape {
        id: Int!
        title: String
        author: User
        votes: Int

        parentLandscapeId:  Landscape
        createdAt: Int

        name: String!
        version: String!
        imageUri: String!

        cloudFormationTemplate: String!
        infoLink: String
        infoLinkText: String
        description: String
    }
`

export default() => [Landscape, User]

 // createdBy: { type: Schema.ObjectId, ref: 'User' },
 // img: { data: Buffer, contentType: String },
