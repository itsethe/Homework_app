import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

export default class Home extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Text style={{fontSize: 25}}>Welcome to the Homework App</Text>

                <TouchableOpacity style={styles.buttonCont_hw} onPress={()=>{
                    this.props.navigation.navigate('Deadlines')
                }}>
                    <Text>Open Deadlines</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: 10, 
  },

    buttonCont_hw: {
    backgroundColor: '#75909C',
    padding: 10,
    borderRadius: 33.33,
    marginTop: 20,
    height: 55,
    width: "55%",
    justifyContent: "center",
    alignItems: "center",
  },

})