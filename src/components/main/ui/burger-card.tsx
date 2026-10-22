
import { Image } from "expo-image";
import { View, Text, StyleSheet } from "react-native";

export interface BurgerCardProps {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    image: number;
}

export default function BurgerCard({
    item,
}: {
    item: BurgerCardProps;
}) {
    return (
        <View style={styles.burgerContainer}>
            <Image
                source={item.image}
                style={styles.burgerImage}
                contentFit="contain"
            />

            <View>
                <Text style={styles.burgerText}>
                    {item.title}
                </Text>

                <Text style={styles.burgerShortDescription}>
                    {item.shortDescription}
                </Text>
            </View>

            <View style={styles.burgerPriceContainer}>
                <Text style={styles.burgerPrice}>
                    Rs. {item.price}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    burgerImage: {
        width: "100%",
        height: 250,
    },
    burgerContainer: {
        borderWidth: 1,
        borderColor: "#81521F",
        borderRadius: 10,
        padding: 10,
        gap: 10,
    },
    burgerText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    burgerShortDescription: {
        color: "#666",
        fontSize: 14,
        fontWeight: "400",
    },
    burgerPriceContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    burgerPrice: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
    },
});
    