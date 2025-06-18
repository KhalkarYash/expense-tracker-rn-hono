import { COLORS } from "@/constants/Colors";
import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

const SafeScreen = ({ children }: Props) => {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: inset.top,
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
