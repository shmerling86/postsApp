export interface Post {
    title: string,
    description: string,
    _id?: string,
    date?: string,
    lastModified?: string,
    creatorId?: string,
    creatorName?: string,
    imagePath?: string,
    profileImage?: string,
    votes?: string[],
    userKeepsIDs?: string[],
    comments?: object[]
}