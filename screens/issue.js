import * as React from 'react' 
import {Text,View,TouchableOpacity, StyleSheet, Image, TextInput} from 'react-native'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import firebase from 'firebase'
import db from '../config'

export default class IssueScreen extends React.Component{
constructor(){
super()
this.state={
    hascamerapermissions:null,
    scanned:false,
    scannedbookid:'',
    scannedstudentid:'',
    buttonstate:'normal',
    transmessage:'',
}
}

handletrans=async()=>{
var message
var book

db.collection("Books").doc(this.state.scannedbookid).get()
.then((doc)=>{console.log(doc.data())

book=doc.data()

if(book.bookAvai===true){


this.issuebook()
message="bookissued"
}

else if(book.bookAvai===false){


this.returnbook()
message="bookreturned"
}
})
this.setState({
        transmessage:message
    })
}

issuebook =async()=>{
await db.collection('Transaction').add({
bookid:this.state.scannedbookid,
studentid:this.state.scannedstudentid,
date:firebase.firestore.Timestamp.now().toDate(),
transtype:"issue"

})

db.collection('Books').doc(this.state.scannedbookid).update({
bookAvai:false
   
})

db.collection('Students').doc(this.state.scannedstudentid).update({
nobooksissue:firebase.firestore.FieldValue.increment(1)
})

this.setState({scannedbookid:'',scannedstudentid:''})


}

returnbook =async()=>{
     await db.collection('Transaction').add({
    bookid:this.state.scannedbookid,
    studentid:this.state.scannedstudentid,
    date:firebase.firestore.Timestamp.now().toDate(),
    transtype:"return"
    
    })
    
    db.collection('Books').doc(this.state.scannedbookid).update({
    bookAvai:true
       
    })
    
    db.collection('Students').doc(this.state.scannedstudentid).update({
    nobooksissue:firebase.firestore.FieldValue.increment(-1)
    })
    
    this.setState({scannedbookid:'',scannedstudentid:''})
    
    
}
    






handleBarCodeScanned=async({type,data})=>{
const {buttonstate}=this.state
if(buttonstate==="Bookid"){
    this.setState({

    scanned:true,
    scannedbookid:data,
    buttonstate:'normal',

})
}

if(buttonstate==="Studentid"){
    this.setState({

    scanned:true,
    scannedstudentid:data,
    buttonstate:'normal',

})
}

}

getcamerapermissions=async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
        hascamerapermissions:status==='granted',
        buttonstate:id,
       scanned:false    
    })
} 
render(){
    const hascamerapermissions=this.state.hascamerapermissions
    const scanned=this.state.scanned
    const buttonstate=this.state.buttonstate
   if(buttonstate!=='normal' && hascamerapermissions){
return(
    <BarCodeScanner onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned} 
    style={StyleSheet.absoluteFillObject}>
        
    </BarCodeScanner>




)
   }

else if(buttonstate==='normal'){




    return(
        <View style={styles.container}>
        <View style={styles.inputview}>
<TextInput placeholder='Enter Book id' style={styles.inputbox} onChangeText={text=>{this.setState({scannedbookid:text})}} value={this.state.scannedbookid} />
<TouchableOpacity style={styles.scanbutton} onPress={()=>{
this.getcamerapermissions("Bookid")

}}>
<Text style={styles.buttontext}>
    Scan
</Text>
</TouchableOpacity>

        </View>
        <View style={styles.inputview}>
<TextInput placeholder='Enter Student id' style={styles.inputbox} onChangeText={text=>{this.setState({scannedstudentid:text})}} value={this.state.scannedstudentid} />
<TouchableOpacity style={styles.scanbutton} onPress={()=>{
this.getcamerapermissions("Studentid")

}}>
<Text style={styles.buttontext}>
    Scan
</Text>
</TouchableOpacity>

        </View>
       <TouchableOpacity style={styles.submitbutton} onPress={async()=>{this.handletrans()}} >
           <Text style={styles.submitbuttontext}>
               Submit
           </Text>
       </TouchableOpacity>
        </View>
        
    )


    }
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    buttontext: {
        fontSize:15,
        textAlign:'center',
        marginTop:10,

    },

    inputview:{
        flexDirection:'row',
        margin:20,

    },

    inputbox: {
      width:200,
      height:40,
      borderWidth:1.5,
      borderRightWidth:0,
      fontSize:20,
    },

    scanbutton: {
        backgroundColor:'blue',
        borderLeftWidth:0,
        width:50,
        borderWidth:1.5,

    },

    submitbutton: {
        backgroundColor:'blue',
        width:100,
        height:50,

    },

    submitbuttontext: {
        textAlign:'center',
        padding:10,
        fontSize:20,
        fontWeight:'bold',
        color:'white',
    },



});