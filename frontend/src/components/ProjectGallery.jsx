import ProjectCard from './ProjectCard';
import dummyProjects from '../data/projects.json';

const ProjectGallery = () => {
  return (
    <div className="flex flex-col items-center px-4 ">
      {dummyProjects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
};

export default ProjectGallery;
