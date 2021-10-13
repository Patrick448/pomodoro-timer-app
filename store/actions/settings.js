import * as FileSystem from 'expo-file-system';

export const CHANGE_SETTING = 'CHANGE_SETTING';
export const LOAD_SETTINGS = 'LOAD_SETTINGS';

export const changeSetting = (settingId, newValue)=>{
    return {type: CHANGE_SETTING, settingId:settingId, newValue:newValue};
}

export const loadSettings = ()=>{
    return async dispatch => {
        const filePath = FileSystem.documentDirectory +'/pomo_settings.json';
        const loadedSettingsString = await FileSystem.readAsStringAsync(filePath);
        const loadedSettings = JSON.parse(loadedSettingsString);
        dispatch( {type: LOAD_SETTINGS, loadedSettings:loadedSettings});
    }

}