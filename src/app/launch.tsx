import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function LaunchScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const availableHeight = height - insets.top - insets.bottom;
  const maxArtHeight = Math.min(
    availableHeight * 0.44,
    (width - 56) * (424 / 290)
  );
  const artHeight = Math.max(200, maxArtHeight);
  const fittedWidth = artHeight * (290 / 424);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/auth/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.hero}>
        <View
          style={[
            styles.art,
            { width: fittedWidth, height: artHeight },
          ]}
        >
          <View style={styles.shadow} />

          <Image
            source={require("@/assets/images/burger.jpg")}
            style={styles.burger}
            contentFit="contain"
          />

          <View style={styles.wordmark} pointerEvents="none">
            <Text
              style={[
                styles.word,
                styles.wordBurger,
                { fontSize: width * 0.095 },
              ]}
            >
              Burger
            </Text>

            <Text
              style={[
                styles.word,
                styles.wordBite,
                { fontSize: width * 0.095 },
              ]}
            >
              Bite
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1B1B1F",
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  art: {
    alignItems: "center",
    justifyContent: "center",
  },
  burger: {
    width: "100%",
    height: "100%",
  },
  shadow: {
    position: "absolute",
    bottom: "5%",
    width: "52%",
    height: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
  },
  wordmark: {
    position: "absolute",
    top: "30%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  word: {
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  wordBurger: {
    color: "#FF7A18",
  },
  wordBite: {
    color: "#FFFFFF",
  },
});