import React, { createContext, useReducer, useContext} from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

//Components
import Splash from "./Splash";
import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import Menu from "./Menu";
import Description from "./Description";
import Condiments from "./Condiments";
import Drinks from "./Drinks";
import Profile from "./Profile";
import OrderCart from "./OrderCart";
import RestaurantCart from "./RestaurantCart";
import SeatBooking from "./SeatBooking";
import OrderStatus from "./OrderStatus";
import Reservation from "./Reservation";
import OrderDetails from "./OrderDetails";
import OrderHistory from "./OrderHistory";

const AppContext = createContext({
    selectedCondiments : [],
    selectedDrinks : [],
    dishData: [],
    dispatch: () => {},
});

const appReducer = (state, action) => {
    switch (action.type) {
        case "SET_SELECTED_CONDIMENT":
            return {...state, selectedCondiments: action.payload};
        case "SET_SELECTED_DRINK":
            return {...state, selectedDrinks: action.payload};
        case "SET_SELECTED_DISH":
            return {...state, dishData: action.payload};
        case "ADD_CONDIMENT":
            const existingCondiment = state.selectedCondiments.find((condiment) => condiment.id === action.payload.id);
            if (existingCondiment) {
                return {
                    ...state,
                    selectedCondiments: state.selectedCondiments.map((condiment) => 
                    condiment.id === action.payload.id ? {...condiment, quantity: condiment.quantity + 1} : condiment
                    )
                }
            } else {
                return {
                    ...state,
                    selectedCondiments: [...state.selectedCondiments, {...action.payload, quantity: 1}]
                }
            }
        case "REMOVE_CONDIMENT":
            return {
                ...state, 
                selectedCondiments: state.selectedCondiments.map((condiment) => 
                condiment.id === action.payload.id
                ? {...condiment, quantity: Math.max(0, condiment.quantity - 1)}
                : condiment).filter((condiment) => condiment.quantity > 0)
            };
        case "ADD_DRINK":
            const existingDrink = state.selectedDrinks.find((drink) => drink.id === action.payload.id);
            if (existingDrink){
                return {
                    ...state,
                    selectedDrinks: state.selectedDrinks.map((drink) =>
                    drink.id === action.payload.id ? {...drink, quantity: drink.quantity + 1} : drink
                    )
                }
            } else {
                return {
                    ...state,
                    selectedDrinks: [...state.selectedDrinks, {...action.payload, quantity: 1}]
                }
            }
        case "REMOVE_DRINK":
            return {...state, 
                selectedDrinks: state.selectedDrinks.map((drink) =>
                drink.id === action.payload.id
                ? {...drink, quantity: Math.max(0, drink.quantity - 1)}
                : drink).filter((drink) => drink.quantity > 0)};
        case "ADD_DISH": 
           const existingDish = state.dishData.find((dish) => dish.id === action.payload.id);
           if (existingDish) {
            return {
                ...state,
                dishData: state.dishData.map((dish) => 
                dish.id === action.payload.id ? {...dish, quantity: dish.quantity + 1} : dish
                )
            }
           } else {
            return {
                ...state,
                dishData: [...state.dishData, {...action.payload, quantity: 1}]
            }
           }
        case "REMOVE_DISH":
            return {...state, 
                dishData: state.dishData.map((dish) => dish.id === action.payload.id
            ? {...dish, quantity: Math.max(0, dish.quantity - 1)} : dish).filter((dish) => dish.quantity > 0)};
        case "RESET_COLLECTIONS":
            console.log("Resetting collections");
            return {...state, selectedCondiments: [], selectedDrinks: [], dishData: [], ...payload,};
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, {
        selectedCondiments: [],
        selectedDrinks: [],
        dishData: [],
    });

    return (
        <AppContext.Provider value={{...state, dispatch}}>
            {children}
        </AppContext.Provider>
    )
};

export const useAppContext = () => {
    return useContext(AppContext);
}

const AppNavigation = () => {
    return(
        <AppProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Splash" screenOptions={{headerShown: false, ...TransitionPresets.SlideFromRightIOS}}>
                <Stack.Screen 
                                name="Splash"
                                component={Splash} 
                />
                <Stack.Screen 
                                name="Login"
                                component={Login} 
                />
                <Stack.Screen 
                                name="SignUp"
                                component={SignUp} 
                />
                <Stack.Screen 
                                name="ForgotPassword"
                                component={ForgotPassword} 
                />
                <Stack.Screen 
                                name="Menu"
                                component={Menu} 
                />
                <Stack.Screen 
                                name="Description"
                                component={Description} 
                />
                <Stack.Screen 
                                name="Condiments"
                                component={Condiments} 
                />
                <Stack.Screen 
                                name="Drinks"
                                component={Drinks} 
                />
                <Stack.Screen 
                                name="Profile"
                                component={Profile} 
                />
                <Stack.Screen 
                                name="OrderCart"
                                component={OrderCart} 
                />
                <Stack.Screen 
                                name="RestaurantCart"
                                component={RestaurantCart} 
                />
                <Stack.Screen 
                                name="SeatBooking"
                                component={SeatBooking} 
                />
                <Stack.Screen 
                                name="Reservation"
                                component={Reservation} 
                />
                <Stack.Screen 
                                name="OrderDetails"
                                component={OrderDetails} 
                />
                <Stack.Screen 
                                name="OrderStatus"
                                component={OrderStatus} 
                />
                <Stack.Screen 
                                name="OrderHistory"
                                component={OrderHistory} 
                />
            </Stack.Navigator>
        </NavigationContainer>
        </AppProvider>
    )
};

export default AppNavigation;