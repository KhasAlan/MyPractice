
import { useCallback, useState } from "react";
import {View,Text,StyleSheet,Pressable,Image,ScrollView,Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getCart,
  changeCartQuantity,
  removeCartItem,
  clearCart,
  type CartItems,
} from "@/utils/cart-storage";
import { burger } from "@/mock/burger";
import { BurgerType } from "@/types/burger-type";
import { SafeAreaView } from "react-native-safe-area-context";

const BACKGROUND = "#242329";
const ORANGE = "#F6B245";

export default function CartScreen() {
  const [cart, setCart] = useState<CartItems>({});
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    try {
      const savedCart = await getCart();
      setCart(savedCart);
    } catch {
      Alert.alert("Error", "Could not load your cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  const updateQuantity = async (id: number, quantity: number) => {
    const updatedCart = await changeCartQuantity(id, quantity);
    setCart(updatedCart);
  };

  const deleteItem = async (id: number) => {
    const updatedCart = await removeCartItem(id);
    setCart(updatedCart);
  };

  const clearShoppingCart = () => {
    Alert.alert("Clear cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearCart();
          setCart({});
        },
      },
    ]);
  };

  const items = Object.entries(cart)
    .map(([id, quantity]) => ({
      item: burger.find(
        (b: BurgerType) => b.id === Number(id)
      ),
      quantity,
    }))
    .filter(
      (entry): entry is {
        item: BurgerType;
        quantity: number;
      } => Boolean(entry.item)
    );

  const total = items.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.message}>Loading cart...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Text style={styles.headerTitle}>My Cart</Text>

        {items.length > 0 ? (
          <Pressable onPress={clearShoppingCart}>
            <Ionicons name="trash-outline" size={23} color={ORANGE} />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="cart-outline"
            size={80}
            color="#77757F"
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDescription}>
            Add your favorite burgers to get started.
          </Text>

          <Pressable
            style={styles.shopButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.shopButtonText}>
              Explore menu
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            <Text style={styles.sectionTitle}>
              Your items ({items.reduce((sum, entry) => sum + entry.quantity, 0)})
            </Text>

            {items.map(({ item, quantity }) => (
              <View key={item.id} style={styles.card}>
                <Image
                  source={require("../../assets/images/burger.jpg")}
                  style={styles.burgerImage}
                  resizeMode="cover"
                />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.itemPrice}>
                    Rs {item.price}
                  </Text>

                  <View style={styles.itemBottom}>
                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() =>
                          updateQuantity(item.id, quantity - 1)
                        }
                        style={styles.stepButton}
                      >
                        <Text style={styles.stepText}>−</Text>
                      </Pressable>

                      <Text style={styles.quantity}>
                        {quantity}
                      </Text>

                      <Pressable
                        onPress={() =>
                          updateQuantity(item.id, quantity + 1)
                        }
                        style={styles.stepButton}
                      >
                        <Text style={styles.stepText}>+</Text>
                      </Pressable>
                    </View>

                    <Pressable
                      onPress={() => deleteItem(item.id)}
                      accessibilityLabel={`Remove ${item.title}`}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={21}
                        color="#FF7777"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.checkout}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>
                Rs {total}
              </Text>
            </View>

            <Pressable
              style={styles.checkoutButton}
              onPress={() =>
                Alert.alert(
                  "Checkout",
                  "Order checkout will be added next."
                )
              }
            >
              <Text style={styles.checkoutText}>
                Proceed to checkout
              </Text>
              <Ionicons
                name="arrow-forward"
                size={21}
                color="#242329"
              />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#35343B",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  message: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 30,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 70,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },
  emptyDescription: {
    color: "#AAA8B1",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 25,
  },
  shopButtonText: {
    color: BACKGROUND,
    fontSize: 16,
    fontWeight: "700",
  },
  list: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#302F36",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    gap: 14,
  },
  burgerImage: {
    width: 105,
    height: 110,
    borderRadius: 13,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  itemTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  itemPrice: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 5,
  },
  itemBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#424149",
    borderRadius: 20,
    padding: 4,
    gap: 12,
  },
  stepButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#55535D",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 23,
  },
  quantity: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    minWidth: 12,
    textAlign: "center",
  },
  checkout: {
    borderTopWidth: 1,
    borderTopColor: "#414047",
    paddingTop: 18,
    paddingBottom: 14,
    gap: 18,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#B5B5B8",
    fontSize: 17,
  },
  totalPrice: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
  },
  checkoutButton: {
    height: 56,
    borderRadius: 30,
    backgroundColor: ORANGE,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  checkoutText: {
    color: BACKGROUND,
    fontSize: 16,
    fontWeight: "800",
  },
});
