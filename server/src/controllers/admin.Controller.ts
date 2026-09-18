import type { Context } from "hono";

import { db } from "../db/db";

import {
  properties,
  propertiesImage,
  PropertyPaymentPlan,
  estateNames,
  notifications,
  users,
  atiMemberships,
  applicationSchema,
  propertyPurchases,
  propertyInstallments,
  propertyPaymentVerifications,
} from "../db/schema";
import { createEstateSchema } from "../validators/estateV";
import { uploadImage } from "../services/uploadImage";
import { and, eq, ne, desc, asc, or, sum, count, sql } from "drizzle-orm";

import { createEstateNameSchema } from "../validators/createEstate";
import { deleteImage } from "../utils/deleteImage";
import STMPservice from "../services/email";

import {
  createEstateService,
  createEstateNameService,
  createPropertyPaymentPlansService,
} from "../services/estateService";

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

    const mainImage = formData.get("mainImage");

    const galleryFiles = formData
      .getAll("galleryImages")
      .filter((file): file is File => file instanceof File && file.size > 0)
      .slice(0, 4);

    const result = await createEstateService({
      body,
      mainImage: mainImage instanceof File ? mainImage : null,
      galleryFiles,
    });

    return c.json(
      {
        success: true,
        message: "Estate created successfully",
        data: result,
      },
      201,
    );
  } catch (error) {
    console.error("CREATE ESTATE ERROR:", error);

    // VALIDATION ERROR
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);

        if (parsed.type === "VALIDATION_ERROR") {
          return c.json(
            {
              success: false,
              message: "Validation failed",
              errors: parsed.errors,
            },
            422,
          );
        }
      } catch {
        // Normal Error message
      }

      // ESTATE NAME NOT FOUND
      if (error.message === "Selected estate name does not exist") {
        return c.json(
          {
            success: false,
            message: error.message,
            data: null,
          },
          404,
        );
      }
    }

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
    const formData = await c.req.formData();

    const body = {
      name: formData.get("name")?.toString().trim() ?? "",
      description: formData.get("description")?.toString().trim() ?? "",
      accountName: formData.get("accountName")?.toString().trim() ?? "",
      accountNumber: formData.get("accountNumber")?.toString().trim() ?? "",
      city: formData.get("city")?.toString().trim() ?? "",
      state: formData.get("state")?.toString().trim() ?? "",
      startingPrice: formData.get("startingPrice")?.toString().trim() ?? "",
      bankName: formData.get("bankName")?.toString().trim() ?? "",
    };

    const mainImage = formData.get("mainImage");

    const estate = await createEstateNameService({
      body,
      mainImage: mainImage instanceof File ? mainImage : (null as never),
    });

    return c.json(
      {
        success: true,
        message: "Estate created successfully",
        data: estate,
      },
      201,
    );
  } catch (error) {
    console.error("CREATE ESTATE NAME ERROR:", error);

    // VALIDATION ERROR
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);

        if (parsed.type === "VALIDATION_ERROR") {
          return c.json(
            {
              success: false,
              message: "Validation failed",
              errors: parsed.errors,
            },
            422,
          );
        }

        // ESTATE NAME ALREADY EXISTS
        if (parsed.type === "ESTATE_NAME_EXISTS") {
          return c.json(
            {
              success: false,
              message: "Estate name already exists",
              data: parsed.data,
            },
            409,
          );
        }
      } catch {
        // Normal Error
      }

      // IMAGE REQUIRED
      if (error.message === "Estate main image is required") {
        return c.json(
          {
            success: false,
            message: error.message,
            data: null,
          },
          422,
        );
      }
    }

    return c.json(
      {
        success: false,
        message: "Failed to create estate",
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
        description: estateNames.description,

        city: estateNames.city,
        state: estateNames.state,
        startingPrice: estateNames.startingPrice,

        mainImageUrl: estateNames.mainImageUrl,
        mainImagePublicId: estateNames.mainImagePublicId,

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

    const body = await c.req.json();

    const createdPlans = await createPropertyPaymentPlansService(
      propertyId,
      body,
    );

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

    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(error.message);

        // PROPERTY ID REQUIRED
        if (parsed.type === "PROPERTY_ID_REQUIRED") {
          return c.json(
            {
              success: false,
              message: "Property ID is required",
              data: null,
            },
            400,
          );
        }

        // VALIDATION ERROR
        if (parsed.type === "VALIDATION_ERROR") {
          return c.json(
            {
              success: false,
              message: "Validation failed",
              errors: parsed.errors,
              data: null,
            },
            422,
          );
        }

        // NO PAYMENT PLANS
        if (parsed.type === "NO_PAYMENT_PLANS") {
          return c.json(
            {
              success: false,
              message: "At least one payment plan is required",
              data: null,
            },
            400,
          );
        }

        // PROPERTY NOT FOUND
        if (parsed.type === "PROPERTY_NOT_FOUND") {
          return c.json(
            {
              success: false,
              message: "Property not found",
              data: null,
            },
            404,
          );
        }

        // INVALID STARTING PRICE
        if (parsed.type === "INVALID_STARTING_PRICE") {
          return c.json(
            {
              success: false,
              message: "Property starting price is invalid",
              data: null,
            },
            422,
          );
        }

        // DUPLICATE DURATIONS
        if (parsed.type === "DUPLICATE_DURATIONS") {
          return c.json(
            {
              success: false,
              message:
                "You cannot add the same payment duration more than once.",
              data: null,
            },
            409,
          );
        }

        // PAYMENT PLAN ALREADY EXISTS
        if (parsed.type === "PAYMENT_PLAN_EXISTS") {
          return c.json(
            {
              success: false,
              message: `${parsed.durationMonths}-month payment plan already exists for this property.`,
              data: null,
            },
            409,
          );
        }
      } catch {
        // Normal Error
      }
    }

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

    const formData = await c.req.formData();

    // =========================
    // ESTATE DATA
    // =========================

    const body = {
      name: formData.get("name")?.toString().trim() ?? "",
      description: formData.get("description")?.toString().trim() ?? "",
      accountName: formData.get("accountName")?.toString().trim() ?? "",
      accountNumber: formData.get("accountNumber")?.toString().trim() ?? "",
      bankName: formData.get("bankName")?.toString().trim() ?? "",
    };

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

    // =========================
    // CHECK ESTATE
    // =========================

    const [existingEstate] = await db
      .select({
        id: estateNames.id,
        name: estateNames.name,
        mainImageUrl: estateNames.mainImageUrl,
        mainImagePublicId: estateNames.mainImagePublicId,
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

    // =========================
    // CHECK DUPLICATE NAME
    // =========================

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

    // =========================
    // REMOVE MAIN IMAGE
    // =========================

    const removeImageRaw = formData.get("removeImage");

    const removeImage = removeImageRaw?.toString().toLowerCase() === "true";

    if (removeImage && existingEstate.mainImagePublicId) {
      await deleteImage(existingEstate.mainImagePublicId);

      await db
        .update(estateNames)
        .set({
          mainImageUrl: null,
          mainImagePublicId: null,
        })
        .where(eq(estateNames.id, estateId));
    }

    // =========================
    // REPLACE MAIN IMAGE
    // =========================

    const mainImage = formData.get("mainImage");

    let uploadedImage: {
      url: string;
      publicId: string;
    } | null = null;

    if (mainImage instanceof File && mainImage.size > 0) {
      // Delete old Cloudinary image
      if (existingEstate.mainImagePublicId) {
        await deleteImage(existingEstate.mainImagePublicId);
      }

      // Upload new image
      uploadedImage = await uploadImage(mainImage);
    }

    // =========================
    // UPDATE ESTATE
    // =========================

    const [updatedEstate] = await db
      .update(estateNames)
      .set({
        name: data.name,
        description: data.description,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        bankName: data.bankName,

        ...(uploadedImage && {
          mainImageUrl: uploadedImage.url,
          mainImagePublicId: uploadedImage.publicId,
        }),

        ...(removeImage && {
          mainImageUrl: null,
          mainImagePublicId: null,
        }),
      })
      .where(eq(estateNames.id, estateId))
      .returning({
        id: estateNames.id,
        name: estateNames.name,
        description: estateNames.description,
        mainImageUrl: estateNames.mainImageUrl,
        mainImagePublicId: estateNames.mainImagePublicId,
        accountName: estateNames.accountName,
        accountNumber: estateNames.accountNumber,
        bankName: estateNames.bankName,
        createdAt: estateNames.createdAt,
      });

    return c.json(
      {
        success: true,
        message: "Estate updated successfully",
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

export const getAllATIMembers = async (c: Context) => {
  try {
    const atiMembers = await db
      .select({
        membershipId: atiMemberships.id,

        userId: users.id,
        fullName: users.full_name,
        email: users.email,
        phoneNumber: users.phone_number,
        role: users.role,
        isActive: users.isActive,

        status: atiMemberships.status,
        ATI_membership: atiMemberships.ATI_membership,
        startDate: atiMemberships.startDate,
        expiryDate: atiMemberships.expiryDate,

        createdAt: atiMemberships.createdAt,
      })
      .from(atiMemberships)
      .innerJoin(users, eq(atiMemberships.userId, users.id))
      .orderBy(desc(atiMemberships.createdAt));

    return c.json(
      {
        success: true,
        message: "ATI members fetched successfully",
        data: atiMembers,
      },
      200,
    );
  } catch (error) {
    console.error("GET ALL ATI MEMBERS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch ATI members",
        data: null,
      },
      500,
    );
  }
};

export const toggleUserATI = async (c: Context) => {
  try {
    const userId = c.req.param("userId");

    if (!userId) {
      return c.json(
        {
          success: false,
          message: "User ID is required",
        },
        400,
      );
    }

    // Get user's latest ATI membership
    const [membership] = await db
      .select({
        id: atiMemberships.id,
        status: atiMemberships.status,
        ATI_membership: atiMemberships.ATI_membership,
        startDate: atiMemberships.startDate,
        expiryDate: atiMemberships.expiryDate,
      })
      .from(atiMemberships)
      .where(eq(atiMemberships.userId, userId))
      .orderBy(desc(atiMemberships.createdAt))
      .limit(1);

    const now = new Date();

    // Check current ATI status
    const isCurrentlyATI =
      membership?.status === "ACTIVE" &&
      membership?.ATI_membership === true &&
      !!membership?.expiryDate &&
      membership.expiryDate > now;

    // =========================
    // TURN OFF ATI
    // =========================
    if (isCurrentlyATI && membership) {
      const [updatedMembership] = await db
        .update(atiMemberships)
        .set({
          status: "CANCELLED",
          ATI_membership: false,
          updatedAt: now,
        })
        .where(eq(atiMemberships.id, membership.id))
        .returning();

      return c.json(
        {
          success: true,
          message: "ATI membership removed successfully",
          data: updatedMembership,
        },
        200,
      );
    }

    // =========================
    // TURN ON ATI
    // =========================
    const expiryDate = new Date(now);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Existing membership record
    if (membership) {
      const [updatedMembership] = await db
        .update(atiMemberships)
        .set({
          status: "ACTIVE",
          ATI_membership: true,
          startDate: now,
          expiryDate,
          updatedAt: now,
        })
        .where(eq(atiMemberships.id, membership.id))
        .returning();

      // GET USER

      const [user] = await db
        .select({
          full_name: users.full_name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      const startDate = new Date();

      // SEND ATI ACTIVATION EMAIL

      if (user) {
        await STMPservice.atiMembershipSuccess(
          {
            full_name: user.full_name,
            email: user.email,
          },
          {
            amount: 20_000,
            startDate,
            expiryDate,
          },
        );
      }
      return c.json(
        {
          success: true,
          message: "ATI membership activated successfully",
          data: updatedMembership,
        },
        200,
      );
    }

    // No membership record exists
    const [newMembership] = await db
      .insert(atiMemberships)
      .values({
        userId,
        status: "ACTIVE",
        ATI_membership: true,
        startDate: now,
        expiryDate,
      })
      .returning();

    return c.json(
      {
        success: true,
        message: "ATI membership activated successfully",
        data: newMembership,
      },
      201,
    );
  } catch (error) {
    console.error("TOGGLE USER ATI ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to update ATI membership",
      },
      500,
    );
  }
};

export const getAllApplicants = async (c: Context) => {
  try {
    const applicants = await db
      .select({
        applicationId: applicationSchema.id,

        userId: applicationSchema.userId,

        surname: applicationSchema.surname,
        firstName: applicationSchema.firstName,
        middleName: applicationSchema.middleName,

        sex: applicationSchema.sex,
        dateOfBirth: applicationSchema.dateOfBirth,
        nationality: applicationSchema.nationality,
        stateOfOrigin: applicationSchema.stateOfOrigin,

        residentialAddress: applicationSchema.residentialAddress,

        phone1: applicationSchema.phone1,
        phone2: applicationSchema.phone2,
        email: applicationSchema.email,

        occupation: applicationSchema.occupation,
        officeAddress: applicationSchema.officeAddress,

        nextOfKinName: applicationSchema.nextOfKinName,
        nextOfKinRelationship: applicationSchema.nextOfKinRelationship,
        nextOfKinPhone: applicationSchema.nextOfKinPhone,
        nextOfKinAddress: applicationSchema.nextOfKinAddress,

        isCorporate: applicationSchema.isCorporate,
        businessName: applicationSchema.businessName,
        rcNumber: applicationSchema.rcNumber,
        companyAddress: applicationSchema.companyAddress,
        natureOfBusiness: applicationSchema.natureOfBusiness,
        companyPhone: applicationSchema.companyPhone,
        companyEmail: applicationSchema.companyEmail,

        referralSource: applicationSchema.referralSource,
        referralOther: applicationSchema.referralOther,

        estate: applicationSchema.estate,
        plotSize: applicationSchema.plotSize,
        paymentOption: applicationSchema.paymentOption,
        acquisitionPurpose: applicationSchema.acquisitionPurpose,

        status: applicationSchema.status,
        isApplication: applicationSchema.isApplication,

        createdAt: applicationSchema.createdAt,
        updatedAt: applicationSchema.updatedAt,

        user: {
          fullName: users.full_name,
          email: users.email,
          phoneNumber: users.phone_number,
          role: users.role,
        },
      })
      .from(applicationSchema)
      .innerJoin(users, eq(applicationSchema.userId, users.id))
      .orderBy(desc(applicationSchema.createdAt));

    return c.json(
      {
        success: true,
        message: "Applicants fetched successfully",
        data: applicants,
      },
      200,
    );
  } catch (error) {
    console.error("GET ALL APPLICANTS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch applicants",
        data: null,
      },
      500,
    );
  }
};

export const getPropertyPaymentPlans = async (c: Context) => {
  try {
    const propertyId = c.req.param("propertyId");

    if (!propertyId) {
      return c.json(
        {
          success: false,
          message: "Property ID is required",
        },
        400,
      );
    }

    const paymentPlans = await db
      .select({
        id: PropertyPaymentPlan.id,
        propertyId: PropertyPaymentPlan.propertyId,
        estateId: PropertyPaymentPlan.estateId,
        name: PropertyPaymentPlan.name,
        durationMonths: PropertyPaymentPlan.durationMonths,
        totalAmount: PropertyPaymentPlan.totalAmount,
        monthlyAmount: PropertyPaymentPlan.monthlyAmount,
        interestRate: PropertyPaymentPlan.interestRate,
        createdAt: PropertyPaymentPlan.createdAt,
      })
      .from(PropertyPaymentPlan)
      .where(eq(PropertyPaymentPlan.propertyId, propertyId))
      .orderBy(asc(PropertyPaymentPlan.durationMonths));

    return c.json({
      success: true,
      message: "Payment plans fetched successfully",
      data: paymentPlans,
    });
  } catch (error) {
    console.error("Get payment plans error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch payment plans",
      },
      500,
    );
  }
};

export const deletePropertyPaymentPlan = async (c: Context) => {
  try {
    const planId = c.req.param("planId");

    if (!planId) {
      return c.json(
        {
          success: false,
          message: "Payment plan ID is required",
        },
        400,
      );
    }

    const existingPlan = await db
      .select({
        id: PropertyPaymentPlan.id,
        name: PropertyPaymentPlan.name,
        propertyId: PropertyPaymentPlan.propertyId,
      })
      .from(PropertyPaymentPlan)
      .where(eq(PropertyPaymentPlan.id, planId))
      .limit(1);

    if (existingPlan.length === 0) {
      return c.json(
        {
          success: false,
          message: "Payment plan not found",
        },
        404,
      );
    }

    const plan = existingPlan[0];

    // Do not allow the automatically-created Outright plan to be deleted
    if (plan.name.trim().toLowerCase() === "outright") {
      return c.json(
        {
          success: false,
          message: "Outright payment plan cannot be deleted",
        },
        400,
      );
    }

    await db
      .delete(PropertyPaymentPlan)
      .where(eq(PropertyPaymentPlan.id, planId));

    return c.json({
      success: true,
      message: "Payment plan deleted successfully",
      data: {
        id: plan.id,
        propertyId: plan.propertyId,
      },
    });
  } catch (error) {
    console.error("Delete payment plan error:", error);

    return c.json(
      {
        success: false,
        message: "Failed to delete payment plan",
      },
      500,
    );
  }
};

export const getAllPropertyPaymentVerifications = async (c: Context) => {
  try {
    const verifications = await db
      .select({
        verification: propertyPaymentVerifications,

        customer: {
          id: users.id,
          fullName: users.full_name,
          email: users.email,
          phoneNumber: users.phone_number,
        },

        purchase: propertyPurchases,

        property: properties,

        estate: {
          id: estateNames.id,
          name: estateNames.name,
          accountName: estateNames.accountName,
          accountNumber: estateNames.accountNumber,
          bankName: estateNames.bankName,
        },

        paymentPlan: PropertyPaymentPlan,
      })
      .from(propertyPaymentVerifications)
      .innerJoin(users, eq(propertyPaymentVerifications.userId, users.id))
      .innerJoin(
        propertyPurchases,
        eq(propertyPaymentVerifications.purchaseId, propertyPurchases.id),
      )
      .innerJoin(properties, eq(propertyPurchases.propertyId, properties.id))
      .innerJoin(estateNames, eq(properties.estateId, estateNames.id))
      .innerJoin(
        PropertyPaymentPlan,
        eq(propertyPurchases.paymentPlanId, PropertyPaymentPlan.id),
      )
      .where(eq(propertyPaymentVerifications.status, "PENDING"))
      .orderBy(desc(propertyPaymentVerifications.createdAt));
    console.log("PENDING VERIFICATIONS:", verifications);
    return c.json({
      success: true,
      message: "Pending payment verifications fetched successfully",
      data: verifications,
    });
  } catch (error) {
    console.error("GET PROPERTY PAYMENT VERIFICATIONS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch payment verifications",
      },
      500,
    );
  }
};

export const approvePropertyPayment = async (c: Context) => {
  try {
    const authUser = c.get("userId");

    if (!authUser) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const adminId = authUser.id;
    const verificationId = c.req.param("verificationId");

    if (!verificationId) {
      return c.json(
        {
          success: false,
          message: "Verification ID is required",
        },
        400,
      );
    }

    /**
     * 1. Get payment verification
     */
    const [verification] = await db
      .select()
      .from(propertyPaymentVerifications)
      .where(eq(propertyPaymentVerifications.id, verificationId))
      .limit(1);

    if (!verification) {
      return c.json(
        {
          success: false,
          message: "Payment verification not found",
        },
        404,
      );
    }

    /**
     * 2. Only pending verification can be approved
     */
    if (verification.status !== "PENDING") {
      return c.json(
        {
          success: false,
          message: "This payment has already been reviewed",
        },
        409,
      );
    }

    /**
     * 3. Get purchase
     */
    const [purchase] = await db
      .select()
      .from(propertyPurchases)
      .where(eq(propertyPurchases.id, verification.purchaseId))
      .limit(1);

    if (!purchase) {
      return c.json(
        {
          success: false,
          message: "Property purchase not found",
        },
        404,
      );
    }

    /**
     * 4. Do not approve payments for cancelled/completed purchases
     */
    if (purchase.status === "CANCELLED" || purchase.status === "COMPLETED") {
      return c.json(
        {
          success: false,
          message: `Cannot approve payment for a ${purchase.status.toLowerCase()} purchase`,
        },
        409,
      );
    }

    /**
     * 5. Payment amount
     */
    const paymentAmount = Number(verification.amount);
    const currentAmountPaid = Number(purchase.amountPaid);
    const currentBalance = Number(purchase.balance);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return c.json(
        {
          success: false,
          message: "Invalid payment amount",
        },
        400,
      );
    }

    if (!Number.isFinite(currentBalance) || currentBalance < 0) {
      return c.json(
        {
          success: false,
          message: "Invalid purchase balance",
        },
        400,
      );
    }

    /**
     * 6. Never allow payment to exceed balance
     */
    if (paymentAmount > currentBalance) {
      return c.json(
        {
          success: false,
          message: "Payment amount exceeds the outstanding balance",
        },
        400,
      );
    }

    /**
     * 7. Calculate new totals
     */
    const newAmountPaid = Number(
      (currentAmountPaid + paymentAmount).toFixed(2),
    );

    const newBalance = Number(
      Math.max(currentBalance - paymentAmount, 0).toFixed(2),
    );

    /**
     * 8. Determine new purchase status
     */
    const newPurchaseStatus = newBalance <= 0 ? "COMPLETED" : "ACTIVE";

    /**
     * 9. Approve verification
     */
    const [updatedVerification] = await db
      .update(propertyPaymentVerifications)
      .set({
        status: "APPROVED",
        reviewedBy: adminId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(propertyPaymentVerifications.id, verificationId))
      .returning();

    if (!updatedVerification) {
      return c.json(
        {
          success: false,
          message: "Failed to approve payment",
        },
        500,
      );
    }

    /**
     * 10. Update purchase
     */
    const [updatedPurchase] = await db
      .update(propertyPurchases)
      .set({
        amountPaid: newAmountPaid.toFixed(2),
        balance: newBalance.toFixed(2),
        status: newPurchaseStatus,
        updatedAt: new Date(),
      })
      .where(eq(propertyPurchases.id, purchase.id))
      .returning();

    if (!updatedPurchase) {
      return c.json(
        {
          success: false,
          message: "Payment approved but failed to update purchase",
        },
        500,
      );
    }

    /**
     * 11. If this is an installment payment,
     * mark the next pending installment as PAID.
     */
    if (purchase.durationMonths && purchase.durationMonths > 0) {
      const [nextInstallment] = await db
        .select()
        .from(propertyInstallments)
        .where(
          and(
            eq(propertyInstallments.purchaseId, purchase.id),
            eq(propertyInstallments.status, "PENDING"),
          ),
        )
        .orderBy(asc(propertyInstallments.installmentNumber))
        .limit(1);

      if (nextInstallment) {
        await db
          .update(propertyInstallments)
          .set({
            status: "PAID",
            paidAt: new Date(),
            paymentReference: verification.id,
            updatedAt: new Date(),
          })
          .where(eq(propertyInstallments.id, nextInstallment.id));
      }
    }

    /**
     * 12. Get customer + property + estate
     */
    const [purchaseData] = await db
      .select({
        customer: {
          id: users.id,
          fullName: users.full_name,
          email: users.email,
        },

        property: {
          location: properties.location,
        },

        estate: {
          name: estateNames.name,
        },
      })
      .from(propertyPurchases)
      .innerJoin(users, eq(propertyPurchases.userId, users.id))
      .innerJoin(properties, eq(propertyPurchases.propertyId, properties.id))
      .innerJoin(estateNames, eq(properties.estateId, estateNames.id))
      .where(eq(propertyPurchases.id, purchase.id))
      .limit(1);

    /**
     * 13. Notification + email
     */
    if (purchaseData) {
      try {
        await db.insert(notifications).values({
          userId: purchaseData.customer.id,
          type: "PAYMENT_SUCCESS",
          title: "Property Payment Approved",
          message:
            newBalance <= 0
              ? `Your payment of ₦${paymentAmount.toLocaleString(
                  "en-NG",
                )} for ${
                  purchaseData.estate.name
                } has been approved successfully. Your property purchase has now been fully paid.`
              : `Your payment of ₦${paymentAmount.toLocaleString(
                  "en-NG",
                )} for ${
                  purchaseData.estate.name
                } has been approved successfully. Your remaining balance is ₦${newBalance.toLocaleString(
                  "en-NG",
                )}.`,
          isRead: false,
        });
      } catch (notificationError) {
        console.error(
          "PROPERTY PAYMENT APPROVAL NOTIFICATION ERROR:",
          notificationError,
        );
      }

      try {
        await STMPservice.propertyPaymentApproved(
          {
            full_name: purchaseData.customer.fullName,
            email: purchaseData.customer.email,
          },
          {
            propertyLocation: purchaseData.property.location,
            estateName: purchaseData.estate.name,
            amount: paymentAmount,
            amountPaid: newAmountPaid,
            balance: newBalance,
            verificationId: verification.id,
          },
        );
      } catch (emailError) {
        console.error("PROPERTY PAYMENT APPROVAL EMAIL ERROR:", emailError);
      }
    }

    /**
     * 14. Return
     */
    return c.json({
      success: true,
      message: "Payment approved successfully",
      data: {
        verification: updatedVerification,
        purchase: updatedPurchase,
      },
    });
  } catch (error) {
    console.error("APPROVE PROPERTY PAYMENT ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to approve payment",
      },
      500,
    );
  }
};

