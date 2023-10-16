import React from "react";
import {View, StyleSheet, Text, Image} from "react-native";

const Loader = () => {
    return(
        <View style={styles.container}>
           <Text style={{color: "white", fontSize: 30}}>Loading...</Text>
           <Image source={require("../images/BigLoader.gif")} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
        elevation: 1,
    }
});

export default Loader;