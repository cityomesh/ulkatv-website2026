import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export const runtime = "nodejs";

// ======================================================
// ULKA API URLS
// ======================================================

const LOGIN_URL =
  "https://partners.ulka.tv/api/railtel.php/v1/user/login?vr=railtel1.1";

const BOUQUET_URL =
  "https://partners.ulka.tv/api/railtel.php/v1/operator-bouque";

// ======================================================
// CACHE SETTINGS
// ======================================================

const TOKEN_TTL = 10 * 60 * 1000;
// 10 minutes

const DATA_TTL = 5 * 60 * 1000;
// 5 minutes

// ======================================================
// API TYPES
// ======================================================

interface UlkaApiObject {
  [key: string]: unknown;
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

interface DataCache {
  data: unknown;
  expiresAt: number;
}

interface BouquetFetchResult {
  unauthorized: boolean;
  data: unknown;
}

// ======================================================
// GLOBAL CACHE
// ======================================================
//
// This cache survives between requests while the same
// Node.js process is running.
// ======================================================

declare global {
  // eslint-disable-next-line no-var
  var __ulkaBouquetTokenCache:
    | TokenCache
    | undefined;

  // eslint-disable-next-line no-var
  var __ulkaBouquetDataCache:
    | DataCache
    | undefined;
}

// ======================================================
// TYPE HELPER
// ======================================================

/**
 * Check whether unknown value is an object.
 */
const isObject = (
  value: unknown
): value is UlkaApiObject => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};

// ======================================================
// GET PROPERTY SAFELY
// ======================================================

const getProperty = (
  value: unknown,
  key: string
): unknown => {
  if (!isObject(value)) {
    return undefined;
  }

  return value[key];
};

// ======================================================
// GET STRING PROPERTY SAFELY
// ======================================================

const getStringProperty = (
  value: unknown,
  key: string
): string | undefined => {
  const property =
    getProperty(
      value,
      key
    );

  if (
    typeof property ===
    "string"
  ) {
    return property;
  }

  return undefined;
};

// ======================================================
// GET API MESSAGE
// ======================================================

const getApiMessage = (
  value: unknown
): string | undefined => {
  return getStringProperty(
    value,
    "message"
  );
};

// ======================================================
// GET API DATA
// ======================================================

const getApiData = (
  value: unknown
): unknown => {
  return getProperty(
    value,
    "data"
  );
};

// ======================================================
// GET ULKA TOKEN
// ======================================================

