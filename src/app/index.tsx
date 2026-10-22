
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {ActivityIndicator,Alert,ScrollView,StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categories, burger } from "@/mock/burger";
import BurgerCard, {
    BurgerCardProps,
} from "@/components/main/ui/burger-card";

const COLORS = {
    background: "#242329",
    card: "#2D2C32",
    border: "#76502E",
    orange: "#F7931E",
    red: "#E53945",
    white: "#FFFFFF",
    muted: "#AAA9B0",
    yellow: "#FFD426",
    button: "#543139",
};

type BurgerItem = BurgerCardProps & {
    title: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
};

const displayCategories = [
    { id: 1, title: "All" },
    { id: 2, title: "Classic" },
    { id: 3, title: "Gourmet" },
    { id: 4, title: "Vegetarian" },
];

const gourmetBurgers = [
    "Smoky Bacon Stack",
    "Truffle Bliss",
    "Mushroom Swiss",
    "Blue Cheese Crumble",
];

export default function Index() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<Record<number, number>>({});

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            try {
                const [loggedIn, storedUser] = await Promise.all([
                    AsyncStorage.getItem("isLoggedIn"),
                    AsyncStorage.getItem("data"),
                ]);

                if (cancelled) return;

                setIsLoggedIn(loggedIn === "true");
                setUser(storedUser ? JSON.parse(storedUser) : {});
            } catch (error) {
                console.error("Failed to load user:", error);

                if (!cancelled) {
                    setIsLoggedIn(false);
                    setUser({});
                }
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, []);

    const items = burger as BurgerItem[];

