import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const selectedUserId = useSelector(store => store.auth.selectedUser?._id);

    useEffect(() => {
        const fetchAllMessage = async () => {
            if (!selectedUserId) return;

            try {
                const res = await axios.get(`https://instragramcopy.onrender.com/api/v1/message/all/${selectedUserId}`, { withCredentials: true });
                if (res.data.success && Array.isArray(res.data.messages)) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log("Error fetching messages:", error);
            }
        };

        fetchAllMessage();
    }, [selectedUserId]); // Now only updates when the actual user ID changes
};

export default useGetAllMessage;
