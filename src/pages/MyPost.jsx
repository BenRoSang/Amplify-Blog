import { API, Auth, Storage } from 'aws-amplify'
import React, { useEffect, useState} from 'react'
import { postByUsername } from '../../queries'
import { NavLink, redirect, useLoaderData } from 'react-router-dom'
import { deletePost } from '../../mutations'

const MyPost = () => {
    const posts = useLoaderData();
    const [postWithImage, setPostWithImage] = useState([]);
    const [ showConfirmBox, setShowConfirmBox] = useState(false)
  
    useEffect(() => {
      getImageFun();
    }, [])
  
    const getImageFun = async () => {
      const postWith = await Promise.all(
        posts.map(async(post) => {
          if(post.coverImage) {
            post.coverImage = await Storage.get(post.coverImage)
          }
          return post
        })
      )
      setPostWithImage(postWith);
    }

    const confirmHandler = () => {
        setShowConfirmBox(!showConfirmBox)
    }

    const deleteHandler = async(id) => {
        console.log(id)
        const response = await API.graphql({
            query: deletePost,
            variables: {input: {id}}
        })

        if(!response.data.deletePost) {
            throw Error('Can not delete post')
        }
        
        setPostWithImage(postWithImage.filter(post => post.id !== id))
        console.log(response)
        setShowConfirmBox(!showConfirmBox)
    }

    console.log(postWithImage)

    const renderPost = postWithImage.map((post, index) => (
        <div className='bg-slate-400 rounded-md p-4 my-4 flex justify-between items-center' key={index}>
          <div>
            <h2 className='text-xl'>{post.title}</h2>
            <p className='text-sm'>{post.content}</p>

            <NavLink to={`/post/detail/${post.id}`} className='p-1 text-sm bg-white border rounded-md' >Details</NavLink>
            <NavLink to={`/post/update/${post.id}`} className='p-1 text-sm mx-2 bg-white border rounded-md' >Update</NavLink>
            <button to={`detail/${post.id}`} onClick={confirmHandler} className='p-1 text-sm bg-white border rounded-md text-red-400' >Delete</button>
          </div>
          
          <div>
            {
              post.coverImage && (
                <img src={post.coverImage} className='w-20 h-20 rounded-full border-2' />
              )
            }
          </div>


          {/* Confirm dialog Box */}

          {
            showConfirmBox && (
                <>
                    <div className='w-full h-full absolute bg-black opacity-20 top-0 left-0 m-0 p-0'></div>
                    <div className='confirm-box border rounded-md bg-slate-800  py-10 px-14'>
                        <h1 className='text-white mb-4'>Do you want to Delete?</h1>
                        <button onClick={() => deleteHandler(post.id)} className='py-1 px-3 rounded bg-slate-200'>Yes</button>
                        <button onClick={confirmHandler} className='py-1 px-3 rounded bg-slate-200 ml-3'>No</button>
                    </div>
                </>
            )
          }
        </div>
      ))

  return (
    <div>
        { renderPost }
    </div>
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