import type { Context } from "hono";
import { and, eq, gt, gte, lte, ilike, or } from "drizzle-orm";
import { verify, sign } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";

import { env } from "../env";
import { sessions, users } from "../db/schema";
import { FIFTEEN_MINUTES_SECONDS } from "../utils/cookies";
import { db } from "../db/db";
import {
  properties,
  estateNames,
  propertiesImage,
  atiMemberships,
  paymentPlans,
  PropertyPaymentPlan,
} from "../db/schema";

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
          accountName: estateNames.accountName,
          accountNumber: estateNames.accountNumber,
          bankName: estateNames.bankName,
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

    // OPTIONAL AUTHENTICATION

    let isAuthenticated = false;
    let userId: string | null = null;

    const accessToken = getCookie(c, "accessToken");

    if (accessToken) {
      try {
        const payload = await verify(
          accessToken,
          env.JWT_ACCESS_SECRET,
          "HS256",
        );

        const tokenUserId = payload.id as string;

        if (tokenUserId) {
          isAuthenticated = true;
          userId = tokenUserId;
        }
      } catch {
        // Access token invalid/expired.
        // Try refresh token below.
      }
    }

    // TRY REFRESH TOKEN

    if (!isAuthenticated) {
      const refreshToken = getCookie(c, "refreshToken");

      if (refreshToken) {
        try {
          const refreshPayload = await verify(
            refreshToken,
            env.JWT_REFRESH_SECRET,
            "HS256",
          );

          const refreshUserId = refreshPayload.id as string;

          if (refreshUserId) {
            const [session] = await db
              .select()
              .from(sessions)
              .where(
                and(
                  eq(sessions.refreshToken, refreshToken),
                  eq(sessions.userId, refreshUserId),
                ),
              )
              .limit(1);

            if (session && session.expiresAt > new Date()) {
              const [user] = await db
                .select({
                  id: users.id,
                  role: users.role,
                })
                .from(users)
                .where(eq(users.id, refreshUserId))
                .limit(1);

              if (user) {
                const newAccessToken = await sign(
                  {
                    id: user.id,
                    role: user.role,
                    exp:
                      Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES_SECONDS,
                  },
                  env.JWT_ACCESS_SECRET,
                );

                setCookie(c, "accessToken", newAccessToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite:
                    process.env.NODE_ENV === "production" ? "None" : "Lax",
                  path: "/",
                  maxAge: FIFTEEN_MINUTES_SECONDS,
                });

                isAuthenticated = true;
                userId = user.id;
              }
            }
          }
        } catch {
          // Invalid refresh token.
          // Treat as visitor.
        }
      }
    }

    // CHECK ATI MEMBERSHIP

    let isAtiMember = false;

    if (isAuthenticated && userId) {
      const now = new Date();

      const [membership] = await db
        .select({
          id: atiMemberships.id,
        })
        .from(atiMemberships)
        .where(
          and(
            eq(atiMemberships.userId, userId),
            eq(atiMemberships.status, "ACTIVE"),
            eq(atiMemberships.ATI_membership, true),
            gt(atiMemberships.expiryDate, now),
          ),
        )
        .limit(1);

      isAtiMember = !!membership;
    }

    // CAN PURCHASE
    // ATI IS NOT REQUIRED.
    // User only needs to be logged in
    // and property must be ACTIVE.

    const canPurchase =
      isAuthenticated && property.property.status === "ACTIVE";

    // GET PAYMENT PLANS

    const rawPaymentPlans =
      property.property.status === "ACTIVE"
        ? await db
            .select()
            .from(PropertyPaymentPlan)
            .where(eq(PropertyPaymentPlan.propertyId, propertyId))
        : [];

    // CALCULATE PRICES

    const paymentPlans = rawPaymentPlans.map((plan) => {
      const originalTotalAmount = Number(plan.totalAmount);
      const originalMonthlyAmount = plan.monthlyAmount
        ? Number(plan.monthlyAmount)
        : null;

      const discountAmount = isAtiMember ? originalTotalAmount * 0.05 : 0;

      const totalAmount = originalTotalAmount - discountAmount;

      const monthlyAmount =
        plan.durationMonths && plan.durationMonths > 0
          ? totalAmount / plan.durationMonths
          : null;

      return {
        ...plan,

        // Original price
        originalTotalAmount: originalTotalAmount.toFixed(2),

        originalMonthlyAmount:
          originalMonthlyAmount !== null
            ? originalMonthlyAmount.toFixed(2)
            : null,

        // ACTUAL USER PRICE
        totalAmount: totalAmount.toFixed(2),

        monthlyAmount: monthlyAmount !== null ? monthlyAmount.toFixed(2) : null,

        // ATI information
        atiDiscountAmount: discountAmount.toFixed(2),

        atiDiscountPercentage: isAtiMember ? 5 : 0,
      };
    });

    // RESPONSE

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

          isAuthenticated,
          isAtiMember,
          canPurchase,

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

