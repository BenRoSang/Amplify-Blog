import { API, Storage } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { getPost } from '../../../queries'
import { NavLink, redirect, useLoaderData, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { createComment } from '../../../mutations'

const BlogDetail = () => {
  const {postId} = useParams();
  const [ image, setImage ] = useState(null)
  const [ comment, setComment ] = useState('')
  const data = useLoaderData();
  const post = data.data.getPost

  console.log(post)

  useEffect(() => {
    getImage();
  
  }, [])

  const getImage = async () => {
    if(post.coverImage) {
      const getImg = await Storage.get(post.coverImage)
      setImage(getImg);
    }
  }

  const SaveCommentHandler = async() => {
    if(!comment) return
    const postData = {
      message: comment,
      id: uuid(),
      postID: post.id
    }
    try {
      const res = await API.graphql({
        query: createComment,
        variables: { input: postData },
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      })
      redirect("/")
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className='w-full'>
      <h3 className='text-4xl pb-4'>{post.title}</h3>
      { image && ( <img src={image} className='w-1/2 h-1/2' /> )}
      <p className='my-2'>{post.content}</p>
      {
        post.comments.items.length > 0 &&
        post.comments.items.map(comment => (
          <div className='my-4 bg-slate-300 p-5 rounded-md'>
            {comment.message}
          </div>
        ))
      }
        <hr className='my-10'/>
        <div className='my-3'>
          <input 
            type='text' value={comment} 
            onChange={(e) => setComment(e.target.value)}
            className='w-full h-10 border-2 rounded'  
          />
          <button className='py-2 px-1 border rounded bg-slate-400 mt-2' onClick={SaveCommentHandler}>Save Comment</button>
        </div>
    </div>

  )
}

export default BlogDetail


export const detailLoader = async ({params}) => {
  const { postId } = params
  const res = await API.graphql({
    query: getPost,
    variables: {id: postId}
  })

  if(!res) {
    throw Error('Could not get data')
  }

  return res;
}