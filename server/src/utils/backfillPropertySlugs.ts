// import "dotenv/config";
// import { estateNames } from "../db/schema";
// import { EstatecreateSlug } from "./slug";
// import { eq } from "drizzle-orm";
// import { db } from "../db/db";

// const backfillEstateSlugs = async () => {
//   const allEstates = await db
//     .select({
//       id: estateNames.id,
//       name: estateNames.name,
//       slug: estateNames.slug,
//     })
//     .from(estateNames);

//   for (const estate of allEstates) {
//     // Don't touch estates that already have a slug
//     if (estate.slug) {
//       continue;
//     }

//     const slug = EstatecreateSlug(estate.name, estate.id);

//     await db
//       .update(estateNames)
//       .set({
//         slug,
//       })
//       .where(eq(estateNames.id, estate.id));

//     console.log(`Updated ${estate.name} -> ${slug}`);
//   }

//   console.log("Estate slug backfill completed.");
// };

// backfillEstateSlugs()
//   .catch(console.error)
//   .finally(() => process.exit());
