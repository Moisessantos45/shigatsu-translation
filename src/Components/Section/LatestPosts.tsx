import PostCard from "../UI/PostCard";

const posts = [
  {
    id: 1,
    image: "https://via.placeholder.com/150",
    title: "Post Title 1",
    date: "June 09, 2022",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/150",
    title: "Post Title 2",
    date: "June 02, 2022",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/150",
    title: "Post Title 3",
    date: "May 27, 2022",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/150",
    title: "Post Title 4",
    date: "May 19, 2022",
  },
];

const LatestPosts = () => {
  return (
    <div className=" p-4 md:p-8 w-11/12 margin">
      <h1 className="text-3xl font-bold text-white mb-6">Latest Posts</h1>
      <div className="md:grid md:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard
            id={post.id}
            key={post.id}
            image={post.image}
            title={post.title}
            date={post.date}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestPosts;
