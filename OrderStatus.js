import React from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";

const OrderStatus = () => {

    const navigation = useNavigation();

    return(
        <View style={styles.main}>

            <View>
                <Text style={styles.screen_name}>Your Order Has Been Placed</Text>
                <Text style={styles.japanese}>Please be patient while we prepare your meal...</Text>
            </View>

            <Image source={require("../images/profile-images/sushi-meme.jpg")} style={styles.logo} resizeMode="cover" />

            <View>

                <TouchableOpacity style={styles.btn_sign_up} onPress={() => navigation.navigate("OrderHistory")}>
                    <Text style={styles.btn_sign_up_text}>Order History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_login} onPress={() => navigation.navigate("Menu")}>
                    <Text style={styles.btn_login_text}>Back Main Menu</Text>
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
        height: 400,
        width: "100%"
    },
    btn_sign_up: {
        backgroundColor: "orange",
        width: 270,
        height: 55,
        borderRadius: 50,
        padding: 8,
        marginLeft: 80,
        marginTop: 15,
        marginBottom: 15,
    },
    btn_sign_up_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    btn_login: {
        backgroundColor: "black",
        width: 270,
        height: 55,
        borderRadius: 50,
        borderColor: "orange",
        borderWidth: 3,
        padding: 8,
        marginLeft: 80,
        marginTop: 15,
        marginBottom: 15,
    },
    btn_login_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    screen_name: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 40,
        marginBottom: 25,
    },
    japanese: {
        color: "white",
        fontSize: 23,
        fontWeight: "bold",
        textAlign: "center",
        width: 350,
        marginLeft: 30,
        marginBottom: 20,
    },
    input: {
        backgroundColor: "white",
        color: "black",
        margin: 10,
        width: 270,
        height: 50,
        textAlign: "center",
        borderRadius: 30,
        marginLeft: 80,
        fontSize: 15,
    }
});

export default OrderStatus;