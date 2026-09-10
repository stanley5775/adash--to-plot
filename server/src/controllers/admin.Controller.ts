import type { Context } from "hono";

import { db } from "../db/db";

import {
  properties,
  propertiesImage,
  PropertyPaymentPlan,
  estateNames,
} from "../db/schema";
import { createEstateSchema } from "../validators/estateV";
import { uploadImage } from "../services/uploadImage";
import { and, eq } from "drizzle-orm";
import { createPropertyPaymentPlansSchema } from "../validators/propertyPlan";

export const createEstate = async (c: Context) => {
  try {
    const formData = await c.req.formData();

    const body = {
      estateNameId: formData.get("estateNameId")?.toString().trim() ?? "",
      location: formData.get("location")?.toString() ?? "",
      city: formData.get("city")?.toString() ?? "",
      state: formData.get("state")?.toString() ?? "",
      description: formData.get("description")?.toString().trim() || null,
      startingPrice: formData.get("startingPrice")?.toString().trim() ?? "",
      totalPlots: formData.get("totalPlots")?.toString().trim() ?? "",
      features: formData.get("features")?.toString().trim() ?? "",
      nearbyLandmarks: formData.get("nearbyLandmarks")?.toString().trim() ?? "",
      status: formData.get("status")?.toString().trim() || "ACTIVE",
    };

    const result = createEstateSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => issue.message),
        },
        422,
      );
    }

    const data = result.data;

    // CHECK ESTATE NAME EXISTS BEFORE UPLOADING IMAGES
    const [estateName] = await db
      .select({
        id: estateNames.id,
        name: estateNames.name,
      })
      .from(estateNames)
      .where(eq(estateNames.id, data.estateNameId))
      .limit(1);

    if (!estateName) {
      return c.json(
        {
          success: false,
          message: "Selected estate name does not exist",
          data: null,
        },
        404,
      );
    }

    const features = data.features
      ? data.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const nearbyLandmarks = data.nearbyLandmarks
      ? data.nearbyLandmarks
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const mainImage = formData.get("mainImage");

    const galleryFiles = formData
      .getAll("galleryImages")
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, 4);

    // UPLOAD IMAGES IN PARALLEL
    const [mainImageData, uploadedImages] = await Promise.all([
      mainImage instanceof File && mainImage.size > 0
        ? uploadImage(mainImage)
        : Promise.resolve(null),

      Promise.all(galleryFiles.map((file) => uploadImage(file))),
    ]);

    // CREATE ESTATE
    const [estate] = await db
      .insert(properties)
      .values({
        // IMPORTANT
        estateId: data.estateNameId,

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

    return c.json(
      {
        success: true,
        message: "Estate created successfully",
        data: {
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
        },
      },
      201,
    );
  } catch (error) {
    console.error("CREATE ESTATE ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to create estate",
        error: "INTERNAL_SERVER_ERROR",
      },
      500,
    );
  }
};

