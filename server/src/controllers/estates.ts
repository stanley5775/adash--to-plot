import type { Context } from "hono";
import { eq } from "drizzle-orm";

import { db } from "../db/db";
import {
  properties,
  estateNames,
  propertiesImage,
  paymentPlans,
  PropertyPaymentPlan,
} from "../db/schema";

export const getAllProperties = async (c: Context) => {
  try {
    const allProperties = await db
      .select({
        id: properties.id,
        estateName: estateNames.name,
        state: properties.state,
        city: properties.city,
        location: properties.location,
        description: properties.description,
        startingPrice: properties.startingPrice,
        totalPlots: properties.totalPlots,
        mainImage: propertiesImage.mainImgUrl,
      })
      .from(properties)

      .leftJoin(estateNames, eq(properties.estateId, estateNames.id))
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

export const getPropertyById = async (c: Context) => {
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

    // GET PROPERTY
    const [property] = await db
      .select({
        property: properties,

        estate: {
          id: estateNames.id,
          name: estateNames.name,
        },

        images: propertiesImage,
      })
      .from(properties)
      .innerJoin(estateNames, eq(properties.estateId, estateNames.id))
      .leftJoin(propertiesImage, eq(propertiesImage.estateId, properties.id))
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

    // GET PAYMENT PLANS
    const paymentPlans = await db
      .select()
      .from(PropertyPaymentPlan)
      .where(eq(PropertyPaymentPlan.propertyId, propertyId));

    return c.json(
      {
        success: true,
        message: "Property fetched successfully",

        data: {
          ...property.property,

          estate: property.estate,

          images: property.images
            ? {
                mainImgUrl: property.images.mainImgUrl,
                mainImagePublicId: property.images.mainImagePublicId,

                image1Url: property.images.image1Url,
                image1PublicId: property.images.image1PublicId,

                image2Url: property.images.image2Url,
                image2PublicId: property.images.image2PublicId,

                image3Url: property.images.image3Url,
                image3PublicId: property.images.image3PublicId,

                image4Url: property.images.image4Url,
                image4PublicId: property.images.image4PublicId,
              }
            : null,

          paymentPlans,
        },
      },
      200,
    );
  } catch (error) {
    console.error("GET PROPERTY BY ID ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch property",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const getPropertyFilters = async (c: Context) => {
  try {
    const rows = await db
      .select({
        location: properties.location,
        city: properties.city,
        estateName: estateNames.name,
      })
      .from(properties)
      .innerJoin(estateNames, eq(properties.estateId, estateNames.id));

    const locations = [
      ...new Set(rows.map((row) => row.location).filter(Boolean)),
    ];

    const cities = [...new Set(rows.map((row) => row.city).filter(Boolean))];

    const estateNamesList = [
      ...new Set(rows.map((row) => row.estateName).filter(Boolean)),
    ];

    return c.json(
      {
        success: true,
        message: "Property filters fetched successfully",
        data: {
          locations,
          cities,
          estateNames: estateNamesList,
        },
      },
      200,
    );
  } catch (error) {
    console.error("GET PROPERTY FILTERS ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch property filters",
        data: null,
      },
      500,
    );
  }
};
