import { eq } from "drizzle-orm";
import { db } from "../db/db";
import {
  estateNames,
  properties,
  PropertyPaymentPlan,
  propertiesImage,
} from "../db/schema";
import { randomUUID } from "crypto";
import { createEstateSchema } from "../validators/estateV";
import { generateUniquePropertySlug } from "../utils/uniqueSlug";
import { uploadImage } from "./uploadImage";
import { createEstateNameSchema } from "../validators/createEstate";
import { createPropertyPaymentPlansSchema } from "../validators/propertyPlan";
import { EstatecreateSlug } from "../utils/slug";
type PaymentPlanInsert = {
  propertyId: string;
  estateId: string;
  name: string;
  durationMonths: number | null;
  totalAmount: string;
  monthlyAmount: string | null;
  interestRate: string;
};

type CreateEstateInput = {
  body: {
    estateNameId: string;
    location: string;
    city: string;
    state: string;
    description: string | null;
    startingPrice: string;
    totalPlots: string;
    features: string;
    nearbyLandmarks: string;
    status: string;
  };
  mainImage: File | null;
  galleryFiles: File[];
};

export const createEstateService = async ({
  body,
  mainImage,
  galleryFiles,
}: CreateEstateInput) => {
  // VALIDATION
  const result = createEstateSchema.safeParse(body);

  if (!result.success) {
    throw new Error(
      JSON.stringify({
        type: "VALIDATION_ERROR",
        errors: result.error.issues.map((issue: any) => issue.message),
      }),
    );
  }

  const data = result.data;

  // ESTATE LOOKUP
  const [estateName] = await db
    .select({
      id: estateNames.id,
      name: estateNames.name,
    })
    .from(estateNames)
    .where(eq(estateNames.id, data.estateNameId))
    .limit(1);

  if (!estateName) {
    throw new Error("Selected estate name does not exist");
  }

  // SLUG GENERATION
  const slug = await generateUniquePropertySlug(
    estateName.name,
    data.city,
    data.location,
  );

  const features = data.features
    ? data.features
        .split(",")
        .map((item: any) => item.trim())
        .filter(Boolean)
    : [];

  const nearbyLandmarks = data.nearbyLandmarks
    ? data.nearbyLandmarks
        .split(",")
        .map((item: any) => item.trim())
        .filter(Boolean)
    : [];

  // IMAGE UPLOAD
  const [mainImageData, uploadedImages] = await Promise.all([
    mainImage && mainImage.size > 0
      ? uploadImage(mainImage)
      : Promise.resolve(null),

    Promise.all(
      galleryFiles
        .filter((file) => file instanceof File && file.size > 0)
        .slice(0, 4)
        .map((file) => uploadImage(file)),
    ),
  ]);

  // DB INSERT
  const [estate] = await db
    .insert(properties)
    .values({
      estateId: data.estateNameId,

      slug,
      location: data.location,
      city: data.city,
      state: data.state,
      description: data.description,
      startingPrice: data.startingPrice.toString(),
      totalPlots: data.totalPlots,
      features,
      nearbyLandmarks,
    })
    .returning();

  // SAVE IMAGES
  const hasImages = mainImageData || uploadedImages.length > 0;

  if (hasImages) {
    await db.insert(propertiesImage).values({
      estateId: estate.id,

      mainImgUrl: mainImageData?.url ?? null,
      mainImagePublicId: mainImageData?.publicId ?? null,

      image1Url: uploadedImages[0]?.url ?? null,
      image1PublicId: uploadedImages[0]?.publicId ?? null,

      image2Url: uploadedImages[1]?.url ?? null,
      image2PublicId: uploadedImages[1]?.publicId ?? null,

      image3Url: uploadedImages[2]?.url ?? null,
      image3PublicId: uploadedImages[2]?.publicId ?? null,

      image4Url: uploadedImages[3]?.url ?? null,
      image4PublicId: uploadedImages[3]?.publicId ?? null,
    });
  }

  // RETURN CREATED ESTATE
  return {
    estate,
    images: {
      mainImgUrl: mainImageData?.url ?? null,
      mainImagePublicId: mainImageData?.publicId ?? null,

      image1Url: uploadedImages[0]?.url ?? null,
      image1PublicId: uploadedImages[0]?.publicId ?? null,

      image2Url: uploadedImages[1]?.url ?? null,
      image2PublicId: uploadedImages[1]?.publicId ?? null,

      image3Url: uploadedImages[2]?.url ?? null,
      image3PublicId: uploadedImages[2]?.publicId ?? null,

      image4Url: uploadedImages[3]?.url ?? null,
      image4PublicId: uploadedImages[3]?.publicId ?? null,
    },
  };
};

type CreateEstateNameInput = {
  body: {
    name: string;
    description: string;
    accountName: string;
    accountNumber: string;
    city: string;
    state: string;
    startingPrice: string;
    bankName: string;
  };
  mainImage: File;
};