const filteredBurgers = useMemo(() => {
    return items.filter((item) => {
        const matchesSearch =
            item.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            item.shortDescription
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            (selectedCategory === "Classic" &&
                ["Beef", "Chicken"].includes(item.category)) ||
            (selectedCategory === "Gourmet" &&
                gourmetBurgers.includes(item.title)) ||
            item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
}, [items, selectedCategory, searchQuery]);



    const addToCart = (item: BurgerItem) => {
        setCart((previous) => ({
            ...previous,
            [item.id]: (previous[item.id] ?? 0) + 1,
        }));
    };

    const cartCount = Object.values(cart).reduce(
        (total, quantity) => total + quantity,
        0
    );

    const cartTotal = items.reduce(
        (total, item) =>
            total + item.price * (cart[item.id] ?? 0),
        0
    );

    const showCart = () => {
        if (cartCount === 0) {
            Alert.alert(
                "Your basket",
                "Your basket is empty. Tap + to add a burger."
            );
            return;
        }

        const summary = items
            .filter((item) => (cart[item.id] ?? 0) > 0)
            .map(
                (item) =>
                    `${item.title} × ${cart[item.id]} — Rs ${(
                        item.price * cart[item.id]
                    ).toFixed(2)}`
            )
            .join("\n");

        Alert.alert(
            `Your basket (${cartCount})`,
            `${summary}\n\nTotal: Rs ${cartTotal.toFixed(2)}`,
            [
                { text: "Continue shopping", style: "cancel" },
                {
                    text: "Clear basket",
                    style: "destructive",
                    onPress: () => setCart({}),
                },
            ]
        );
    };

    if (isLoggedIn === null) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator
                    color={COLORS.orange}
                    size="large"
                />
            </View>
        );
    }

    if (!isLoggedIn) {
        return <Redirect href="/launch" />;
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.screen}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() =>
                            Alert.alert(
                                "Burger Bite",
                                "Welcome to Burger Bite!"
                            )
                        }
                    >
                        <Ionicons
                            name="menu"
                            size={29}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>

                    <View style={styles.headerRight}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {String(
                                    user?.name ?? user?.email ?? "U"
                                )
                                    .charAt(0)
                                    .toUpperCase()}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.notification}
                            onPress={() =>
                                Alert.alert(
                                    "Notifications",
                                    "You are all caught up!"
                                )
                            }
                        >
                            <Ionicons
                                name="notifications-outline"
                                size={27}
                                color={COLORS.white}
                            />
                            <View style={styles.notificationBadge}>
                                <Text style={styles.badgeText}>2</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Heading */}
                    <View style={styles.heading}>
                        <Text style={styles.title}>
                            Beyond Just Burgers
                        </Text>
                        <Text style={styles.subtitle}>
                            It’s a Taste Revolution!
                        </Text>
                    </View>


                    

                    {/* Categories */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryContainer}
                    >
                        {displayCategories.map((category) => {
                            const selected =
                                selectedCategory === category.title;

                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.categoryButton}
                                    onPress={() =>
                                        setSelectedCategory(category.title)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            selected &&
                                                styles.selectedCategoryText,
                                        ]}
                                    >
                                        {category.title}
                                    </Text>

                                    {selected && (
                                        <View
                                            style={styles.categoryUnderline}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() =>
                                Alert.alert(
                                    "Filter",
                                    "Choose a category to filter burgers."
                                )
                            }
                        >
                            <Ionicons
                                name="options"
                                size={25}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Featured burgers */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuredContainer}
                    >
                        {filteredBurgers.map((item) => (
                            <View
                                key={item.id}
                                style={styles.featuredCard}
                            >
                                <Link
                                    href={`/burger/${item.id}/page`}
                                    asChild
                                >
                                    <TouchableOpacity
                                        style={styles.featuredImageArea}
                                        activeOpacity={0.85}
                                    >
                                        <BurgerCard item={item} />
                                    </TouchableOpacity>
                                </Link>

                                <Text
                                    style={styles.featuredName}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={styles.featuredDescription}
                                    numberOfLines={2}
                                >
                                    {item.shortDescription}
                                </Text>

                                <View style={styles.featuredFooter}>
                                    <Text style={styles.price}>
                                        Rs {item.price.toFixed(2)}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => addToCart(item)}
                                    >
                                        <Ionicons
                                            name="add"
                                            size={30}
                                            color={COLORS.white}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        {filteredBurgers.length === 0 && (
                            <Text style={styles.emptyText}>
                                No burgers in this category yet.
                            </Text>
                        )}
                    </ScrollView>

                    {/* Menu heading */}
                    <View style={styles.menuHeading}>
                        <Text style={styles.menuTitle}>Menu</Text>

                        <TouchableOpacity
                            onPress={() => setSelectedCategory("All")}
                        >
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Menu list */}
                    {items.map((item, index) => (
                        <View
                            key={item.id}
                            style={styles.menuCard}
                        >
                            <Link
                                href={`/burger/${item.id}/page`}
                                asChild
                            >
                                <TouchableOpacity
                                    style={styles.menuImageArea}
                                    activeOpacity={0.85}
                                >
                                    <BurgerCard item={item} />
                                </TouchableOpacity>
                            </Link>

                            <View style={styles.menuInfo}>
                                <Text
                                    style={styles.menuItemName}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>

                                <View style={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Ionicons
                                            key={star}
                                            name="star"
                                            size={16}
                                            color={COLORS.yellow}
                                        />
                                    ))}
                                </View>

                                <View style={styles.menuBottom}>
                                    <Text
                                        style={styles.tag}
                                        numberOfLines={1}
                                    >
                                        {item.category}
                                    </Text>

                                    <Text style={styles.menuPrice}>
                                        Rs {item.price.toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.menuAddButton}
                                onPress={() => addToCart(item)}
                            >
                                <Ionicons
                                    name="add"
                                    size={39}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

                {/* Bottom navigation */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            Alert.alert(
                                "Locations",
                                "Location selection will be added next."
                            )
                        }
                    >
                        <Ionicons
                            name="location-outline"
                            size={27}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={showCart}
                    >
                        <Ionicons
                            name="basket-outline"
                            size={32}
                            color={COLORS.white}
                        />

                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.badgeText}>
                                    {cartCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() =>
                            Alert.alert(
                                "Offers",
                                "Special offers will appear here."
                            )
                        }
                    >
                        <Ionicons
                            name="gift-outline"
                            size={27}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
    },
    loading: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        height: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    menuButton: {
        width: 43,
        height: 43,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 5,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 22,
    },
    avatar: {
        width: 39,
        height: 39,
        borderRadius: 24,
        backgroundColor: "#C6D5CD",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#333333",
    },
    notification: {
        position: "relative",
        padding: 4,
    },
    notificationBadge: {
        position: "absolute",
        right: -3,
        top: -3,
        width: 19,
        height: 19,
        borderRadius: 10,
        backgroundColor: COLORS.red,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: "800",
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heading: {
        paddingTop: 16,
        paddingBottom: 23,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 18,
        color: "#E1DFE4",
        marginTop: 5,
    },
    categoryContainer: {
        alignItems: "center",
        gap: 27,
        paddingBottom: 18,
    },
    categoryButton: {
        paddingTop: 5,
        paddingBottom: 9,
        position: "relative",
    },
    categoryText: {
        color: "#E1DFE4",
        fontSize: 15,
    },
    selectedCategoryText: {
        color: COLORS.red,
        fontWeight: "800",
    },
    categoryUnderline: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: COLORS.red,
        borderRadius: 2,
    },
    filterButton: {
        paddingHorizontal: 1,
        paddingVertical: 2,
    },
    featuredContainer: {
        gap: 15,
        paddingBottom: 22,
    },
    featuredCard: {
        width: 270,
        minHeight: 365,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 29,
        padding: 14,
        overflow: "hidden",
    },
    featuredImageArea: {
        height: 205,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    featuredName: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.white,
        marginTop: 6,
    },
    featuredDescription: {
        fontSize: 15,
        color: "#E2E0E5",
        marginTop: 5,
        minHeight: 40,
    },
    featuredFooter: {
        marginTop: "auto",
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    price: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "800",
    },
    addButton: {
        width: 47,
        height: 47,
        borderRadius: 25,
        backgroundColor: "#17161C",
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        color: COLORS.muted,
        padding: 20,
    },
    menuHeading: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 1,
        marginBottom: 16,
    },
    menuTitle: {
        color: COLORS.white,
        fontSize: 27,
        fontWeight: "500",
    },
    seeAll: {
        color: COLORS.muted,
        fontSize: 15,
    },
    menuCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 27,
        minHeight: 126,
        marginBottom: 12,
        overflow: "hidden",
    },
    menuImageArea: {
        width: 100,
        height: 120,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    menuInfo: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 12,
        paddingLeft: 4,
        paddingRight: 5,
    },
    menuItemName: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: "800",
    },
    stars: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        marginTop: 6,
    },
    menuBottom: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        gap: 4,
    },
    tag: {
        color: "#F1EDF0",
        fontSize: 10,
        backgroundColor: "#483038",
        borderRadius: 12,
        paddingHorizontal: 7,
        paddingVertical: 4,
        overflow: "hidden",
        flexShrink: 1,
    },
    menuPrice: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "800",
    },
    menuAddButton: {
        width: 58,
        alignSelf: "stretch",
        backgroundColor: COLORS.button,
        alignItems: "center",
        justifyContent: "center",
    },
    bottomNav: {
        height: 78,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderTopColor: "#343239",
        backgroundColor: COLORS.background,
    },
    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
    cartButton: {
        width: 64,
        height: 64,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.orange,
        shadowColor: COLORS.orange,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    cartBadge: {
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: COLORS.red,
        minWidth: 19,
        height: 19,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
    },
});
 