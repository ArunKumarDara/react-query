import { useQuery, useMutation } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";
import { useQueryClient } from "@tanstack/react-query";

const PostList = () => {
  const queryClient = useQueryClient();
  const {
    data: postData = [],
    isLoading,
    isError,
    // error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const {
    data: tagsData = [],
    isLoading: isTagLoading,
    isError: isTagError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    // staleTime: Infinity,
  });

  const {
    mutate,
    isError: isPostError,
    isPending,
    // error: postError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    onMutate: () => {
      return { id: 1 };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
        // predicate: (query) => {
        //   query.queryKey[0] === "posts" && query.queryKey[1].page >= 2;
        // },
      });
    },
    // onError: (error, variables, context) => {},
    // onSettled: (data, error, variables, context) => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter((key) => key !== "title");
    if (!title || !tags) return;
    mutate({ id: postData.length + 1, title, tags });
    e.target.reset();
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your post"
          className="postbox"
          name="title"
        />
        <div className="tags">
          {tagsData.map((tag) => {
            const { id, name } = tag;
            return (
              <div key={id}>
                <input name={name} id={id} type="checkbox" />
                <label htmlFor={id}>{name}</label>
              </div>
            );
          })}
        </div>
        <button>Post</button>
      </form>
      {(isLoading || isTagLoading) && isPending && <p>Loading....</p>}
      {(isError || isTagError) && <p>Some Error happend</p>}
      {isPostError && <p onClick={() => reset()}>Unable to Post</p>}
      {postData.map((post) => {
        return (
          <div key={post.id} className="post">
            <div>{post.title}</div>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
