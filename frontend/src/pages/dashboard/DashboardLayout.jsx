import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarLeft from "../../components/Dashboard/SidebarLeft";
import SidebarRight from "../../components/Dashboard/SidebarRight";
import Logo from "../../assets/navbar/VDSLOGOADMIN.png";
import SorryImg from "../../assets/other/pageNotFound.png"; 

const DashboardLayout = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeSidebarRight = () => setSelectedProject(null);

  if (!isDesktop) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4 gap-6">
        
        <img src={Logo} alt="Logo" className="w-32 h-auto" />

        
        <img src={SorryImg} alt="Sorry" className="w-48 h-auto" />

        
        <h1 className="text-xl font-semibold text-[#722F37]">
          Sorry, the Admin dashboard is only visible on a laptop or desktop screen.
        </h1>
      </div>
    );
  }

  return (
    <div className="h-[90vh] grid grid-cols-[250px_1fr]">
      <SidebarLeft />

      
      <div className="overflow-y-auto">
        <Outlet context={{ setSelectedProject }} />
      </div>

      {selectedProject && <SidebarRight project={selectedProject} onClose={closeSidebarRight} />}
    </div>
  );
};

export default DashboardLayout;
