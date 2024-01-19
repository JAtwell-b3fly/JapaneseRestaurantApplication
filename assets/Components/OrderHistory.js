import {React, useEffect, useState} from "react";
import {db} from "../config/firebase";
import { getAuth } from "firebase/auth";
import {where, query, collection, getDocs} from "firebase/firestore";
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, FlatList} from "react-native";
import { useNavigation } from "@react-navigation/native";

const OrderHistory = () =>{

    const navigation = useNavigation();

    const auth = getAuth();
    const user = auth.currentUser;
    const userUID = user.uid;
    const [orders, setOrders] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchedItem, setSearchedItem] = useState([]);

    const handleSearch = () => {
        const filteredOrders = orders.filter((order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchedItem(filteredOrders);
      };

    useEffect(() => {
        pullOrderHistoryData();
        console.log("Orders List ", orders);
        console.log("Orders Made: ", orders.length);
    }, []);

    /*CHATGPT PASTE >>>>>>>>>>
        this is what one document's contents look like in firestore:
        userId: asdfasdfadf,
        orderDate: dd/mm/yyyy,
        orderNumber: OR26388,
        reservations: [],
        order: {}
    */

    const pullOrderHistoryData = async() => {
        const userOrdersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));

            try {
            const querySnapshot = await getDocs(userOrdersQuery);

            if (!querySnapshot.empty) {
                const ordersData = querySnapshot.docs.map((doc) => ({ 
                    id: doc.id,
                    order: doc.data().order,
                    orderNumber: doc.data().orderNumber,
                }));
                setOrders(ordersData);
            } else {
                console.log("No orders found for the user!");
                setOrders([]);
            }
            } catch (error) {
            console.error("Error in fetching the order information: ", error);
            }
    };

    const formatMonth = (dateString) => {
        const [month, day, year] = dateString.split("/");
        const monthAbbreviation = getMonthAbbreviation(parse(month, 10));

        return `${monthAbbreviation}`
    }

    const formatDay = (dateString) => {
        const [month, day, year] = dateString.split("/");
        const monthAbbreviation = getMonthAbbreviation(parse(month, 10));

        return `${day}`
    }

    const getMonthAbbreviation = (month) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[month - 1];
    }

    return(
        <View style={styles.main}>

            <View style={styles.heading_div}>

                <TouchableOpacity style={styles.btn_back} onClick={() => navigation.navigate("Profile")}>
                    <Image style={styles.back_image} source={require("../images/icons/arrow-left.png")} />
                </TouchableOpacity>
               
                <Text style={styles.heading}>Order History</Text>

            </View>

            <View style={styles.search_div}>
                <TextInput placeholder="Search by OrderNumber..." 
                            placeholderTextColor="white" 
                            style={styles.search} value={searchTerm} 
                            onChangeText={handleSearch} />
            </View>

            <TouchableOpacity style={styles.search_icon_div} onPress={(searchTerm) => handleSearch(searchTerm)}>
                <Image style={styles.search_icon} source={require("../images/icons/search.png")} />
            </TouchableOpacity>

            <ScrollView horizontal>
                {orders.map((order) => (
                    <View style={styles.container} key={order.id}>
                    <View style={styles.orderBox}>
                        <View style={styles.dateBox}>
                            <Text style={styles.date_month}>{formatMonth(order.orderDate) || "OCT"}</Text>
                            <Text style={styles.date_day}>{formatDay(order.orderDate) || "26"}</Text>
                        </View>

                        <View style={styles.descriptionBox}>
                            {order.order.main && order.order.main.length > 0 ? (
                                order.order.main.map((mainDish) => (
                                    <Text style={styles.dish_name} key={mainDish.id}>{mainDish.name || "Spicy Ramen Noodles"}</Text>
                                ))
                            ): (
                                    <Text style={styles.dish_name} key={mainDish.id}>{"No Main Dish"}</Text>
                            )}
                            
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.reference_nr}>#{order.orderNumber || "#OR65168"}</Text>
                                <Text style={styles.typeTime}>.{order.order.orderType|| "Delivery"}.</Text>
                                <Text style={styles.typeTime}>{order.order.orderDate|| "12:40"}</Text>
                            </View>

                        </View>

                        <View style={styles.drilldownBox}>
                            <Text style={styles.arrow}>></Text>
                        </View>
                    </View>
                </View>
                ))}
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
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      orderBox: {
        backgroundColor: 'rgb(69, 71, 75)',
        height: "auto",
        width: 390,
        margin: 10,
        zIndex: 1,
        flex: 1,
        flexDirection: 'row',
        padding: 10,
      },
      dateBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -25,
        height:"auto",
        marginRight: 15
      },
      descriptionBox: {
        textAlign: "left",
        height: "auto",
        width: "60%",
        justifyContent: "center",
        marginRight: 5,
      },
      drilldownBox: {
        flex: 1,
        height: "auto",
        justifyContent: "center",
        marginLeft: 40,
        textAlign: "right"
      },
      date_month: {
        color: 'rgb(182, 187, 196)',
        zIndex: 1,
        fontSize: 18,
      },
      date_day: {
        color: 'rgb(182, 187, 196)',
        zIndex: 1,
        fontWeight: "bold",
        fontSize: 30,
      },
      arrow: {
        color: 'white',
        zIndex: 1,
        fontWeight: "300",
        fontSize: 60,
      },
      dish_name: {
        color: 'orange',
        zIndex: 1,
        fontWeight: "bold",
        fontSize: 20,
        paddingBottom: 5,
      },
      reference_nr: {
        color: 'white',
        zIndex: 1,
        fontWeight: "400",
        fontSize: 18,
      },
      typeTime: {
        color: 'white',
        zIndex: 1,
        fontWeight: "100",
        fontSize: 15,
        marginLeft: 10,
        paddingTop:2,
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