export const createEstateNameService = async ({
  body,
  mainImage,
}: CreateEstateNameInput) => {
  // VALIDATION
  const result = createEstateNameSchema.safeParse(body);

  if (!result.success) {
    throw new Error(
      JSON.stringify({
        type: "VALIDATION_ERROR",
        errors: result.error.issues.map((issue) => issue.message),
      }),
    );
  }

  const data = result.data;

  // IMAGE REQUIRED
  if (!(mainImage instanceof File) || mainImage.size === 0) {
    throw new Error("Estate main image is required");
  }

  // CHECK IF ESTATE NAME ALREADY EXISTS
  const [existingEstate] = await db
    .select({
      id: estateNames.id,
      name: estateNames.name,
    })
    .from(estateNames)
    .where(eq(estateNames.name, data.name))
    .limit(1);

  if (existingEstate) {
    throw new Error(
      JSON.stringify({
        type: "ESTATE_NAME_EXISTS",
        data: existingEstate,
      }),
    );
  }
  // GENERATE ID FIRST
  const estateId = randomUUID();

  // CREATE SLUG USING NAME + ID
  const slug = EstatecreateSlug(data.name, estateId);
  // UPLOAD ESTATE MAIN IMAGE TO CLOUDINARY
  const mainImageData = await uploadImage(mainImage);

  // CREATE ESTATE NAME
  const [estate] = await db
    .insert(estateNames)
    .values({
      name: data.name,
      description: data.description,
      city: data.city,
      state: data.state,
      startingPrice: data.startingPrice,
      slug,
      // CLOUDINARY IMAGE
      mainImageUrl: mainImageData.url,
      mainImagePublicId: mainImageData.publicId,

      accountName: data.accountName,
      accountNumber: data.accountNumber,
      bankName: data.bankName,
    })
    .returning({
      id: estateNames.id,
      name: estateNames.name,
      description: estateNames.description,
      slug: estateNames.slug,
      mainImageUrl: estateNames.mainImageUrl,
      mainImagePublicId: estateNames.mainImagePublicId,

      accountName: estateNames.accountName,
      accountNumber: estateNames.accountNumber,
      bankName: estateNames.bankName,

      createdAt: estateNames.createdAt,
    });

  // RETURN CREATED ESTATE
  return estate;
};

export const createPropertyPaymentPlansService = async (
  propertyId: any,
  body: unknown,
) => {
  // PROPERTY ID
  if (!propertyId) {
    throw new Error(
      JSON.stringify({
        type: "PROPERTY_ID_REQUIRED",
      }),
    );
  }

  // VALIDATE REQUEST
  const result = createPropertyPaymentPlansSchema.safeParse(body);

  if (!result.success) {
    throw new Error(
      JSON.stringify({
        type: "VALIDATION_ERROR",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      }),
    );
  }

  const { plans } = result.data;

  if (!plans || plans.length === 0) {
    throw new Error(
      JSON.stringify({
        type: "NO_PAYMENT_PLANS",
      }),
    );
  }

  // GET PROPERTY
  const [property] = await db
    .select({
      id: properties.id,
      estateId: properties.estateId,
      startingPrice: properties.startingPrice,
    })
    .from(properties)
    .where(eq(properties.id, propertyId))
    .limit(1);

  if (!property) {
    throw new Error(
      JSON.stringify({
        type: "PROPERTY_NOT_FOUND",
      }),
    );
  }

  // VALIDATE STARTING PRICE
  const startingPrice = Number(property.startingPrice);

  if (!Number.isFinite(startingPrice) || startingPrice <= 0) {
    throw new Error(
      JSON.stringify({
        type: "INVALID_STARTING_PRICE",
      }),
    );
  }

  // CHECK DUPLICATES
  const durations = plans.map((plan) => plan.durationMonths);

  const uniqueDurations = new Set(durations);

  if (uniqueDurations.size !== durations.length) {
    throw new Error(
      JSON.stringify({
        type: "DUPLICATE_DURATIONS",
      }),
    );
  }

  // GET EXISTING PLANS
  const existingPlans = await db
    .select({
      id: PropertyPaymentPlan.id,
      name: PropertyPaymentPlan.name,
      durationMonths: PropertyPaymentPlan.durationMonths,
    })
    .from(PropertyPaymentPlan)
    .where(eq(PropertyPaymentPlan.propertyId, propertyId));

  // CHECK IF SELECTED PLANS ALREADY EXIST
  for (const plan of plans) {
    const alreadyExists = existingPlans.some(
      (existingPlan) => existingPlan.durationMonths === plan.durationMonths,
    );

    if (alreadyExists) {
      throw new Error(
        JSON.stringify({
          type: "PAYMENT_PLAN_EXISTS",
          durationMonths: plan.durationMonths,
        }),
      );
    }
  }

  // PREPARE PAYMENT PLANS
  const paymentPlans: PaymentPlanInsert[] = plans.map((plan) => {
    const months = plan.durationMonths;

    let interestRate = 0;

    // 6 months = 0%
    // 12 months = 9%
    // 18 months = 9%
    // 24 months = 11%

    if (months === 12 || months === 18) {
      interestRate = 9;
    } else if (months === 24) {
      interestRate = 11;
    }

    const interestAmount = startingPrice * (interestRate / 100);

    const totalAmount = startingPrice + interestAmount;

    const monthlyAmount = totalAmount / months;

    return {
      propertyId: property.id,
      estateId: property.estateId,
      name: `${months} Months`,
      durationMonths: months,
      totalAmount: totalAmount.toFixed(2),
      monthlyAmount: monthlyAmount.toFixed(2),
      interestRate: interestRate.toFixed(2),
    };
  });

  // ADD OUTRIGHT ONLY ONCE
  const outrightExists = existingPlans.some(
    (plan) => plan.durationMonths === null,
  );

  if (!outrightExists) {
    paymentPlans.unshift({
      propertyId: property.id,
      estateId: property.estateId,
      name: "Outright",
      durationMonths: null,
      totalAmount: startingPrice.toFixed(2),
      monthlyAmount: null,
      interestRate: "0.00",
    });
  }

  // INSERT
  const createdPlans = await db
    .insert(PropertyPaymentPlan)
    .values(paymentPlans)
    .returning();

  return createdPlans;
};
