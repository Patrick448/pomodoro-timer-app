import React, { useState }  from 'react';
import { View, Text, StyleSheet, Modal, KeyboardAvoidingView } from 'react-native';

const CustomModal = (props)=>{
    return(
        <Modal transparent={true} visible={props.visible} statusBarTranslucent={true} animationType='fade'>
                <View style={styles.modalTranslucentView}>
                <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20}>
                        <View style={styles.modalMainView}>
                            <View style={styles.modalTitle}>
                                <Text style={{fontSize:20, fontWeight:'bold'}}>{props.title}</Text>
                            </View>
                            {props.children}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
    )
};

const styles = StyleSheet.create({
    modalTranslucentView:{
        flex:1,  
        justifyContent:'center',
        backgroundColor:'#00000080'
        },
    modalMainView:{
        backgroundColor:'white', 
        marginHorizontal:25,
        paddingHorizontal:30,
        paddingTop:15,
        paddingBottom:30,
        borderRadius:10,
        shadowColor: 'black',
        shadowRadius: 6,
        shadowOpacity: 0,
        shadowOffset:{
            width:0,
            height:2
        },
        elevation: 5,
    },
    modalTitle:{
        alignItems:'center', 
        justifyContent:'flex-start', 
        marginBottom:15}
  });

export default CustomModal;