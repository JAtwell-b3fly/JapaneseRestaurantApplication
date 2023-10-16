import {React, useState, useEffect} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import {db} from "../config/firebase";
import {getDoc, doc, updateDoc} from "firebase/firestore";
import { useAppContext } from "./AppNavigation";
import { useRoute } from "@react-navigation/native";

const Profile = () => {

    const navigation = useNavigation();

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;

    const [userInfo, setUserInfo] = useState([]);

    const [updatedUserName, setUpdatedUserName] = useState("");
    const [updatedContactEmail, setUpdatedContactEmail] = useState("");
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");

    const {selectedCondiments, dishData, selectedDrinks, dispatch} = useAppContext();

    const RestaurantCartSelected = () => {
        navigation.navigate("RestaurantCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const OrderCartSelected = () => {
        navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const MenuSelected = () => {
        navigation.navigate("Menu", {userId});
    }

    useEffect(() => {
        console.log("User Info: ", user);
        userInfoPull();
    }, []);

    const userInfoPull = async() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            try{
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserInfo(userData);
                    console.log(userInfo);
                } else {
                    console.log("No such doument!");
                }
            } catch (error) {
                console.error("Error in fetching the user information: ", error)
            }
        }
    };

    const userInfoPush = async() => {
        //get current logged in user credentials
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user.uid;

        console.log("user:", user);

        try{

            //Check if user is not null before accessing uid
            if (user && userId) {
                const userDocRef = doc(db, "users", userId);

                //Create an object to hold the fields that need to be updated
                const updatedFields = {
                    number: updatedPhoneNumber !== "" ? updatedPhoneNumber : user.number,
                    fullName: updatedUserName !== "" ? updatedUserName : user.fullName,
                    email: updatedContactEmail !== "" ? updatedContactEmail : user.email,
                };

                //Check is any fields need to be updated
                if (Object.keys(updatedFields).length > 0) {
                    await updateDoc(userDocRef, updatedFields);
                }
    
                //Inform the user that infirmation is added to the database
                setUpdatedUserName("");
                setUpdatedContactEmail("");
                setUpdatedPhoneNumber("");
                Alert.alert("User Information Updated");

            } else {
                console.error("Error in Updating User Information");
            }
           
            } catch (error) {
            console.error(error.message);
            };
    }
    

    const Logout = (() => {
        signOut(auth).then(() => {
            navigation.navigate("Splash");
            Alert.alert("You are Logged Out");
        }).catch((error) => {
            console.error("You could not be logged out", error);
        })
    });

    return(
        <View style={styles.main}>

            <View>
                <View style={styles.btn_back}>
                    <TouchableOpacity onPress={() => MenuSelected()}>
                    <Image source={require("../images/icons/arrow-left.png")} style={styles.back_image} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.screen_name}>Profile Update</Text>

                <View style={styles.btn_logout}>
                    <TouchableOpacity onPress={Logout}>
                    <Image source={require("../images/icons/log-out.png")} style={styles.logout_image} />
                    </TouchableOpacity>
                </View>
                
            </View>

            <Image source={require("../images/profile-images/torro.jpg")} style={styles.avatar} resizeMode="contain" />

            <View>
                <Text style={styles.label}>Full Name</Text>
                <TextInput style={styles.input} placeholder={userInfo.fullName} value ={updatedUserName} onChangeText={(text) => setUpdatedUserName(text)} />

                <Text style={styles.label}>E-Mail Address</Text>
                <TextInput style={styles.input} placeholder={userInfo.email} value ={updatedContactEmail} onChangeText={(text) => setUpdatedContactEmail(text)}/>

                <Text style={styles.label}>Phone Number</Text>
                <TextInput style={styles.input} placeholder={userInfo.number} value={updatedPhoneNumber} onChangeText={(text) => setUpdatedPhoneNumber(text)} />

                <TouchableOpacity style={styles.btn_save} onPress={userInfoPush}>
                    <Text style={styles.btn_save_text}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_history} onPress={() => navigation.navigate("OrderHistory")}>
                    <Text style={styles.btn_history_text}>Order History</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.nav_box}>
                <TouchableOpacity style={styles.nav_btn} onPress={() => MenuSelected()}>
                    <Image source={require("../images/icons/rice-bowl.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => RestaurantCartSelected()}>
                    <Image source={require("../images/icons/diamonds.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => OrderCartSelected()}>
                    <Image source={require("../images/icons/shopping-cart.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("Profile")}>
                    <Image source={require("../images/icons/user-colour.png")} style={styles.nav_btn_image} />
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
    avatar: {
        height: 200,
        width: "100%"
    },
    screen_name: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 40,
        marginBottom: 25,
    },
    label: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        width: 350,
        marginLeft: 40,
        marginBottom: 10,
        marginTop: 5,
    },
    input: {
        backgroundColor: "white",
        color: "black",
        margin: 10,
        width: 270,
        height: 45,
        textAlign: "center",
        borderRadius: 30,
        marginLeft: 80,
        fontSize: 15,
    },
    btn_save: {
        backgroundColor: "black",
        width: 110,
        height: 55,
        borderRadius: 50,
        borderColor: "orange",
        borderWidth: 3,
        padding: 8,
        marginLeft: 155,
        marginTop: 10,
        marginBottom: 10,
    },
    btn_save_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    btn_history: {
        backgroundColor: "orange",
        width: 200,
        height: 57,
        borderRadius: 50,
        borderColor: "black",
        borderWidth: 3,
        padding: 8,
        marginLeft: 115,
        marginTop: 10,
        marginBottom: 15,
    },
    btn_history_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    btn_logout: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        zIndex: 1,
        position: "absolute",
        top: 40,
        left: 340,
        borderRadius: 30,
        padding: 8,
        borderColor: "red",
        borderWidth: 3,
    },
    btn_back: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        zIndex: 1,
        position: "absolute",
        top: 40,
        left: 25,
        borderRadius: 30,
        padding: 0,
        borderColor: "red",
        borderWidth: 3,
    },
    logout_image: {
        width: 30,
        height: 30,
    },
    back_image: {
        width: 45,
        height: 46,
    },
    nav_box: {
        backgroundColor: "white",
        width: "95%",
        height: 70,
        borderRadius: 30,
        marginLeft: 10,
        flexDirection: "row"
    },
    nav_btn_image: {
        width: 50,
        height: "100%",
    },
    nav_btn: {
        padding: 10,
        marginRight: 15,
        marginLeft: 12,
    }
});

export default Profile;