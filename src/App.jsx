import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Blog, {postsLoader} from './pages/Blog/Blog'
import BlogCreate, { postAction } from './pages/Blog/BlogCreate'
import BlogUpdate, { updateAction, updateLoader } from './pages/Blog/BlogUpdate'
// import BlogDetail from './pages/Blog/BlogDetail'
import BlogDetail,{ detailLoader} from './pages/Blog/BlogDetail'
import Navbar from './layouts/Navbar'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import BlogLayout from './layouts/BlogLayout'
import '@aws-amplify/ui-react/styles.css';
import MyPost, {myPostsLoader} from './pages/MyPost'


function App() {


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Navbar />}>
        <Route index element={ <Home />} />
        <Route path='mypost' element={ <MyPost />} loader={myPostsLoader} />
        <Route path='blog' element={<BlogLayout />} >
          <Route index element={ <Blog />} loader={postsLoader} />
         
          <Route 
            path='create' 
            element={ <BlogCreate />} 
            action={postAction}
          />
          <Route 
            path='update/:postId' 
            element={ <BlogUpdate />}
            loader={updateLoader}
            action={updateAction}
          />
          <Route 
            path='detail/:postId' 
            element={ <BlogDetail />} 
            loader={detailLoader}
          />
        </Route>

        {/* <Route path="about" element={<About />} />
        <Route path="help" element={<HelpLayout />}>
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact/>} action={contactAction} />
        </Route> 
         <Route 
          index 
          element={<Careers />} 
          loader={careersLoader}
          // errorElement={<CareersError />}
        />
        */}
      
  
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )
  
  

  return (
    <RouterProvider router={router} />
  )
}

export default App
