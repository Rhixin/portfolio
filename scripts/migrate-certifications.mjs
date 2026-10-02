import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Run with: node --env-file=.env.local scripts/migrate-certifications.mjs"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const certifications = [
  { title: "AWS Academy Graduate", image: "/imagesv2/certifications/aws.webp", sort_order: 0 },
  { title: "C Programming", image: "/imagesv2/certifications/c.webp", sort_order: 1 },
  { title: "Java Certification", image: "/imagesv2/certifications/java.webp", sort_order: 2 },
  { title: "JavaScript", image: "/imagesv2/certifications/javascript.webp", sort_order: 3 },
  { title: "PhilNITS Passer", image: "/imagesv2/certifications/philnits.webp", sort_order: 4 },
  { title: "React Certification", image: "/imagesv2/certifications/react.webp", sort_order: 5 },
  { title: "STTP", image: "/imagesv2/certifications/sttp.webp", sort_order: 6 },
  { title: "TopCIT Level III", image: "/imagesv2/certifications/topcit.webp", sort_order: 7 },
];

async function run() {
  const { data: existing, error: fetchError } = await supabase
    .from("certifications")
    .select("title");
  if (fetchError) {
    console.error("Failed to check existing rows:", fetchError.message);
    process.exit(1);
  }
  const existingTitles = new Set((existing ?? []).map((row) => row.title));

  for (const cert of certifications) {
    if (existingTitles.has(cert.title)) {
      console.log(`  SKIP (already exists): ${cert.title}`);
      continue;
    }
    const { error } = await supabase.from("certifications").insert(cert);
    if (error) {
      console.error(`  FAILED "${cert.title}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`  OK: ${cert.title}`);
    }
  }
  console.log("Done.");
}

run();
