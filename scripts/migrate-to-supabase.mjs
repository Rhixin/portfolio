import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Run with: node --env-file=.env.local scripts/migrate-to-supabase.mjs"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const projects = [
  { id: "gesturbee", title: "GesturBee", category: ["mobile", "automations"], description: "A gamified e-learning mobile app designed to make learning Filipino Sign Language (FSL) fun, accessible, and engaging. Features progressive learning stages, mini-games, quizzes, and performance tracking powered by a custom-built AI gesture recognition model built from scratch.", images: ["/imagesv2/gesturbee/1.webp", "/imagesv2/gesturbee/2.webp", "/imagesv2/gesturbee/3.webp", "/imagesv2/gesturbee/4.webp", "/imagesv2/gesturbee/5.webp", "/imagesv2/gesturbee/6.webp", "/imagesv2/gesturbee/7.webp", "/imagesv2/gesturbee/8.webp", "/imagesv2/gesturbee/9.webp", "/imagesv2/gesturbee/10.webp", "/imagesv2/gesturbee/11.webp"], technology: ["React Native", "TypeScript", "Firebase", "Redux"], github: "https://github.com/Rhixin/GesturbeeCamera", demo: "", video: "", sort_order: 0 },
  { id: "wingsagrivet", title: "Wings Agrivet POS & Inventory", category: ["web", "mobile"], description: "An offline-first point-of-sale and inventory management system built for Wings Agrivet & Feed Supply, a veterinary and agricultural feed/medicine retailer. Ships from a single React codebase as both a Windows desktop app and an Android tablet app, with all data stored locally so the store keeps running without internet. Includes a full POS with per-item discounts and split payments, inventory tracked down to pack and base units (e.g. box of tablets vs. loose tablets), customer credit balances, role-based admin access, a full audit log, and sales/inventory analytics with demand forecasting.", images: ["/imagesv2/wingsagrivet/1.png", "/imagesv2/wingsagrivet/2.png", "/imagesv2/wingsagrivet/3.png", "/imagesv2/wingsagrivet/4.png", "/imagesv2/wingsagrivet/5.png", "/imagesv2/wingsagrivet/6.png", "/imagesv2/wingsagrivet/7.png"], technology: ["React", "TypeScript", "Vite", "Electron", "Capacitor", "Tailwind", "Recharts"], github: "", demo: "", video: "", sort_order: 1 },
  { id: "roomradar", title: "RoomRadar", category: ["web"], description: "A web platform that helps users find nearby boarding houses through real-time listings integrated with Google Maps. Landlords post property details while tenants browse, filter by budget and proximity, chat with landlords, and explore through an interactive map-based interface.", images: ["/imagesv2/roomradarweb/1.webp", "/imagesv2/roomradarweb/2.webp", "/imagesv2/roomradarweb/3.webp", "/imagesv2/roomradarweb/4.webp", "/imagesv2/roomradarweb/5.webp", "/imagesv2/roomradarweb/6.webp", "/imagesv2/roomradarweb/7.webp", "/imagesv2/roomradarweb/8.webp"], technology: ["React", "Next.js", "ASP.NET", "MySQL", "Google Maps API", "Bootstrap"], github: "https://github.com/Rhixin/RoomRadarWeb", demo: "", video: "https://drive.google.com/file/d/1DF99Y3fcrSaBvUIVIAv3vX1_3yNsSvDV/view?usp=sharing", sort_order: 2 },
  { id: "sinehan", title: "Sinehan", category: ["web"], description: "An online cinema ticketing system that lets users browse real-time movie schedules, choose screening times, and reserve specific seats through an interactive seating layout. Includes a full admin dashboard for managing movies, schedules, and seat availability.", images: ["/imagesv2/sinehan/1.webp", "/imagesv2/sinehan/2.webp", "/imagesv2/sinehan/3.webp", "/imagesv2/sinehan/4.webp", "/imagesv2/sinehan/5.webp", "/imagesv2/sinehan/6.webp", "/imagesv2/sinehan/7.webp", "/imagesv2/sinehan/8.webp"], technology: ["HTML", "CSS", "JavaScript", "Python Django", "SQLite"], github: "https://github.com/elib00/sinehan", demo: "", video: "https://drive.google.com/file/d/1e6CuNI87NsXNQK-vW9J3zvgkvF6M5bA_/view?usp=sharing", sort_order: 3 },
  { id: "powersystems", title: "Power Systems Inc.", category: ["web"], description: "An internal company website for Power Systems Inc., transitioning paper-based forms to a fully digital system. Centralizes all company forms and workflows, features a searchable data management dashboard, and an integrated AI-powered chatbot for quick data retrieval.", images: ["/imagesv2/powersystemsinc/1.webp", "/imagesv2/powersystemsinc/2.webp", "/imagesv2/powersystemsinc/3.webp", "/imagesv2/powersystemsinc/4.webp", "/imagesv2/powersystemsinc/5.webp", "/imagesv2/powersystemsinc/6.webp", "/imagesv2/powersystemsinc/7.webp", "/imagesv2/powersystemsinc/8.webp", "/imagesv2/powersystemsinc/9.webp"], technology: ["Next.js", "PostgreSQL", "NestJS", "Render", "Tailwind"], github: "https://github.com/Rhixin/powersystemsinc", demo: "", video: "", sort_order: 4 },
  { id: "mnsts-ims", title: "MNSTS IMS", category: ["web"], description: "An Inventory Management System for Medellin National Science and Technology School featuring stock tracking, reporting dashboards, and full administrative tools for managing school resources.", images: ["/imagesv2/ims/1.webp", "/imagesv2/ims/2.webp", "/imagesv2/ims/3.webp", "/imagesv2/ims/4.webp", "/imagesv2/ims/5.webp", "/imagesv2/ims/6.webp", "/imagesv2/ims/7.webp", "/imagesv2/ims/8.webp", "/imagesv2/ims/9.webp", "/imagesv2/ims/10.webp"], technology: ["Next.js", "Tailwind", "MongoDB"], github: "https://github.com/Rhixin/MNSTS-IMS", demo: "", video: "", sort_order: 5 },
  { id: "mnsts-website", title: "MNSTS Website", category: ["web"], description: "Developed and deployed a school website enabling students to access news, announcements, events, organizations, and achievements. Features an admin dashboard and an automated email notification system for subscribed students.", images: ["/imagesv2/mnsts/1.webp", "/imagesv2/mnsts/2.webp", "/imagesv2/mnsts/3.webp", "/imagesv2/mnsts/4.webp", "/imagesv2/mnsts/5.webp", "/imagesv2/mnsts/6.webp", "/imagesv2/mnsts/7.webp"], technology: ["Next.js", "Tailwind", "MongoDB", "Cloudinary"], github: "https://github.com/Rhixin/MNSTS", demo: "https://mnsts.vercel.app/home", video: "https://drive.google.com/file/d/1jUZ5zXoGHEWfjZdQjqx3Bz9p-w/view?usp=sharing", sort_order: 6 },
  { id: "cyberbully", title: "Cyber Bullying Detector Extension", category: ["automations"], description: "A browser extension that detects and covers cyberbullying content in real time. Trained a custom deep learning model using Python and Keras via KGGN on the Hateful Memes dataset to identify both hateful text and hateful images. When harmful content is detected on a webpage, the extension automatically covers it to protect the user.", images: ["/imagesv2/cyber/cyber1.webp", "/imagesv2/cyber/cyber2.webp"], technology: ["JavaScript", "Python", "Keras", "Flask", "Uvicorn"], github: "https://github.com/KennLoyd/Cyberbullying-Detection-on-X", demo: "", video: "https://drive.google.com/file/d/1huReq6k0xBERgOn9wqbckeZC84uuXecF/view", sort_order: 7 },
  { id: "pitchfully", title: "Pitchfully", category: ["automations", "web"], description: "An AI-powered sales and marketing platform for freelancers and agencies. Connects to Meta Ads for full campaign management, Creative & Audience Insights, automated rules, and a leads dashboard. AI generates personalized ad copy and pitch messages, manages follow-ups, and actively controls ad spend. Built on ASP.NET Core with AES-GCM encryption and JWT authentication.", images: ["/imagesv2/pitchfully/pitch1.webp", "/imagesv2/pitchfully/pitch2.webp", "/imagesv2/pitchfully/pitch3.webp", "/imagesv2/pitchfully/pitch4.webp", "/imagesv2/pitchfully/pitch5.webp"], technology: ["ASP.NET Core", "JavaScript", "Meta Ads API", "Azure", "AES-GCM"], github: "https://github.com/Everincrease/pitchai", demo: "https://app-uat.pitchfully.io/pages/sign-in.html", video: "", sort_order: 8 },
  { id: "court-rentals", title: "Court Rentals", category: ["automations", "web"], description: "A fully automated sport court booking platform. Browse real-time court availability, select a schedule, and pay securely via Stripe. Automated booking confirmations are sent instantly. Includes an AI chatbot that answers questions about court availability, rates, and more.", images: ["/imagesv2/sports/sport1.webp", "/imagesv2/sports/sport2.webp", "/imagesv2/sports/sport3.webp", "/imagesv2/sports/sport4.webp", "/imagesv2/sports/sport5.webp", "/imagesv2/sports/sport6.webp", "/imagesv2/sports/sport7.webp", "/imagesv2/sports/sport8.webp"], technology: ["Next.js", "Supabase", "Python", "Stripe"], github: "", demo: "", video: "", sort_order: 9 },
  { id: "jobless", title: "JobLess", category: ["automations", "web"], description: "A platform that automates job hunting by matching your resume against job listings and scoring each one from 1–100. Generates a personalized draft application letter tailored to the job description, lets you edit it, and submits your application with a single click.", images: ["/imagesv2/jobless/jobless1.webp", "/imagesv2/jobless/jobless2.webp", "/imagesv2/jobless/jobless3.webp", "/imagesv2/jobless/jobless4.webp", "/imagesv2/jobless/jobless5.webp", "/imagesv2/jobless/jobless6.webp"], technology: ["Next.js", "Supabase", "Python", "OpenClaw"], github: "https://github.com/ZhaztedValles/ai-job-seeker", demo: "", video: "", sort_order: 10 },
  { id: "leadgen", title: "Lead Gen & Outreach Automation", category: ["automations", "web"], description: "Automates B2B lead generation for wine products by scraping Google Maps and social media data via APIFY to find wine shops and pub bars. Scores each lead with a custom ranking system, generates personalized outreach emails, and manages replies — all in one pipeline.", images: ["/imagesv2/leadgen/lead1.webp", "/imagesv2/leadgen/lead2.webp", "/imagesv2/leadgen/lead3.webp", "/imagesv2/leadgen/lead4.webp", "/imagesv2/leadgen/lead5.webp", "/imagesv2/leadgen/lead6.webp", "/imagesv2/leadgen/lead7.webp"], technology: ["Next.js", "Supabase", "Python", "APIFY"], github: "", demo: "", video: "", sort_order: 11 },
  { id: "rent-collection", title: "Automated Tenant Rent Collection", category: ["automations", "web"], description: "A platform that automates rent collection by sending SMS messages via Twilio to tenants with overdue balances. Negotiates payment plans through automated messaging, detects incoming payments, and escalates unresolved cases to admin with notifications.", images: ["/imagesv2/collections/stanton_1.webp", "/imagesv2/collections/stanton_2.webp", "/imagesv2/collections/stanton_3.webp", "/imagesv2/collections/stanton_4.webp", "/imagesv2/collections/stanton_5.webp", "/imagesv2/collections/stanton_6.webp", "/imagesv2/collections/stanton_7.webp", "/imagesv2/collections/stanton_8.webp"], technology: ["Next.js", "Supabase", "Twilio"], github: "https://github.com/Rhixin/collections_dash_v2", demo: "", video: "", sort_order: 12 },
  { id: "asl", title: "Real-Time Sign Language Recognition", category: ["automations"], description: "A real-time sign language recognition system using computer vision and deep learning, achieving 98.6% accuracy in gesture classification. Uses Flask and Socket.IO for real-time backend communication with a React frontend for live hand tracking and gesture detection.", images: ["/imagesv2/asl/1.webp", "/imagesv2/asl/2.webp", "/imagesv2/asl/3.webp"], technology: ["React", "TensorFlow", "Keras", "Flask", "Socket.IO", "Python", "NumPy"], github: "https://github.com/Rhixin/GesturbeeCamera", demo: "", video: "", sort_order: 13 },
  { id: "disease", title: "Disease Symptoms Analysis", category: ["automations"], description: "Implemented the Apriori algorithm to identify frequent symptom sets and disease associations from a preprocessed dataset. Analyzed disease relationships via shared symptoms and produced visualizations including heatmaps and network graphs.", images: ["/imagesv2/disease/1.webp", "/imagesv2/disease/2.webp", "/imagesv2/disease/3.webp", "/imagesv2/disease/4.webp"], technology: ["Python", "Matplotlib", "Pandas", "Seaborn", "Apriori"], github: "https://github.com/Rhixin/SymptomsDiseaseAnalysis", demo: "", video: "", sort_order: 14 },
  { id: "maze", title: "3D Horror Maze", category: ["games"], description: "A 3D game built from 2D materials using Raycasting — a rendering technique that simulates light rays to create the illusion of depth and perspective. Navigate through dark mazes while avoiding terrifying creatures with atmospheric sound design.", images: ["/imagesv2/maze/1.webp", "/imagesv2/maze/2.webp", "/imagesv2/maze/3.webp", "/imagesv2/maze/4.webp", "/imagesv2/maze/5.webp"], technology: ["Java", "Raycasting", "JavaFX", "JDBC"], github: "https://github.com/Rhixin/EscapeSerato", demo: "", video: "https://drive.google.com/file/d/12972LaKNp6Q0kfXUXT4n-uHyKxs9-N5r/view?usp=sharing", sort_order: 15 },
  { id: "terraria", title: "Terraria Duplicate", category: ["games"], description: "A 2D game inspired by Terraria where players mine resources and craft materials to survive. Independently designed and implemented all game mechanics except graphics. Boss battles are the core mechanic — victory requires defeating the final boss.", images: ["/imagesv2/terraria/1.webp", "/imagesv2/terraria/2.webp", "/imagesv2/terraria/3.webp"], technology: ["Java", "libGDX"], github: "https://github.com/Rhixin/TERRARIA", demo: "", video: "https://drive.google.com/file/d/1tJHA7ckE2qhamNhosbw1WbB9_P3gRNBa/view?usp=sharing", sort_order: 16 },
];