const getUlkaToken =
  async (): Promise<string> => {
    const now =
      Date.now();

    // ==================================================
    // CHECK TOKEN CACHE
    // ==================================================

    const cachedToken =
      globalThis
        .__ulkaBouquetTokenCache;

    if (
      cachedToken &&
      cachedToken.expiresAt >
        now
    ) {
      console.log(
        "Using cached ULKA token..."
      );

      return cachedToken.token;
    }

    // ==================================================
    // TOKEN NOT AVAILABLE
    // ==================================================

    console.log(
      "ULKA token cache expired. Logging in..."
    );

    // ==================================================
    // ENVIRONMENT VARIABLES
    // ==================================================

    const username =
      process.env
        .ULKA_USERNAME;

    const password =
      process.env
        .ULKA_PASSWORD;

    if (
      !username ||
      !password
    ) {
      throw new Error(
        "ULKA_USERNAME or ULKA_PASSWORD is not configured."
      );
    }

    // ==================================================
    // ULKA LOGIN
    // ==================================================

    const loginResponse =
      await fetch(
        LOGIN_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            LoginForm: {
              username,
              password,
            },
          }),

          // Do not cache login request
          cache: "no-store",
        }
      );

    // ==================================================
    // READ LOGIN RESPONSE
    // ==================================================

    let loginData: unknown;

    try {
      loginData =
        await loginResponse.json();
    } catch {
      throw new Error(
        "ULKA login returned invalid JSON."
      );
    }

    console.log(
      "ULKA login status:",
      loginResponse.status
    );

    // ==================================================
    // CHECK LOGIN SUCCESS
    // ==================================================

    const loginSuccess =
      getProperty(
        loginData,
        "success"
      );

    if (
      !loginResponse.ok ||
      loginSuccess !== true
    ) {
      console.error(
        "ULKA login failed:",
        loginData
      );

      const message =
        getApiMessage(
          loginData
        );

      throw new Error(
        message ||
          `ULKA login failed (${loginResponse.status})`
      );
    }

    // ==================================================
    // EXTRACT TOKEN
    // ==================================================

    let token:
      | string
      | undefined;

    // --------------------------------------------------
    // Possible response:
    //
    // {
    //   access_token: "..."
    // }
    // --------------------------------------------------

    token =
      getStringProperty(
        loginData,
        "access_token"
      );

    // --------------------------------------------------
    // Possible response:
    //
    // {
    //   token: "..."
    // }
    // --------------------------------------------------

    if (!token) {
      token =
        getStringProperty(
          loginData,
          "token"
        );
    }

    // --------------------------------------------------
    // Possible response:
    //
    // {
    //   data: {
    //     access_token: "..."
    //   }
    // }
    // --------------------------------------------------

    const nestedLoginData =
      getApiData(
        loginData
      );

    if (!token) {
      token =
        getStringProperty(
          nestedLoginData,
          "access_token"
        );
    }

    // --------------------------------------------------
    // Possible response:
    //
    // {
    //   data: {
    //     token: "..."
    //   }
    // }
    // --------------------------------------------------

    if (!token) {
      token =
        getStringProperty(
          nestedLoginData,
          "token"
        );
    }

    // ==================================================
    // TOKEN VALIDATION
    // ==================================================

    if (!token) {
      console.error(
        "ULKA login response:",
        loginData
      );

      throw new Error(
        "ULKA login succeeded but no access token was returned."
      );
    }

    // ==================================================
    // SAVE TOKEN IN CACHE
    // ==================================================

    globalThis
      .__ulkaBouquetTokenCache = {
        token,

        expiresAt:
          Date.now() +
          TOKEN_TTL,
      };

    console.log(
      "ULKA token cached for 10 minutes."
    );

    return token;
  };

// ======================================================
// FETCH BOUQUETS
// ======================================================

const fetchBouquets =
  async (
    token: string
  ): Promise<BouquetFetchResult> => {
    // ==================================================
    // CREATE URL
    // ==================================================

    const url =
      new URL(
        BOUQUET_URL
      );

    // ==================================================
    // QUERY PARAMETERS
    // ==================================================

    url.searchParams.set(
      "expand",
      "boxtype_lbl,type_lbl,status_lbl,created_by_lbl"
    );

    url.searchParams.set(
      "filter[operator_id]",
      "4"
    );

    url.searchParams.set(
      "vr",
      "railtel1.1"
    );

    console.log(
      "Calling ULKA bouquet API..."
    );

    // ==================================================
    // REQUEST
    // ==================================================

    const response =
      await fetch(
        url.toString(),
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          // Do not cache external API request
          cache: "no-store",
        }
      );

    // ==================================================
    // READ RESPONSE
    // ==================================================

    let data: unknown;

    try {
      data =
        await response.json();
    } catch {
      throw new Error(
        "ULKA bouquet API returned invalid JSON."
      );
    }

    console.log(
      "ULKA bouquet API status:",
      response.status
    );

    // ==================================================
    // TOKEN EXPIRED
    // ==================================================

    if (
      response.status ===
        401 ||
      response.status ===
        403
    ) {
      return {
        unauthorized: true,

        data,
      };
    }

    // ==================================================
    // API ERROR
    // ==================================================

    if (
      !response.ok
    ) {
      const message =
        getApiMessage(
          data
        );

      throw new Error(
        message ||
          `ULKA bouquet API failed (${response.status})`
      );
    }

    // ==================================================
    // SUCCESS
    // ==================================================

    return {
      unauthorized: false,

      data,
    };
  };

// ======================================================
// GET API ROUTE
// ======================================================

