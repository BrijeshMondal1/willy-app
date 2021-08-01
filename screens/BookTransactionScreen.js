import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions'
import { TextInput } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import db from '../config.js';

export default class BookTransactionScreen extends React.Component {

    constructor(){

        super()
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedBookID:'',
            scannedStudentID:'',
            buttonState:"normal"
        }

    }

    getCameraPermissions=async(id)=>{

        const {status}=await Permissions.askAsync(Permissions.CAMERA);
        this.setState({

            hasCameraPermissions:status==="granted",
            buttonState:id,
            scanned:false

        });

    }

    handleBarcodeScan=async({type,data})=>{

        const {buttonState}=this.state

        if(buttonState === "BookID"){

            this.setState({scanned:true,
                scannedBookID:data,
                buttonState:"normal"})

        }else if(buttonState === "StudentID"){

            this.setState({scanned:true,
                scannedStudentID:data,
                buttonState:"normal"})

            }

    }
        handleTransaction=async()=>{

            var transactionMessage 
            db.collection("Books").doc(this.state.scannedBookID).get()
            .then((doc)=>{

                console.log(doc.data());

            })

        }
    render(){

        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if(buttonState !== "normal" && hasCameraPermissions){

            return(

                <BarCodeScanner onBarCodeScanned = {scanned?undefined:this.handleBarcodeScan}style={StyleSheet.absoluteFillObject}
                ></BarCodeScanner>

            )

        }else if(buttonState === "normal"){

            return (

                <View style = {styles.container}>
                    <View>
                        <Image source={require("../assets/booklogo.jpg")} style={{width:200,height:200}}></Image>
                        <Text style={{textAlign:'center',fontSize:30}}>Willy</Text>
                    </View>
                    <View style={styles.inputView}>

                        <TextInput style={styles.inputBox}placeholder="Book ID" value={this.state.scannedBookID}></TextInput>
                           
                            <TouchableOpacity style={styles.scanButton} 
                            onPress={()=>{this.getCameraPermissions("BookID")}}>
                                <Text style={styles.buttonText}>Scan</Text>
                            </TouchableOpacity>
                    </View>

                    <View style={styles.inputView}>
                   
                            <TextInput style={styles.inputBox}placeholder="Student ID" value={this.state.scannedStudentID}></TextInput>
                            
                            <TouchableOpacity style={styles.scanButton} 
                             onPress={()=>{this.getCameraPermissions("StudentID")}}>
                                <Text style={styles.buttonText}>Scan</Text>
                            </TouchableOpacity>

                     </View>
                    
                    <TouchableOpacity style={styles.submitButton} onPress={async()=>{this.handleTransaction()}}>

                        <Text style={styles.submitButtonText}>Submit</Text>

                    </TouchableOpacity>
        
                </View>
        
            )

        }

}

}

const styles = StyleSheet.create({

    container:{flex:1, justifyContent: 'center', alignItems: 'center'},
    displayText: {fontSize: 15, textDecorationLine:'underline'},
    scanButton:{backgroundColor:'cyan',padding:10, margin:10},
    buttonText:{fontSize:15,textAlign:'center'},
    inputView:{flexDirection:'row',margin:20},
    inputBox:{width:200,height:30,borderWidth:1.5,fontSize:15},
    scanButton:{backgroundColor:'cyan',width:50,borderWidth:1.5},
    submitButton:{backgroundColor:'red',width:50,height:50},
    submitButtonText:{fontSize:20,fontWeight:"bold",color:"white",textAlign:'center'}

})