import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = (props)=>{
    return(
        <View style={styles.header}>
           <Text style={styles.headerText}>{props.title}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    header:{
        width: '100%',
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        backgroundColor: '#FFC107',
       
    },
    headerText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    }
});

export default Header;