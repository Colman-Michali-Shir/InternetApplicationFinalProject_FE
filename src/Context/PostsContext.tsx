import { createContext, useContext, useState } from 'react';
import { IPost } from '../services/postsService';

interface PostContextType {
  postsContext: IPost[];
  addPost: (newPost: IPost) => void;
  addMultiplePosts: (newPosts: IPost[]) => void;
  clearStates: () => void;
  setEndOfList: (hasMore: boolean) => void;
}

const PostsContext = createContext<PostContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const addPost = (newPost: IPost) => {
    if (!hasMore) setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const addMultiplePosts = (newPosts: IPost[]) => {
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
  };

  const clearStates = () => {
    setPosts([]);
    setHasMore(false);
  };

  const setEndOfList = (hasMore: boolean) => {
    setHasMore(hasMore);
  };

  return (
    <PostsContext.Provider
      value={{
        postsContext: posts,
        addPost,
        clearStates,
        addMultiplePosts,
        setEndOfList,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};
