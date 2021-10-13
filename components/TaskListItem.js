import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native'
import RoundButton from './RoundButton';

const TaskListItem = (props)=>{
    return(
        <View style={{...styles.mainView, ...{backgroundColor:props.backgroundColor}}}>
            <View style={styles.listItem}>
                <Text>{props.primaryText}</Text>
                <Text>{props.secondaryText}</Text>
                <RoundButton textColor='gray' text={props.buttonText} style={{...styles.button, ...{backgroundColor:props.backgroundColor}}} onPress={props.onButtonPress}>
                    {props.children}
                </RoundButton>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    listItem:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    mainView:{
        margin:5,
        padding:8,
        shadowColor: 'black',
        shadowRadius: 6,
        shadowOpacity: 0,
        shadowOffset:{
            width:0,
            height:2
        },
        elevation: 3,
        backgroundColor:'white',
        borderRadius: 10
       },
       button:{
           padding:5,
           width:40,
           height:40,
           backgroundColor:'white'
       }
})

export default TaskListItem;