// `type` wasn't tracked before this feature, so every migrated row starts
// as null except where the role is unambiguously an internship. Fill the
// rest in via /admin after migrating.
const experience = [
  { logo: "/imagesv2/experiences/sttp.webp", name: "STTP", additional: "Scholarship Technopreneurship Training Program", type: null, year: "Mar 2025 – Aug 2025", duration: "6 months", link: "https://www.linkedin.com/in/zhazted-rhixin-valles-051152258", sort_order: 0 },
  { logo: "/imagesv2/others/sun.webp", name: "Sun* Inc.", additional: "Full Stack Software Developer Intern", type: "Internship", year: "Mar 2025 – Jun 2025", duration: "4 months", link: "https://en.sun-asterisk.com/about/", sort_order: 1 },
  { logo: "/imagesv2/others/fullscale.webp", name: "Full Scale Teams Inc.", additional: "Full Stack Software Developer Intern", type: "Internship", year: "Jun 2025 – Sep 2025", duration: "4 months", link: "https://fullscale.io/", sort_order: 2 },
  { logo: "/imagesv2/experiences/everincrease.webp", name: "Everincrease LLC", additional: "Automations Engineer", type: null, year: "Feb 2024 – Dec 2025", duration: "1 yr 10 mos", link: "https://everincreasellc.com/", sort_order: 3 },
  { logo: "/imagesv2/experiences/stanton.webp", name: "Stanton Management", additional: "Automations Engineer", type: null, year: "Jan 2025 – Feb 2026", duration: "1 yr 1 mo", link: "https://www.stantonpm.com/", sort_order: 4 },
  { logo: "/imagesv2/others/zv2.webp", name: "Freelancing", additional: "Automations & Full Stack Developer", type: null, year: "Jan 2020 – Present", duration: "6+ years", link: "https://www.linkedin.com/in/zhazted-rhixin-valles-051152258", sort_order: 5 },
];

async function run() {
  console.log(`Seeding ${projects.length} projects...`);
  for (const project of projects) {
    const { error } = await supabase.from("projects").upsert(project, { onConflict: "id" });
    if (error) {
      console.error(`  FAILED "${project.id}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`  OK: ${project.id}`);
    }
  }

  console.log(`Seeding ${experience.length} experience entries...`);
  const { data: existing, error: fetchError } = await supabase
    .from("experience")
    .select("name");
  if (fetchError) {
    console.error("Failed to check existing experience rows:", fetchError.message);
    process.exit(1);
  }
  const existingNames = new Set((existing ?? []).map((row) => row.name));

  for (const entry of experience) {
    if (existingNames.has(entry.name)) {
      console.log(`  SKIP (already exists): ${entry.name}`);
      continue;
    }
    const { error } = await supabase.from("experience").insert(entry);
    if (error) {
      console.error(`  FAILED "${entry.name}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`  OK: ${entry.name}`);
    }
  }

  console.log("Done.");
}

run();
