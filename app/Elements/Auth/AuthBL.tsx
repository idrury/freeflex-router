import supabase from "@supabase/supabase-js";
import type {
  EncrypedToken,
  FFAccessToken,
  FFProfile,
  FFProfileIntegrations,
  FFRole,
} from "../../assets/Types";
import {
  insertError,
  updateProfileAttribute,
  updateUserProfile,
} from "../../Functions/DBAccess";
import { DateTime } from "luxon";
import { refreshGoogleSession } from "../GoogleCalendar/GoogleCalendarBL";

/********************************************
 * Update local storage default role and color
 * settings for a user
 * @param role The role of the user
 */
export function setUserDefaults(role: FFRole, page?: Document) {
  // Change Colors for admin
  if (role == "admin") {
    try {
      page?.querySelector(":root")
        /*@ts-ignore*/
        ?.style.setProperty("--primaryColor", "var(--safeColor)");
    } catch (error) {
      console.error("Error updating style");
    }
  } else {
    page?.querySelector(":root")
      /*@ts-ignore*/
      ?.style.setProperty(
        "--primaryColor",
        localStorage.getItem("accentColor")
      );
  }
}

/******************************************
 * Update a user's name and email settings
 * @param profile The profile settings
 */
export async function handleUserProfileUpdate(
  profile: FFProfile | undefined
) {
  try {
    if (!profile) {
      throw await insertError(
        "Could not get the session",
        "onNewFeaturesRead",
        {}
      );
    }
    //if(process.env.NODE_ENV != "development")
    await updateUserProfile(
      profile.id,
      profile.first_name || null,
      profile.last_name || null,
      profile.allow_email,
      true
    );
  } catch (error) {
    await insertError(
      "Updating new features to read failed for an unknown reason",
      "onNewFeaturesRead",
      {}
    );
  }
}

/***************************************
 * Update the browser default colors
 * @param lightMode true if light mode or false for dark mode
 */
export function changeDefaultColors(lightMode: boolean, page?: Document) {
  const root = page?.querySelector(":root");

  localStorage.setItem("isLight", `${lightMode}`);

  /*@ts-ignore*/
  root?.style.setProperty(
    "background",
    lightMode == true ? "#eeeeee" : "#111111"
  );
  /*@ts-ignore*/
  root?.style.setProperty(
    "color-scheme",
    lightMode == true ? "light" : "dark"
  );
}

export function setAccentColor(hex: string) {
  if (!hex) return;
  /*@ts-ignore*/
  root.style.setProperty("--primaryColor", hex);
}

/**************************************
 * Save a provider refresh token to the DB
 */
export async function setProviderRefreshToken(
  session: supabase.Session | null
) {
  if (!session || !session.provider_refresh_token) return;

  try {
    const encryptedToken = await encryptRefreshToken(
      session.provider_refresh_token
    );

    // Set the refresh token
    await updateProfileAttribute(
      session.user.id,
      "provider_refresh_token",
      encryptedToken
    );
  } catch (error) {
    await insertError(
      error,
      "authBL:setProviderRefreshToken",
      session.user.id
    );
  }
}

/**************************************
 * Save an access token to the DB
 */
export async function setProviderAccessToken(
  session: supabase.Session | null
) {
  if (!session || !session.provider_token) return;

  try {
    // Set the refresh token
    await updateProfileAttribute(
      session.user.id,
      "google_access_token",
      {
        token_id: session.provider_token,
        expiry_date: DateTime.now().plus({ minutes: 20 }).toISO(),
      }
    );
  } catch (error) {
    await insertError(
      error,
      "authBL:setProviderAccessToken",
      session.user.id
    );
  }
}

/*****************************************
 * Refresh the google session if it is within
 * a certain period of the expiry time
 * @param profile The profile to check
 * @param secondsThreshold Refresh if there are this many or less seconds till expiry
 * @returns The new access token or null
 */
export async function maybeRefreshGoogleSession(
  profile: FFProfile,
  secondsThreshold: number
): Promise<FFAccessToken | null> {
  if (!profile.google_access_token) return null;

  // Refresh the session if remaining ttl is under the threshold
  if (
    DateTime.fromJSDate(
      new Date(profile?.google_access_token?.expiry_date)
    )
      .diff(DateTime.now())
      .as("seconds") < secondsThreshold
  ) {
    try {
      return await refreshGoogleSession(profile);
    } catch (error) {
      throw error;
    }
  }

  return null;
}

/*************************************************
 * Remove a provider refresh token from the database
 * @TODO Implement this
 * @param integrations
 */
export async function unlinkGoogle(
  session: supabase.Session,
  integrations: FFProfileIntegrations | undefined
) {
  throw { code: 0, message: "function not implmeneted" };
}

/**
 * Generate a cryptographically secure IV array
 * @param length How many bytes?
 * @returns An Int32Array of specified length
 */
function generateIV(length: number): Uint8Array {
  // Create an Int32Array view on the same underlying ArrayBuffer.
  // This allows you to interpret the random bytes as 32-bit integers.
  const randomBytes = new Uint8Array(length * 4);
  crypto.getRandomValues(randomBytes);

  return new Uint8Array(randomBytes.buffer);
}

/***********************************************
 * Encrypt a google refresh token
 * @param token The token to encrypt
 * @throws Error if encryption fails
 */
async function encryptRefreshToken(
  token: string,
  theWindow: Window
): Promise<EncrypedToken> {
  const Encoder = new TextEncoder();
  const IV = generateIV(128);
  const GCM: AesGcmParams = { iv: IV, name: "AES-GCM" };
  const encodedToken = Encoder.encode(token);
  /* @ts-ignore */
  const rawKey = Encoder.encode(import.meta.env.VITE_CRYPTO_KEY);

  // Create the key
  const key = await theWindow.crypto.subtle.importKey(
    "raw",
    rawKey,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );

  // Encrypt the text
  let encrypedText = await theWindow.crypto.subtle.encrypt(
    GCM,
    key,
    encodedToken
  );

  return {
    key: btoa(String.fromCharCode.apply(null, new Uint8Array(IV))),
    value: btoa(
      String.fromCharCode.apply(null, new Uint8Array(encrypedText))
    ),
  };
}

/********************************************
 * Decrypt a token and return the
 * @param token The token in base 64 format
 */
export async function decryptRefreshToken(
  token: EncrypedToken,
  theWindow: Window
): Promise<string> {
  const Encoder = new TextEncoder();
  /* @ts-ignore */
  const rawKey = Encoder.encode(import.meta.env.VITE_CRYPTO_KEY);
  const decodedIV = new Uint8Array(
    atob(token.key)
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
  const encodedValue = new Uint8Array(
    atob(token.value)
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
  const GCM: AesGcmParams = { iv: decodedIV, name: "AES-GCM" };

  // Create the key
  const key = await theWindow.crypto.subtle.importKey(
    "raw",
    rawKey,
    "AES-GCM",
    true,
    ["decrypt"]
  );

  const decryptedToken = await theWindow.crypto.subtle.decrypt(
    GCM,
    key,
    encodedValue
  );

  return new TextDecoder().decode(decryptedToken);
}

/**************************************************
 * Update the user's integration settings
 * @param profile The user profile
 * @param settings The new settings object
 */
export async function updateProfileIntegrationSettings(
  profile: FFProfile,
  settings: FFProfileIntegrations
) {
  try {
    await updateProfileAttribute(
      profile.id,
      "integration_settings",
      settings
    );
  } catch (error) {
    await insertError(
      "could not set integration settings",
      "AuthBL:updateProfileIntegratoinSettings",
      { settings }
    );
  }
}
