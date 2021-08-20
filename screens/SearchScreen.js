import React from 'react';
import { Text, View  } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import db from '../config'

export default class SearchScreen extends React.Component {

    constructor(props){

        super(props);
        this.state={
            allTransactions:[]
        }

    }

    componentDidMount=async()=>{

        const query=await db.collection("Transactions").get()
        query.docs.map((doc)=>{

            this.setState({
                allTransactions:[this.state.allTransactions,doc.data()]
            })

        })

    }

render(){

    return (

        <FlatList
            data={this.state.allTransactions}
            renderItem={({item})=>(

                    <View style={{borderBottomWidth:2}}>
                        <Text>{"BookID"+item.bookID}</Text>
                        <Text>{"StudentID"+item.studentID}</Text>
                        <Text>{"TransactionType"+item.transactionType}</Text>
                        <Text>{"Date"+item.date.toDate()}</Text>
                    </View>

            )
        
        }
        
                keyExtractor={(item,index)=>index.toString()}
            
            >
            
        </FlatList>
         
    )

}


}