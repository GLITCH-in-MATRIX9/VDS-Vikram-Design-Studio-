import React, { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import SidebarLeft from "../../components/Dashboard/SidebarLeft";
import SidebarRight from "../../components/Dashboard/SidebarRight";
import Logo from "../../assets/navbar/VDSLOGOADMIN.png";
import SorryImg from "../../assets/other/pageNotFound.png"; 
import { AuthContext } from "../../context/authContext"; // ⬅️ IMPORT AuthContext

const DashboardLayout = () => {
    // ⬅️ CONSUME AUTH CONTEXT
    const { user, logout } = useContext(AuthContext); 
    
    const [selectedProject, setSelectedProject] = useState(null);
    // Initialize isDesktop state correctly
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); 

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const closeSidebarRight = () => setSelectedProject(null);

    // This check should technically be redundant due to ProtectedRoute, 
    // but ensures data integrity if the user object is momentarily missing.
    if (!user) {
        return <div>Loading user session...</div>; 
    }

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
        // ⬅️ Changed h-[90vh] to h-screen for a standard full-height dashboard
        <div className="h-screen grid grid-cols-[250px_1fr]"> 
            {/* ⬅️ PASS USER AND LOGOUT: SidebarLeft now has the user's name/role and logout function */}
            <SidebarLeft user={user} onLogout={logout} /> 

            
            <div className="overflow-y-auto">
                {/* Outlet renders AdminHome or Projects component */}
                <Outlet context={{ setSelectedProject }} /> 
            </div>

            {/* SidebarRight is conditional based on selected project */}
            {selectedProject && <SidebarRight project={selectedProject} onClose={closeSidebarRight} />}
        </div>
    );
};

export default DashboardLayout;