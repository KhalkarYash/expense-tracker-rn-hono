import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const clerkKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  Constants.manifest?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  console.warn(
    "⚠️ Clerk publishableKey is missing. App may crash in production."
  );
  throw new Error(
    "CLERK_PUBLISHABLE_KEY is missing! Check your build environment."
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={clerkKey} tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
