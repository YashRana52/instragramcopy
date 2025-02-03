import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

function LeftSidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    if (!user) return;

    try {
      const res = await axios.get("https://instragramcopy.onrender.com/api/v1/user/logout", { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null))
        dispatch(setPosts([]))
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Log Out" && user) {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    }
    else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`)
    }
    else if (textType === "Home") {
      navigate('/')
    }
    else if (textType === "Messages") {
      navigate('chat')
    }

  };

  const sidebarItems = [
    { id: 1, icon: <Home size={28} />, text: "Home" },
    { id: 2, icon: <Search size={28} />, text: "Search" },
    { id: 3, icon: <TrendingUp size={28} />, text: "Explore" },
    { id: 4, icon: <MessageCircle size={28} />, text: "Messages" },
    { id: 5, icon: <Heart size={28} />, text: "Notifications" },
    { id: 6, icon: <PlusSquare size={28} />, text: "Create" },
    {
      id: 7,
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profilePicture} alt="User Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { id: 8, icon: <LogOut size={28} />, text: "Log Out" },
  ];

  return (
    <div className="px-6 border-r border-gray-300 lg:w-[250px] sm:w-[200px] w-[20%] fixed h-full top-0 left-0 z-50 flex flex-col items-start py-6 bg-white">
      {/* Logo Section */}
      <div className="mb-6 px-6">
        <img src="/instagram.png" alt="Instagram Logo" className="h-12" />
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex flex-col w-full">
        {sidebarItems.map((item) => (
          <div
            onClick={() => sidebarHandler(item.text)}
            key={item.id}
            className="flex items-center gap-5 hover:bg-gray-200 cursor-pointer rounded-lg px-6 py-4 w-full transition-all"
          >
            {item.icon}
            <span className="text-lg font-semibold">{item.text}</span>
            {
              item.text === 'Notifications' && likeNotification.length > 0 && (

                <Popover>
                  <PopoverTrigger asChild>

                    <Button size='icon' className='rounded-full h-5 w-5 bg-red-500 hover:bg-red-500 absolute bottom-5 left-6'>{likeNotification.length}

                    </Button>


                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      {
                        likeNotification.length === 0 ? (<p>No new notification</p>) : (
                          likeNotification.map((notification) => {
                            return (
                              <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                <Avatar>
                                  <AvatarImage src={notification.userDetails?.profilePicture} />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                              </div>
                            )
                          })
                        )
                      }
                    </div>
                  </PopoverContent>
                </Popover>

              )
            }
          </div>
        ))}

      </nav>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSidebar;
