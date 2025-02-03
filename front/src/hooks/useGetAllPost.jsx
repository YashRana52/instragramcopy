import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
    const dispatch = useDispatch();

    const fetchAllPost = useCallback(async () => {
        try {
            const res = await axios.get('https://instragramcopy.onrender.com/api/v1/post/all', { withCredentials: true });
            if (res.data.success) {
                dispatch(setPosts(res.data.posts));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchAllPost();
    }, [fetchAllPost]);

};

export default useGetAllPost;
