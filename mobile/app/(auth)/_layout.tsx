import PageLoader from "@/components/PageLoader";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  console.log("AuthRoutesLayout:", { isLoaded, isSignedIn });

  if (!isLoaded) return <PageLoader />;

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