export const createEstateName = async (c: Context) => {
  try {
    const body = await c.req.json();

    const name = body.name?.toString().trim();

    if (!name) {
      return c.json(
        {
          success: false,
          message: "Estate name is required",
          data: null,
        },
        422,
      );
    }

    const existingEstate = await db
      .select({
        id: estateNames.id,
        name: estateNames.name,
      })
      .from(estateNames)
      .where(eq(estateNames.name, name))
      .limit(1);

    if (existingEstate.length > 0) {
      return c.json(
        {
          success: false,
          message: "Estate name already exists",
          data: existingEstate[0],
        },
        409,
      );
    }

    const [estate] = await db
      .insert(estateNames)
      .values({
        name,
      })
      .returning({
        id: estateNames.id,
        name: estateNames.name,
        createdAt: estateNames.createdAt,
      });

    return c.json(
      {
        success: true,
        message: "Estate name created successfully",
        data: estate,
      },
      201,
    );
  } catch (error) {
    console.error("CREATE ESTATE NAME ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to create estate name",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const getAllEstates = async (c: Context) => {
  try {
    const allEstates = await db
      .select({
        id: estateNames.id,
        name: estateNames.name,
      })
      .from(properties)
      .innerJoin(estateNames, eq(propertiesImage.estateId, estateNames.id));
    return c.json(
      {
        success: true,
        message: "Estates fetched successfully",
        data: allEstates,
      },
      200,
    );
  } catch (error) {
    console.error("GET ALL ESTATES ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch estates",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const createPropertyPaymentPlans = async (c: Context) => {
  try {
    const propertyId = c.req.param("propertyId");

    if (!propertyId) {
      return c.json(
        {
          success: false,
          message: "Property ID is required",
          data: null,
        },
        400,
      );
    }

    const body = await c.req.json();

    const result = createPropertyPaymentPlansSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
          data: null,
        },
        422,
      );
    }

    const { plans } = result.data;

    // CHECK PROPERTY
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
      return c.json(
        {
          success: false,
          message: "Property not found",
          data: null,
        },
        404,
      );
    }

    // CHECK DUPLICATES IN REQUEST
    const planNames = plans.map((plan) => plan.name.trim().toLowerCase());

    if (new Set(planNames).size !== planNames.length) {
      return c.json(
        {
          success: false,
          message: "Duplicate payment plans are not allowed",
          data: null,
        },
        409,
      );
    }

    // CHECK EXISTING PLANS
    for (const plan of plans) {
      const [existingPlan] = await db
        .select({
          id: PropertyPaymentPlan.id,
          name: PropertyPaymentPlan.name,
        })
        .from(PropertyPaymentPlan)
        .where(
          and(
            eq(PropertyPaymentPlan.propertyId, propertyId),
            eq(PropertyPaymentPlan.name, plan.name.trim()),
          ),
        )
        .limit(1);

      if (existingPlan) {
        return c.json(
          {
            success: false,
            message: `Payment plan "${plan.name}" already exists for this property`,
            data: null,
          },
          409,
        );
      }
    }

    const startingPrice = Number(property.startingPrice);

    if (isNaN(startingPrice) || startingPrice <= 0) {
      return c.json(
        {
          success: false,
          message: "Property starting price is invalid",
          data: null,
        },
        422,
      );
    }

    // CREATE OUTRIGHT + INSTALLMENT PLANS
    // CREATE OUTRIGHT + INSTALLMENT PLANS
    const paymentPlans = [
      {
        propertyId: property.id,
        estateId: property.estateId,
        name: "Outright",
        durationMonths: null,
        totalAmount: startingPrice.toFixed(2),
        monthlyAmount: null,
        interestRate: "0.00",
      },

      ...plans.map((plan) => {
        const months = plan.durationMonths;

        // DETERMINE INTEREST FROM DURATION
        let interestRate = 0;

        if (months === 12 || months === 18) {
          interestRate = 9;
        } else if (months === 24) {
          interestRate = 11;
        }

        // CALCULATE INTEREST
        const interestAmount = startingPrice * (interestRate / 100);

        // PROPERTY PRICE + INTEREST
        const totalAmount = startingPrice + interestAmount;

        // MONTHLY PAYMENT
        const monthlyAmount = totalAmount / months;

        return {
          propertyId: property.id,
          estateId: property.estateId,
          name: plan.name.trim(),
          durationMonths: months,
          totalAmount: totalAmount.toFixed(2),
          monthlyAmount: monthlyAmount.toFixed(2),
          interestRate: interestRate.toFixed(2),
        };
      }),
    ];

    const createdPlans = await db
      .insert(PropertyPaymentPlan)
      .values(paymentPlans)
      .returning();

    return c.json(
      {
        success: true,
        message: "Payment plans created successfully",
        data: createdPlans,
      },
      201,
    );
  } catch (error) {
    console.error("CREATE PROPERTY PAYMENT PLANS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to create payment plans",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const getAllEstatesName = async (c: Context) => {
  try {
    const estates = await db
      .select({
        id: estateNames.id,
        estateName: estateNames.name,
      })
      .from(estateNames);

    return c.json(
      {
        success: true,
        message: "Estates fetched successfully",
        data: estates,
      },
      200,
    );
  } catch (error) {
    console.error("GET ALL ESTATES ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch estates",
        data: null,
      },
      500,
    );
  }
};
