// //channels//route.ts
// import {
//   NextRequest,
//   NextResponse,
// } from "next/server";

// export const dynamic =
//   "force-dynamic";

// export const revalidate = 0;

// export const runtime =
//   "nodejs";

// // ======================================================
// // ULKA CHANNEL API
// // ======================================================

// const ULKA_CHANNEL_URL =
//   "https://partners.ulka.tv/api/index.php/v1/channel";

// // ======================================================
// // CACHE SETTINGS
// // ======================================================

// const CACHE_TTL =
//   5 * 60 * 1000;
// // 5 minutes

// // ======================================================
// // TYPES
// // ======================================================

// interface Channel {
//   id?: number;
//   name?: string;
//   [key: string]: unknown;
// }

// interface ChannelApiResponse {
//   success?: boolean;
//   message?: string;
//   data?: unknown;

//   [key: string]: unknown;
// }

// interface ChannelCache {
//   data: Channel[];
//   timestamp: number;
// }

// interface ChannelPageResult {
//   channels: Channel[];
//   pageCount: number;
//   totalCount: number;
// }

// // ======================================================
// // GLOBAL CACHE
// // ======================================================
// //
// // Cache remains available while the same Node.js
// // process is running.
// // ======================================================

// const globalForUlka =
//   globalThis as typeof globalThis & {
//     __ulkaChannelCache?:
//       | ChannelCache
//       | undefined;
//   };

// // ======================================================
// // SAFE JSON PARSER
// // ======================================================

// function parseJson<T>(
//   text: string
// ): T {
//   try {
//     return JSON.parse(
//       text
//     ) as T;
//   } catch {
//     throw new Error(
//       "ULKA channel API returned invalid JSON"
//     );
//   }
// }

// // ======================================================
// // GET CHANNELS
// // ======================================================

// export async function GET(
//   request: NextRequest
// ) {
//   try {
//     console.log(
//       "========================================"
//     );

//     console.log(
//       "ULKA CHANNEL API START"
//     );

//     console.log(
//       "========================================"
//     );

//     // ==================================================
//     // CHECK CACHE FIRST
//     // ==================================================

//     const cached =
//       globalForUlka
//         .__ulkaChannelCache;

//     if (
//       cached &&
//       Date.now() -
//         cached.timestamp <
//         CACHE_TTL
//     ) {
//       console.log(
//         "Returning channels from CACHE"
//       );

//       console.log(
//         `Cached channels: ${cached.data.length}`
//       );

//       return NextResponse.json(
//         {
//           success: true,

//           status: 200,

//           count:
//             cached.data.length,

//           data:
//             cached.data,

//           cached: true,
//         },
//         {
//           status: 200,

//           headers: {
//             "Cache-Control":
//               "private, max-age=300",
//           },
//         }
//       );
//     }

//     // ==================================================
//     // GET AUTHORIZATION HEADER
//     // ==================================================

//     const authorization =
//       request.headers.get(
//         "authorization"
//       );

//     // ==================================================
//     // CHECK TOKEN
//     // ==================================================

//     if (!authorization) {
//       console.error(
//         "Authorization header missing"
//       );

//       return NextResponse.json(
//         {
//           success: false,

//           status: 401,

//           message:
//             "ULKA access token is missing. Please login again.",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     console.log(
//       "Authorization received: true"
//     );

//     // ==================================================
//     // CREATE CHANNEL URL
//     // ==================================================

//     const createUrl = (
//       page: number
//     ): string => {
//       const params =
//         new URLSearchParams();

//       // ------------------------------------------------
//       // Expand fields
//       // ------------------------------------------------

//       params.set(
//         "expand",
//         "created_by_lbl,broadcaster_lbl,genre_lbl,language_lbl,channel_type_lbl,isAlacarte_lbl,status_lbl,isFta_lbl,isNCF_lbl"
//       );

//       // ------------------------------------------------
//       // Sort
//       // ------------------------------------------------

//       params.set(
//         "sort",
//         "name"
//       );

//       // ------------------------------------------------
//       // Page
//       // ------------------------------------------------

//       params.set(
//         "page",
//         String(page)
//       );

//       // ------------------------------------------------
//       // Items per page
//       // ------------------------------------------------

//       params.set(
//         "per-page",
//         "100"
//       );

//       // ------------------------------------------------
//       // Version
//       // ------------------------------------------------

//       params.set(
//         "vr",
//         "web1.0"
//       );

//       return (
//         `${ULKA_CHANNEL_URL}?` +
//         params.toString()
//       );
//     };

//     // ==================================================
//     // FETCH ONE PAGE
//     // ==================================================

//     const fetchPage =
//       async (
//         page: number
//       ): Promise<ChannelPageResult> => {
//         const url =
//           createUrl(
//             page
//           );

