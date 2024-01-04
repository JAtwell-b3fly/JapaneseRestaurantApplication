import {React, useState} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

const SeatBooking = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { userId } = route.params;
    
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedTables, setSelectedTables] = useState([]);
    const [addState, setAddState] = useState({});
    const [tables, setTables] = useState({
        table_1: "Table 1",
        table_2: "Table 2",
        table_3: "Table 3",
        table_4: "Table 4",
        table_5: "Table 5",
        table_6: "Table 6",
        table_7: "Table 7",
        table_8: "Table 8",
        table_9: "Table 9",
    })

    const handleSelectedTable = (table) => {
    // Set the addState for all tables to "add"
  const updatedAddState = {};
  Object.keys(tables).forEach((key) => {
    updatedAddState[key] = "add";
  });

  // If the selected table is already in the current selection, clear it
  if (selectedTable === table) {
    setSelectedTable("");
  } else {
    // Set the selected table and update the state
    setSelectedTable(table);
    updatedAddState[table] = "add_clicked";
  }

  // Update the addState
  setAddState(updatedAddState);
}

    const handleBookSeat = () => {
        Alert.alert(`${selectedTable} successfully booked`);
        navigation.navigate("Reservation", {
            userId, 
            selectedTable});
    }

    return(
        <View style={styles.main}>

            <View style={styles.top_btn_div}>
            <TouchableOpacity style={styles.delivery_btn} onPress={() => navigation.navigate("OrderCart", {userId})}>
                    <Text style={styles.top_btn_text}>Order Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurant_btn} onPress ={() => navigation.navigate("RestaurantCart")}>
                    <Text style={styles.top_btn_text}>In The Restaurant</Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.seating_arrangements}>
                <View style={styles.first_row}>
                    <TouchableOpacity key={tables.table_1} style={[styles.table1, addState["Table 1"] === "add_clicked" && styles.table1_selected]} onPress={() => handleSelectedTable("Table 1")}><Text style={styles.table_styling_horizontal}>Table 1</Text></TouchableOpacity>
                    <TouchableOpacity key={tables.table_2} style={[styles.table2, addState["Table 2"] === "add_clicked" && styles.table2_selected]} onPress={() => handleSelectedTable("Table 2")}><Text style={styles.table_styling_horizontal}>Table 2</Text></TouchableOpacity>
                </View>

                <View style={styles.second_row}>
                    <TouchableOpacity key={tables.table_3} style={[styles.table3, addState["Table 3"] === "add_clicked" && styles.table3_selected]} onPress={() => handleSelectedTable("Table 3")}><Text style={styles.table_styling_vertical}>Table 3</Text></TouchableOpacity>
                    <TouchableOpacity key={tables.table_4} style={[styles.table4, addState["Table 4"] === "add_clicked" && styles.table4_selected]} onPress={() => handleSelectedTable("Table 4")}><Text style={styles.table_styling_vertical}>Table 4</Text></TouchableOpacity>
                </View>

                <View style={styles.third_row}>
                    <TouchableOpacity key={tables.table_5} style={[styles.table5, addState["Table 5"] === "add_clicked" && styles.table5_selected]} onPress={() => handleSelectedTable("Table 5")}><Text style={styles.table_styling_vertical}>Table 5</Text></TouchableOpacity>
                    <TouchableOpacity key={tables.table_6} style={[styles.table6, addState["Table 6"] === "add_clicked" && styles.table6_selected]} onPress={() => handleSelectedTable("Table 6")}><Text style={styles.table_styling_vertical}>Table 6</Text></TouchableOpacity>
                </View>

                <View style={styles.fourth_row}>
                    <TouchableOpacity key={tables.table_7} style={[styles.table7, addState["Table 7"] === "add_clicked" && styles.table7_selected]} onPress={() => handleSelectedTable("Table 7")}><Text style={styles.table_styling_horizontal}>Table 7</Text></TouchableOpacity>
                    <TouchableOpacity key={tables.table_8} style={[styles.table8, addState["Table 8"] === "add_clicked" && styles.table8_selected]} onPress={() => handleSelectedTable("Table 8")}><Text style={styles.table_styling_horizontal}>Table 8</Text></TouchableOpacity>
                </View>

                <View style={styles.middle_row}>
                    <TouchableOpacity key={tables.table_9} style={[styles.table9, addState["Table 9"] === "add_clicked" && styles.table9_selected]} onPress={() => handleSelectedTable("Table 9")}><Text style={styles.table_styling_vertical}>Table 9</Text></TouchableOpacity>
                </View>

            </View>


            <View style={styles.main_btns}>
                <TouchableOpacity style={styles.btn_condiments} onPress={() => navigation.navigate("RestaurantCart", {userId})}>
                    <Text style={styles.btn_condiments_text}>Cancel Booking</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_cart} onPress={() => handleBookSeat()}>
                    <Text style={styles.btn_cart_text}>Book Seat</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.nav_box}>
                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("Menu")}>
                    <Image source={require("../images/icons/rice-bowl.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("RestaurantCart")}>
                    <Image source={require("../images/icons/diamonds-colour.png")} style={styles.nav_btn_image} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("OrderCart")}>
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
    main_btns: {
        marginTop: 15,
        marginBottom: 25,
        flexDirection: "row",
    },
    seating_arrangements: {
        flexDirection: "column",
        marginBottom: 15,
    },
    first_row: {
        flexDirection: "row",
    },
    second_row: {
        flexDirection: "row",
    },
    third_row: {
        flexDirection: "row",
    },
    fourth_row: {
        flexDirection: "row",
        marginTop: 30,
    },
    middle_row: {
        position: "absolute",
        zIndex: 1,
        top: 80,
        left: 170,
    },
    table1: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 25,
    },
    table1_selected: {
        backgroundColor: "orange",
        width: 170,
        height: 50,
        marginLeft: 25,
    },
    table2: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 20,
    },
    table2_selected: {
        backgroundColor: "orange",
        width: 170,
        height: 50,
        marginLeft: 20,
    },
    table7: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 25,
    },
    table7_selected: {
        backgroundColor: "orange",
        width: 170,
        height: 50,
        marginLeft: 25,
    },
    table8: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 20,
    },
    table8_selected: {
        backgroundColor: "orange",
        width: 170,
        height: 50,
        marginLeft: 20,
    },
    table3: {
        width:50,
        height:170,
        marginLeft: 40,
        marginTop: 30,
        backgroundColor: "white",
    },
    table3_selected: {
        width:50,
        height:170,
        marginLeft: 40,
        marginTop: 30,
        backgroundColor: "orange",
    },
    table4: {
        width:50,
        height:170,
        marginLeft: 220,
        marginTop: 30,
        backgroundColor: "white",
    },
    table4_selected: {
        width:50,
        height:170,
        marginLeft: 220,
        marginTop: 30,
        backgroundColor: "orange",
    },
    table5: {
        width:50,
        height:170,
        marginLeft: 40,
        marginTop: 30,
        backgroundColor: "white",
    },
    table5_selected: {
        width:50,
        height:170,
        marginLeft: 40,
        marginTop: 30,
        backgroundColor: "orange",
    },
    table6: {
        width:50,
        height:170,
        marginLeft: 220,
        marginTop: 30,
        backgroundColor: "white",
    },
    table6_selected: {
        width:50,
        height:170,
        marginLeft: 220,
        marginTop: 30,
        backgroundColor: "orange",
    },
    table9: {
        width:50,
        height:370,
        backgroundColor: "white",
        paddingTop: 80,
    },
    table9_selected: {
        width:50,
        height:370,
        backgroundColor: "orange",
    },
    table_styling_horizontal: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
        paddingTop: 10,
    },
    table_styling_vertical: {
        color: "black",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: 30,
        paddingLeft: 15,
    }
});

export default SeatBooking;