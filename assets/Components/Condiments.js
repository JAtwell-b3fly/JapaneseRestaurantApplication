import {React, useState, useEffect} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";
import { useAppContext } from "./AppNavigation";
import { useRoute } from "@react-navigation/native";

import Loader from "./Loading";

const Condiments = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const {userId} = route.params;
    const {selectedCondiments, dishData, dispatch, selectedDrinks} = useAppContext()

    const [condiments, setCondiments] = useState([]);
    const [addState, setAddState] = useState({});
  
    const [condimentsPending, setCondimentsPending] = useState(false);

    //Get the last dish that was added to the array
    const lastDish = dishData[dishData.length - 1];

    const handleAddCondiment = (selectedCondiment) => {
        //Check and see if the condiment is already selected
        const isSelected = selectedCondiments.some((condiment) => condiment.id === selectedCondiment.id);

        if (isSelected) {
            dispatch({ type: "REMOVE_CONDIMENT", payload: selectedCondiment.id});
        } else {
            dispatch({ type: "ADD_CONDIMENT", payload: selectedCondiment});
        }

        //Toggle the state for this condiment
        setAddState((prevAddState) => ({
            ...prevAddState,
            [selectedCondiment.id]: isSelected ? "add" : "add_clicked",
        }))
    }

    const RestaurantCartSelected = () => {
        navigation.navigate("RestaurantCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const OrderCartSelected = () => {
        navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    useEffect (() => {
        getCondiments();
    }, []);

    const getCondiments = async() => {
        setCondimentsPending(true);
        try {
                const querySnapShot = await getDocs(collection(db, "condiments"));
                const data = querySnapShot.docs.map(async (doc) => {
                    const condimentsData = doc.data();
                        return {
                            id: doc.id,
                            ...condimentsData,
                        }
                })

                const condimentData = await Promise.all(data);
                setCondiments(condimentData);
        } catch (error) {
            console.log("Error in fetching condiments", error);
        }
        setCondimentsPending(false);
    }

    const handleAddCondimentPress = (selectedCondiments) => {
        navigation.navigate("Drinks", { dishData, selectedCondiments, userId, selectedDrinks});
    };

    const handleBackNavPress = () => {
        navigation.navigate("Description", {userId});
    }

    const handleMenuPress = () => {
        navigation.navigate("Menu", {userId});
    }


    return(
        <View style={styles.main}>

            <View>
                <TouchableOpacity style={styles.back_btn} onPress={() => handleBackNavPress()}>
                    <Image style={styles.back_image} source={require("../images/icons/arrow-left-black.png")} />
                </TouchableOpacity>

                <Image source={{uri: lastDish.image}} style={styles.dish} resizeMode="cover" />

                <Text style={styles.screen_name}>EXTRA CONDIMENTS</Text>
            </View>

            
            <ScrollView style={styles.scroll_div}>
                {condiments.map((condiment) => (
                    <View style={styles.single_condiment} key={condiment.id}>
                    <Image source={{uri: condiment.image}} style={styles.condiment_img} />

                    <View style={styles.condiment_text}>
                        <Text style={styles.description}>{condiment.name}</Text>
                        <Text style={styles.price}>{condiment.price}</Text>
                    </View>

                    <TouchableOpacity key={condiment.id} style={[styles.add_btn, addState[condiment.id] === "add_clicked" && styles.add_btn_clicked]} onPress={() => handleAddCondiment(condiment)}>
                        <Image source={require("../images/icons/plus.png")}
                            style={styles.add}
                        /> 
                    </TouchableOpacity>
                </View>
                ))}
            </ScrollView>


            <View>
                <TouchableOpacity style={styles.btn_condiments} onPress={() => handleAddCondimentPress(selectedCondiments)}>
                    <Text style={styles.btn_condiments_text}>Add Condiments</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.nav_box}>
                <TouchableOpacity style={styles.nav_btn} onPress={() => handleMenuPress()}>
                    <Image source={require("../images/icons/rice-bowl-colour.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => RestaurantCartSelected()}>
                    <Image source={require("../images/icons/diamonds.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => OrderCartSelected()}>
                    <Image source={require("../images/icons/shopping-cart.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("Profile")}>
                    <Image source={require("../images/icons/user.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>
            </View>
        
        {condimentsPending ? (<Loader />) : null}

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
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 30,
        marginBottom: 25,
    },
    description: {
        color: "white",
        fontSize: 22,
        fontWeight: "normal",
        textAlign: "center",
        marginLeft: 10,
        marginBottom: 10,
    },
    price: {
        color: "white",
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginLeft: 10,
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
        marginBottom: 25,
    },
    btn_condiments_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    condiment_img: {
        width: 130,
        height: 130,
        borderRadius: 30,
    },
    condiment_text: {
        flexDirection: "column",
        width: 200,
        textAlign: "center",
        paddingTop: 10,
    },
    single_condiment: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 15,
    },
    add_btn: {
        backgroundColor: "white",
        borderRadius: 30,
        height: 40,
        width: 40,
        padding: 5,
        marginTop: 40,
        marginLeft: 10,
    },
    add_btn_clicked: {
        backgroundColor: "orange",
        borderRadius: 30,
        height: 40,
        width: 40,
        padding: 5,
        marginTop: 40,
        marginLeft: 10,
    },
    add: {
        width: 30,
        height: 30,
    },
    scroll_div: {
        width: "100%",
        height: 300,
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

export default Condiments;