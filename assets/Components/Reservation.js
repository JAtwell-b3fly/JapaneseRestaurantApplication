import {React, useState} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {db} from "../config/firebase";
import {doc, setDoc} from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { getAuth } from "firebase/auth";

const Reservation = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { 
        userId, 
        selectedTable } = route.params;

    const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = user.email;

    //variables
    const [isChecked, setIsChecked] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("" || userEmail);
    const [cellNumber, setCellNumber] = useState("");
    const [date, setDate] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const [occassion, setOccassion] = useState("Casual Dining");

    const validateDate = (text) => {
        //Regular expression for dd/mm/yyyy
        const dataRegex = /^[0-9/]*$/;

        if (dataRegex.test(text) || text === "") {
            setDate(text);
        }
    };

    const validatePhoneNumber = (text) => {
        //Only allow up to ten digits
        if (/^\d{0,10}$/.test(text) || text === "") {
            setCellNumber(text)
        }
    };

    const validateNumberOfGuests = (text) => {
            setNumberOfGuests(text);
    }

    const addToReservations = async() => {

        try{
            //Save user information to Firestore
            const auth = getAuth();
            const user = auth.currentUser;
            const userUID = user.uid;
            let userId = userUID;

            //Getting todays date
            const getTodaysDate = () => {
                const today = new Date();
                const day = String(today.getDate()).padStart(2, "0");
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const year = today.getFullYear();
    
                return `${day}/${month}/${year}`;
            }

            console.log("userId", userId);

            //Check if user is not null before accessing uid
            if (user) {
                const userUID = user.uid;
                const userDocRef = doc(db, "reservations", userUID);

                await setDoc(userDocRef, {
                    Name: name,
                    Email: email,
                    Phone_Number: cellNumber,
                    Number_Of_Guests: numberOfGuests,
                    Special_Requests: specialRequests,
                    Date: date,
                    Occassion: occassion,
                    AgreeToTerms: isChecked,
                    reservationMade: getTodaysDate(),
                    Table: selectedTable,
                })

                //Inform the user that information is added to the database
                Alert.alert("Added To Cart");
                navigation.navigate("OrderDetails", {userId: userUID})
            } else {
                console.error("User Not Found");
            }
           
    } catch (error) {
        console.error(error.message);
    };
};

    const handleClearPress = () => {
        //Set everything back to its default empty state
        setName("");
        setEmail("");
        setCellNumber("");
        setDate("");
        setNumberOfGuests(0);
        setSpecialRequests("");
        setOccassion("Casual Dining");
        setIsChecked(false);
        setShowTerms(false);
    }

    const toggleTerms = () => {
        setShowTerms(!showTerms);
    }

    const handleCancelPress = () => {
        navigation.navigate("SeatBooking", {
            //userId, 
            selectedTable});
    }

    return(
        <ScrollView style={styles.main}>

            <View style={styles.top_btn_div}>
                <TouchableOpacity style={styles.delivery_btn} onPress={() => navigation.navigate("OrderCart")}>
                    <Text style={styles.top_btn_text}>Order Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.restaurant_btn} onPress ={() => navigation.navigate("RestaurantCart")}>
                    <Text style={styles.top_btn_text}>In The Restaurant</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{flex: 1, marginTop: 25,}}>
            <View style={styles.seating_arrangements}>
                <View style={styles.first_row}>
                    <TextInput style={styles.input1} placeholder="Full Name" value={name} onChangeText={(text) => setName(text)}></TextInput>
                </View>

                <View style={styles.second_row}>
                    <TextInput style={styles.input2} placeholder={userEmail} value={email} onChangeText={(text) => setEmail(text)}></TextInput>
                    <TextInput style={styles.input3} placeholder="Phone Number" value={cellNumber} keyboardType = "numeric" maxLength = {10} onChangeText={(text) => setCellNumber(text)}></TextInput>
                    
                </View>

                <View style={styles.third_row}>
                    <TextInput style={styles.input4} placeholder="Date: (dd/mm/yyyy)" value={date} onChangeText={(text) => setDate(text)}></TextInput>

                    <TextInput style={styles.input5} placeholder="Number of Guests" value={numberOfGuests} keyboardType = "numeric" onChangeText={(text) => setNumberOfGuests(text)}></TextInput>
                </View>

                <View style={styles.fourth_row}>
                    <TextInput style={styles.input6} placeholder="Special Requests" value={specialRequests} onChangeText={(text) => setSpecialRequests(text)}></TextInput>

                    <Picker style={styles.input7} selectedValue={occassion} onValueChange={(occassionChosen) => setOccassion(occassionChosen)}>
                        <Picker.Item label="Casual Dining" value="Casual Dining" />
                        <Picker.Item label="Birthday Celebration" value="Birthday Celebration" />
                        <Picker.Item label="Business Meeting" value="Business Meeting" />
                        <Picker.Item label="Anniversary Celebration" value="Anniversary Celebration" />
                        <Picker.Item label="Proposal" value="Proposal" />
                    </Picker>
                </View>

                <View style={styles.fifth_row}>
                    <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>

                    { isChecked ? (
                        <Image style={styles.checkbox} source={require("../images/icons/approved.png")} />
                    ) : (
                        <Image style={styles.checkbox} source={require("../images/icons/unchecked.png")} />
                    )} 

                    </TouchableOpacity>
                    
                    <Text style={styles.agree}>I agree to the terms and conditions</Text>
                    </View>
                    </View>
                </ScrollView>

                    <View>
                    <View>
                    <TouchableOpacity style={styles.terms_btn} onPress={toggleTerms}>
                        <Text style={styles.terms}>
                            {showTerms ? "Hide Terms and Conditions" : "Show Terms and Conditions"}
                        </Text>
                    </TouchableOpacity>
                    {!showTerms && (
                        <ScrollView style={{ height: 130, marginTop: 10, blackgroundColor: "black"}} />
                    )}
                    {showTerms && (
                        <ScrollView style={{ maxHeight: 130, marginTop: 10}}>
                            <Text style={styles.terms_conditions}>
                            Reservation Terms and Conditions

                            Reservation Confirmation: By making a reservation at Japanese Restaurant, you acknowledge and agree to the following terms and conditions.

                            Reservation Payment: A reservation at Japanese Restaurant may require prepayment or a credit card guarantee. The payment details will be provided during the reservation process.

                            Payment Obligation: Once a reservation is confirmed, you are obliged to pay for the reserved table, regardless of whether you show up or not. This policy is in place because when a table is reserved, it is taken off the availability list, denying other potential customers the opportunity to dine.

                            Cancellation Policy: You may cancel your reservation without charge up to 24 hours before the reservation time. To cancel, please use the link provided in your reservation confirmation email or contact our reservation team directly.

                            Late Cancellation or No-Show: If you cancel your reservation within 24 hours of the reservation time or fail to show up, Japanese Restaurant reserves the right to charge a cancellation fee. The amount of the fee may vary depending on the circumstances and will be communicated to you at the time of cancellation.

                            Reservation Duration: We kindly ask that you adhere to the agreed reservation duration. If you require more time, please contact us in advance to make the necessary arrangements. Extending your reservation may be subject to availability.

                            Group Reservations: For large group reservations or special events, please contact our events team for specific terms and conditions.

                            Changes to Reservation: If you need to modify your reservation in any way, please do so as soon as possible by contacting our reservation team. We will do our best to accommodate your request, subject to availability.

                            Child Policy: Japanese Restaurant welcomes families with children. Please inform us in advance if you require high chairs or have any special requests for young diners.

                            Special Requests: If you have any dietary restrictions or special requests, please let us know in advance, and we will do our best to accommodate your needs.

                            Privacy Policy: Your personal information is important to us. Please review our privacy policy to understand how we collect, use, and protect your data.

                            Reservation Disputes: In the event of any disputes or concerns regarding your reservation, please contact our management team, and we will work to resolve the issue to your satisfaction.

                            Reservation Confirmation: You will receive a confirmation email or SMS for your reservation. Please present this confirmation upon arrival.

                            Japanese Restaurant appreciates your understanding and cooperation with these reservation terms and conditions. We look forward to welcoming you for a delightful dining experience.

                            If you have any questions or require further clarification on these terms and conditions, please feel free to contact us.
                            </Text>
                        </ScrollView>
                    )}
                </View>

                <View style={styles.submit_row}>
                <TouchableOpacity style={styles.clear} onPress={() => handleClearPress()}><Text style={styles.clear_text}>Clear</Text></TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottom_btns}>
            <View style={styles.main_btns}>
                <TouchableOpacity style={styles.btn_condiments} onPress={() => handleCancelPress()}>
                    <Text style={styles.btn_condiments_text}>Cancel Booking</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn_cart} onPress={() => addToReservations()}>
                    <Text style={styles.btn_cart_text}>Confirm Booking</Text>
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
        
        </ScrollView>
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
        paddingTop: 10,
        marginLeft: 20,
    },
    btn_cart_text: {
        color: "white",
        textAlign: "center",
        fontSize: 19,
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
        marginTop: 10,
        marginBottom: 25,
        flexDirection: "row",
    },
    seating_arrangements: {
        flexDirection: "column",
        marginBottom: 15,
    },
    submit_row: {
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 20,
    },
    first_row: {
        flexDirection: "row",
        marginBottom: 15,
    },
    second_row: {
        flexDirection: "row",
        marginBottom: 15,
    },
    third_row: {
        flexDirection: "row",
        marginBottom: 15,
    },
    fourth_row: {
        flexDirection: "row",
        marginBottom: 15,
    },
    fifth_row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    terms_btn: {
        backgroundColor: "white",
        width: 350,
        height: 50,
        marginLeft: 25,
        borderRadius: 20,
        padding: 10,
        fontSize: 16,
        fontWeight: "400",
    },
    input1: {
        backgroundColor: "white",
        width: 350,
        height: 50,
        marginLeft: 25,
        borderRadius: 20,
        padding: 10,
        fontSize: 13,
        fontWeight: "400",
    },
    input2: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 20,
        borderRadius: 20,
        padding: 10,
        fontSize: 13,
        fontWeight: "400",
    },
    input7: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 15,
        padding: 10,
        fontSize: 13,
        fontWeight: "400",
        borderRadius: 20,
    },
    horizontal_table4: {
        backgroundColor: "orange",
        width: 170,
        height: 50,
        marginLeft: 20,
    },
    input3: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 15,
        borderRadius: 20,
        padding: 10,
        fontSize: 13,
        fontWeight: "400",
    },
    input4: {
        backgroundColor: "white",
        width: 170,
        height: 50,
        marginLeft: 20,
        borderRadius: 20,
        padding: 10,
        fontSize: 13,
        fontWeight: "400",
    },
    input5: {
        width: 170,
        height: 50,
        marginLeft: 15,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        fontSize: 13,
        fontWeight: "400",
    },
    input6: {
        width:170,
        height:50,
        marginLeft: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        fontSize: 13,
        fontWeight: "400",
    },
    vertical_table5: {
        width:170,
        height:50,
        backgroundColor: "white",
        marginLeft: 20,
        marginTop: 15,
    },
    clear: {
        width:60,
        height:40,
        marginLeft: 20,
        backgroundColor: "black",
        borderRadius: 20,
        padding: 6,
        borderColor: "orange",
        borderWidth: 3,
    },
    clear_text: {
        fontSize: 14,
        fontWeight: "500",
        color: "white"
    },
    submit: {
        width:70,
        height:40,
        marginLeft: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 6,
        borderColor: "orange",
        borderWidth: 3,
    },
    submit_text: {
        fontSize: 14,
        fontWeight: "500",
    },
    checkbox: {
        width: 40,
        height: 40,
        backgroundColor: "white",
        marginLeft: 20,
        borderRadius: 10,
    },
    terms: {
        fontSize: 16,
        fontWeight: "normal",
    },
    terms_conditions: {
        color: "white",
        letterSpacing: 2,
        textAlign: "justify",
        marginLeft: 25,
        marginRight: 25,
        marginTop: 5,
        marginBottom: 5,
    },
    agree: {
        color: "white",
        letterSpacing: 1,
        textAlign: "justify",
        marginLeft: 20,
        marginTop: 8,
    },
    bottom_btns: {
        position: "relative",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    container: {
        marginVertical: 10,
        paddingHorizontal: 20,
    }
});

const pickerSelectStyles = StyleSheet.create ({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
        color: "black",
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: "red",
        borderRadius: 8,
        color: "black",
        paddingRight: 30,
    }
})

export default Reservation;