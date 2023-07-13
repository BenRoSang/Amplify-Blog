import React, { useState } from 'react'
import { API } from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Form, redirect, useActionData, useLoaderData } from 'react-router-dom'
import { updatePost } from '../../../mutations'
import { v4 as uuid } from 'uuid'
import { getPost } from '../../../queries'

function BlogUpdate() {
  const errors = useActionData();
  const data = useLoaderData();
  const [title, setTitle] = useState(data.title)
  const [image, setImage] = useState(null)

  const handleChange = (e) => {
    const fileUpload = e.target.files[0]
    if(!fileUpload) return
    setImage(fileUpload);
  }

  return (
    <Form method="post" action="/blog/create">
      <h3 className='block text-4xl font-bold py-3'>Create Blog</h3>
      <div className='py-2'>
        <label>
          <span className='block py-2'>Title</span>  
        </label>
        <input type="text"
          name="title" 
          value={title} required 
          className='border-2 rounded' 
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type='hidden' name="id" value={data.id} />
          { errors && errors.title && <span className='block text-sm text-red-400 italic'>{errors.title}</span> }
      </div>
      <div className='py-2'>
        <label>
          <span className='block py-2'>Content</span>
        </label>
        <textarea name="content" required className='border-2 rounded'>{data.content}</textarea>
          { errors && errors.content && <span className='block text-sm text-red-400 italic'>{errors.content}</span> }
      </div>
      <div className='py-2'>
        <label>
          <span className='block py-2'>Image</span>
        </label>
        <textarea name="content" required className='border-2 rounded'>{data.content}</textarea>
        <input type='file' onChange={handleChange} />
        <img src={image} />
      </div>
      <div className='py-3'>
        <button type='submit' className='py-2 px-3 border-2 rounded-lg bg-slate-400'>Submit</button>
      </div>

      {/* {data && data.errors && <p>{data.error}</p>} Example data output */}
    </Form>
  )

}

export default withAuthenticator(BlogUpdate);

export const updateAction = async ({ request }) => {
  const data = await request.formData()
  const errors = {}

  const submission = {
    id: data.get('id'),
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
  console.log(submission)

  await API.graphql({
    query: updatePost,
    variables: {input: submission},
    // authMode: 'AMAZON_COGNITO_USER_POOLS'
  })
  
  // redirect the user
  return redirect('/blog')
}

export const updateLoader = async ({ params }) => {
  const { postId } = params

  const res = await API.graphql({
    query: getPost,
    variables: { id: postId}
  })

  if(!res) {
    throw Error('Can not get Post Data')
  }

  return res.data.getPost
}