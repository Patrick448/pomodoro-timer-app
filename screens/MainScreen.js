import React, { useState, useEffect }  from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Modal, TextInput, ScrollView, 
        KeyboardAvoidingView, Dimensions, Platform, Vibration} from 'react-native';
import RoundButton from '../components/RoundButton';
import TaskListItem from '../components/TaskListItem';
import PauseListItem from '../components/PauseListItem';
import Colors from '../constants/colors';
import CustomTextInput from '../components/CustomTextInput';
import CustomModal from '../components/CustomModal';
import {Ionicons, Entypo} from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { loadSettings } from '../store/actions/settings';


const MainScreen = ({navigation}) =>{
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitleInput, setModalTitleInput] = useState("");
    const [modalTimeInput, setModalTimeInput] = useState("");
    const [timer, setTimer] = useState(0);
    const [taskList, setTaskList] = useState([]);
    const [nextTaskId, setNextTaskId] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [timerPaused, setTimerPaused] = useState(false);
    const [orientation, setOrientation] = useState('portrait');
    const [currentTaskId, setCurrentTaskId] = useState(-1);
    const currentSettings = useSelector(state=> state.settings);
    const dispatch =useDispatch();

    useEffect(()=>{
        let interval = setInterval(()=>{
            if(timerActive && !timerPaused){
               setTimer(lastValue =>{
                    if(lastValue <=1){
                       clearInterval(interval);
                       setTimerActive(false);
                       onTimerFinish();
                       
                    }
                    return lastValue-1;
                });  
            }
               
        }, 1000)
        return ()=>clearInterval(interval);
    }, [timerActive, timerPaused]);

    useEffect(()=>{
        //loadSettings();
        onOrientationChanged();
        Dimensions.addEventListener('change', onOrientationChanged);
        return ()=>{Dimensions.removeEventListener('change', onOrientationChanged)}
    },[]);

   
    

    useEffect(()=>{
        setTaskList((currentTaskList=> recalculatePauses(currentTaskList)));
        console.log('work_session_duration changed and mainscreen detected it!');
    },[currentSettings.work_session_duration, 
        currentSettings.short_interval_duration,
        currentSettings.long_interval_duration]);

    const onOrientationChanged =()=>{
        
        let screenDimensions = Dimensions.get('window');
        let width = screenDimensions.width;
        let height = screenDimensions.height;

        if(height>width){
            setOrientation('portrait');
            console.log("orientation changed to portrait");
        }else{
            setOrientation('landscape')
            console.log("orientation changed to landscape");
        }

    }

    const validateTimeInput=(input)=>{
        input = parseInt(input);
        if(isNaN(input) || input <=0){
            return false;
        }
        return true;
    }
    const onTimerFinish = ()=>{
        console.log("Timer finished. Task done: id " + currentTaskId);
        markAsDone(currentTaskId);
        resetTimer();
        Vibration.vibrate(300, false);
        //notify user
        //show some way to start the next one
        
    }

    const formatTime=(timeInt)=>{
        let minutes = Math.floor(timeInt/60).toString().padStart(2,"0");
        let seconds = Math.floor(timeInt%60).toString().padStart(2,"0");
        return minutes+ ":" + seconds;
    }

    const resetTimer=()=>{
        setCurrentTaskId(-1);
        setTimer(0);
        setTimerActive(false);
        setTimerPaused(false);

    }

    const onStartButtonPressed = ()=>{
        //TODO: maybe have a restart button
        
        if(taskList.length!=0 && !timerPaused && !timerActive){
            let firstPendingTask = getFirstPendingTask();
            console.log("getting first pending task: " + firstPendingTask);

            if(firstPendingTask!==undefined){
                setTimer(firstPendingTask.time);
                setCurrentTaskId(firstPendingTask.id);
                setTimerActive(true);
            }
               
        }
        setTimerPaused(false);
        
    }

    const getFirstPendingTask=()=>{
        return taskList.find(task=>task.statusFinished===false);
    }

    const getCurrentTask=()=>{
        if(currentTaskId!=-1){
            return taskList.find(task=>task.id===currentTaskId);s
        }
        else{
            return null;
        }
        
    }

    const onPauseButtonPressed = ()=>{
        if(timerActive){
            setTimerPaused(true);
        }
    }

    const addNewTaskHandler=(title, time, id)=>{
        if(validateTimeInput(time)){
            setTaskList((currentTaskList=> [...currentTaskList, {id:id, title: title, time: parseInt(time), statusFinished:false, type:'default'}]))
            modalDismiss();
            setNextTaskId(currentNextTaskId =>currentNextTaskId+1);
            setTaskList((currentTaskList=> recalculatePauses(currentTaskList)));
        }  
    }

    const recalculatePauses=(currentTaskList)=>{

        let timeCounter=0;
        //let newTaskList= removeAllPauses(currentTaskList);
        let newTaskList= removeAllNonFinishedPauses(currentTaskList);
        let index =0;
        let nextPauseId= nextTaskId;
        console.log('--------------------');
        console.log(newTaskList);
        for(index=0; index< newTaskList.length; index++){
           
            if(newTaskList[index].type=='default'){
                timeCounter+=newTaskList[index].time;
                console.log("timecounter "+timeCounter);
            }else if(newTaskList[index].type=='pause'){
                timeCounter=0;
            }
            if(!newTaskList[index].statusFinished){
                if(timeCounter>=currentSettings.work_session_duration){
                    const taskPause = {id:"P"+nextPauseId, title: "Break", time: currentSettings.short_interval_duration, statusFinished:false, type:'pause'}
                    nextPauseId++;
                    newTaskList.splice(index+1, 0, taskPause);
                    console.log(newTaskList);
                    timeCounter=0;
                    console.log("insert at position "+(index));
                }
            }
               /* if(timeCounter>=50 && newTaskList[index+1].type!='pause'){
                    const taskPause = {id:"P"+nextPauseId, title: "Pause", time: 10, statusFinished:false, type:'pause'}
                    nextPauseId++;
                    newTaskList.splice(index+1, 0, taskPause);
                    console.log(newTaskList);
                    timeCounter=0;
                    console.log("insert at position "+(index) );
                }else if(timeCounter>=50 && newTaskList[index+1].type=='pause'){
                    timeCounter=0;
                }*/
            //index++;
        }
      
        return newTaskList;
    }

    const incrementNextTaskId=()=>{
        setNextTaskId(currentNextTaskId =>currentNextTaskId+1);
    }

    const removeAllNonFinishedPauses=(list)=>{
        return list.filter((task)=>{return (task.type!='pause' || task.statusFinished)});
    }

    const modalDismiss = ()=>{
        setModalTitleInput("");
        setModalTimeInput("");
        setModalVisible(false);

    }

    const modalShow=()=>{
        setModalTimeInput(currentSettings.work_session_duration.toString());
        setModalVisible(true);
    }

    const titleInputHandler =(text)=>{
        setModalTitleInput(text);
    }

    const timeInputHandler =(text)=>{
        setModalTimeInput(text);
    }

    const deleteItem =(id)=>{
        setTaskList(taskList.filter((task)=>id !== task.id));
        setTaskList((currentTaskList=> recalculatePauses(currentTaskList)));
        if(currentTaskId===id){
            resetTimer();
        }
        console.log(taskList);
    }

    const markAsDone=(taskId)=>{
        const newTaskList = [...taskList];
        newTaskList.forEach((task)=>{if(task.id===taskId){task.statusFinished=true;}})
        setTaskList(newTaskList);
    }

    const goToSettingsScreen=()=>{
        navigation.navigate("Settings");
        //recalculatePauses();
    }

    const deleteOldFinishedTasks=()=>{
        let i;
        let removeCount=0;
        for(i=0; i<taskList.length;i++){
            if(taskList[i].type=='pause' && taskList[i].statusFinished){
                removeCount=i+1;
            }
            if(!taskList[i].statusFinished){
                break;
            }
        }
        if(i==taskList.length){
            setTaskList([]);
        }
        else{
            console.log('Start deleting at 0, '+removeCount+' elements' );
            const newTaskList = [...taskList];
            newTaskList.splice(0, removeCount);
            setTaskList(newTaskList);
        }
            
    }

    const renderTaskListItem=(task)=>{
        let itemLayout;
        if(task.type=='default'){
            itemLayout = <TaskListItem
                            key={task.id} 
                            primaryText={task.title} 
                            secondaryText={formatTime(task.time)} 
                            onButtonPress={task.statusFinished?()=>{}:()=>deleteItem(task.id)}
                            backgroundColor={task.statusFinished?'#bda6ff':'white'}>
                                {task.statusFinished?<View/>:<Ionicons name="close" size={24} color="gray"/>}
                            </TaskListItem>
        }else{
            itemLayout = <PauseListItem
                            key={task.id}
                            infoText={formatTime(task.time)}
                            backgroundColor={task.statusFinished?'#bda6ff':'#D9D9DB'}>
                            </PauseListItem>

        }
        return itemLayout;
       
    }

    const styles = orientation=='portrait'? stylesPortrait:stylesLandscape;

    return(
        <View style={styles.screen}>
        <View style={styles.timerOuterView}>
            <View style={styles.timerView}>
                <View style={styles.timerTextContainer}>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                </View>
                <Text style={styles.taskInfoText}>{timerActive ? getCurrentTask().title:""}</Text>
            </View>
            
            <View style={styles.buttonView}>
                <RoundButton  style={styles.roundButton} textColor='white' onPress={onStartButtonPressed}>
                    <Ionicons name="play"  size={24} color="white"/>
                </RoundButton>
                <RoundButton style={styles.roundButton} textColor='white' onPress={onPauseButtonPressed}>
                    <Ionicons name="pause" size={24}  color="white"/>
                </RoundButton>
                <RoundButton style={styles.roundButton} textColor='white' onPress={goToSettingsScreen}>
                    <Ionicons name="settings" size={24} color="white"/>
                </RoundButton>
                <RoundButton style={styles.roundButton} textColor='white' onPress={deleteOldFinishedTasks}>
                    <Ionicons name="refresh" size={24} color="white"/>
                </RoundButton>
            </View>
        </View>
        <ScrollView style={{width:'100%'}} contentContainerStyle={{flexGrow:1, paddingVertical:10}}>
        {taskList.map((task => renderTaskListItem(task)))}

        </ScrollView>
        <View style={styles.addButtonView}>
            <RoundButton style={styles.roundButton} textColor='white' onPress={modalShow}>
                <Entypo name="plus" size={26} color="white"/>
            </RoundButton>
        </View>
        <CustomModal title="New Task" visible={modalVisible} >
            <Text>Title</Text>
            <CustomTextInput value={modalTitleInput} onChangeText={titleInputHandler} style={styles.input}/>
            <Text>Time</Text>
            <CustomTextInput value={modalTimeInput} onChangeText={timeInputHandler} keyboardType="numeric" style={styles.input}/>
            
            <View style={styles.buttonView}>
                <RoundButton
                        text="OK"
                        textColor='white' 
                        onPress={()=>{addNewTaskHandler(modalTitleInput, modalTimeInput, nextTaskId)}}/>
                <RoundButton text="CANCEL" textColor='white' onPress={modalDismiss}/>
            </View>
        </CustomModal>
    </View>
    );
};

