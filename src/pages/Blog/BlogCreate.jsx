import React, { useState } from 'react'
import { API, Storage, Auth } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Form, redirect, useActionData } from 'react-router-dom'
import { createPost } from '../../../mutations'
import { v4 as uuid } from 'uuid'

function BlogCreate() {
  const errors = useActionData();
  const [image, setImage] = useState(null)
  
  const handleChange = (e) => {
    const uploadFile = e.target.files[0]
    if(!uploadFile) return
    setImage(uploadFile)
    
  }
  

  return (
    <Form method="post" action="/blog/create" className='w-full' encType="multipart/form-data">
      <h3 className='block text-4xl font-bold py-3'>Create Blog</h3>
      <div className='py-2'>
        <label>
          <span className='block py-2'>Title</span>  
        </label>
        <input type="text" name="title" required className='border-2 rounded w-full h-10' />
          { errors && errors.title && <span className='block text-sm text-red-400 italic'>{errors.title}</span> }
      </div>
      <div className='py-2'>
        <label>
          <span className='block py-2'>Content</span>  
        </label>
        <textarea name="content" required className='border-2 rounded w-full h-20'></textarea>
          { errors && errors.content && <span className='block text-sm text-red-400 italic'>{errors.content}</span> }
      </div>
      <div className='py-2'>
        <label>
          <span className='block py-2'>Image</span>  
        </label>
        <input type="file" name='image' onChange={handleChange} />
        { image && <img src={URL.createObjectURL(image)} /> }
      </div>
      <div className='py-3'>
        <button type='submit' className='py-2 px-3 border-2 rounded-lg bg-slate-400'>Submit</button>
      </div>

    </Form>
  )

}

export default withAuthenticator(BlogCreate);

export const postAction = async ({ request }) => {
  const data = await request.formData()
  const {username} = await Auth.currentAuthenticatedUser();
  console.log(username) 
  const errors = {}
  const image = data.get('image')

  // console.log(image)
  const submission = {
    title: data.get('title'),
    content: data.get('content')
  }

  // send your post request
  if (submission.title.length < 3) {
    errors.title = 'Title too short';
  }

  if (submission.content.length < 5) {
    errors.content = 'Content too short';
  }

  if(Object.keys(errors).length) {
    return errors;
  }

  // send data to api
  submission.id = uuid();
  submission.username = username
  console.log(submission)

  if(image) {
    console.log('image upload')
    const fileName = `${image.name}_${uuid()}`;
    submission.coverImage = fileName
    await Storage.put(fileName, image)
  }

  await API.graphql({
    query: createPost,
    variables: {input: submission},
    // authMode: 'AMAZON_COGNITO_USER_POOLS'
  })
  
  // redirect the user
  return redirect('/blog')
}