import React, { useRef, useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Assuming projectApi is located in ../../../services/projectApi.js
import projectApi from "../services/projectApi";

// Re-add standard Leaflet marker icon definition for OTHER markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ProjectMap = ({ project, onProjectSelect, onMouseEnter, onMouseLeave, className }) => {
    // Current project coordinates (used for centering the map)
    const lat = project?.latitude || 23.82811088679897;
    const lng = project?.longitude || 91.27649743144973;

    // State to hold all fetched projects
    const [allProjects, setAllProjects] = useState([]);

    // ⭐️ Custom black icon definition for the CURRENT project
    const customIcon = useMemo(() => {
        // SVG generates a classic teardrop/pin shape in solid black.
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" width="38" height="38">
            <path fill="#000000" d="M19 0c-9.5 0-16 6.5-16 16 0 9.5 9 17 16 22 7-5 16-12.5 16-22 0-9.5-6.5-16-16-16z"/>
            <circle fill="#FFFFFF" cx="19" cy="16" r="6"/>
        </svg>`;

        return new L.Icon({
            iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent),
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            tooltipAnchor: [18, -28],
        });
    }, []);

    // ⭐️ EFFECT: Fetch all projects for the map once on load
    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                // Assuming projectApi.getProjects() returns an array of projects
                const projects = await projectApi.getProjects();

                // Filter and set valid projects
                const validProjects = projects.filter(p => p.latitude && p.longitude);
                setAllProjects(validProjects);

            } catch (error) {
                console.error("Failed to fetch all projects for map:", error);
            }
        };

        fetchAllProjects();
    }, []);

    return (
        <div
            className={`flex-shrink-0 w-[280px] h-[220px] sm:w-[400px] sm:h-[450px] xl:w-[600px] xl:h-[450px] rounded-lg overflow-hidden relative ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full grayscale"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* ⭐️ RENDER MARKERS FOR ALL PROJECTS */}
                {allProjects.map((p) => {
                    // Assuming your project objects have a unique identifier like _id
                    const isCurrentProject = p._id === project?._id;

                    // Determine which icon and tooltip behavior to use
                    const markerIcon = isCurrentProject ? customIcon : new L.Icon.Default();
                    const permanentTooltip = isCurrentProject;

                    return (
                        <Marker
                            key={p._id || p.name}
                            position={[p.latitude, p.longitude]}
                            icon={markerIcon}
                            eventHandlers={{
                                click: () => {
                                    onProjectSelect?.(p._id);   // 👈 tell parent which project was clicked
                                },
                            }}
                        >
                            <Tooltip
                                permanent={permanentTooltip}
                                direction="right"
                                offset={[10, 0]}
                            >
                                <div className="flex flex-col text-xs p-1">
                                    <strong className="whitespace-nowrap">{p.title || p.name || "Project"}</strong>
                                    <span className="whitespace-nowrap">{p.location || "Unknown"}</span>
                                </div>
                            </Tooltip>
                        </Marker>
                    );
                })}

            </MapContainer>
        </div>
    );
};

export default ProjectMap;
