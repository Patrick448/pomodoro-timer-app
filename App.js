import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppLoading from 'expo-app-loading';
import React, { useState } from 'react';
import Header from './components/Header';
import MainScreen from './screens/MainScreen';
import SettingsScreen from './screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import {enableScreens} from 'react-native-screens';
import {createStore, combineReducers}  from 'redux';
import {Provider} from 'react-redux';
import settingsReducer from './store/reducers/settings';


enableScreens();

const rootReducer = combineReducers({
  settings: settingsReducer
})

const store = createStore(rootReducer);

const fetchFonts =()=>{
  return Font.loadAsync({
    'ubuntu-regular':require('./assets/fonts/Ubuntu-Regular.ttf'),
    'ubuntu-bold':require('./assets/fonts/Ubuntu-Bold.ttf')

  })
}


export default function App() {
  const [dataLoaded, setDataLoaded]=useState(false);

  if(!dataLoaded){
    return <AppLoading 
              startAsync={fetchFonts} 
              onFinish={()=>setDataLoaded(true)}
              onError={(error)=>console.log(error)}/>;}
  
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{title:"Pomodoro Timer"}}/>
          <Stack.Screen name="Settings" component={SettingsScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    //<View style={styles.container}>
    //  <StatusBar style="auto" />
    //  <Header title="Pomodoro Timer"/>
    //  <MainScreen/>

   // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
 
   
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
