
import * as ImagePicker from 'expo-image-picker';
const openCamera = async ()  => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
        alert("You've refused to allow this appp to access your camera!");
        return;
    }

    const cameraResult = await ImagePicker.launchCameraAsync();

    if (!cameraResult.cancelled) {
        return cameraResult
        // setimgPicker(false)   
        // settypePicker(true)
        // setimgPicked(cameraResult);
    }
}

const selectImage = async () => { 
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    
    if(!pickerResult.cancelled){
        return pickerResult
        // setimgPicker(false)   
        // settypePicker(true)
        // setimgPicked(pickerResult)
    }
}

export default {openCamera,selectImage}