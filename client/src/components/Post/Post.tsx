import React from "react"
import { useParams } from "react-router-dom"
const Post = () => {
  const { id } = useParams()
  return (
    <div className='w-full min-h-screen flex flex-col items-center'>
      <div>{id}</div>
    </div>
  )
}

export default Post
