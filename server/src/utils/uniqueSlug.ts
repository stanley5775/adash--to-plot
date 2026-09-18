import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { properties, estateNames } from "../db/schema";
import { createSlug } from "./slug";

export const generateUniquePropertySlug = async (
  estateName: string,
  city: string,
  location: string,
) => {
  const baseSlug = createSlug(estateName, city, location);

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const [existingProperty] = await db
      .select({
        id: properties.id,
      })
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);

    if (!existingProperty) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};
