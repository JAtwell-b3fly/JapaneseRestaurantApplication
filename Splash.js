import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {

    const navigation = useNavigation();

    return(
        <View style={styles.main}>
            <Image source={require("../images/profile-images/logo.jpg")} style={styles.logo} resizeMode="cover" />

            <View style={styles.name}>
                <Text style={styles.english}>Japanese Restaurant</Text>
                <Text style={styles.japanese}>日本料理屋</Text>
            </View>

            <View style={styles.sign_div}>
                <Text style={styles.neon_sign}>SUSHI & RAMEN</Text>
            </View>

            <View>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.btn_text}>ORDER NOW</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "black",
    },
    logo: {
        height: 550,
        width: "100%"
    },
    btn: {
        backgroundColor: "orange",
        width: 230,
        height: 80,
        borderRadius: 50,
        padding: 20,
        marginLeft: 90,
        marginTop: 170,
    },
    btn_text: {
        color: "white",
        textAlign: "center",
        fontSize: 25,
        fontWeight: "bold",
    },
    name: {
        zIndex: 1,
        position: "absolute",
        flexDirection: "row",
        top:10,
        left: 240,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 30,
    },
    english: {
        color: "white",
        fontSize: 25,
        flexDirection: "column",
        width: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 25,
        textShadowColor: "black",
        textShadowRadius: 20,
        marginRight: 10,
    },
    japanese: {
        color: "white",
        fontSize: 80,
        flexDirection: "column",
        width: 80,
        fontWeight: "bold",
        textShadowColor: "black",
        textShadowRadius: 20,
    },
    sign_div: {
        zIndex: 1,
        position: "absolute",
        left: 20,
        top: 510,
    },
    neon_sign: {
        color: "yellow",
        fontSize: 40,
        fontWeight: "900",
        width: 155,
        textAlign: "center",
        textShadowColor: "red",
        textShadowOffset: {
            width: 8,
            height: 8,
        },
        textShadowRadius: 8,
    }
});

export default Splash;