import {React, useState} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../config/firebase";

const Login = () => {

    const navigation = useNavigation();

    //Variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Functions
    const Login = (() => {
        signInWithEmailAndPassword(auth, email, password).then(() => {
            //Alert.alert("Login Successful");
            navigation.navigate("Menu");
        }).catch((error) => {
            console.error(error.message);
        })
    });

    return(
        <View style={styles.main}>
            <Image source={require("../images/profile-images/logo.jpg")} style={styles.logo} resizeMode="cover" />

            <View>
                <Text style={styles.screen_name}>LOGIN</Text>
                <Text style={styles.japanese}>to join the community and enjoy life</Text>
            </View>

            <View>
                <TouchableOpacity style={styles.google_btn}>
                    <Image source={require("../images/icons/google.png")} style={styles.google_icon} />
                    <Text style={styles.google_text}>Google</Text>
                </TouchableOpacity>

                <Text style={styles.or}>____________________  or  ___________________</Text>

                <TextInput style={styles.input} placeholder="E-Mail" value={email} onChangeText={(text) => setEmail(text)} />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} />

                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}><Text style={styles.forgot_password}>Forgot Password</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}><Text style={styles.sign_up}>Don't have account? Sign Up</Text></TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style={styles.btn} onPress={Login}>
                    <Text style={styles.btn_text}>Login</Text>
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
    btn: {
        backgroundColor: "orange",
        width: 240,
        height: 55,
        borderRadius: 50,
        padding: 8,
        marginLeft: 90,
        marginTop: 25,
        marginBottom: 20,
    },
    btn_text: {
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
        marginTop: 15,
    },
    japanese: {
        color: "white",
        fontSize: 23,
        fontWeight: "bold",
        textAlign: "center",
        width: 350,
        marginLeft: 30,
    },
    google_icon: {
        width: 20,
        height: 20,
    },
    google_text: {
        color: "black",
        fontSize: 15,
        fontWeight: "400",
        marginLeft: 10,
    },
    google_btn: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        width: 110,
        borderRadius: 30,
        marginLeft: 150,
        marginTop: 20,
    },
    or: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        marginTop: 8,
    },
    forgot_password: {
        color: "white",
        textAlign: "right",
        fontSize: 16,
        marginRight: 85,
    },
    sign_up: {
        color: "white",
        textAlign: "left",
        fontSize: 16,
        marginLeft: 85,
        marginTop: 13,
    },
    continue: {
        color: "white",
        textAlign: "left",
        fontSize: 16,
        marginLeft: 85,
    },
    input: {
        backgroundColor: "white",
        color: "black",
        margin: 14,
        width: 270,
        height: 40,
        textAlign: "center",
        borderRadius: 30,
        marginLeft: 80,
    }
});

export default Login;