export async function GET() {
  const startedAt =
    Date.now();

  console.log(
    "========================================"
  );

  console.log(
    "ULKA BOUQUET API START"
  );

  console.log(
    "========================================"
  );

  try {
    // ==================================================
    // CHECK BOUQUET DATA CACHE
    // ==================================================

    const now =
      Date.now();

    const cachedData =
      globalThis
        .__ulkaBouquetDataCache;

    if (
      cachedData &&
      cachedData.expiresAt >
        now
    ) {
      console.log(
        "Returning cached ULKA bouquet data."
      );

      console.log(
        `Cache response time: ${
          Date.now() -
          startedAt
        }ms`
      );

      return NextResponse.json(
        {
          success: true,

          status: 200,

          cached: true,

          data:
            cachedData.data,
        },
        {
          status: 200,
        }
      );
    }

    // ==================================================
    // GET ULKA TOKEN
    // ==================================================

    let token =
      await getUlkaToken();

    // ==================================================
    // FETCH BOUQUETS
    // ==================================================

    let result =
      await fetchBouquets(
        token
      );

    // ==================================================
    // TOKEN EXPIRED
    // ==================================================

    if (
      result.unauthorized
    ) {
      console.log(
        "ULKA token rejected. Refreshing token..."
      );

      // ----------------------------------------------
      // CLEAR OLD TOKEN
      // ----------------------------------------------

      globalThis
        .__ulkaBouquetTokenCache =
        undefined;

      // ----------------------------------------------
      // LOGIN AGAIN
      // ----------------------------------------------

      token =
        await getUlkaToken();

      // ----------------------------------------------
      // RETRY ONCE
      // ----------------------------------------------

      result =
        await fetchBouquets(
          token
        );
    }

    // ==================================================
    // SECOND AUTH FAILURE
    // ==================================================

    if (
      result.unauthorized
    ) {
      throw new Error(
        "ULKA authentication failed while fetching bouquets."
      );
    }

    // ==================================================
    // GET RESPONSE DATA
    // ==================================================

    const bouquetData =
      result.data;

    // ==================================================
    // EXTRACT ACTUAL BOUQUET ARRAY
    // ==================================================

    let finalData:
      unknown;

    // --------------------------------------------------
    // CASE 1
    //
    // API response itself is an array
    //
    // [
    //   {...},
    //   {...}
    // ]
    // --------------------------------------------------

    if (
      Array.isArray(
        bouquetData
      )
    ) {
      finalData =
        bouquetData;
    }

    // --------------------------------------------------
    // CASE 2
    //
    // API response:
    //
    // {
    //   data: [...]
    // }
    // --------------------------------------------------

    else {
      const nestedData =
        getApiData(
          bouquetData
        );

      if (
        Array.isArray(
          nestedData
        )
      ) {
        finalData =
          nestedData;
      } else {
        finalData =
          bouquetData;
      }
    }

    // ==================================================
    // CACHE BOUQUET DATA
    // ==================================================

    globalThis
      .__ulkaBouquetDataCache = {
        data:
          finalData,

        expiresAt:
          Date.now() +
          DATA_TTL,
      };

    console.log(
      "ULKA bouquet data cached for 5 minutes."
    );

    // ==================================================
    // PERFORMANCE LOG
    // ==================================================

    console.log(
      `Total bouquet API time: ${
        Date.now() -
        startedAt
      }ms`
    );

    console.log(
      "========================================"
    );

    console.log(
      "ULKA BOUQUET API END"
    );

    console.log(
      "========================================"
    );

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return NextResponse.json(
      {
        success: true,

        status: 200,

        cached: false,

        data:
          finalData,
      },
      {
        status: 200,
      }
    );
  } catch (
    error: unknown
  ) {
    // ==================================================
    // ERROR LOG
    // ==================================================

    console.error(
      "Bouquet API Error:",
      error
    );

    console.log(
      `Total failed request time: ${
        Date.now() -
        startedAt
      }ms`
    );

    // ==================================================
    // SAFE ERROR MESSAGE
    // ==================================================

    let message =
      "Failed to fetch ULKA bouquet data.";

    if (
      error instanceof Error
    ) {
      message =
        error.message;
    } else if (
      typeof error ===
      "string"
    ) {
      message =
        error;
    }

    // ==================================================
    // ERROR RESPONSE
    // ==================================================

    return NextResponse.json(
      {
        success: false,

        status: 500,

        message,
      },
      {
        status: 500,
      }
    );
  }
}