export const getAllEstates = async (c: Context) => {
  try {
    const search = c.req.query("search")?.trim() ?? "";
    const state = c.req.query("state")?.trim() ?? "";
    const price = c.req.query("price")?.trim() ?? "";

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(estateNames.name, `%${search}%`),
          ilike(estateNames.city, `%${search}%`),
          ilike(estateNames.state, `%${search}%`),
        ),
      );
    }

    if (state) {
      conditions.push(eq(estateNames.state, state));
    }

    if (price) {
      const [min, max] = price.split("-").map(Number);

      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        conditions.push(
          and(
            gte(estateNames.startingPrice, min.toString()),
            lte(estateNames.startingPrice, max.toString()),
          ),
        );
      }
    }

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
      .from(estateNames)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Get ALL available states independently of the current filters
    const stateResults = await db
      .selectDistinct({
        state: estateNames.state,
      })
      .from(estateNames)
      .where(ilike(estateNames.state, "%"));

    const states = stateResults
      .map((item) => item.state)
      .filter((state): state is string => Boolean(state))
      .sort();

    return c.json(
      {
        success: true,
        message: "Estates fetched successfully",
        data: estates,
        filters: {
          states,
        },
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

export const getPropertiesByEstate = async (c: Context) => {
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

    // Get estate details
    const [estate] = await db
      .select({
        id: estateNames.id,
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
      .from(estateNames)
      .where(eq(estateNames.id, estateId))
      .limit(1);

    if (!estate) {
      return c.json(
        {
          success: false,
          message: "Estate not found",
          data: null,
        },
        404,
      );
    }

    // Get properties inside the estate
    const propertiesList = await db
      .select({
        id: properties.id,
        estateId: properties.estateId,
        state: properties.state,

        city: properties.city,
        location: properties.location,
        description: properties.description,
        startingPrice: properties.startingPrice,
        totalPlots: properties.totalPlots,
        status: properties.status,
        mainImage: propertiesImage.mainImgUrl,
      })
      .from(properties)
      .leftJoin(propertiesImage, eq(propertiesImage.estateId, properties.id))
      .where(eq(properties.estateId, estateId));

    return c.json(
      {
        success: true,
        message: "Estate and properties fetched successfully",
        data: {
          estate,
          properties: propertiesList,
        },
      },
      200,
    );
  } catch (error) {
    console.error("GET ESTATE PROPERTIES ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch estate properties",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
      },
      500,
    );
  }
};

export const getAllActiveProperties = async (c: Context) => {
  try {
    const search = c.req.query("search")?.trim() ?? "";
    const state = c.req.query("state")?.trim() ?? "";
    const price = c.req.query("price")?.trim() ?? "";

    const conditions = [eq(properties.status, "ACTIVE")];

    // Search available properties
    if (search) {
      conditions.push(
        or(
          ilike(properties.location, `%${search}%`),
          ilike(properties.city, `%${search}%`),
          ilike(properties.state, `%${search}%`),
          ilike(estateNames.name, `%${search}%`),
        )!,
      );
    }

    // State filter
    if (state) {
      conditions.push(eq(properties.state, state));
    }

    // Price filter
    if (price) {
      const [min, max] = price.split("-").map(Number);

      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        conditions.push(
          and(
            gte(properties.startingPrice, min.toString()),
            lte(properties.startingPrice, max.toString()),
          )!,
        );
      }
    }

    const propertiesList = await db
      .select({
        id: properties.id,
        estateId: properties.estateId,
        estateName: estateNames.name,

        state: properties.state,
        city: properties.city,
        location: properties.location,

        description: properties.description,
        startingPrice: properties.startingPrice,
        totalPlots: properties.totalPlots,
        status: properties.status,

        mainImage: propertiesImage.mainImgUrl,
      })
      .from(properties)
      .innerJoin(estateNames, eq(estateNames.id, properties.estateId))
      .leftJoin(propertiesImage, eq(propertiesImage.estateId, properties.id))
      .where(and(...conditions));

    // States that actually have ACTIVE properties
    const stateResults = await db
      .selectDistinct({
        state: properties.state,
      })
      .from(properties)
      .where(eq(properties.status, "ACTIVE"));

    const states = stateResults
      .map((item) => item.state)
      .filter((state): state is string => Boolean(state))
      .sort();

    return c.json(
      {
        success: true,
        message: "Active properties fetched successfully",
        data: propertiesList,
        filters: {
          states,
        },
      },
      200,
    );
  } catch (error) {
    console.error("GET ALL ACTIVE PROPERTIES ERROR:", error);

    return c.json(
      {
        success: false,
        message: "Failed to fetch active properties",
        error: "INTERNAL_SERVER_ERROR",
        data: null,
        filters: {
          states: [],
        },
      },
      500,
    );
  }
};
