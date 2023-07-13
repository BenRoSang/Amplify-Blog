import { API, Storage } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { getPost } from '../../../queries'
import { NavLink, useLoaderData, useParams } from 'react-router-dom'

const BlogDetail = () => {
  const {postId} = useParams();
  const [ image, setImage ] = useState(null)
  const data = useLoaderData();
  const post = data.data.getPost

  useEffect(() => {
    getImage();
  
  }, [])

  const getImage = async () => {
    if(post.coverImage) {
      const getImg = await Storage.get(post.coverImage)
      setImage(getImg);
    }
  }
  
  return (
    <div className='w-full'>
      <h3 className='text-4xl pb-4'>{post.title}</h3>
      { image && ( <img src={image} /> )}
      <p className='mt-2'>{post.content}</p>
      <NavLink to={`/blog/update/${postId}`} className="m-3 py-2 px-3 inline-block rounded border-2 bg-slate-400 my-3"> Edit</NavLink>
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