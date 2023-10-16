import {React, useState, useEffect} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";
import { useRoute } from "@react-navigation/native";
import { useAppContext } from "./AppNavigation";
import Loader from "./Loading";

const Drinks = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const {userId} = route.params;
    const {selectedDrinks, dispatch, selectedCondiments, dishData} = useAppContext()

    const [drinks, setDrinks] = useState([]);
    const [addState, setAddState] = useState({});

    const [drinksPending, setDrinksPending] = useState(false);

    const RestaurantCartSelected = () => {
        navigation.navigate("RestaurantCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const OrderCartSelected = () => {
        navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    useEffect(() => {
        getDrinks();
    }, []);

    const getDrinks = async() => {
        setDrinksPending(true);
        try {
                const querySnapShot = await getDocs(collection(db,"drinks"));
                const data = querySnapShot.docs.map(async (doc) => {
                    const drinkData = doc.data();
                    
                        return {
                            id: doc.id,
                            ...drinkData,
                        }
                })

                const drinksData = await Promise.all(data);
                setDrinks(drinksData);
            }
             catch (error) {
            console.error("Error fetching drinks:", error);
        }
        setDrinksPending(false);
    };
    
    const handleAddDrink = (selectedDrink) => {
       //Check and see if the condiment is already selected
       const isSelected = selectedDrinks.some((drink) => drink.id === selectedDrink.id);

       if (isSelected) {
        dispatch({ type: "REMOVE_DRINK", payload: selectedDrink.id});
       } else {
        dispatch({ type: "ADD_DRINK", payload: selectedDrink})
       };

       //Toggle the state for this condiment
       setAddState((prevAddState) => ({
        ...prevAddState,
        [selectedDrink.id]: isSelected? "add": "add_clicked",
       }))
    };

    const handleBackNavPress = () => {
        navigation.navigate("Condiments", {userId});
    };

    const handleCartNavPress = () => {
        navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks})
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

                <Text style={styles.screen_name}>Refreshing Drinks</Text>
            </View>

            
            <ScrollView style={styles.scroll_div}>
                {drinks.map((drink) => (
                    <View style={styles.single_condiment} key={drink.id}>
                    <Image source={{uri : drink.image}} style={styles.condiment_img} />

                    <View style={styles.condiment_text}>
                        <Text style={styles.description}>{drink.name}</Text>
                        <Text style={styles.price}>{drink.price}</Text>
                    </View>

                    <TouchableOpacity key={drink.id} style={[styles.add_btn, addState[drink.id] === "add_clicked" && styles.add_btn_clicked]} onPress={() => handleAddDrink(drink)}>
                        <Image source={require("../images/icons/plus.png")}
                            style={styles.add}
                        />
                    </TouchableOpacity>
                </View>
                ))}

            </ScrollView>


            <View>
                <TouchableOpacity style={styles.btn_condiments} onPress={() => handleCartNavPress()}>
                    <Text style={styles.btn_condiments_text}>Add Drinks</Text>
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
        
        {drinksPending ? (<Loader />) : null}
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
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 30,
        marginBottom: 25,
        marginLeft: 30,
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
        top: 25,
        left: 25,
        borderRadius: 30,
        padding: 2,
        borderColor: "orange",
        borderWidth: 3,
    }
});

export default Drinks;