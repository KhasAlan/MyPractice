import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export interface BurgerCardProps {
    id: number;
    title: string;
    shortDescription: string;
    price: number;

}

export default function BurgerCard({ item }: { item: BurgerCardProps }) {
    return (
        <View key={item.id} style={styles.burgerContainer}>
            <Image source={require("../../../../assets/images/burger.jpg")} style={styles.burgerImage} />
            <View>
                <Text style={styles.burgerText}>{item.title}</Text>
                <Text style={styles.burgerShortDescription}>{item.shortDescription}</Text>
            </View>
            <View style={styles.burgerPriceContainer}>
                <Text style={styles.burgerPrice}>Rs. {item.price}</Text>
                <TouchableOpacity style={styles.addToCartButton}>
                    <Ionicons name="add-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
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
    addToCartButton: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 100,
    },
})