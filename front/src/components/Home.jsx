import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

function Home() {
  useGetAllPost()
  useGetSuggestedUsers()
  return (
    <div className="flex relative">
      {/* Center Feed - Maintain negative margin */}
      <div className="flex-grow ml-[-18%] overflow-y-auto max-h-screen relative z-40">
        <Feed />
        <Outlet />
      </div>

      {/* Right Sidebar - Clickable & Visible */}
      <div className="w-[18%] fixed h-full top-0 right-0 z-50 pointer-events-auto">
        <RightSidebar />
      </div>
    </div>
  );
}

export default Home;