const stylesLandscape = StyleSheet.create({
    screen: {
        flexDirection:'row',
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent:'center',
    },
    addButtonView:{
        flexDirection:'column',
        justifyContent:'center'
    },
    buttonView:{
        paddingVertical:5,
        flexDirection:'row',
        justifyContent:'space-around'
    },
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
    timerOuterView:{
        width:"45%"
    },
    timerView:{
        padding:15,
        alignItems:'center',
        
    },
    timerText:{
        fontSize:30,
        color:'white',
        fontWeight:'bold'
    },
    timerTextContainer:{
        backgroundColor:'#7C4DFF',
        width:120,
        height:120,
        maxWidth:200,
        maxHeight:200,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:100

    },
    taskInfoText:{
        fontSize:25,
        color:'black',
        fontWeight:'bold',
        //fontFamily:'ubuntu-regular'
    },
    input:{
        marginBottom:15
    },
    roundButton:{
        width:55,
        height:55,
        maxHeight:80,
        maxWidth:80,
    }
  });

const stylesPortrait = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
        

    },
    addButtonView:{
        
    },
    buttonView:{
        paddingVertical:5,
        width: '100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
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
    timerOuterView:{
        alignItems:'center'
    },
    timerView:{
        width:'100%',
        alignItems:'center',
        
    },
    timerText:{
        fontSize:30,
        color:'white',
        fontWeight:'bold'
    },
    timerTextContainer:{
        backgroundColor:'#7C4DFF',
        width:130,
        height:130,
        maxWidth:200,
        maxHeight:200,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:100

    },
    taskInfoText:{
        fontSize:25,
        color:'black',
        fontWeight:'bold',
        //fontFamily:'ubuntu-regular'
    },
    input:{
        marginBottom:15
    },
    roundButton:{
        width:55,
        height:55,
        maxHeight:80,
        maxWidth:80,
    }
  });

  //borderWidth:1,
  //borderColor:'black',

export default MainScreen;