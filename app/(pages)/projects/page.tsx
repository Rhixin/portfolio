import Project from "@/components/Project";

export default function Projects() {
  const images_project1 = [
    "/images/zhazted_2by2_nobg.png",
    "/images/zhazted_2by2_nobg.png",
    "/images/zhazted_2by2_nobg.png",
    "/images/zhazted_2by2_nobg.png",
    "/images/zhazted_2by2_nobg.png",
    "/images/zhazted_2by2_nobg.png",
    "/images/zhazted_2by2_nobg.png",
  ];

  const p0 = ["/images/asl/1.png", "/images/asl/2.png", "/images/asl/3.png"];

  const p1 = [
    "/images/mnsts/1.png",
    "/images/mnsts/2.png",
    "/images/mnsts/3.png",
    "/images/mnsts/4.png",
    "/images/mnsts/5.png",
    "/images/mnsts/6.png",
    "/images/mnsts/7.png",
  ];

  const p2 = [
    "/images/terraria/1.png",
    "/images/terraria/2.png",
    "/images/terraria/3.png",
  ];

  const p3 = [
    "/images/roomradarweb/1.png",
    "/images/roomradarweb/2.png",
    "/images/roomradarweb/3.png",
    "/images/roomradarweb/4.png",
    "/images/roomradarweb/5.png",
    "/images/roomradarweb/6.png",
    "/images/roomradarweb/7.png",
    "/images/roomradarweb/8.png",
  ];

  const p4 = [
    "/images/disease/1.png",
    "/images/disease/2.png",
    "/images/disease/3.png",
    "/images/disease/4.png",
  ];

  const p5 = [
    "/images/sinehan/1.png",
    "/images/sinehan/2.png",
    "/images/sinehan/3.png",
    "/images/sinehan/4.png",
    "/images/sinehan/5.png",
    "/images/sinehan/6.png",
    "/images/sinehan/7.png",
    "/images/sinehan/8.png",
  ];

  const p6 = [
    "/images/maze/1.png",
    "/images/maze/2.png",
    "/images/maze/3.png",
    "/images/maze/4.png",
    "/images/maze/5.png",
  ];

  return (
    <>
      <Project
        title={"Real-Time Sign Language Recognition"}
        description={
          "Built a real-time sign language recognition system leveraging computer vision and deep learning. Integrated TensorFlow and Keras for model training, achieving 98.6% accuracy in gesture classification. Used Flask and Socket.IO for real-time backend communication, and a React-based frontend for live hand tracking and gesture detection. Implemented a responsive UI with Tailwind and deployed the model through a Python-based API. Focused on seamless real-time video processing and improving accessibility for sign language users."
        }
        images={p0}
        technology={[
          "React",
          "Next.js",
          "Tailwind",
          "Tensorflow",
          "Keras",
          "Flask",
          "SocketIo",
          "Python",
          "Numpy",
          "Matplotlib",
        ]}
        weblink={""}
        github={"https://github.com/Rhixin/GesturbeeCamera"}
        video={""}
      ></Project>

      <Project
        title={"RoomRadar Website"}
        description={
          "Developed a landlord-tenant platform that streamlines the process of finding and listing boarding houses, integrating Google Maps API for interactive property listings and advanced search filters for tenants. Built an interactive landlord dashboard for managing listings and a tenant search system with filters for proximity, price range, and availability."
        }
        images={p3}
        technology={[
          "React",
          "Next.js",
          "Bootstrap",
          "ASP.NET",
          "MySQL",
          "Google Maps API",
        ]}
        weblink={""}
        github={"https://github.com/Rhixin/RoomRadarWeb"}
        video={
          "https://drive.google.com/file/d/1DF99Y3fcrSaBvUIVIAv3vX1_3yNsSvDV/view?usp=sharing"
        }
      ></Project>

      <Project
        title={"MNSTS School Website"}
        description={
          "Developed and deployed a school website on my own using MongoDB for the backend and Next.js for the frontend. The website enables students to access news, announcements, events, organizations, and school achievements while featuring an admin dashboard for managing displayed content. Additionally, it includes an automated email notification system that informs subscribed students about newly added news, announcements, and events."
        }
        images={p1}
        technology={["Next.js", "Tailwind", "MongoDB", "Cloudinary"]}
        weblink={"https://mnsts.vercel.app/home"}
        github={"https://github.com/Rhixin/MNSTS"}
        video={
          "https://drive.google.com/file/d/1jUZ5zXoWPSDYqGhEWfjZdQjqx3Bz9p-w/view?usp=sharing"
        }
      ></Project>

      <Project
        title={"Cinema System with Reserved Seating"}
        description={
          "Developed a cinema ticketing website with an admin panel for listing movies, using SQLite as the database. Implemented a reserved seating feature that allows users to select seats based on their preferences."
        }
        images={p5}
        technology={["HTML", "CSS", "Javascript", "Python Django", "SQLite"]}
        weblink={""}
        github={"https://github.com/elib00/sinehan"}
        video={
          "https://drive.google.com/file/d/1e6CuNI87NsXNQK-vW9J3zvgkvF6M5bA_/view?usp=sharing"
        }
      ></Project>

      <Project
        title={"Terraria Game Duplicate"}
        description={
          "Developed a 2D game inspired by Terraria, where players mine resources and craft materials to survive. Independently designed and implemented all aspects of the game, except for the graphics. Integrated boss battles as a core mechanic, making victory achievable only by defeating the final boss."
        }
        images={p2}
        technology={["Java", "libGDX"]}
        weblink={""}
        github={"https://github.com/Rhixin/TERRARIA"}
        video={
          "https://drive.google.com/file/d/1tJHA7ckE2qhamNhosbw1WbB9_P3gRNBa/view?usp=sharing"
        }
      ></Project>

      <Project
        title={"3D Horror Maze"}
        description={
          "I developed a 3D game out of 2D materials using a technique called Raycasting. Raycasting is a rendering technique where virtual rays are cast from the camera into the game world to determine what objects are visible in the scene. It essentially simulates how light rays travel in the real world, allowing a 2D engine to display 3D-like environments. By tracing these rays to detect intersections with objects, I was able to create the illusion of depth and perspective, transforming flat 2D assets into a dynamic 3D experience."
        }
        images={p6}
        technology={["Java", "Raycasting", "JavaFx"]}
        weblink={""}
        github={"https://github.com/Rhixin/EscapeSerato"}
        video={
          "https://drive.google.com/file/d/12972LaKNp6Q0kfXUXT4n-uHyKxs9-N5r/view?usp=sharing"
        }
      ></Project>

      <Project
        title={"Disease Symptoms Analysis"}
        description={
          "I collected and preprocessed a dataset of diseases, symptoms, and side effects, then implemented the Apriori algorithm to identify frequent symptom sets and disease associations. I analyzed relationships between diseases based on shared symptoms to uncover potential correlations, and utilized Seaborn and Matplotlib for visualizations, including heatmaps and network graphs."
        }
        images={p4}
        technology={["Python", "Matplotlib", "Pandas", "Seaborn", "Apriori"]}
        weblink={""}
        github={"https://github.com/Rhixin/SymptomsDiseaseAnalysis"}
        video={""}
      ></Project>
    </>
  );
}
