import {React, useState, useEffect} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useAppContext } from "./AppNavigation";
import {setDoc, doc} from "firebase/firestore";
import {db} from "../config/firebase";
import { getAuth } from "firebase/auth";

const RestaurantCart = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const {userId} = route.params;
    const {selectedCondiments, dishData, selectedDrinks, dispatch} = useAppContext();
    const [quantities, setQuantities] = useState({});
    const [orderPrice, setOrderPrice] = useState(0);

    useEffect(() => {
        //Your logic when quantities change
        console.log("Quantities update: ", quantities);

        //You can store the quantities in a variable here if needed
        const quantitiesArray = Object.entries(quantities).map(([itemId, quantity]) => ({
            itemId,
            quantity,
        }));
        console.log("Quantities as an array: " , quantitiesArray)

        
    }, [quantities]);

    useEffect(() => {
        const calculateOrderTotal = () => {
            let total = 0;

    //Calculate the total price for the dishes
    for (const dish of dishData) {
        total  += dish.price * (dish.quantity || 0);
    }

    //Calculate the total price for the drinks
    for (const drink of selectedDrinks) {
        total  += drink.price * (drink.quantity || 0);
    }

    //Calculate the total price for the condiments
    for (const condiment of selectedCondiments) {
        total  += condiment.price * (condiment.quantity || 0);
    }

            setOrderPrice(total);
        };

        calculateOrderTotal();
    }, [quantities, dishData, selectedDrinks, selectedCondiments]);

    //Stores the quantities added to an object
    const handleAddQuantity = (itemId, itemType) => {
        //Update the quantities

        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemId]: (prevQuantities[itemId] || 1) + 1
        }));

        //Dispatch actions to update the arrays
        dispatch({ type: `ADD_${itemType}`, payload: {id: itemId}})
    };

    //Remove the Quantity if it is zero
    const handleRemoveQuantity = (itemId, itemType) => {
        //Use dispatch with the appropriate action type and payload
        dispatch({ type: `REMOVE_${itemType}`, payload: {id: itemId}})


        setQuantities((prevQuantities) => {
            const newQuantity = (prevQuantities[itemId] || 1) - 1;
            const newQuantities = {...prevQuantities};
            if (newQuantities <= 0) {
                delete newQuantities[itemId];
            } else {
                newQuantities[itemId] = newQuantity; //Store the new quantity 
            };

            return newQuantities;
        })
    }

    const handleOrderCartHeaderButton = () => {
        navigation.navigate("OrderCart", {userId});
    }

    const handleAddMore = () => {
        navigation.navigate("Menu", {userId})
    }

    const handleMenuPress = () => {
        navigation.navigate("Menu", {userId})
    }

    const RestaurantCartSelected = () => {
        navigation.navigate("RestaurantCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const OrderCartSelected = () => {
        navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const addToCart = async() => {

        try{
            //Save user information to Firestore
            const auth = getAuth();
            const user = auth.currentUser;
            const userUID = user.uid;
            let userId = userUID;

            console.log("userId", userId);
            console.log("dishData", dishData);
            console.log("selectedCondiments", selectedCondiments);
            console.log("selectedDrinks", selectedDrinks);

            //Check if user is not null before accessing uid
            if (user) {
                const userUID = user.uid;
                const userDocRef = doc(db, "cart", userUID);

                await setDoc(userDocRef, {
                    main: dishData,
                    condiments: selectedCondiments,
                    drinks: selectedDrinks,
                    orderPrice: orderPrice,
                    orderType: "Reservation",
                })

                //Inform the user that information is added to the database
                Alert.alert("Added To Cart");
                navigation.navigate("SeatBooking", {userId: userUID, docRef: userDocRef});
            } else {
                console.error("User Not Found");
            }
           
    } catch (error) {
        console.error(error.message);
    };
};

    return(
        <View style={styles.main}>

            <View style={styles.top_btn_div}>
                <TouchableOpacity style={styles.delivery_btn} onPress={() => handleOrderCartHeaderButton()}>
                    <Text style={styles.top_btn_text}>Order Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurant_btn}>
                    <Text style={styles.top_btn_text}>In The Restaurant</Text>
                </TouchableOpacity>
            </View>

            
            <ScrollView style={styles.scroll_div}>
            <View>
                        <Text style={styles.categoryTitle}>Item</Text>
                        {dishData.map((dish, index) => (
                            <View key={index} style={styles.single_condiment}>
                            <Image source={{uri : dish.image}} style={styles.condiment_img} />

                            <View style={styles.cart_details}>
                                <Text style={styles.description}>{dish.id}</Text>

                                <View style={styles.price_quantity}>
                                    <Text style={styles.price}>R {dish.price}</Text>

                                    <View style={styles.quantity}>
                                        <TouchableOpacity onPress={() => handleRemoveQuantity(dish.id, "DISH")}>
                                            <Image source={require("../images/icons/minus.png")}
                                                    style={styles.add}
                                            />
                                        </TouchableOpacity>

                                        <Text style={styles.count}>{quantities[dish.id] || 1}</Text>

                                        <TouchableOpacity onPress={() => handleAddQuantity(dish.id, "DISH")}>
                                            <Image source={require("../images/icons/plus-circle.png")}
                                                    style={styles.add}
                                        />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        ))}
                    </View> 

                    <View>
                        <Text style={styles.categoryTitle}>Condiments</Text>
                        {selectedCondiments.map((condiment, index) => (
                            <View key={index} style={styles.single_condiment}>
                            <Image source={{uri : condiment.image}} style={styles.condiment_img} />

                            <View style={styles.cart_details}>
                                <Text style={styles.description}>{condiment.id}</Text>

                                <View style={styles.price_quantity}>
                                    <Text style={styles.price}>R {condiment.price}</Text>

                                    <View style={styles.quantity}>
                                        <TouchableOpacity onPress={() => handleRemoveQuantity(condiment.id, "CONDIMENT")}>
                                            <Image source={require("../images/icons/minus.png")}
                                                    style={styles.add}
                                            />
                                        </TouchableOpacity>

                                        <Text style={styles.count}>{quantities[condiment.id] || 1}</Text>

                                        <TouchableOpacity onPress={() => handleAddQuantity(condiment.id, "CONDIMENT")}>
                                            <Image source={require("../images/icons/plus-circle.png")}
                                                    style={styles.add}
                                        />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        ))}
                    </View>

                    <View>
                        <Text style={styles.categoryTitle}>Drinks</Text>
                        {selectedDrinks.map((drink, index) => (
                            <View key={index} style={styles.single_condiment}>
                            <Image source={{uri : drink.image}} style={styles.condiment_img} />

                            <View style={styles.cart_details}>
                                <Text style={styles.description}>{drink.id}</Text>

                                <View style={styles.price_quantity}>
                                    <Text style={styles.price}>R {drink.price}</Text>

                                    <View style={styles.quantity}>
                                        <TouchableOpacity onPress={() => handleRemoveQuantity(drink.id, "DRINK")}>
                                            <Image source={require("../images/icons/minus.png")}
                                                    style={styles.add}
                                            />
                                        </TouchableOpacity>

                                        <Text style={styles.count}>{quantities[drink.id] || 1}</Text>

                                        <TouchableOpacity onPress={() => handleAddQuantity(drink.id, "DRINK")}>
                                            <Image source={require("../images/icons/plus-circle.png")}
                                                    style={styles.add}
                                        />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        ))}
                    </View>
            </ScrollView>


            <View style={styles.main_btns}>
                <TouchableOpacity style={styles.btn_condiments} onPress={() => handleAddMore()}>
                    <Text style={styles.btn_condiments_text}>Add More</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_cart} onPress ={() => addToCart()}>
                    <Text style={styles.btn_cart_text}>Order R {orderPrice}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.nav_box}>
                <TouchableOpacity style={styles.nav_btn} onPress ={() => handleMenuPress()}>
                    <Image source={require("../images/icons/rice-bowl.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress ={() => RestaurantCartSelected()}>
                    <Image source={require("../images/icons/diamonds-colour.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => OrderCartSelected()}>
                    <Image source={require("../images/icons/shopping-cart.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress ={() => navigation.navigate("Profile")}>
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
    description: {
        color: "white",
        fontSize: 16,
        fontWeight: "normal",
        textAlign: "center",
        marginLeft: 10,
        marginBottom: 5,
        paddingTop: 15,
        width: 250,
    },
    price: {
        color: "white",
        fontSize: 24,
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
        width: 180,
        height: 55,
        borderRadius: 50,
        padding: 8,
        marginLeft: 20,
    },
    btn_cart_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    btn_condiments: {
        backgroundColor: "black",
        width: 180,
        height: 55,
        borderRadius: 50,
        borderColor: "orange",
        borderWidth: 3,
        padding: 8,
        marginLeft: 10,
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
    single_condiment: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 15,
    },
    quantity: {
        backgroundColor: "white",
        borderRadius: 30,
        height: 40,
        width: 150,
        padding: 5,
        marginLeft: 30,
        flexDirection: "row",
        position: "relative",
    },
    add: {
        width: 30,
        height: 30,
        marginLeft: 15,
        marginRight: 15,
    },
    scroll_div: {
        width: "100%",
        height: 480,
        marginBottom: 15,
    },
    top_btn_text: {
        color: "orange",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    top_btn_div: {
        flex: 1,
        flexDirection: "row",
        marginTop: 35,
        marginLeft: 15,
    },
    restaurant_btn: {
        backgroundColor: "white",
        padding: 10,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        height: 50,
        width: 190,
    },
    delivery_btn: {
        backgroundColor: "black",
        padding: 10,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        height: 50,
        width: 190,
    },
    price_quantity: {
        flex: 1,
        flexDirection: "row",
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 10,
    },
    cart_details: {
        flexDirection: "column",
    },
    count: {
        fontSize: 18,
        fontWeight: "500",
    },
    main_btns: {
        marginTop: 15,
        marginBottom: 25,
        flexDirection: "row",
    },
    categoryTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 5,
    },
});

export default RestaurantCart;