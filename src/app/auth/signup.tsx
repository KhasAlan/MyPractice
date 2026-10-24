
    import { Ionicons } from "@expo/vector-icons";
    import { LinearGradient } from "expo-linear-gradient";
    import { Link, useRouter } from "expo-router";
    import { useForm, Controller } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { StatusBar } from "expo-status-bar";
    import { useState } from "react";
    import AsyncStorage from "@react-native-async-storage/async-storage";
    import {
        Alert,
        KeyboardAvoidingView,
        Platform,
        Pressable,
        ScrollView,
        StyleSheet,
        Text,
        TextInput,
        View,
    } from "react-native";
    import { SafeAreaView } from "react-native-safe-area-context";
    import { signupSchema, type SignupSchema } from "./auth.schema";

    export default function Signup() {
        const router = useRouter();

        const {
            control,
            handleSubmit,
            formState: { errors, isSubmitting },
        } = useForm<SignupSchema>({
            resolver: zodResolver(signupSchema),
            defaultValues: {
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            },
        });

        const [hidden, setHidden] = useState(true);
        const [hiddenConfirm, setHiddenConfirm] = useState(true);
        const [focused, setFocused] = useState<string | null>(null);

        const goBack = () => {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace("/launch");
            }
        };

        const onSubmit = async (data: SignupSchema) => {
            try {
                const savedUser = await AsyncStorage.getItem("user");

                if (savedUser) {
                    const user = JSON.parse(savedUser);

                    if (
                        typeof user.email === "string" &&
                        user.email.trim().toLowerCase() ===
                            data.email.trim().toLowerCase()
                    ) {
                        Alert.alert(
                            "Account exists",
                            "This email is already registered."
                        );
                        return;
                    }
                }

                await AsyncStorage.setItem(
                    "user",
                    JSON.stringify({
                        name: data.name.trim(),
                        email: data.email.trim(),
                        password: data.password,
                    })
                );

                Alert.alert(
                    "Success",
                    "Account created successfully. You can now log in.",
                    [
                        {
                            text: "Log in",
                            onPress: () => router.replace("/auth/signin"),
                        },
                    ]
                );
            } catch (error) {
                console.error("Signup error:", error);
                Alert.alert("Error", "Failed to create account.");
            }
        };

        return (
            <SafeAreaView style={styles.screen}>
                <StatusBar style="light" />

                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.content}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Pressable
                            accessibilityLabel="Go back"
                            onPress={goBack}
                            style={styles.back}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={22}
                                color="#FFFFFF"
                            />
                        </Pressable>

                        <View style={styles.wordmark}>
                            <Text style={styles.wordBurger}>Burger</Text>
                            <Text style={styles.wordBite}>Bite</Text>
                        </View>

                        <Text style={styles.title}>Sign Up</Text>

                        <Text style={styles.subtitle}>
                            Create an account and start your journey to burger
                            perfection.
                        </Text>

                        <Text style={styles.label}>Full name</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={() => {
                                        onBlur();
                                        setFocused(null);
                                    }}
                                    placeholder="Your name"
                                    placeholderTextColor="#8E8E93"
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    onFocus={() => setFocused("name")}
                                    style={[
                                        styles.field,
                                        focused === "name" && styles.fieldFocused,
                                    ]}
                                />
                            )}
                        />
                        {errors.name && (
                            <Text style={styles.error}>
                                {errors.name.message}
                            </Text>
                        )}

                        <Text style={styles.label}>Email</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={() => {
                                        onBlur();
                                        setFocused(null);
                                    }}
                                    placeholder="you@email.com"
                                    placeholderTextColor="#8E8E93"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onFocus={() => setFocused("email")}
                                    style={[
                                        styles.field,
                                        focused === "email" && styles.fieldFocused,
                                    ]}
                                />
                            )}
                        />
                        {errors.email && (
                            <Text style={styles.error}>
                                {errors.email.message}
                            </Text>
                        )}

                        <Text style={styles.label}>Password</Text>
                        <View
                            style={[
                                styles.field,
                                styles.passwordField,
                                focused === "password" && styles.fieldFocused,
                            ]}
                        >
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { value, onChange, onBlur } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={() => {
                                            onBlur();
                                            setFocused(null);
                                        }}
                                        placeholder="Create a password"
                                        placeholderTextColor="#8E8E93"
                                        secureTextEntry={hidden}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onFocus={() => setFocused("password")}
                                        style={styles.passwordInput}
                                    />
                                )}
                            />

                            <Pressable
                                accessibilityLabel={
                                    hidden ? "Show password" : "Hide password"
                                }
                                onPress={() => setHidden((value) => !value)}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={hidden ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#8E8E93"
                                />
                            </Pressable>
                        </View>
                        {errors.password && (
                            <Text style={styles.error}>
                                {errors.password.message}
                            </Text>
                        )}

                        <Text style={styles.label}>Confirm password</Text>
                        <View
                            style={[
                                styles.field,
                                styles.passwordField,
                                focused === "confirmPassword" &&
                                    styles.fieldFocused,
                            ]}
                        >
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { value, onChange, onBlur } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={() => {
                                            onBlur();
                                            setFocused(null);
                                        }}
                                        placeholder="Repeat your password"
                                        placeholderTextColor="#8E8E93"
                                        secureTextEntry={hiddenConfirm}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        onFocus={() =>
                                            setFocused("confirmPassword")
                                        }
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        returnKeyType="done"
                                        style={styles.passwordInput}
                                    />
                                )}
                            />

                            <Pressable
                                accessibilityLabel={
                                    hiddenConfirm
                                        ? "Show confirmation password"
                                        : "Hide confirmation password"
                                }
                                onPress={() =>
                                    setHiddenConfirm((value) => !value)
                                }
                                hitSlop={8}
                            >
                                <Ionicons
                                    name={
                                        hiddenConfirm
                                            ? "eye-outline"
                                            : "eye-off-outline"
                                    }
                                    size={20}
                                    color="#8E8E93"
                                />
                            </Pressable>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={styles.error}>
                                {errors.confirmPassword.message}
                            </Text>
                        )}

                        <Pressable
                            accessibilityRole="button"
                            disabled={isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            style={({ pressed }) => [
                                styles.submit,
                                pressed && styles.pressed,
                                isSubmitting && styles.disabled,
                            ]}
                        >
                            <LinearGradient
                                colors={["#F6B042", "#E8881A"]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonLabel}>
                                    {isSubmitting ? "Creating account..." : "Sign Up"}
                                </Text>
                            </LinearGradient>
                        </Pressable>

                        <View style={styles.switchRow}>
                            <Text style={styles.hint}>
                                Already have an account?{" "}
                            </Text>
                            <Link href="/auth/signin">
                                <Text style={styles.link}>Log in</Text>
                            </Link>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.legal}>
                                Your privacy is important to us. Learn how we handle
                                your personal information.
                            </Text>
                            <Text style={styles.legal}>
                                Need help? Contact our support team for assistance.
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    const styles = StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: "#1B1B1F",
        },
        flex: {
            flex: 1,
        },
        content: {
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingBottom: 20,
        },
        back: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2A2A30",
            marginTop: 4,
        },
        wordmark: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 18,
        },
        wordBurger: {
            color: "#FF7A18",
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: -0.6,
        },
        wordBite: {
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: -0.6,
        },
        title: {
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: "700",
            textAlign: "center",
            marginTop: 22,
        },
        subtitle: {
            color: "#B5B5B8",
            fontSize: 15,
            lineHeight: 22,
            textAlign: "center",
            marginTop: 8,
            marginBottom: 8,
        },
        label: {
            color: "#D0D0D4",
            fontSize: 13,
            marginTop: 16,
            marginBottom: 8,
        },
        field: {
            height: 54,
            borderRadius: 16,
            backgroundColor: "#2A2A30",
            paddingHorizontal: 18,
            color: "#FFFFFF",
            fontSize: 16,
            borderWidth: 1,
            borderColor: "transparent",
        },
        fieldFocused: {
            borderColor: "#FF7A18",
        },
        passwordField: {
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 14,
        },
        passwordInput: {
            flex: 1,
            color: "#FFFFFF",
            fontSize: 16,
            height: 54,
        },
        error: {
            color: "#FF7A18",
            fontSize: 12,
            marginTop: 4,
        },
        submit: {
            marginTop: 28,
        },
        button: {
            height: 54,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
        },
        buttonLabel: {
            color: "#FFFFFF",
            fontSize: 17,
            fontWeight: "600",
        },
        pressed: {
            opacity: 0.88,
        },
        disabled: {
            opacity: 0.6,
        },
        switchRow: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 18,
            flexWrap: "wrap",
        },
        hint: {
            color: "#D0D0D4",
            fontSize: 14,
        },
        link: {
            color: "#FF7A18",
            fontSize: 14,
            fontWeight: "700",
        },
        footer: {
            marginTop: "auto",
            paddingTop: 28,
            gap: 14,
        },
        legal: {
            color: "#8E8E93",
            fontSize: 12,
            lineHeight: 18,
            textAlign: "center",
        },
    });