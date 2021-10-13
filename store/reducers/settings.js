import { CHANGE_SETTING, LOAD_SETTINGS } from '../actions/settings';
import * as FileSystem from 'expo-file-system';

const initialState ={
        'send_notifications': true,
        'work_session_duration': 10,
        'short_interval_duration': 10,
        'long_interval_duration': 10,
        'language':'pt-BR'
};

const settingsReducer = (state=initialState, action)=>{
    switch(action.type){
        case CHANGE_SETTING:
            const filePath = FileSystem.documentDirectory +'/pomo_settings.json';
            const newState = {...state};
            newState[action.settingId] = action.newValue;
            console.log(action.settingId + " changed to " +newState[action.settingId]);

            FileSystem.writeAsStringAsync(filePath, JSON.stringify(newState),{encoding: FileSystem.EncodingType.UTF8});
            //console.log(FileSystem.readAsStringAsync(filePath));
            //readFileToConsole();
            return newState;
        case LOAD_SETTINGS:

            return action.loadedSettings;
        default:
            return state;

    }

    return state;
}

const readFileToConsole= async ()=>{
    const filePath = FileSystem.documentDirectory +'/pomo_settings.json';
    const string = await FileSystem.readAsStringAsync(filePath);
    console.log(string);
}

export default settingsReducer;