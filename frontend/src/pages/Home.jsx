import ProjectCard from '../components/ProjectCard';
import projects from '../Data/projects.json'; 
import HorizontalScrollComponent from '../components/HorizontalScrollComponent';
const Home = () => {
  return (
    <div className=" bg-[#faf6f3] flex flex-col items-center py-2">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}

      {/* <HorizontalScrollComponent/> */}
    </div>
  );
};

export default Home;
