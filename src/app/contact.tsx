import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Contact() {
    const router = useRouter();

    const handleBack = () => {
        router.navigate("/");
    }

    return (
        <SafeAreaView>
            <TouchableOpacity
                onPress={handleBack}>
                <Text>Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}