export const rejectPropertyPayment = async (c: Context) => {
  try {
    const authUser = c.get("userId");

    if (!authUser) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const adminId = authUser.id;
    const verificationId = c.req.param("verificationId");

    if (!verificationId) {
      return c.json(
        {
          success: false,
          message: "Verification ID is required",
        },
        400,
      );
    }

    const body = await c.req.json();

    const rejectionReason =
      typeof body.rejectionReason === "string"
        ? body.rejectionReason.trim()
        : "";

    if (!rejectionReason) {
      return c.json(
        {
          success: false,
          message: "Rejection reason is required",
        },
        400,
      );
    }

    // 1. Get payment verification
    const [verification] = await db
      .select()
      .from(propertyPaymentVerifications)
      .where(eq(propertyPaymentVerifications.id, verificationId))
      .limit(1);

    if (!verification) {
      return c.json(
        {
          success: false,
          message: "Payment verification not found",
        },
        404,
      );
    }

    // 2. Make sure it has not already been reviewed
    if (verification.status !== "PENDING") {
      return c.json(
        {
          success: false,
          message: "This payment has already been reviewed",
        },
        409,
      );
    }

    // 3. Get the purchase
    const [purchase] = await db
      .select()
      .from(propertyPurchases)
      .where(eq(propertyPurchases.id, verification.purchaseId))
      .limit(1);

    if (!purchase) {
      return c.json(
        {
          success: false,
          message: "Property purchase not found",
        },
        404,
      );
    }

    // 4. Reject the verification
    const [updatedVerification] = await db
      .update(propertyPaymentVerifications)
      .set({
        status: "REJECTED",
        rejectionReason,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(propertyPaymentVerifications.id, verificationId))
      .returning();

    if (!updatedVerification) {
      return c.json(
        {
          success: false,
          message: "Failed to reject payment",
        },
        500,
      );
    }

    // 5. If this is the initial purchase and it is still PENDING,
    // cancel the purchase so the customer can start a new one.
    //
    // IMPORTANT:
    // Do NOT cancel ACTIVE purchases.
    // An ACTIVE purchase may already have approved installment payments.
    if (purchase.status === "PENDING") {
      await db
        .update(propertyPurchases)
        .set({
          status: "CANCELLED",
          updatedAt: new Date(),
        })
        .where(eq(propertyPurchases.id, purchase.id));
    }

    // 6. Get customer/property information for notification/email
    const [purchaseData] = await db
      .select({
        customer: {
          id: users.id,
          fullName: users.full_name,
          email: users.email,
        },
        property: {
          location: properties.location,
        },
        estate: {
          name: estateNames.name,
        },
      })
      .from(propertyPurchases)
      .innerJoin(users, eq(propertyPurchases.userId, users.id))
      .innerJoin(properties, eq(propertyPurchases.propertyId, properties.id))
      .innerJoin(estateNames, eq(properties.estateId, estateNames.id))
      .where(eq(propertyPurchases.id, verification.purchaseId))
      .limit(1);

    if (purchaseData) {
      // Notification
      await db.insert(notifications).values({
        userId: purchaseData.customer.id,
        type: "PAYMENT_FAILED",
        title: "Payment Rejected",
        message: `Your payment for ${purchaseData.estate.name} has been rejected. Reason: ${rejectionReason}`,
        createdAt: new Date(),
      });

      // Email
      await STMPservice.propertyPaymentRejected(
        {
          full_name: purchaseData.customer.fullName,
          email: purchaseData.customer.email,
        },
        {
          propertyLocation: purchaseData.property.location,
          estateName: purchaseData.estate.name,
          amount: Number(verification.amount),
          rejectionReason,
          verificationId: verification.id,
        },
      );
    }

    return c.json({
      success: true,
      message: "Payment rejected successfully",
      data: {
        verification: updatedVerification,
        purchaseStatus:
          purchase.status === "PENDING" ? "CANCELLED" : purchase.status,
      },
    });
  } catch (error) {
    console.error("REJECT PROPERTY PAYMENT ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to reject payment",
      },
      500,
    );
  }
};

