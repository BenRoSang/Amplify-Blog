import React, { useEffect, useState } from 'react'
import { NavLink, useLoaderData } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { listPosts } from '../../../queries'

const Blog = () => {
  const posts = useLoaderData();
  const [postWithImage, setPostWithImage] = useState([]);
  useEffect(() => {
    getImageFun();
  }, [])

  const getImageFun = async () => {
    const postWith = await Promise.all(
      posts.items.map(async(post) => {
        if(post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage)
        }
        return post
      })
    )
    setPostWithImage(postWith);
  }
  

  const renderPost = postWithImage.map((post, index) => (
    <NavLink to={`detail/${post.id}`} className='bg-slate-400 rounded-md p-4 my-4 flex justify-between items-center' key={index}>
      <div>
        <h2 className='text-xl'>{post.title}</h2>
        <p className='text-sm'>{post.content}</p>
      </div>
      <div>
        {
          post.coverImage && (
            <img src={post.coverImage} className='w-20 h-20 rounded-full border-2' />
          )
        }
      </div>
    </NavLink>
  ))

  return (
    <div className='w-3/4'>
      {renderPost}
    </div>
  )
}

export default Blog;

// data loader
export const postsLoader = async () => {
  const res = await API.graphql({
    query: listPosts
  })

  if (!res) {
    throw Error('Could not fetch the list of Blogs')
  }
  return res.data.listPosts;
}
