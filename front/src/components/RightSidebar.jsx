import store from "@/redux/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SuggestedUsers from "./SuggestedUsers";

function RightSidebar() {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={user?.profilePicture || "default-avatar.png"}
              alt="profile_img"
              className="object-cover rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>


        <div className="flex flex-col">
          <h1 className="font-semibold text-sm text-gray-800">
            <Link to={`/profile/${user?._id}`}>{user?.username || "Unknown"}</Link>
          </h1>

          <span className="text-gray-600 text-sm whitespace-nowrap">{user?.bio || "I am a full stack developer"}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
}

export default RightSidebar;
