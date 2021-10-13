import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'
import RoundButton from './RoundButton';

const PauseListItem = (props)=>{
    return(
        <View style={styles.mainView}>
            <View style={{...styles.line, ...{backgroundColor:props.backgroundColor}}}/>
            <View style={{...styles.listItem, ...{backgroundColor:props.backgroundColor}}}>
                <Text>Break | </Text>
                <Text>{props.infoText}m</Text> 
            </View>
            <View style={{...styles.line, ...{backgroundColor:props.backgroundColor}}}/>
        </View>
    )
};

const styles = StyleSheet.create({
    listItem:{
        backgroundColor:'#D9D9DB',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        padding:8,
        borderRadius:100,
        alignSelf:'center',
        marginHorizontal: 10,
    },
    mainView:{
        paddingHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:5,
        shadowColor: 'black',
        shadowRadius: 6,
        shadowOpacity: 0,
        shadowOffset:{
            width:0,
            height:2
        },
        //elevation: 5,
        backgroundColor:'white',
        borderRadius: 5
       },

    line:{
        flex:1,
        height:2,
        backgroundColor:'#D9D9DB',
        width:10,
    }
       
})

export default PauseListItem;