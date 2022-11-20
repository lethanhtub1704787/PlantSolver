import { SafeAreaView, StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';


const PlantSelect_Modal = ({
    typePicker,
    onFruitTypePress,
    onFlowerTypePress
}) => {
  return (
 
        <Modal
            isVisible={typePicker}
        >
            <SafeAreaView style={styles.centeredView}>
            <View style={styles.mainContainer}>
                <View style={{marginBottom:20}}>
                    <Text style={{fontSize:25,fontWeight:"600"}}>Chọn loại</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <View> 
                        <View style={[{marginRight:30},styles.buttonStyle]}>
                            <TouchableOpacity style={styles.center} onPress={onFruitTypePress}>
                                <Image style={styles.icon}  
                                    source={require("../../assets/icons/fruit.png")}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonTextContainer}>
                            <Text style={styles.buttonText}>Quả</Text>
                        </View>
                    </View>

                    <View>
                        <View style={styles.buttonStyle}>
                            <TouchableOpacity style={styles.center} onPress={onFlowerTypePress}>
                                <Image style={styles.icon} 
                                    source={require("../../assets/icons/flower.png")}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    
                        <View style={styles.buttonTextContainer}>
                            <Text style={styles.buttonText}>Hoa</Text>
                        </View>
                    </View>
                </View>
            </View>
            </SafeAreaView>
        </Modal>
  )
}

export default PlantSelect_Modal

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor:"blue", //remove
        // height:300 //remove
    },
    mainContainer:{
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:"white",
        width:300,
        height:250,
        borderRadius:30,
    },
    buttonContainer:{
        flexDirection:"row",
    },
    buttonStyle:{
        backgroundColor:"gray",
        width:115,
        height:115,
        borderRadius:100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
     },
    buttonText:{
        fontSize: 20,
        fontWeight: '600',
        color:"black"
    },
    buttonTextContainer:{
        width:110,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:5
    },
    icon:{
        width:100,
        height:100
    }  
})