import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DialogTrigger, Dialog, DialogContent } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuSendHorizontal } from "react-icons/lu";
import { FiMessageCircle } from "react-icons/fi";
import { IoBookmarksOutline } from "react-icons/io5";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

function Post({ post }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post.comments);

  const changeEventHandler = (e) => {
    setText(e.target.value.trim() ? e.target.value : "");
  };

  const likeOrDislikeHandler = async () => {
    if (!post?._id) return;
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`https://instragramcopy.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      const updatedLike = liked ? postLike - 1 : postLike + 1;
      if (res.data.success) {
        setPostLike(updatedLike);
        setLiked(!liked);

        // Update the current post without affecting others
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
              ...p,
              likes: liked ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id],
            }
            : p
        );
        dispatch(setPosts(updatedPostData)); // Only update the affected post

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instragramcopy.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [res.data.comment, ...comment];
        setComment(updatedCommentData);

        // Update only the selected post's comments without affecting others
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData)); // Update only the selected post's comments

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`https://instragramcopy.onrender.com/api/v1/post/delete/${post._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPosts)); // Remove the deleted post from the list

        toast.success("Post deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`https://instragramcopy.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!post) return null;

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10 flex items-center justify-center">
            <AvatarImage
              src={post.author?.profilePicture || "default-avatar.png"}
              alt="profile_img"
              className="w-full h-full rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 mb-4">
            <h1 className="font-semibold text-sm text-gray-800">{post.author?.username || "Unknown"}</h1>
            {user?._id === post?.author._id && (
              <Badge className="px-2 py-0.5 text-xs rounded-md bg-gray-200 text-gray-700">
                Author
              </Badge>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              post?.author._id !== user?._id && <Button variant="ghost" className="w-fit text-[#ED4956] font-bold">
                Unfollow
              </Button>
            }

            <Button variant="ghost" className="w-fit">Add to favorites</Button>
            {user?._id === post?.author?._id && (
              <Button onClick={deletePostHandler} variant="ghost" className="w-fit">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img className="rounded-sm my-2 object-contain" src={post.image || "default-image.jpg"} alt="Post" />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart onClick={likeOrDislikeHandler} size={22} className="cursor-pointer text-red-600" />
          ) : (
            <FaRegHeart size={22} className="cursor-pointer" onClick={likeOrDislikeHandler} />
          )}

          <FiMessageCircle onClick={() => {
            dispatch(setSelectedPost(post)); setOpen(true);
          }} size={22} className="cursor-pointer hover:text-gray-600" />
          <LuSendHorizontal size={22} className="cursor-pointer hover:text-gray-600" />
        </div>
        <IoBookmarksOutline onClick={bookmarkHandler} size={22} className="cursor-pointer hover:text-gray-600" />
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username || "Unknown"}</span>
        {post.caption || "No caption provided."}
      </p>
      {
        comment.length > 0 && (
          <span className="cursor-pointer text-sm text-gray-400" onClick={() => {
            dispatch(setSelectedPost(post)); setOpen(true)
          }} >
            View all {post.comments?.length} comments
          </span>
        )
      }

      <CommentDialog open={open} setOpen={setOpen} />

      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
}

export default Post;
