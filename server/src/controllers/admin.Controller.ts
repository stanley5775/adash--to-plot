import type { Context } from "hono";

import { db } from "../db/db";

import {
  properties,
  propertiesImage,
  PropertyPaymentPlan,
  estateNames,
  users,
} from "../db/schema";
import { createEstateSchema } from "../validators/estateV";
import { uploadImage } from "../services/uploadImage";
import { and, eq, ne, desc } from "drizzle-orm";
import { createPropertyPaymentPlansSchema } from "../validators/propertyPlan";
import { createEstateNameSchema } from "../validators/createEstate";
import { deleteImage } from "../utils/deleteImage";

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
    const result = createEstateNameSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Invalid estate information",
          errors: result.error.flatten(),
          data: null,
        },
        422,
      );
    }
    const { name, accountName, accountNumber, bankName } = result.data;
    const existingEstate = await db
      .select({ id: estateNames.id, name: estateNames.name })
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
        accountName,
        accountNumber,
        bankName,
      })
      .returning({
        id: estateNames.id,
        bankName: estateNames.bankName,
        name: estateNames.name,
        accountName: estateNames.accountName,
        accountNumber: estateNames.accountNumber,
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
        accountName: estateNames.accountName,
        accountNumber: estateNames.accountNumber,
        bankName: estateNames.bankName,
        createdAt: estateNames.createdAt,
      })
      .from(estateNames);

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

