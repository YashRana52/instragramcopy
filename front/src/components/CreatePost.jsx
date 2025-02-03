/* eslint-disable */
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { useRef, useState } from "react";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2, ImagePlus } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

function CreatePost({ open, setOpen }) {
    const imageRef = useRef();
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const { posts } = useSelector((store) => store.post);

    // Handle Image Selection
    const fileChangeHandler = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const dataUrl = await readFileAsDataURL(selectedFile);
            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async () => {
        if (!caption.trim() && !file) {
            toast.error("Caption or image is required!");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        if (file) formData.append("image", file);

        try {
            setLoading(true);
            const res = await axios.post(
                "http://localhost:5000/api/v1/post/addpost",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);
                setCaption("");
                setImagePreview("");
                setFile(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
            <DialogContent className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-white max-w-lg w-full rounded-lg shadow-lg p-5 relative">
                    <DialogHeader className="text-center text-lg font-semibold border-b pb-3">
                        Create New Post
                    </DialogHeader>

                    <div className="flex items-center gap-3 py-3">
                        <Avatar className="w-16 h-16">
                            <AvatarImage
                                src={user?.profilePicture}
                                alt="User"
                                className="object-cover rounded-full"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-semibold text-sm">{user?.username}</h1>
                            <span className="text-gray-500 text-xs">Bio Here...</span>
                        </div>
                    </div>

                    <Textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="border-none focus-visible:ring-transparent text-sm"
                        placeholder="Write a caption..."
                    />

                    {imagePreview ? (
                        <div className="w-full h-80 flex items-center justify-center relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="object-contain h-full w-full rounded-md"
                            />
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
                            onClick={() => imageRef.current.click()}
                        >
                            <ImagePlus className="h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-500 mt-2">Select from computer</p>
                        </div>
                    )}

                    <input
                        ref={imageRef}
                        type="file"
                        className="hidden"
                        onChange={fileChangeHandler}
                    />

                    <Button
                        onClick={createPostHandler}
                        disabled={loading}
                        className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreatePost;