//         console.log(
//           `Fetching channel page ${page}`
//         );

//         // ----------------------------------------------
//         // API REQUEST
//         // ----------------------------------------------

//         const response =
//           await fetch(
//             url,
//             {
//               method: "GET",

//               headers: {
//                 Accept:
//                   "application/json",

//                 Authorization:
//                   authorization,

//                 "User-Agent":
//                   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",

//                 Referer:
//                   "https://partners.ulka.tv/",

//                 Origin:
//                   "https://partners.ulka.tv",
//               },

//               // Important:
//               // Do not cache external ULKA request.
//               cache: "no-store",
//             }
//           );

//         // ----------------------------------------------
//         // READ RESPONSE
//         // ----------------------------------------------

//         const responseText =
//           await response.text();

//         console.log(
//           `Channel page ${page} status:`,
//           response.status
//         );

//         // ==================================================
//         // ERROR RESPONSE
//         // ==================================================

//         if (!response.ok) {
//           let errorMessage =
//             responseText;

//           try {
//             const errorData =
//               parseJson<ChannelApiResponse>(
//                 responseText
//               );

//             if (
//               typeof errorData.message ===
//               "string"
//             ) {
//               errorMessage =
//                 errorData.message;
//             }
//           } catch {
//             // Keep original response text
//           }

//           throw new Error(
//             `ULKA channel page ${page} failed with status ${response.status}: ${errorMessage}`
//           );
//         }

//         // ==================================================
//         // PARSE JSON
//         // ==================================================

//         const result =
//           parseJson<ChannelApiResponse>(
//             responseText
//           );

//         // ==================================================
//         // API SUCCESS CHECK
//         // ==================================================

//         if (
//           result.success !== true
//         ) {
//           throw new Error(
//             `ULKA channel page ${page} returned an API error`
//           );
//         }

//         // ==================================================
//         // CHANNEL DATA
//         // ==================================================

//         const channels: Channel[] =
//           Array.isArray(
//             result.data
//           )
//             ? result.data.filter(
//                 (
//                   item: unknown
//                 ): item is Channel =>
//                   typeof item ===
//                     "object" &&
//                   item !== null &&
//                   !Array.isArray(
//                     item
//                   )
//               )
//             : [];

//         // ==================================================
//         // PAGINATION
//         // ==================================================

//         const pageCountHeader =
//           response.headers.get(
//             "X-Pagination-Page-Count"
//           );

//         const totalCountHeader =
//           response.headers.get(
//             "X-Pagination-Total-Count"
//           );

//         const pageCount =
//           Number(
//             pageCountHeader ||
//               0
//           );

//         const totalCount =
//           Number(
//             totalCountHeader ||
//               0
//           );

//         console.log(
//           `Page ${page}: ${channels.length} channels`
//         );

//         console.log(
//           `Page count: ${pageCount}`
//         );

//         console.log(
//           `Total count: ${totalCount}`
//         );

//         return {
//           channels,

//           pageCount,

//           totalCount,
//         };
//       };

//     // ==================================================
//     // FETCH FIRST PAGE
//     // ==================================================

//     const firstPage =
//       await fetchPage(
//         1
//       );

//     // ==================================================
//     // STORE FIRST PAGE
//     // ==================================================

//     const allChannels:
//       Channel[] = [
//         ...firstPage.channels,
//       ];

//     // ==================================================
//     // DETERMINE TOTAL PAGES
//     // ==================================================

//     let pageCount =
//       firstPage.pageCount;

//     // --------------------------------------------------
//     // If ULKA doesn't provide pagination header
//     // --------------------------------------------------

//     if (
//       pageCount <= 0
//     ) {
//       // If less than 100 channels returned,
//       // there is probably only one page.
//       if (
//         firstPage.channels.length <
//         100
//       ) {
//         pageCount = 1;
//       } else {
//         // Safety fallback.
//         pageCount = 100;
//       }
//     }

//     console.log(
//       "TOTAL CHANNEL PAGES:",
//       pageCount
//     );

//     // ==================================================
//     // FETCH REMAINING PAGES IN PARALLEL
//     // ==================================================

//     if (
//       pageCount > 1
//     ) {
//       const remainingPages =
//         Array.from(
//           {
//             length:
//               pageCount -
//               1,
//           },
//           (
//             _,
//             index
//           ) =>
//             index + 2
//         );

//       console.log(
//         "Fetching remaining pages in PARALLEL:"
//       );

//       console.log(
//         remainingPages
//       );

//       // ------------------------------------------------
//       // Parallel requests
//       // ------------------------------------------------

//       const results =
//         await Promise.all(
//           remainingPages.map(
//             (
//               page
//             ) =>
//               fetchPage(
//                 page
//               )
//           )
//         );

