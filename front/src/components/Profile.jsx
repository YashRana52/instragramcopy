import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, HeartIcon, MessageCircle } from "lucide-react";
import { useState } from "react";

function Profile() {
  const param = useParams();
  const userId = param.id;
  useGetUserProfile(userId);
  const [activeTab, setActivTab] = useState("posts");
  const { userProfile, user } = useSelector((store) => store.auth);


  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = true;

  const handleTabChange = (tab) => {
    setActivTab(tab);
  };

  const displayPost =
    activeTab === "posts" ? userProfile?.posts || [] : userProfile?.bookmarks || [];

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture || ""}
                alt="profilephoto"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username || "User"}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to='/account/edit'>
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">
                        Edit Profile
                      </Button>
                    </Link>

                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      View archive
                    </Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">Unfollow</Button>
                    <Button variant="secondary" className="h-8">Message</Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#0095f6] h-8">Follow</Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold mr-1">
                    {userProfile?.posts?.length || 0}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold mr-1">
                    {userProfile?.followers?.length || 0}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold mr-1">
                    {userProfile?.following?.length || 0}
                  </span>
                  following
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold">{userProfile?.bio || "bio here..."}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign /> <span className="pl-1">{userProfile?.username || "User"}</span>
                </Badge>
                <span>Success follows hard work. 🚀</span>
                <span>Dream, believe, achieve. ✨</span>
                <span>Keep going, keep growing. 💪</span>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${activeTab === "posts" ? "font-bold" : ""}`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer" onClick={() => handleTabChange("posts")}>
              REELS
            </span>
            <span className="py-3 cursor-pointer" onClick={() => handleTabChange("saved")}>
              TAGS
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {displayPost.length > 0 ? (
              displayPost.map((post) => (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image || ""}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <HeartIcon />
                        <span>{post?.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500 py-5">No posts found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
