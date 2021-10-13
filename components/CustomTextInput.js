import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import Colors from '../constants/colors';

const CustomTextInput =(props) =>{
    return(
        <TextInput  {...props} style={{...styles.input, ...props.style}}/>
    )
}

const styles = StyleSheet.create({
    input:{
        padding:5,
        borderRadius:10,
        borderWidth:2,
        borderColor:Colors.accent,
        
    
    }

})

export default CustomTextInput;
