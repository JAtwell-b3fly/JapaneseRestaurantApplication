import {React, useState, useEffect} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../config/firebase";
import { getAuth } from "firebase/auth";
import { useAppContext } from "./AppNavigation";

import Loader from "./Loading";

const Menu = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;

    const navigation = useNavigation();
    const {dispatch, selectedCondiments, selectedDrinks, dishData} = useAppContext();

    const SelectedItemPress = (selectedItem) => {
        dispatch({type: "ADD_DISH", payload: selectedItem});
        navigation.navigate("Description", {
            dishData,
            userId,
            selectedCondiments,
            selectedDrinks,
        })
    };

    const RestaurantCartSelected = () => {
        navigation.navigate("RestaurantCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const OrderCartSelected = () => {
        navigation.navigate("OrderCart", {userId, dishData, selectedCondiments, selectedDrinks});
    };

    const [drinks, setDrinks] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [ramens, setRamens] = useState([]);
    const [specialDishes, setSpecialDishes] = useState([]);
    const [sushis, setSushis] = useState([]);
    const [alls, setAlls] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [menuPending, setMenuPending] = useState(false);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    useEffect(() => {
        getDrinks();
        getDesserts();
        getRamens();
        getSpecialDishes();
        getSushi();
        getAll();
    }, [selectedCategory]);

    const getAll = async() => {
        setMenuPending(true);
        try {
            const drinkData = await getDataForCategory("drinks");
            const sushiData = await getDataForCategory("sushi");
            const ramenData = await getDataForCategory("ramen");
            const specialData = await getDataForCategory("special-dishes");
            const dessertData = await getDataForCategory("desserts");

            const allData = [...drinkData, ...sushiData, ...ramenData, ...specialData, ...dessertData];
            setMenuPending(false);

            setAlls(allData);
        } catch (error) {
            console.error("Error fetching all data: ", error);
        }
        
    };

    const getDataForCategory = async (category) => {
        try {
            const querySnapShot = await getDocs(collection(db, category));
            const data = querySnapShot.docs.map(async (doc) => {
                const itemData = doc.data();
                    return {
                        id: doc.id,
                        ...itemData,
                    };
            });

            return Promise.all(data);
        } catch (error) {
            console.error(`Error fetching ${category} data: `, error);
            return [];
        }
    }

    const getSushi = async() => {
        setMenuPending(true);
        try {
            if (selectedCategory === "Sushi") {
                const querySnapShot = await getDocs(collection(db, "sushi"));
                const data = querySnapShot.docs.map(async (doc) => {
                    const sushisData = doc.data();
                        return {
                            id: doc.id,
                            ...sushisData,
                        }
                })

                const sushiData = await Promise.all(data);
                setSushis(sushiData);
            }
        } catch (error) {
            console.log("Error in fetching sushis", error);
        }
        setMenuPending(false);
    }

    const getSpecialDishes = async() => {
        setMenuPending(true);
        try {
            if (selectedCategory === "SpecialDishes") {
                const querySnapShot = await getDocs(collection(db, "special-dishes"));
                const data = querySnapShot.docs.map(async (doc) => {
                    const specialsData = doc.data();
                        return {
                            id: doc.id,
                            ...specialsData,
                        }
                })

                const specialData = await Promise.all(data);
                setSpecialDishes(specialData);
            }
        } catch (error) {
            console.error("Error in fetching special dishes:", error)
        }
        setMenuPending(false);
    }

    const getRamens = async() => {
        setMenuPending(true);
        try {
            if (selectedCategory === "Ramen") {
                const querySnapShot = await getDocs(collection(db, "ramen"));
                const data = querySnapShot.docs.map(async (doc) => {
                    const ramensData = doc.data();
                        return {
                            id: doc.id,
                            ...ramensData,
                        }
                })

                const ramenData = await Promise.all(data);
                setRamens(ramenData);
            }
        } catch (error) {
            console.error("Error fetching ramen list", error);
        }
        setMenuPending(false);
    }

    const getDesserts = async() => {
        setMenuPending(true);
        try {
            if (selectedCategory === "Desserts") {
                const querySnapShot = await getDocs(collection(db, "desserts"));
                const data = querySnapShot.docs.map(async (doc) => {
                    const dessertData = doc.data();
                        return {
                            id: doc.id,
                            ...dessertData,
                        }
                })

                const dessertData = await Promise.all(data);
                setDesserts(dessertData);
            }
        } catch (error) {
            console.error("Error fetching desserts:", error);
        }
        setMenuPending(false);
    };

    const getDrinks = async() => {
        setMenuPending(true);
        try {
                if (selectedCategory === "Drinks") {
                const querySnapShot = await getDocs(collection(db,"drinks"));
                const data = querySnapShot.docs.map(async (doc) => {
                    const drinkData = doc.data();

                    console.log(drinkData)
                    
                        return {
                            id: doc.id,
                            ...drinkData,
                        }
                })

                const drinksData = await Promise.all(data);
                setDrinks(drinksData);
            }
            }
             catch (error) {
            console.error("Error fetching drinks:", error);
        }
        setMenuPending(false);
    };

    return(
        <>
        <View style={styles.main}>

            <View style={styles.search_div}>
                <TextInput placeholder="Search your dish..." placeholderTextColor="white" style={styles.search} />
            </View>

            <View style={styles.search_icon_div}>
                <Image style={styles.search_icon} source={require("../images/icons/search.png")} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.category}>

                <TouchableOpacity style={[styles.categoryButton, selectedCategory === "All" && styles.selectedCategoryButton]} onPress = {() => handleCategorySelect("All")}>
                    <Text style={styles.category_text}>All</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.categoryButton, selectedCategory === "Sushi" && styles.selectedCategoryButton]} onPress = {() => handleCategorySelect("Sushi")}>
                    <Text style={styles.category_text}>Sushi</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.categoryButton, selectedCategory === "Ramen" && styles.selectedCategoryButton]} onPress = {() => handleCategorySelect("Ramen")}>
                    <Text style={styles.category_text}>Ramen</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.categoryButton, selectedCategory === "SpecialDishes" && styles.selectedCategoryButton]} onPress={() => handleCategorySelect("SpecialDishes")}>
                    <Text style={styles.category_text}>Special Dishes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.categoryButton, selectedCategory === "Desserts" && styles.selectedCategoryButton]} onPress={() => handleCategorySelect("Desserts")}>
                    <Text style={styles.category_text}>Dessert</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.categoryButton, selectedCategory === "Drinks" && styles.selectedCategoryButton]} onPress={() => handleCategorySelect("Drinks")}>
                    <Text style={styles.category_text}>Drinks</Text>
                </TouchableOpacity>
                
                </View>
            </ScrollView>
           
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>

            {selectedCategory === "All" && (
                    <View style={styles.dishes}>
                    {alls.map((all) => (
                        <View key ={all.id} style={styles.item_box}>
                        <Image source={{ uri: all.image}} style={styles.dish} />
        
                        <Text style={styles.dish_name}>{all.name}</Text>
        
                        <TouchableOpacity style={styles.new_btn}>
                            <Text style={styles.category_text}>New</Text>
                        </TouchableOpacity>
        
                        <View style={styles.description_container}>
                            <ScrollView style={{maxHeight: 120}}>
                                <Text style={styles.description}>{all.description}</Text>
                            </ScrollView>
        
                        <TouchableOpacity key={all.id} style={styles.btn_price} onPress={() => SelectedItemPress(all)}>
                            <Text style={styles.price_text}>R {all.price}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                     </View>
                )}

                {selectedCategory === "Drinks" && (
                    <View style={styles.dishes}>
                    {drinks.map((drink) => (
                        <View key ={drink.id} style={styles.item_box}>
                        <Image source={{uri : drink.image}} style={styles.dish} />
        
                        <Text style={styles.dish_name}>{drink.name}</Text>
        
                        <TouchableOpacity style={styles.new_btn}>
                            <Text style={styles.category_text}>New</Text>
                        </TouchableOpacity>
        
                        <View style={styles.description_container}>
                            <ScrollView style={{maxHeight: 120}}>
                                <Text style={styles.description}>{drink.description}</Text>
                            </ScrollView>
        
                        <TouchableOpacity key={drink.id} style={styles.btn_price} onPress={() =>SelectedItemPress(drink)}>
                            <Text style={styles.price_text}>R {drink.price}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                     </View>
                )}

                {selectedCategory === "Desserts" && (
                    <View style={styles.dishes}>
                    {desserts.map((dessert) => (
                        <View key ={dessert.id} style={styles.item_box}>
                        <Image source={{ uri: dessert.image}} style={styles.dish} />
        
                        <Text style={styles.dish_name}>{dessert.name}</Text>
        
                        <TouchableOpacity style={styles.new_btn}>
                            <Text style={styles.category_text}>New</Text>
                        </TouchableOpacity>
        
                        <View style={styles.description_container}>
                            <ScrollView style={{maxHeight: 120}}>
                                <Text style={styles.description}>{dessert.description}</Text>
                            </ScrollView>
        
                        <TouchableOpacity key={dessert.id} style={styles.btn_price} onPress={() => SelectedItemPress(dessert)}>
                            <Text style={styles.price_text}>R{dessert.price}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                     </View>
                )}

                {selectedCategory === "Ramen" && (
                    <View style={styles.dishes}>
                    {ramens.map((ramen) => (
                        <View key ={ramen.id} style={styles.item_box}>
                        <Image source={{ uri: ramen.image}} style={styles.dish} />
        
                        <Text style={styles.dish_name}>{ramen.name}</Text>
        
                        <TouchableOpacity style={styles.new_btn}>
                            <Text style={styles.category_text}>New</Text>
                        </TouchableOpacity>
        
                        <View style={styles.description_container}>
                            <ScrollView style={{maxHeight: 120}}>
                                <Text style={styles.description}>{ramen.description}</Text>
                            </ScrollView>
        
                        <TouchableOpacity key={ramen.id} style={styles.btn_price} onPress={() => SelectedItemPress(ramen)}>
                            <Text style={styles.price_text}>R{ramen.price}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                     </View>
                )}

                {selectedCategory === "SpecialDishes" && (
                    <View style={styles.dishes}>
                    {specialDishes.map((specialDish) => (
                        <View key ={specialDish.id} style={styles.item_box}>
                        <Image source={{ uri: specialDish.image}} style={styles.dish} />
        
                        <Text style={styles.dish_name}>{specialDish.name}</Text>
        
                        <TouchableOpacity style={styles.new_btn}>
                            <Text style={styles.category_text}>New</Text>
                        </TouchableOpacity>
        
                        <View style={styles.description_container}>
                            <ScrollView style={{maxHeight: 120}}>
                                <Text style={styles.description}>{specialDish.description}</Text>
                            </ScrollView>
        
                        <TouchableOpacity key={specialDish.id} style={styles.btn_price} onPress={() => SelectedItemPress(specialDish)}>
                            <Text style={styles.price_text}>R{specialDish.price}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                     </View>
                )}

                {selectedCategory === "Sushi" && (
                    <View style={styles.dishes}>
                    {sushis.map((sushi) => (
                        <View key ={sushi.id} style={styles.item_box}>
                        <Image source={{ uri: sushi.image}} style={styles.dish} />
        
                        <Text style={styles.dish_name}>{sushi.name}</Text>
        
                        <TouchableOpacity style={styles.new_btn}>
                            <Text style={styles.category_text}>New</Text>
                        </TouchableOpacity>
        
                        <View style={styles.description_container}>
                            <ScrollView style={{maxHeight: 120}}>
                                <Text style={styles.description}>{sushi.description}</Text>
                            </ScrollView>
        
                        <TouchableOpacity key={sushi.id} style={styles.btn_price} onPress={() => SelectedItemPress(sushi)}>
                            <Text style={styles.price_text}>R{sushi.price}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                     </View>
                )}
            </ScrollView>
            

            <View style={styles.nav_box}>
                <TouchableOpacity style={styles.nav_btn} onPress={() => navigation.navigate("Menu")}>
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
        
        </View>

        {menuPending ? (<Loader />) : null}
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "black",
    },
    dish: {
        height: 300,
        width: "100%",
        borderRadius: 15,
    },
    screen_name: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 40,
        marginBottom: 25,
    },
    description: {
        color: "white",
        fontSize: 16,
        fontWeight: "normal",
        textAlign:"center",
        marginBottom: 10,
    },
    dish_name: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        width: "100%",
        marginBottom: 5,
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
        marginBottom: 15,
    },
    btn_condiments_text: {
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
        top: 30,
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
    all_btn: {
        backgroundColor: "orange",
        width: 65,
        height: 50,
        padding: 10,
        borderRadius: 30,
        marginRight: 5,
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
    sushi_btn: {
        backgroundColor: "black",
        width: 80,
        height: 50,
        padding: 10,
        borderRadius: 30,
    },
    ramen_btn: {
        backgroundColor: "black",
        width: 90,
        height: 50,
        padding: 10,
        borderRadius: 30,
        marginRight: 5,
    },
    dish_btn: {
        backgroundColor: "black",
        width: 165,
        height: 50,
        padding: 10,
        borderRadius: 30,
        marginRight: 5,
    },
    dessert_btn: {
        backgroundColor: "black",
        width: 95,
        height: 50,
        padding: 10,
        borderRadius: 30,
        marginRight: 5,
    },
    drinks_btn: {
        backgroundColor: "black",
        width: 85,
        height: 50,
        padding: 10,
        borderRadius: 30,
        marginRight: 5,
    },
    category_text: {
        fontSize: 19,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    category: {
        marginLeft: 20,
        marginTop: 5,
        marginBottom: 15,
        flexDirection: "row",
        flex: 1,
    },
    item_box: {
        width: 250,
        paddingBottom: 20,
        marginRight: 20,
        marginLeft: 20,
    },
    dishes: {
        flexDirection: "row",
    },
    description_container: {
        marginTop: 10,
        paddingHorizontal: 20,
        height: 200,
    },
    categoryButton: {
        padding: 10,
        marginRight: 5,
        borderRadius: 30,
        backgroundColor: "black",
        height: 50,
    },
    selectedCategoryButton: {
        backgroundColor: "orange",
        height: 50,
    }
});

export default Menu;