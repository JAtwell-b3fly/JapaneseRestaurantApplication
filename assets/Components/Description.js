import React, {useEffect} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "./AppNavigation";
import { useRoute } from "@react-navigation/native";

const Description = () => {

    const navigation = useNavigation();
    const {dishData, selectedCondiments, selectedDrinks} = useAppContext();
    const route = useRoute();
    const {userId, lastSelectedType} = route.params;

    // Determine the correct array based on the lastSelectedType
    const selectedArray = lastSelectedType === "drinks" ? selectedDrinks : dishData;

    // Get the last selected item based on its type
    const lastSelectedItem = selectedArray[selectedArray.length - 1];

    useEffect (() => {
        console.log("Component re-rendered with updated lastSelectedItem: ", lastSelectedItem)
    }, [lastSelectedItem]);

    const handleCondimentPress = () => {
        if (lastSelectedType === "dish") {
            navigation.navigate("Condiments", {userId, dishData, selectedCondiments, selectedDrinks})
        } else if (lastSelectedType === "drinks") {
            navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks})
        }
    }

    const handleBackMenuPress = () => {
        navigation.navigate("Menu", {userId, dishData, selectedCondiments, selectedDrinks});
    }

    return(
        <View style={styles.main}>

            <View>
                <TouchableOpacity style={styles.back_btn} onPress={() => handleBackMenuPress()}>
                    <Image style={styles.back_image} source={require("../images/icons/arrow-left-black.png")} />
                </TouchableOpacity>

                <Image source={{uri: lastSelectedItem.image}} style={styles.dish} resizeMode="cover" />

                <Text style={styles.screen_name}>{lastSelectedItem.name}</Text>
            </View>

            <View>
                <ScrollView style={{ maxHeight: 190}}>
                    <Text style={styles.description}>{lastSelectedItem.description}</Text>
                    <Text style={styles.description}>{lastSelectedItem.ingredients}</Text>
                </ScrollView>
                
                <Text style={styles.price}>R {lastSelectedItem.price}</Text>


                <TouchableOpacity style={styles.btn_condiments} onPress={() => handleCondimentPress(lastSelectedItem)}>
                    <Text style={styles.btn_condiments_text}>Add Condiments</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_cart} onPress={() => handleCondimentPress(lastSelectedItem)}>
                    <Text style={styles.btn_cart_text}>Add To Cart</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.nav_box}>
                <TouchableOpacity style={styles.nav_btn} onPress={() => handleBackMenuPress()}>
                    <Image source={require("../images/icons/rice-bowl-colour.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("RestaurantCart", {userId, dishData, selectedCondiments, selectedDrinks})}>
                    <Image source={require("../images/icons/diamonds.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks})}>
                    <Image source={require("../images/icons/shopping-cart.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("Profile")}>
                    <Image source={require("../images/icons/user.png")} style={styles.nav_btn_image} />
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
    dish: {
        height: 300,
        width: "100%"
    },
    screen_name: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    description: {
        color: "white",
        fontSize: 18,
        fontWeight: "normal",
        textAlign: "center",
        width: 350,
        marginLeft: 30,
        marginBottom: 10,
    },
    price: {
        color: "white",
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        width: 350,
        marginLeft: 35,
        marginBottom: 10,
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
    },
    btn_cart: {
        backgroundColor: "orange",
        width: 270,
        height: 55,
        borderRadius: 50,
        padding: 8,
        marginLeft: 80,
        marginTop: 10,
        marginBottom: 25,
    },
    btn_cart_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    btn_condiments: {
        backgroundColor: "black",
        width: 270,
        height: 55,
        borderRadius: 50,
        borderColor: "orange",
        borderWidth: 3,
        padding: 8,
        marginLeft: 80,
        marginTop: 10,
        marginBottom: 10,
    },
    btn_condiments_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    back_image: {
        width: 45,
        height: 46,
    },
    back_btn: {
        backgroundColor: "white",
        width: 55,
        height: 55,
        zIndex: 1,
        position: "absolute",
        top: 40,
        left: 25,
        borderRadius: 30,
        padding: 2,
        borderColor: "orange",
        borderWidth: 3,
    }
});

export default Description;