import {React, useState} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {auth} from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {

    const navigation = useNavigation();

    const [email, setPassword] = useState("");

    const ResetPassword = (() => {
        sendPasswordResetEmail(auth, email).then(() => {
            Alert.alert("An email has been send to you to reset your password");

        }).catch((error) => {
            console.error(error.message);
        })
    })

    return(
        <View style={styles.main}>
            <Image source={require("../images/profile-images/logo.jpg")} style={styles.logo} resizeMode="cover" />

            <View>
                <Text style={styles.screen_name}>FORGOT YOUR PASSWORD</Text>
                <Text style={styles.japanese}>Enter your e-mail address to reset your password</Text>
            </View>

            <View>
                <TextInput style={styles.input} placeholder="E-Mail" onChangeText={(text) => setPassword(text)} />

                <TouchableOpacity style={styles.btn_sign_up} onPress={ResetPassword}>
                    <Text style={styles.btn_sign_up_text}>Reset Your Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_login} onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.btn_login_text}>Back to Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_home} onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.btn_home_text}>Back to Sign Up</Text>
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
        height: 300,
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
    btn_home: {
        backgroundColor: "black",
        width: 270,
        height: 55,
        borderRadius: 50,
        borderColor: "black",
        borderWidth: 3,
        padding: 8,
        marginLeft: 80,
        marginTop: 15,
        marginBottom: 15,
    },
    btn_home_text: {
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
        marginTop: 25,
        marginBottom: 20,
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

export default ForgotPassword;