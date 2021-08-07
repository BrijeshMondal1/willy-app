import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, Alert } from 'react-native';
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
            scannedstudentID:'',
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

        if(buttonState === "bookID"){

            this.setState({scanned:true,
                scannedBookID:data,
                buttonState:"normal"})

        }else if(buttonState === "studentID"){

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
                var book=doc.data()
                if(book.bookAvailability){
                    this.initiateBookIssue()
                    transactionMessage="book issued"
                }else{
                    this.initiateBookReturn()
                    transactionMessage="book return"
                }

            })

            this.setState({
                transactionMessage:transactionMessage
            })

        }

        initiateBookIssue=async()=>{

            db.collection("Transactions").add({

                'studentID':this.state.scannedStudentID,
                'bookID':this.state.scannedBookID,
                'date':firebase.firestore.Timestamp.now().toDate(),
                'transactionType':"Issue"

            })

            db.collection("Books").doc(this.state.scannedBookID).update({

                'bookAvailability':false

            })

            db.collection("Students").doc(this.state.scannedStudentID).update({


                'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)

            })

            Alert.alert("bookIssued")
            this.setState({
                scannedBookID:'',scannedStudentID:''
            })

        }

        initiateBookReturn=async()=>{

            db.collection("Transactions").add({

                'studentID':this.state.scannedStudentID,
                'bookID':this.state.scannedBookID,
                'date':firebase.firestore.Timestamp.now().toDate(),
                'transactionType':"Issue"

            })

            db.collection("Books").doc(this.state.scannedBookID).update({

                'bookAvailability':true

            })

            db.collection("Students").doc(this.state.scannedStudentID).update({


                'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)

            })

            Alert.alert("bookReturned")
            this.setState({
                scannedBookID:'',scannedStudentID:''
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
                            onPress={()=>{this.getCameraPermissions("bookID")}}>
                                <Text style={styles.buttonText}>Scan</Text>
                            </TouchableOpacity>
                    </View>

                    <View style={styles.inputView}>
                   
                            <TextInput style={styles.inputBox}placeholder="Student ID" value={this.state.scannedStudentID}></TextInput>
                            
                            <TouchableOpacity style={styles.scanButton} 
                             onPress={()=>{this.getCameraPermissions("studentID")}}>
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