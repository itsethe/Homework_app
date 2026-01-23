import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

export default class Home extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Text style={{fontSize: 25}}>Welcome to the Homework App</Text>

                <TouchableOpacity style={styles.buttonCont_hw} onPress={()=>{
                    this.props.navigation.navigate('URL_page')
                }}>
                    <Text style={styles.hw_button}>Import Homework Link</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonCont_assign} onPress={()=>{
                    this.props.navigation.navigate('Homework')
                }}>
                    <Text style={styles.assign_button}>View Assignments</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonCont_deadlines} onPress={()=>{
                    this.props.navigation.navigate('Deadlines')
                }}>
                    <Text style={styles.deadlines_button}>Important Upcoming Deadlines</Text>
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

  
  buttonCont_assign: {
    backgroundColor: '#75909C',
    padding: 10,
    borderRadius: 33.33,
    marginTop: 20,
    height: 55,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonCont_deadlines: {
    backgroundColor: '#75909C',
    padding: 10,
    borderRadius: 33.33,
    marginTop: 20,
    height: 55,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  
  hw_button: {
    color: "#E6E6E6",
    fontSize: 20,
    fontStyle: "Times New Roman"
  },

  assign_button: {
    color: "#E6E6E6",
    fontSize: 20,
    fontStyle: "Times New Roman"
  },

   deadlines_button: {
    color: "#E6E6E6",
    fontSize: 20,
    fontStyle: "Times New Roman"
  }


})