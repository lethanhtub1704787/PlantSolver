import React from 'react';
import { SafeAreaView, Text, Image, StyleSheet,TouchableOpacity,View } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
export default ImagePickerModal = ({
    imgPicker,
    onClose,
    onImageLibraryPress,
    onCameraPress,
    }) => {
    return(
      
        <Modal
            isVisible={imgPicker}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <SafeAreaView style={styles.buttons}>
                <View>
                    <View style={[{marginRight:50},styles.buttonContainer]}>
                        <TouchableOpacity style={styles.center} onPress={onImageLibraryPress}>
                            <FontAwesome name="image" style={styles.icon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Thư Viện</Text>
                    </View>
                </View>
        
                <View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.center} onPress={onCameraPress}>
                            <FontAwesome name="camera" style={styles.icon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Máy Ảnh</Text>
                    </View>       
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
       justifyContent: 'flex-end',
       margin: 0
    },
    buttons:{
        backgroundColor: '#337954',
        flexDirection:"row",
        borderTopRightRadius:50,
        borderTopLeftRadius:50,
        height:200,
        justifyContent:"center",
        alignItems:"center"
    },
    center:{
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
    },
    buttonText:{
        fontSize: 20,
        fontWeight: '600',
        color:"white"
    },
    buttonTextContainer:{
        width:110,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:5
    },  
    buttonContainer:{
        width:110,
        height:110,
        backgroundColor:"white",
        borderRadius:35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 70,
        color:"#337954"
    },

}); 