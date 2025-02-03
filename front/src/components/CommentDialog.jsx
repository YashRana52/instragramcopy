/* eslint-disable */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { toast } from "sonner";

function CommentDialog({ open, setOpen }) {
  const [newComment, setNewComment] = useState("");
  const [comment, setComment] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const { selectedPost, posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  // Fetch comments initially (on page load or refresh)
  useEffect(() => {
    if (selectedPost) {
      const fetchComments = async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/v1/post/${selectedPost?._id}/comments`
          );
          if (res.data.success) {
            setComment(res.data.comments);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchComments();
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setNewComment(inputText);
    } else {
      setNewComment("");
    }
  };

  const sendMessageHandler = async () => {
    if (!newComment.trim()) return;

    try {
      // Send new comment to backend
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${selectedPost?._id}/comment`,
        { text: newComment },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const newCommentData = res.data.comment;

        // Update frontend comments immediately after successful post
        setComment((prevComments) => [newCommentData, ...prevComments]);
        setNewComment("");

        // Update the post data
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: [...p.comments, newCommentData] }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add comment");
    }
  };

  const toggleOptions = () => setShowOptions(!showOptions);
  const handleCloseDialog = () => {
    setShowOptions(false);
    setOpen(false);
  };

  const toggleShowComments = () => setShowAllComments(!showAllComments);

  return (
    <Dialog open={open} onOpenChange={(openState) => { setOpen(openState); if (!openState) setShowOptions(false); }}>
      <DialogContent
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-lg shadow-lg flex"
        onInteractOutside={handleCloseDialog}
      >
        {/* Left: Post Image */}
        <div className="w-1/2 flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md">
          <img src={selectedPost?.image} alt="Post" className="max-h-[80vh] w-full object-cover rounded-lg" />
        </div>

        <div className='w-1/2 flex flex-col justify-between'>
          <div className='flex items-center justify-between p-4'>
            <div className='flex gap-3 items-center'>
              <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
              </div>
            </div>

            <div className="relative">
              <MoreHorizontal
                className="cursor-pointer text-gray-600 hover:text-black"
                onClick={toggleOptions}
              />
              {showOptions && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border p-2">
                  <div className="py-1 hover:bg-gray-100 cursor-pointer">Unfollow</div>
                  <div className="py-1 hover:bg-gray-100 cursor-pointer">Add to favorites</div>

                </div>
              )}
            </div>
          </div>

          {/* Scrollable Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px]">
            {(showAllComments ? comment : comment?.slice(0, 3))?.map((comment) => (
              <div key={comment._id} className="flex items-center space-x-3">
                <Avatar className="w-12 h-12 rounded-full border border-gray-300">
                  <AvatarImage
                    src={comment?.author?.profilePicture}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <AvatarFallback className="w-full h-full rounded-full bg-gray-300 text-white flex items-center justify-center">
                    CN
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">
                  <span className="font-semibold text-sm">{comment?.author?.username || "Unknown User"}</span> {comment?.text}
                </p>
              </div>
            ))}

            {comment?.length > 3 && (
              !showAllComments ? (
                <span
                  className="text-gray-400 font-semibold text-gray-600 cursor-pointer"
                  onClick={toggleShowComments}
                >
                  View All Comments
                </span>
              ) : (
                <span
                  className="text-blue-300 font-semibold cursor-pointer"
                  onClick={toggleShowComments}
                >
                  Hide All Comments
                </span>
              )
            )}
          </div>

          {/* Comment Input */}
          <div className="flex items-center space-x-3 border-t pt-3">
            <Avatar className="w-10 h-10 rounded-full border border-gray-300">
              <AvatarImage
                src=""
                className="w-full h-full rounded-full object-cover"
              />
              <AvatarFallback
                className="w-full h-full rounded-full bg-gray-300 text-white flex items-center justify-center"
              >
                Me
              </AvatarFallback>
            </Avatar>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 bg-gray-100 rounded-lg shadow-sm focus:outline-none text-sm"
            />
            {newComment.trim() && (
              <Button variant="link" className="text-blue-500 font-semibold" onClick={sendMessageHandler}>
                Post
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
