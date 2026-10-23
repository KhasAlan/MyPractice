import { burger } from "@/mock/burger";
import { BurgerType } from "@/types/burger-type";
import { addItemToCart } from "@/utils/cart-storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const BACKGROUND = "#242329";

export default function Index() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [quantity, setQuantity] = useState(1);
  const imageWidth = Math.min(width - 44, 420);

  const burgers = burger.find((burger: BurgerType) => burger.id === Number(id));

  if (!burgers) {
    return <Text>Burger not found</Text>;
  }

const inc = () => {
  setQuantity((prev) => prev + 1);
};

const dec = () => {
  setQuantity((prev) => Math.max(1, prev - 1));
};
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <Link href="/contact" asChild>
        <Pressable >
          <Text>Contact</Text>
        </Pressable>
      </Link>
      <View style={styles.hero}>
        <View style={styles.shadow} />
        <Image
          source={require("../../../../assets/images/burger.jpg")}
          style={{ width: imageWidth, height: imageWidth * 0.72 }}
          contentFit="contain"
        />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{burgers.title}</Text>
        <Text style={styles.description}>
          {burgers.description}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.purchaseRow}>
          <View style={styles.stepper}>
            <Pressable
              accessibilityLabel="Increase quantity"
              onPress={inc}
              style={styles.stepButton}
            >
              <Text style={styles.stepIcon}>+</Text>
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable
              accessibilityLabel="Decrease quantity"
              onPress={dec}
              style={styles.stepButton}
            >
              <Text style={styles.stepIcon}>−</Text>
            </Pressable>
          </View>

          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Total price</Text>
            <Text style ={styles.priceValue}>
              Rs {burgers.price * quantity}
            </Text>
          </View>
        </View>



<Pressable
  accessibilityRole="button"
  onPress={async () => {
    Alert.alert("TEST", "Button was pressed");

    try {
      const savedCart = await addItemToCart(
        burgers.id,
        quantity
      );

      console.log("SAVED CART:", savedCart);

      Alert.alert(
        "SUCCESS",
        `${burgers.title} × ${quantity} added to cart`,
        [
          {
            text: "Continue shopping",
            onPress: () => router.back(),
          },
          {
            text: "Open cart",
            onPress: () => router.push("/cart"),
          },
        ]
      );
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      Alert.alert("ERROR", String(error));
    }
  }}
  style={({ pressed }) => [
    pressed && styles.pressed,
  ]}
>
  <LinearGradient
    colors={["#F6B245", "#E4891E"]}
    start={{ x: 0, y: 0.5 }}
    end={{ x: 1, y: 0.5 }}
    style={styles.cartButton}
  >
    <Ionicons name="cart-outline" size={24} color="white" />
    <Text style={styles.cartLabel}>Add to cart</Text>
  </LinearGradient>
</Pressable>






      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingHorizontal: 22,
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  shadow: {
    position: "absolute",
    bottom: 28,
    width: "46%",
    height: 18,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
  },
  copy: {
    gap: 12,
    marginTop: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  description: {
    color: "#F3F3F3",
    fontSize: 16,
    lineHeight: 24,
  },
footer: {
  marginTop: 24,
  gap: 20,
  paddingBottom: 16,
},
  purchaseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#2E2D33",
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  stepButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#3A3940",
    alignItems: "center",
    justifyContent: "center",
  },
  stepIcon: {
    color: "#FFFFFF",
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "500",
  },
  quantity: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    minWidth: 14,
    textAlign: "center",
  },
  priceBlock: {
    alignItems: "flex-end",
  },
  priceLabel: {
    color: "#B5B5B8",
    fontSize: 13,
    marginBottom: 2,
  },
  priceValue: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  cartButton: {
    height: 58,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  cartLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});