export const getAdminDashboardStats = async (c: Context) => {
  try {
    const authUser = c.get("userId");

    if (!authUser) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    // --------------------------------------------------
    // 1. TOTAL ESTATES
    // --------------------------------------------------
    const [estateResult] = await db
      .select({
        total: count(),
      })
      .from(estateNames);

    // --------------------------------------------------
    // 2. TOTAL PROPERTIES
    // --------------------------------------------------
    const [propertyResult] = await db
      .select({
        total: count(),
      })
      .from(properties);

    // --------------------------------------------------
    // 3. TOTAL PLOTS
    // --------------------------------------------------
    const [plotResult] = await db
      .select({
        totalPlots: sql<string>`
          COALESCE(
            SUM(${properties.totalPlots}),
            0
          )
        `,
      })
      .from(properties);

    // 4. RESERVED PLOTS
    //

    const [reservedResult] = await db
      .select({
        total: count(),
      })
      .from(propertyPurchases)
      .where(eq(propertyPurchases.status, "ACTIVE"));

    // --------------------------------------------------
    // 5. SOLD PLOTS

    const [soldResult] = await db
      .select({
        total: count(),
      })
      .from(propertyPurchases)
      .where(eq(propertyPurchases.status, "COMPLETED"));

    // 6. TOTAL CUSTOMERS

    const [customerResult] = await db
      .select({
        total: count(),
      })
      .from(users)
      .where(eq(users.role, "CUSTOMER"));

    // 7. ATI PLUS MEMBERS

    const [atiResult] = await db
      .select({
        total: count(),
      })
      .from(atiMemberships)
      .where(eq(atiMemberships.status, "ACTIVE"));

    // 8. TOTAL SALES
    //

    const [salesResult] = await db
      .select({
        totalSales: sql<string>`
          COALESCE(
            SUM(${propertyPurchases.amountPaid}),
            0
          )
        `,
      })
      .from(propertyPurchases)
      .where(
        or(
          eq(propertyPurchases.status, "ACTIVE"),
          eq(propertyPurchases.status, "COMPLETED"),
        ),
      );

    // 9. OUTSTANDING PAYMENTS
    //
    // Only ACTIVE purchases have an unpaid balance.
    // COMPLETED purchases should have balance = 0.

    const [outstandingResult] = await db
      .select({
        outstandingPayments: sql<string>`
          COALESCE(
            SUM(${propertyPurchases.balance}),
            0
          )
        `,
      })
      .from(propertyPurchases)
      .where(eq(propertyPurchases.status, "ACTIVE"));

    // CONVERT VALUES

    const totalEstates = Number(estateResult?.total ?? 0);

    const totalProperties = Number(propertyResult?.total ?? 0);

    const totalPlots = Number(plotResult?.totalPlots ?? 0);

    const reservedPlots = Number(reservedResult?.total ?? 0);

    const soldPlots = Number(soldResult?.total ?? 0);

    const totalCustomers = Number(customerResult?.total ?? 0);

    const atiPlusMembers = Number(atiResult?.total ?? 0);

    const totalSales = Number(salesResult?.totalSales ?? 0);

    const outstandingPayments = Number(
      outstandingResult?.outstandingPayments ?? 0,
    );

    // AVAILABLE PLOTS

    const availablePlots = Math.max(totalPlots - reservedPlots - soldPlots, 0);

    return c.json({
      success: true,
      message: "Admin dashboard statistics fetched successfully",

      data: {
        totalEstates,
        totalProperties,

        totalPlots,
        availablePlots,
        reservedPlots,
        soldPlots,

        totalCustomers,
        atiPlusMembers,

        totalSales,
        outstandingPayments,
      },
    });
  } catch (error) {
    console.error("GET ADMIN DASHBOARD STATS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch admin dashboard statistics",
      },
      500,
    );
  }
};
