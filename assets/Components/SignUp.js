import {React, useState} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../config/firebase";
import {collection, addDoc, doc, setDoc} from "firebase/firestore";

const SignUp = () => {

    const navigation = useNavigation();

    //Variables
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Functions
    const handleEmailChange = (text) => {
        console.log("Email changed to : ", text);
        setEmail(text);
    }


    const validateEmail = (text) => {
        if (text.includes("@")) {
            return true;
        } else {
            return false;
        }
    };

    const validatePassword = (text) => {
        //Use a regular expression to enforce password requirements
        const passwordRegex = /^(?=.*\d)(?=.*[@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (passwordRegex.test(text)) {
            setPassword(text);
        };
    };

    const Register = (async() => {
        if (!validateEmail(email)) {
            //Display an alert if @ is not present
            Alert.alert("Invalid Email", 'Please include "@" in your email.');
            return; //Exit the function early
        }

        try{
            //Save user information to Firestore
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //Check if user is not null before accessing uid
            if (user && user.uid) {
                const userDocRef = doc(db, "users", user.uid);

                await setDoc(userDocRef, {
                    fullName: fullName,
                    email: email,
                })
    
                //Inform the user that infirmation is added to the database
                Alert.alert("Added successfully to the database");
    
                navigation.navigate("Menu");
            } else {
                console.error("User or user.uid is null");
            }
           
    } catch (error) {
        console.error(error.message);
    };
});

    

    return(
        <View style={styles.main}>
            <Image source={require("../images/profile-images/logo.jpg")} style={styles.logo} resizeMode="cover" />

            <View>
                <Text style={styles.screen_name}>SIGN UP</Text>
                <Text style={styles.japanese}>to join the community and enjoy life</Text>
            </View>

            <View>
                <TouchableOpacity style={styles.google_btn}>
                    <Image source={require("../images/icons/google.png")} style={styles.google_icon} />
                    <Text style={styles.google_text}>Google</Text>
                </TouchableOpacity>

                <Text style={styles.or}>____________________  or  ___________________</Text>

                <TextInput style={styles.input} 
                            placeholder="Full Name" 
                            onChangeText={(text) => {
                                //Limit Full to 25 characters
                                if (text.length <= 25) {
                                    setFullName(text);
                                };
                            }}
                            value={fullName} 
                />
                <TextInput style={styles.input} 
                            placeholder="E-Mail"
                            onChangeText={handleEmailChange}
                />
                <TextInput style={styles.input} 
                            placeholder="Password"
                            onChangeText={validatePassword}
                />

                <TouchableOpacity onPress={() => navigation.navigate("Login")}><Text style={styles.sign_up}>Already have an account? Login</Text></TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity style={styles.btn} onPress={Register}>
                    <Text style={styles.btn_text}>Sign Up</Text>
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
        marginTop: 15,
        marginBottom: 15,
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
    sign_up: {
        color: "white",
        textAlign: "left",
        fontSize: 16,
        marginLeft: 85,
        marginTop: 10,
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
        margin: 10,
        width: 270,
        height: 40,
        textAlign: "center",
        borderRadius: 30,
        marginLeft: 80,
    }
});

export default SignUp;