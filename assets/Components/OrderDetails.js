import {React, useState, useEffect} from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import {getDoc, doc, updateDoc, addDoc, setDoc, collection} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {db} from "../config/firebase";
import { useAppContext } from "./AppNavigation";

const OrderDetails = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const {userId} = route.params;
    const {state, dispatch} = useAppContext()

    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user.uid;

    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);

    useEffect (() => {
        pullOrderData();
        pullReservationData();
    }, []);

    useEffect(() => {
        console.log('Order Data: ', orders);
        // Add any other logic or rendering based on the updated state here
      }, [orders]);

    //Get the orderData from Firebase
    const pullOrderData = async() => {
        if (user) {
            try{
                const userDocRef = doc(db, "cart", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const orderData = docSnap.data();
                    setOrders(orderData);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error in fetching the cart information: ", error)
            }
        }
    };

    //TRY PULLING THE RESERVATION DATA THAT HAS THE SAME DOCREF AS THE ORDER DOCREF, THEY SHOULD BE IDENTICAL
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //Get the reservationData from Firebase
    const pullReservationData = async() => {
        if (user) {
            try{
                const userDocRef = doc(db, "reservations", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const reservationsData = docSnap.data();
                    setReservations(reservationsData);
                    console.log("Reservation Data: ",reservations);
                } else {
                    setReservations([]);
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error in fetching the reservation information: ", error)
            }
        }
    };

    //Update the Cart and Sent the Final Order through to Firebase
    const confirmedOrder = async() => {
        //Push Final Order to Firebase
        try{

            //Getting todays date
            const getTodaysDate = () => {
                const today = new Date();
                const day = String(today.getDate()).padStart(2, "0");
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const year = today.getFullYear();
    
                return `${day}/${month}/${year}`;
            }

            //Check if user is not null before accessing uid
            if (user) {
                const ordersCollectionRef = collection(db, "orders");
                //const newOrderDocRef = doc(ordersCollectionRef);

                if (orders.orderType === "takeAway") {
                    await addDoc(ordersCollectionRef, {
                        order: orders,
                        orderDate: getTodaysDate(),
                        orderNumber: CustomerOrderNumber,
                        userId: user.uid,
                    })
                    //Inform the user that information is added to the database
                    Alert.alert("TakeAway Order Placed");

                } else if (orders.orderType === "reservation") {
                    await addDoc(ordersCollectionRef, {
                        reservations: reservations,
                        order: orders,
                        orderDate: getTodaysDate(),
                        orderNumber: CustomerOrderNumber,
                        userId: user.uid,
                    })
                    //Inform the user that information is added to the database
                    Alert.alert("Reservation Placed");
                }

            } else {
                console.error("User Not Found");
            }
           
    } catch (error) {
        console.error(error.message);
    };

        //Remove the cart data from firebase for the current user
        try{
            //Check if user is not null before accessing uid
            if (user) {
                const userDocRef = doc(db, "cart", user.uid);

                //Create an object to hold the fields that need to be updated
                const resetFields = {
                    condiments : [],
                    drinks : [],
                    main: [],
                };
                    await updateDoc(userDocRef, resetFields);
    
                Alert.alert("Cart Cleared, Order Confirmed");
                navigation.navigate("OrderStatus");

            } else {
                console.error("Error in Updating User Information");
            }
           
            } catch (error) {
                console.error(error.message);
            };

            //Resetting the global states
            try {
                console.log("State before reset: ", state)
                dispatch({ type: "RESET_COLLECTIONS", payload: null});
                console.log("State after reset: ", state)
            } catch (error) {
                console.error("Error in resetting Cart Using Global States", error)
            } 
    };



    //Create a unique order number for the specific order shown
    const generateOrderNumber = () => {
        const randomNumber = Math.floor(10000 + Math.random() * 90000);

        const orderNumber = `OR${randomNumber}`;

        return orderNumber
    };
    const CustomerOrderNumber = generateOrderNumber();


    const handleCancelPress = () => {
        navigation.navigate("OrderCart", {userId})
    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }

    return(
        <ScrollView style={styles.main}>
            
            <View style={styles.heading_div}>
                <Text style={styles.heading}>Order Summary</Text>
            </View>

            <ScrollView style={styles.details_div}>
                <View style={styles.section}>

                    <Text style={styles.sectionHeading}>Order Information</Text>

                    <Text style={styles.details}>
                        <Text style={styles.header}>Order Number: </Text>
                            {CustomerOrderNumber}
                    </Text>

                    {Array.isArray(orders.condiments) && orders.condiments.map((condiment, index) => (
                        <View key={`condiment-${index}`} style={styles.items_div}>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Condiments {index + 1}: 
                                    <Text style={styles.details}>{condiment.name}</Text>
                                </Text>
                            </Text>
                            
                            <Text style={styles.details}>
                                <Text style={styles.header}>Price: </Text>
                                    R {condiment.price}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Quantity:</Text> 
                                    {condiment.quantity}
                            </Text>
                        </View>
                    ))}

                        {Array.isArray(orders.main) && orders.main.map((mainItem, index) => (
                            <View key={`main-${index}`} style={styles.items_div}>
                                <Text style={styles.details}>
                                    <Text style={styles.header}>Item {index + 1}: </Text>
                                        {mainItem.name}
                                </Text>

                                <Text style={styles.details}>
                                    <Text style={styles.header}>Ingredients: </Text>
                                        {mainItem.ingredients}
                                </Text>

                                <Text style={styles.details}>
                                    <Text style={styles.header}>Price: </Text>
                                        R {mainItem.price}
                                </Text>

                                <Text style={styles.details}>
                                    <Text style={styles.header}>Quantity: </Text>
                                         {mainItem.quantity}
                                </Text>
                            </View>
                        ))}

                        {Array.isArray(orders.drinks) && orders.drinks.map((drink, index) => (
                            <View key={`drink-${index}`} style={styles.items_div}>
                                <Text style={styles.details}>
                                    <Text style={styles.header}>Drinks {index + 1}: 
                                        <Text style={styles.details}>{drink.name}</Text>
                                    </Text>
                                </Text>
                            
                                <Text style={styles.details}>
                                    <Text style={styles.header}>Price: </Text>
                                        R {drink.price}
                                </Text>

                                <Text style={styles.details}>
                                    <Text style={styles.header}>Quantity:</Text>
                                     {drink.quantity}
                                </Text>
                            </View>
                        ))}

                            <Text style={styles.details}>
                                <Text style={styles.header}>Total Order Price: 
                                    <Text style={styles.details}>R {orders.orderPrice}</Text>
                                </Text>
                            </Text>
                </View>

                {!isEmpty(reservations) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeading}>Reservation Information</Text>
                        
                        <View style={styles.items_div}>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Agree To Terms: </Text>{" "}
                                {reservations.AgreeToTerms ? "Yes" : "No"}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Customer: </Text>
                                 {reservations.Name}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Date: </Text>
                                 {reservations.Date}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Email: </Text>
                                 {reservations.Email}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Number Of Guests: </Text>
                                 {reservations.Number_Of_Guests}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Occassion: </Text>
                                 {reservations.Occassion}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Phone Number: </Text>
                                 {reservations.Phone_Number}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Special Requests: </Text>
                                 {reservations.Special_Requests}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Table Selected: </Text>
                                 {reservations.Table}
                            </Text>

                            <Text style={styles.details}>
                                <Text style={styles.header}>Reservation Made: </Text>
                                 {reservations.reservationMade}
                            </Text>
                    </View>
                     </View>
                )}
                

            </ScrollView>

            <View style={styles.btn_div}>

            <TouchableOpacity style={styles.cancel_btn} onPress={() => handleCancelPress()}>
                <Text style={styles.cancel_btn_text}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirm_btn} onPress={() => confirmedOrder()}>
                <Text style={styles.confirm_btn_text}>Confirm</Text>
            </TouchableOpacity>

            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "black",
    },
    heading: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    heading_div: {
        marginTop: 30,
        marginLeft: 90,
        marginBottom: 50,
    },
    details_div: {
        flexDirection: "column",
        textAlign: "justify",
        borderWidth: 1,
        borderColor: "orange",
        marginLeft: 20,
        width: "90%",
        height: 630,
        padding: 10,
    },
    details: {
        color: "white",
        fontSize: 16,
    },
    items_div: {
        marginTop: 15,
        marginBottom: 15,
    },
    cancel_btn: {
        backgroundColor: "black",
        borderRadius: 30,
        height: 50,
        width: 100,
        padding: 8,
        paddingLeft: 12,
        marginLeft: 20,
        marginTop: 20,
        borderColor: "orange",
        borderWidth: 2,
    },
    cancel_btn_text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    confirm_btn: {
        backgroundColor: "orange",
        borderRadius: 30,
        height: 50,
        width: 105,
        padding: 10,
        marginLeft: 20,
        marginTop: 20,
    },
    confirm_btn_text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    btn_div: {
        flexDirection: "row",
        marginLeft: 60,
        marginBottom: 20,
        zIndex: 1,
        position: "relative",
        marginTop: 10,
    },
    header: {
        color: "orange",
        fontWeight: "bold",
        borderColor: "black",
        borderWidth: 1,
    },
    section: {
        marginTop: 20,
        marginBottom: 20,
      },
    
      sectionHeading: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      },
})

export default OrderDetails;