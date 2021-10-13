import React, { useState, useEffect, useCallback }  from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Button, Modal, TextInput, ScrollView, Switch, TouchableHighlight } from 'react-native';
import RoundButton from '../components/RoundButton';
import Colors from '../constants/colors';
import CustomTextInput from '../components/CustomTextInput';
import CustomModal from '../components/CustomModal';
import { useSelector, useDispatch } from 'react-redux';
import { changeSetting } from '../store/actions/settings';
import { settingsProperties } from '../constants/settingsProperties';



const SettingsScreen = (props) =>{

    const currentSettings = useSelector(state=> state.settings);
    const dispatch = useDispatch();

    const changeSettingHandler =
        useCallback(()=>{
            dispatch(changeSetting('send_notifications', true));
        }, [dispatch]);


    const dispatchSettingChange=(id, newValue)=>{
        dispatch(changeSetting(id, newValue));
    }

    const showChangeSettingModal = (settingId)=>{
        console.log('Show modal for '+ settingId);
        dispatchSettingChange(settingId, currentSettings[settingId]+5);
    }

    return(
        <View style={styles.screen}>
            <ScrollView>
                <View  key={settingsProperties[0].propertyId} style={styles.settingsItem}>
                    <Text>{settingsProperties[0].propertyTitle}</Text>
                    <Switch 
                        value={currentSettings[settingsProperties[0].propertyId]} 
                        onValueChange={(newValue)=>dispatchSettingChange(settingsProperties[0].propertyId, newValue)}/>
                </View>
            <View key={settingsProperties[1].propertyId} style={styles.settingsItem}>
                <Text>{settingsProperties[1].propertyTitle}</Text>
                <Button title={currentSettings[settingsProperties[1].propertyId]+'m'} 
                        onPress={()=>showChangeSettingModal(settingsProperties[1].propertyId)}/>
            </View>
            <View key={settingsProperties[2].propertyId} style={styles.settingsItem}>
                <Text>{settingsProperties[2].propertyTitle}</Text>
                <Button title={currentSettings[settingsProperties[2].propertyId]+'m'}
                        onPress={()=>showChangeSettingModal(settingsProperties[2].propertyId)}/>
            </View>
            <View key={settingsProperties[3].propertyId} style={styles.settingsItem}>
                <Text>{settingsProperties[3].propertyTitle}</Text>
                <Button title={currentSettings[settingsProperties[3].propertyId]+'m'}
                        onPress={()=>showChangeSettingModal(settingsProperties[3].propertyId)}/>
            </View>

            </ScrollView>
            
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        
        backgroundColor: '#fff',
        padding: 10,
        flex:1,
    },
    settingsItem:{
        backgroundColor: '#fff',
        paddingHorizontal:10,
        paddingVertical:15,
        borderBottomColor:'gray',
        borderBottomWidth:1,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'

    }
 
  });

  //borderWidth:1,
  //borderColor:'black',

export default SettingsScreen;