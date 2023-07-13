import { API, Auth } from 'aws-amplify'
import React from 'react'
import { postByUsername } from '../../queries'
import { useLoaderData } from 'react-router-dom'

const MyPost = () => {
    const posts = useLoaderData();
    console.log(posts)
  return (
    <div>MyPost</div>
  )
}

export default MyPost

export const myPostsLoader = async() => {
    const { username } = await Auth.currentAuthenticatedUser();
    const posts = await API.graphql({
        query: postByUsername,
        variables: { username }
    })

    if(!posts) throw Error('There is no posts');

    return posts.data.postByUsername.items
}