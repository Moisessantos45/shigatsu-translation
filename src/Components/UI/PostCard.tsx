import { FC } from "react";

interface Post {
    id: number;
    image: string;
    title: string;
    date: string;
  }
  
const PostCard:FC<Post> = ({ image, title, date }) => {
  return (
    <div className="flex h-56 flex-col bg-[#1b1e2a] rounded-lg shadow-md overflow-hidden mx-2 my-4 w-full">
    <img className="w-full h-32 object-cover" src={image} alt={title} />
    <div className="p-4">
      <div className="flex items-center text-gray-400 text-sm mb-2">
        <span className="material-icons mr-1">access_time</span>
        {date}
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
  </div>
  )
}

export default PostCard
