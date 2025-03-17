import { createContext, useContext, useState } from 'react';
import { IPost } from '../services/postsService';

interface PostContextType {
  postsContext: IPost[];
  addPost: (newPost: IPost) => void;
  addMultiplePosts: (newPosts: IPost[]) => void;
  clearStates: () => void;
  setEndOfList: (flage: boolean) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
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

  const setEndOfList = (flag: boolean) => {
    setHasMore(flag);
  };

  return (
    <PostContext.Provider
      value={{
        postsContext: posts,
        addPost,
        clearStates,
        addMultiplePosts,
        setEndOfList,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};