//       // ------------------------------------------------
//       // Add all pages
//       // ------------------------------------------------

//       for (
//         const result of
//           results
//       ) {
//         allChannels.push(
//           ...result.channels
//         );
//       }
//     }

//     // ==================================================
//     // REMOVE DUPLICATES
//     // ==================================================

//     const uniqueChannels =
//       Array.from(
//         new Map(
//           allChannels
//             .filter(
//               (
//                 channel
//               ) =>
//                 channel.id !==
//                 undefined
//             )
//             .map(
//               (
//                 channel
//               ) => [
//                 channel.id,
//                 channel,
//               ]
//             )
//         ).values()
//       );

//     // ==================================================
//     // SORT CHANNELS BY NAME
//     // ==================================================

//     uniqueChannels.sort(
//       (
//         a,
//         b
//       ) =>
//         String(
//           a.name ||
//             ""
//         ).localeCompare(
//           String(
//             b.name ||
//               ""
//           )
//         )
//     );

//     // ==================================================
//     // LOG RESULTS
//     // ==================================================

//     console.log(
//       "========================================"
//     );

//     console.log(
//       "TOTAL CHANNELS:",
//       uniqueChannels.length
//     );

//     console.log(
//       "========================================"
//     );

//     // ==================================================
//     // SAVE CACHE
//     // ==================================================

//     globalForUlka
//       .__ulkaChannelCache = {
//         data:
//           uniqueChannels,

//         timestamp:
//           Date.now(),
//       };

//     console.log(
//       "ULKA channel data cached for 5 minutes."
//     );

//     // ==================================================
//     // RETURN SUCCESS
//     // ==================================================

//     return NextResponse.json(
//       {
//         success: true,

//         status: 200,

//         count:
//           uniqueChannels.length,

//         data:
//           uniqueChannels,

//         cached: false,
//       },
//       {
//         status: 200,

//         headers: {
//           "Cache-Control":
//             "private, max-age=300",
//         },
//       }
//     );
//   } catch (
//     error: unknown
//   ) {
//     // ==================================================
//     // ERROR LOG
//     // ==================================================

//     console.error(
//       "========================================"
//     );

//     console.error(
//       "ULKA Channel Server Error:",
//       error
//     );

//     console.error(
//       "========================================"
//     );

//     // ==================================================
//     // ERROR MESSAGE
//     // ==================================================

//     const message =
//       error instanceof Error
//         ? error.message
//         : "Failed to fetch ULKA channels";

//     // ==================================================
//     // ERROR RESPONSE
//     // ==================================================

//     return NextResponse.json(
//       {
//         success: false,

//         status: 500,

//         message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }



import {
  NextRequest,
  NextResponse,
} from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// ======================================================
// ✅ ULKA CHANNEL API (railtel — same as login)
// ======================================================
// Login endpoint:
//   https://partners.ulka.tv/api/railtel.php/v1/user/login?vr=railtel1.1
//
// So channels kuda same base + version use cheyyali,
// lekapothe token reject avutundi (403 Forbidden).
// ======================================================

const ULKA_CHANNEL_URL =
  "https://partners.ulka.tv/api/railtel.php/v1/channel";

// ======================================================
// CACHE SETTINGS
// ======================================================

const CACHE_TTL = 5 * 60 * 1000;

// ======================================================
// TYPES
// ======================================================

interface Channel {
  id?: number;
  name?: string;
  [key: string]: unknown;
}

interface ChannelApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

interface ChannelCache {
  data: Channel[];
  timestamp: number;
}

interface ChannelPageResult {
  channels: Channel[];
  pageCount: number;
  totalCount: number;
}

// ======================================================
// GLOBAL CACHE
// ======================================================

const globalForUlka = globalThis as typeof globalThis & {
  __ulkaChannelCacheV5?: ChannelCache | undefined;
};

// ======================================================
// SAFE JSON PARSER
// ======================================================

function parseJson<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("ULKA channel API returned invalid JSON");
  }
}

// ======================================================
// GET CHANNELS
// ======================================================

