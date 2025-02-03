import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

function MainLayout() {
  return (
    <div className="flex relative">
      {/* Left Sidebar - Correct Width + Clickable */}
      <div className="w-[20%] fixed h-full top-0 left-0 z-50 pointer-events-auto">
        <LeftSidebar />
      </div>

      {/* Center Content */}
      <div className="flex-grow ml-[18%]">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
