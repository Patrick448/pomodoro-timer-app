import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

const RoundButton = (props)=>{
    return(
        <View style={{backgroundColor:"transparent", borderRadius:30}}>
        <TouchableOpacity  activeOpacity={0.5} onPress={props.onPress} style={{alignSelf:'center'}}>
            <View style={{...styles.button,  ...props.style}}>
                {props.children}
                <Text style={{...styles.text, ...{color:props.textColor}}}>{props.text}</Text>
            </View>
        </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    button:{
        borderRadius: 30,
        backgroundColor: '#7C4DFF',
        alignItems:'center',
        justifyContent:'center',
        padding:15,
        flexDirection:"row",
      
  
    }, 
    text:{
        fontSize:15,
        color: 'white',
        fontWeight: 'bold'
    } 
});

export default RoundButton;