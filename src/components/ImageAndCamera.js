
import * as ImagePicker from 'expo-image-picker';
async function openCamera(){
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your camera!");
        return;
    }

    const cameraResult = await ImagePicker.launchCameraAsync();

    return !cameraResult.canceled ? cameraResult.assets[0].uri : null
}

async function selectImage(){ 
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    
    return !pickerResult.canceled ? pickerResult.assets[0].uri : null
}

export default {openCamera,selectImage}