export async function GET(request: NextRequest) {
  try {
    console.log("========================================");
    console.log("ULKA CHANNEL API START (railtel)");
    console.log("========================================");

    // ==================================================
    // CHECK CACHE
    // ==================================================

    const cached = globalForUlka.__ulkaChannelCacheV5;

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("Returning channels from CACHE");
      console.log(`Cached channels: ${cached.data.length}`);

      return NextResponse.json(
        {
          success: true,
          status: 200,
          count: cached.data.length,
          data: cached.data,
          cached: true,
        },
        {
          status: 200,
          headers: { "Cache-Control": "private, max-age=300" },
        }
      );
    }

    // ==================================================
    // AUTHORIZATION
    // ==================================================

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      console.error("Authorization header missing");

      return NextResponse.json(
        {
          success: false,
          status: 401,
          message:
            "ULKA access token is missing. Please login again.",
        },
        { status: 401 }
      );
    }

    console.log("Authorization received: true");

    // ==================================================
    // ✅ CREATE URL (railtel.php + railtel1.1)
    // ==================================================

    const createUrl = (page: number): string => {
      const params = new URLSearchParams();

      params.set(
        "expand",
        "created_by_lbl,broadcaster_lbl,genre_lbl,language_lbl,channel_type_lbl,isAlacarte_lbl,status_lbl,isFta_lbl,isNCF_lbl"
      );

      params.set("sort", "name");
      params.set("page", String(page));
      params.set("per-page", "100");

      // ✅ SAME version as login
      params.set("vr", "railtel1.1");

      return `${ULKA_CHANNEL_URL}?${params.toString()}`;
    };

    // ==================================================
    // FETCH ONE PAGE
    // ==================================================

    const fetchPage = async (
      page: number
    ): Promise<ChannelPageResult> => {
      const url = createUrl(page);

      console.log(`Fetching channel page ${page}`);
      console.log(url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: authorization,
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
          Referer: "https://partners.ulka.tv/",
          Origin: "https://partners.ulka.tv",
        },
        cache: "no-store",
      });

      const responseText = await response.text();

      console.log(`Channel page ${page} status:`, response.status);

      if (!response.ok) {
        let errorMessage = responseText;

        try {
          const errorData = parseJson<ChannelApiResponse>(responseText);
          if (typeof errorData.message === "string") {
            errorMessage = errorData.message;
          }
        } catch {
          // Keep original
        }

        throw new Error(
          `ULKA channel page ${page} failed with status ${response.status}: ${errorMessage}`
        );
      }

      const result = parseJson<ChannelApiResponse>(responseText);

      if (result.success !== true) {
        throw new Error(
          `ULKA channel page ${page} returned an API error`
        );
      }

      const channels: Channel[] = Array.isArray(result.data)
        ? result.data.filter(
            (item: unknown): item is Channel =>
              typeof item === "object" &&
              item !== null &&
              !Array.isArray(item)
          )
        : [];

      const pageCountHeader = response.headers.get(
        "X-Pagination-Page-Count"
      );
      const totalCountHeader = response.headers.get(
        "X-Pagination-Total-Count"
      );

      const pageCount = Number(pageCountHeader || 0);
      const totalCount = Number(totalCountHeader || 0);

      console.log(`Page ${page}: ${channels.length} channels`);
      console.log(`Page count: ${pageCount}`);
      console.log(`Total: ${totalCount}`);

      return { channels, pageCount, totalCount };
    };

    // ==================================================
    // FIRST PAGE
    // ==================================================

    const firstPage = await fetchPage(1);
    const allChannels: Channel[] = [...firstPage.channels];

    // ==================================================
    // TOTAL PAGES
    // ==================================================

    let pageCount = firstPage.pageCount;

    if (pageCount <= 0) {
      pageCount = firstPage.channels.length < 100 ? 1 : 100;
    }

    console.log("TOTAL CHANNEL PAGES:", pageCount);

    // ==================================================
    // REMAINING PAGES (parallel)
    // ==================================================

    if (pageCount > 1) {
      const remainingPages = Array.from(
        { length: pageCount - 1 },
        (_, index) => index + 2
      );

      console.log("Fetching remaining pages:", remainingPages);

      const results = await Promise.all(
        remainingPages.map((page) => fetchPage(page))
      );

      for (const result of results) {
        allChannels.push(...result.channels);
      }
    }

    // ==================================================
    // DEDUPE
    // ==================================================

    const uniqueChannels = Array.from(
      new Map(
        allChannels
          .filter((channel) => channel.id !== undefined)
          .map((channel) => [channel.id, channel])
      ).values()
    );

    // ==================================================
    // SORT
    // ==================================================

    uniqueChannels.sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""))
    );

    console.log("========================================");
    console.log("TOTAL CHANNELS:", uniqueChannels.length);
    console.log("========================================");

    // ==================================================
    // SAVE CACHE
    // ==================================================

    globalForUlka.__ulkaChannelCacheV5 = {
      data: uniqueChannels,
      timestamp: Date.now(),
    };

    return NextResponse.json(
      {
        success: true,
        status: 200,
        count: uniqueChannels.length,
        data: uniqueChannels,
        cached: false,
      },
      {
        status: 200,
        headers: { "Cache-Control": "private, max-age=300" },
      }
    );
  } catch (error: unknown) {
    console.error("========================================");
    console.error("ULKA Channel Server Error:", error);
    console.error("========================================");

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch ULKA channels";

    return NextResponse.json(
      { success: false, status: 500, message },
      { status: 500 }
    );
  }
}
