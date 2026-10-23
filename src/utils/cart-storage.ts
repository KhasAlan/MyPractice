
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "burger-cart";

export type CartItems = Record<number, number>;

export async function getCart(): Promise<CartItems> {
  try {
    const savedCart = await AsyncStorage.getItem(CART_KEY);

    if (!savedCart) {
      return {};
    }

    return JSON.parse(savedCart) as CartItems;
  } catch (error) {
    console.error("Failed to load cart:", error);
    return {};
  }
}

export async function saveCart(cart: CartItems): Promise<void> {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function addItemToCart(
  id: number,
  quantity: number
): Promise<CartItems> {
  const cart = await getCart();

  cart[id] = (cart[id] ?? 0) + quantity;

  await saveCart(cart);

  return cart;
}

export async function changeCartQuantity(
  id: number,
  quantity: number
): Promise<CartItems> {
  const cart = await getCart();

  if (quantity <= 0) {
    delete cart[id];
  } else {
    cart[id] = quantity;
  }

  await saveCart(cart);

  return cart;
}

export async function removeCartItem(id: number): Promise<CartItems> {
  const cart = await getCart();

  delete cart[id];

  await saveCart(cart);

  return cart;
}

export async function clearCart(): Promise<void> {
  await AsyncStorage.removeItem(CART_KEY);
}
