import {React, useEffect, useState} from "react";
import {db} from "../config/firebase";
import { getAuth } from "firebase/auth";
import {getDoc, doc, where, query} from "firebase/firestore";
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";

const OrderHistory = () =>{

    const navigation = useNavigation();

    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user.uid;
    const [orders, setOrders] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchedItem, setSearchedItem] = useState([]);

    const handleSearch = (searchTerm) => {
        //const filteredData = alls.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

        setSearchedItem(filteredData);
    }

    useEffect(() => {
        //const filteredData = orders.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

        setSearchedItem(filteredData);
    }, [searchTerm, orders])

    useEffect(() => {
        pullOrderHistoryData();
        console.log("Order History: ", orders, userUID);
    }, []);

    const pullOrderHistoryData = async() => {
        if (user) {
            try{
                const userDocRef = doc(db, "orders");
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const orderData = docSnap.data();
                    setOrders(orderData);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error in fetching the order information: ", error)
            }
        }
    };

    return(
        <View style={styles.main}>

            <View style={styles.heading_div}>

                <TouchableOpacity style={styles.btn_back}>
                    <Image style={styles.back_image} source={require("../images/icons/arrow-left.png")} />
                </TouchableOpacity>
               
                <Text style={styles.heading}>Order History</Text>

            </View>

            <View style={styles.search_div}>
                <TextInput placeholder="Search by OrderNumber..." placeholderTextColor="white" style={styles.search} value={searchTerm} onChangeText={(text) => setSearchTerm(text)} />
            </View>

            <TouchableOpacity style={styles.search_icon_div} onPress={(searchTerm) => handleSearch(searchTerm)}>
                <Image style={styles.search_icon} source={require("../images/icons/search.png")} />
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.dishes}>
                    <Text key={orders.id} style={styles.details}>
                        <Text style={styles.header}>Order Number: </Text>
                            R {orders.orderNumber}
                    </Text>

                {searchTerm.length > 0 && (
                <View style={styles.dishes}>
                {searchedItem.map((item) => (
                    <View key ={item.id} style={styles.item_box}>
                    <Image source={{ uri: item.image}} style={styles.dish} />
    
                    <Text style={styles.dish_name}>{item.name}</Text>
    
                    <TouchableOpacity style={styles.new_btn}>
                        <Text style={styles.category_text}>New</Text>
                    </TouchableOpacity>
    
                    <View style={styles.description_container}>
                        <ScrollView style={{maxHeight: 120}}>
                            <Text style={styles.description}>{item.description}</Text>
                        </ScrollView>
    
                    <TouchableOpacity key={item.id} style={styles.btn_price} onPress={() => SelectedItemPress(item)}>
                        <Text style={styles.price_text}>R {item.price}</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                ))}
                 </View>
            )}

                  {/*  {orders.map((order) => (
                        <View key ={order.id} style={styles.item_box}>
                        <Image source={{ uri: order.image}} style={styles.dish} />
        
                        <Text style={styles.dish_name}>{order.orderNumber}</Text>
        
                        <TouchableOpacity style={styles.new_btn}>
                            <Text style={styles.category_text}>New</Text>
                        </TouchableOpacity>
        
                        <View style={styles.description_container}>
                            <ScrollView style={{maxHeight: 120}}>
                                <Text style={styles.description}>{order.description}</Text>
                            </ScrollView>
        
                        <TouchableOpacity key={all.id} style={styles.btn_price}>
                            <Text style={styles.price_text}>R {order.price}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                  ))} */}
                    
                    {Array.isArray(orders.condiments) && orders.condiments.map((condiment, index) => (
                        <View key={`condiment-${index}`} style={styles.items_div}>
                            <Text style={styles.details}>
                                <Text style={styles.header}>Condiments {index + 1}: <Text style={styles.details}>{condiment.name}</Text></Text>
                            </Text>
                            
                            <Text style={styles.details}>
                                <Text style={styles.header}>Price: </Text>
                            R {condiment.price}
                            </Text>
                            <Text style={styles.details}>
                                <Text style={styles.header}>Quantity:</Text>{condiment.quantity}
                            </Text>
                        </View>
                    ))}

            {Array.isArray(orders.drinks) && orders.drinks.map((drink, index) => (
                        <View key={`drink-${index}`} style={styles.items_div}>
                            <Text style={styles.details}>
                                <Text style={styles.header}>Drinks {index + 1}: <Text style={styles.details}>{drink.name}</Text></Text>
                            </Text>
                            
                            <Text style={styles.details}>
                                <Text style={styles.header}>Price: </Text>
                            R {drink.price}
                            </Text>
                            <Text style={styles.details}>
                                <Text style={styles.header}>Quantity:</Text>{drink.quantity}
                            </Text>
                        </View>
                    ))}

            {Array.isArray(orders.main) && orders.main.map((item, index) => (
                        <View key={`item-${index}`} style={styles.items_div}>
                            <Text style={styles.details}>
                                <Text style={styles.header}>Item {index + 1}: <Text style={styles.details}>{item.name}</Text></Text>
                            </Text>
                            
                            <Text style={styles.details}>
                                <Text style={styles.header}>Price: </Text>
                            R {item.price}
                            </Text>
                            <Text style={styles.details}>
                                <Text style={styles.header}>Quantity:</Text>{item.quantity}
                            </Text>
                        </View>
                    ))}
                     </View>
            </ScrollView>

            <TouchableOpacity style={styles.btn_history} onPress={() => navigation.navigate("Menu")}>
                <Text style={styles.btn_history_text}>Back To Main Menu</Text>
            </TouchableOpacity>
        </View>
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
        marginLeft: 20,
    },
    heading_div: {
        marginTop: 30,
        marginLeft: 90,
        marginBottom: 30,
    },
    btn_back: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        zIndex: 1,
        position: "absolute",
        right: 320,
        borderRadius: 30,
        padding: 0,
        borderColor: "red",
        borderWidth: 3,
    },
    back_image: {
        width: 45,
        height: 46,
    },
    btn_history: {
        backgroundColor: "orange",
        width: 250,
        height: 55,
        borderRadius: 50,
        borderColor: "black",
        borderWidth: 3,
        padding: 8,
        marginLeft: 90,
        marginTop: 10,
        marginBottom: 15,
    },
    btn_history_text: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
    },
    search: {
        fontSize: 20,
        fontStyle: "italic",
        backgroundColor: "black",
        height: 40,
        fontWeight: "bold",
        width: 300,
        padding: 6,
        borderRadius: 20,
        color: "white",
    },
    search_div: {
        marginLeft: 20,
        marginBottom: 15,
    },
    dishes: {
        flexDirection: "row",
    },
    item_box: {
        width: 250,
        paddingBottom: 20,
        marginRight: 20,
        marginLeft: 20,
    },
    dish: {
        height: 300,
        width: "100%",
        borderRadius: 15,
    },
    dish_name: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        marginBottom: 5,
    },
    new_btn: {
        backgroundColor: "orange",
        width: 65,
        height: 50,
        padding: 10,
        borderRadius: 30,
        marginLeft: 90,
        marginBottom: 10,
    },
    category_text: {
        fontSize: 19,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    description_container: {
        marginTop: 10,
        paddingHorizontal: 20,
        height: 200,
    },
    description: {
        color: "white",
        fontSize: 16,
        fontWeight: "normal",
        textAlign:"center",
        marginBottom: 10,
    },
    btn_price: {
        backgroundColor: "orange",
        width: 150,
        height: 55,
        borderRadius: 50,
        padding: 8,
        marginTop: 10,
        marginLeft: 20,
    },
    price_text: {
        color: "white",
        textAlign: "center",
        fontSize: 25,
        fontWeight: "bold",
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
      search_div: {
        marginTop: 30,
        marginLeft: 20,
        marginBottom: 15,
    },
    search_icon: {
        width:35,
        height:35,
       
        position: "relative",
    },
    search_icon_div: {
        position: "absolute",
        zIndex: 1,
        top: 130,
        left: 340,
        width: 50,
        height: 50,
        backgroundColor: "white",
        borderRadius: 50,
        borderStyle: "solid",
        borderWidth: 3,
        borderColor: "orange",
        padding: 5,
    },
});

export default OrderHistory;