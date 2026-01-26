import React, {useState} from 'react'
import {View, Text, TouchableOpacity, TextInput, StyleSheet} from 'react-native'

export default function URL_page({navigation, route}) {
    const [link, setLink] = useState("");
    return(
        <View style={styles.container}>
            <TextInput
            style={styles.input}
            placeholder='Enter Link' 
            placeholderTextColor={"grey"}
            value={link} 
            onChangeText={setLink}
            >
            </TextInput>

            {/*The onpress returns the link so will be useful for the backend */}
            <TouchableOpacity style={styles.submit_link_cont} onPress={() => console.log(link)}>
                <Text style={styles.submit_button}>Submit</Text>
                
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        height: 44,
        paddingHorizontal: 10,


    },

    
    submit_link_cont: {
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