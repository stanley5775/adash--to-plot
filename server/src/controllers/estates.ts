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
        status: properties.status,
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

// export const getEstateWithProperties = async (c: Context) => {
//   try {
//     const estateId = c.req.param("estateId");

//     if (!estateId) {
//       return c.json(
//         {
//           success: false,
//           message: "Estate ID is required",
//           data: null,
//         },
//         400,
//       );
//     }
//     const estate = await db
//       .select({
//         id: estateNames.id,
//         name: estateNames.name,
//       })
//       .from(estateNames)
//       .where(eq(estateNames.id, estateId))
//       .limit(1);

//     if (!estate.length) {
//       return c.json(
//         {
//           success: false,
//           message: "Estate not found",
//           data: null,
//         },
//         404,
//       );
//     }

//     const propertiesList = await db
//       .select({
//         id: properties.id,
//         estateId: properties.estateId,
//         state: properties.state,
//         city: properties.city,
//         location: properties.location,
//         description: properties.description,
//         startingPrice: properties.startingPrice,
//         totalPlots: properties.totalPlots,
//         status: properties.status,
//         mainImage: propertiesImage.mainImgUrl,
//       })
//       .from(properties)
//       .leftJoin(propertiesImage, eq(propertiesImage.estateId, properties.id))
//       .where(eq(properties.estateId, estateId));

//     return c.json(
//       {
//         success: true,
//         message: "Estate fetched successfully",
//         data: {
//           estate: estate[0],
//           properties: propertiesList,
//         },
//       },
//       200,
//     );
//   } catch (error) {
//     console.error("GET ESTATE WITH PROPERTIES ERROR:", error);

//     return c.json(
//       {
//         success: false,
//         message: "Failed to fetch estate",
//         error: "INTERNAL_SERVER_ERROR",
//         data: null,
//       },
//       500,
//     );
//   }
// };
export const getAllEstates = async (c: Context) => {
  try {
    const estates = await db
      .select({
        estateId: estateNames.id,
        estateName: estateNames.name,
        description: estateNames.description,

        city: estateNames.city,
        state: estateNames.state,
        startingPrice: estateNames.startingPrice,

        mainImage: estateNames.mainImageUrl,
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
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};
