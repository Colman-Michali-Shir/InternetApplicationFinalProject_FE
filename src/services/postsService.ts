export interface IPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  user: { username: string; profileImage: string };
  likesCount: number;
  commentsCount: number;
  rating: number;
}