export const getAllProperties = async (c: Context) => {
  try {
    const allProperties = await db
      .select({
        id: properties.id,
        estateId: properties.estateId,
        status: properties.status,
        // Estate information
        estateName: estateNames.name,
        accountName: estateNames.accountName,
        accountNumber: estateNames.accountNumber,
        bankName: estateNames.bankName,

        // Property information
        location: properties.location,
        city: properties.city,
        state: properties.state,
        description: properties.description,
        startingPrice: properties.startingPrice,
        totalPlots: properties.totalPlots,
        features: properties.features,
        nearbyLandmarks: properties.nearbyLandmarks,

        // Images
        mainImgUrl: propertiesImage.mainImgUrl,
        mainImagePublicId: propertiesImage.mainImagePublicId,
        image1Url: propertiesImage.image1Url,
        image1PublicId: propertiesImage.image1PublicId,
        image2Url: propertiesImage.image2Url,
        image2PublicId: propertiesImage.image2PublicId,
        image3Url: propertiesImage.image3Url,
        image3PublicId: propertiesImage.image3PublicId,
        image4Url: propertiesImage.image4Url,
        image4PublicId: propertiesImage.image4PublicId,

        createdAt: properties.createdAt,
      })
      .from(properties)
      .innerJoin(estateNames, eq(properties.estateId, estateNames.id))
      .leftJoin(propertiesImage, eq(propertiesImage.estateId, properties.id));

    return c.json(
      {
        success: true,
        message: "Properties fetched successfully",
        data: allProperties,
      },
      200,
    );
  } catch (error) {
    console.error("GET ALL PROPERTIES ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch properties",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const deleteProperty = async (c: Context) => {
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

    const [property] = await db
      .select({
        id: properties.id,
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

    // GET PROPERTY IMAGES
    const [images] = await db
      .select({
        mainImagePublicId: propertiesImage.mainImagePublicId,
        image1PublicId: propertiesImage.image1PublicId,
        image2PublicId: propertiesImage.image2PublicId,
        image3PublicId: propertiesImage.image3PublicId,
        image4PublicId: propertiesImage.image4PublicId,
      })
      .from(propertiesImage)
      .where(eq(propertiesImage.estateId, propertyId))
      .limit(1);

    // DELETE IMAGES FROM CLOUDINARY
    if (images) {
      await Promise.all([
        deleteImage(images.mainImagePublicId),
        deleteImage(images.image1PublicId),
        deleteImage(images.image2PublicId),
        deleteImage(images.image3PublicId),
        deleteImage(images.image4PublicId),
      ]);
    }

    // DELETE PAYMENT PLANS
    await db
      .delete(PropertyPaymentPlan)
      .where(eq(PropertyPaymentPlan.propertyId, propertyId));

    // DELETE IMAGE RECORD
    await db
      .delete(propertiesImage)
      .where(eq(propertiesImage.estateId, propertyId));

    // DELETE PROPERTY
    await db.delete(properties).where(eq(properties.id, propertyId));

    return c.json(
      {
        success: true,
        message: "Property and images deleted successfully",
        data: null,
      },
      200,
    );
  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to delete property",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const deleteEstateName = async (c: Context) => {
  try {
    const estateId = c.req.param("estateId");

    if (!estateId) {
      return c.json(
        {
          success: false,
          message: "Estate ID is required",
          data: null,
        },
        400,
      );
    }

    const [estate] = await db
      .select({
        id: estateNames.id,
        name: estateNames.name,
      })
      .from(estateNames)
      .where(eq(estateNames.id, estateId))
      .limit(1);

    if (!estate) {
      return c.json(
        {
          success: false,
          message: "Estate name not found",
          data: null,
        },
        404,
      );
    }

    // Check if properties are using this estate
    const [property] = await db
      .select({
        id: properties.id,
      })
      .from(properties)
      .where(eq(properties.estateId, estateId))
      .limit(1);

    if (property) {
      return c.json(
        {
          success: false,
          message:
            "Cannot delete this estate name because it has properties attached to it",
          data: null,
        },
        409,
      );
    }

    await db.delete(estateNames).where(eq(estateNames.id, estateId));

    return c.json(
      {
        success: true,
        message: "Estate name deleted successfully",
        data: null,
      },
      200,
    );
  } catch (error) {
    console.error("DELETE ESTATE NAME ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to delete estate name",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const updateProperty = async (c: Context) => {
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

    const formData = await c.req.formData();

    // =========================
    // PROPERTY DATA
    // =========================

    const body = {
      estateNameId: formData.get("estateNameId")?.toString().trim() ?? "",
      location: formData.get("location")?.toString().trim() ?? "",
      city: formData.get("city")?.toString().trim() ?? "",
      state: formData.get("state")?.toString().trim() ?? "",
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
          data: null,
        },
        422,
      );
    }

    const data = result.data;

    // =========================
    // CHECK PROPERTY
    // =========================

    const [property] = await db
      .select({
        id: properties.id,
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

    // =========================
    // CHECK ESTATE
    // =========================

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

    // =========================
    // PREPARE ARRAYS
    // =========================

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

    // =========================
    // UPDATE PROPERTY
    // =========================

    const [updatedProperty] = await db
      .update(properties)
      .set({
        estateId: data.estateNameId,
        location: data.location,
        city: data.city,
        state: data.state,
        description: data.description,
        startingPrice: data.startingPrice.toString(),
        totalPlots: data.totalPlots,
        features,
        nearbyLandmarks,
        status: data.status,
      })
      .where(eq(properties.id, propertyId))
      .returning();

    // =========================
    // GET EXISTING IMAGES
    // =========================

    const [existingImages] = await db
      .select()
      .from(propertiesImage)
      .where(eq(propertiesImage.estateId, propertyId))
      .limit(1);

    // =========================
    // REMOVE IMAGES
    // =========================

    const removeImagesRaw = formData.get("removeImages");

    let removeImages: string[] = [];

    if (removeImagesRaw) {
      try {
        const parsed = JSON.parse(removeImagesRaw.toString());

        if (Array.isArray(parsed)) {
          removeImages = parsed;
        }
      } catch {
        return c.json(
          {
            success: false,
            message: "Invalid removeImages format",
            data: null,
          },
          400,
        );
      }
    }

    const allowedImageTypes = ["main", "image1", "image2", "image3", "image4"];

    for (const imageType of removeImages) {
      if (!allowedImageTypes.includes(imageType)) {
        continue;
      }

      if (!existingImages) {
        continue;
      }

      if (imageType === "main") {
        if (existingImages.mainImagePublicId) {
          await deleteImage(existingImages.mainImagePublicId);
        }

        await db
          .update(propertiesImage)
          .set({
            mainImgUrl: null,
            mainImagePublicId: null,
          })
          .where(eq(propertiesImage.estateId, propertyId));
      }

      if (imageType === "image1") {
        if (existingImages.image1PublicId) {
          await deleteImage(existingImages.image1PublicId);
        }

        await db
          .update(propertiesImage)
          .set({
            image1Url: null,
            image1PublicId: null,
          })
          .where(eq(propertiesImage.estateId, propertyId));
      }

      if (imageType === "image2") {
        if (existingImages.image2PublicId) {
          await deleteImage(existingImages.image2PublicId);
        }

        await db
          .update(propertiesImage)
          .set({
            image2Url: null,
            image2PublicId: null,
          })
          .where(eq(propertiesImage.estateId, propertyId));
      }

      if (imageType === "image3") {
        if (existingImages.image3PublicId) {
          await deleteImage(existingImages.image3PublicId);
        }

        await db
          .update(propertiesImage)
          .set({
            image3Url: null,
            image3PublicId: null,
          })
          .where(eq(propertiesImage.estateId, propertyId));
      }

      if (imageType === "image4") {
        if (existingImages.image4PublicId) {
          await deleteImage(existingImages.image4PublicId);
        }

        await db
          .update(propertiesImage)
          .set({
            image4Url: null,
            image4PublicId: null,
          })
          .where(eq(propertiesImage.estateId, propertyId));
      }
    }

    // =========================
    // UPLOAD / REPLACE IMAGES
    // =========================

    const imageFields = [
      {
        type: "main",
        formKey: "mainImage",
      },
      {
        type: "image1",
        formKey: "galleryImage1",
      },
      {
        type: "image2",
        formKey: "galleryImage2",
      },
      {
        type: "image3",
        formKey: "galleryImage3",
      },
      {
        type: "image4",
        formKey: "galleryImage4",
      },
    ] as const;

    for (const imageField of imageFields) {
      const file = formData.get(imageField.formKey);

      if (!(file instanceof File) || file.size === 0) {
        continue;
      }

      let oldPublicId: string | null = null;

      if (existingImages) {
        if (imageField.type === "main") {
          oldPublicId = existingImages.mainImagePublicId;
        }

        if (imageField.type === "image1") {
          oldPublicId = existingImages.image1PublicId;
        }

        if (imageField.type === "image2") {
          oldPublicId = existingImages.image2PublicId;
        }

        if (imageField.type === "image3") {
          oldPublicId = existingImages.image3PublicId;
        }

        if (imageField.type === "image4") {
          oldPublicId = existingImages.image4PublicId;
        }
      }

      // Delete old image when replacing it
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }

      const uploaded = await uploadImage(file);

      if (existingImages) {
        if (imageField.type === "main") {
          await db
            .update(propertiesImage)
            .set({
              mainImgUrl: uploaded.url,
              mainImagePublicId: uploaded.publicId,
            })
            .where(eq(propertiesImage.estateId, propertyId));
        }

        if (imageField.type === "image1") {
          await db
            .update(propertiesImage)
            .set({
              image1Url: uploaded.url,
              image1PublicId: uploaded.publicId,
            })
            .where(eq(propertiesImage.estateId, propertyId));
        }

        if (imageField.type === "image2") {
          await db
            .update(propertiesImage)
            .set({
              image2Url: uploaded.url,
              image2PublicId: uploaded.publicId,
            })
            .where(eq(propertiesImage.estateId, propertyId));
        }

        if (imageField.type === "image3") {
          await db
            .update(propertiesImage)
            .set({
              image3Url: uploaded.url,
              image3PublicId: uploaded.publicId,
            })
            .where(eq(propertiesImage.estateId, propertyId));
        }

        if (imageField.type === "image4") {
          await db
            .update(propertiesImage)
            .set({
              image4Url: uploaded.url,
              image4PublicId: uploaded.publicId,
            })
            .where(eq(propertiesImage.estateId, propertyId));
        }
      } else {
        await db.insert(propertiesImage).values({
          estateId: propertyId,

          ...(imageField.type === "main" && {
            mainImgUrl: uploaded.url,
            mainImagePublicId: uploaded.publicId,
          }),

          ...(imageField.type === "image1" && {
            image1Url: uploaded.url,
            image1PublicId: uploaded.publicId,
          }),

          ...(imageField.type === "image2" && {
            image2Url: uploaded.url,
            image2PublicId: uploaded.publicId,
          }),

          ...(imageField.type === "image3" && {
            image3Url: uploaded.url,
            image3PublicId: uploaded.publicId,
          }),

          ...(imageField.type === "image4" && {
            image4Url: uploaded.url,
            image4PublicId: uploaded.publicId,
          }),
        });
      }
    }

    return c.json(
      {
        success: true,
        message: "Property updated successfully",
        data: updatedProperty,
      },
      200,
    );
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to update property",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const updateEstateName = async (c: Context) => {
  try {
    const estateId = c.req.param("estateId");

    if (!estateId) {
      return c.json(
        {
          success: false,
          message: "Estate ID is required",
          data: null,
        },
        400,
      );
    }

    const body = await c.req.json();

    const result = createEstateNameSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.issues.map((issue) => issue.message),
          data: null,
        },
        422,
      );
    }

    const data = result.data;

    // Check estate exists
    const [existingEstate] = await db
      .select({
        id: estateNames.id,
        name: estateNames.name,
      })
      .from(estateNames)
      .where(eq(estateNames.id, estateId))
      .limit(1);

    if (!existingEstate) {
      return c.json(
        {
          success: false,
          message: "Estate name not found",
          data: null,
        },
        404,
      );
    }

    // Check if another estate already has this name
    const [duplicateName] = await db
      .select({
        id: estateNames.id,
      })
      .from(estateNames)
      .where(and(eq(estateNames.name, data.name), ne(estateNames.id, estateId)))
      .limit(1);

    if (duplicateName) {
      return c.json(
        {
          success: false,
          message: "An estate with this name already exists",
          data: null,
        },
        409,
      );
    }

    const [updatedEstate] = await db
      .update(estateNames)
      .set({
        name: data.name,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
      })
      .where(eq(estateNames.id, estateId))
      .returning();

    return c.json(
      {
        success: true,
        message: "Estate name updated successfully",
        data: updatedEstate,
      },
      200,
    );
  } catch (error) {
    console.error("UPDATE ESTATE NAME ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to update estate name",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const getAllUsers = async (c: Context) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        fullName: users.full_name,
        email: users.email,
        phoneNumber: users.phone_number,
        role: users.role,
        isActive: users.isActive,
        ATI_membership: users.ATI_membership,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return c.json(
      {
        success: true,
        message: "Users fetched successfully",
        data: allUsers,
      },
      200,
    );
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const toggleUserStatus = async (c: Context) => {
  try {
    const userId = c.req.param("userId");

    if (!userId) {
      return c.json(
        {
          success: false,
          message: "User ID is required",
          data: null,
        },
        400,
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.full_name,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return c.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        404,
      );
    }

    const newStatus = !user.isActive;

    const [updatedUser] = await db
      .update(users)
      .set({
        isActive: newStatus,
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullName: users.full_name,
        isActive: users.isActive,
      });

    return c.json(
      {
        success: true,
        message: newStatus
          ? "User activated successfully"
          : "User deactivated successfully",
        data: updatedUser,
      },
      200,
    );
  } catch (error) {
    console.error("TOGGLE USER STATUS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to update user status",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};
