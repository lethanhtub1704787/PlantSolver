import React, { useState,useEffect } from "react";
import { View,Image, Text, StyleSheet,ScrollView,Dimensions, TouchableOpacity,AppState } from "react-native";
import { useRoute } from '@react-navigation/native'
import { SafeAreaView,StatusBar } from "react-native";
import CustomHeader from "../components/CustomHeader";

const bg_image = 'https://s2.best-wallpaper.net/wallpaper/iphone/1807/Red-rose-green-leaves-water-drops_iphone_1080x1920.jpg';
const widthScreen = Dimensions.get("window").width
const fontColor = "#337954"

const renderReadMore = (text) => {
    return(
        <Text style={{color:fontColor,fontSize:17,marginLeft:5}}>
            {text}
        </Text>
    )
}

const ReadMore = ({children, maxCharCount = 120}) => {
    const [isTruncated, setisTruncated] = useState(true);
    const text = children;
    const resultString = isTruncated ? text.substring(0,maxCharCount) : text;
    return(
        <Text style={styles.des}>
            {resultString}
            <TouchableOpacity onPress={() => setisTruncated(!isTruncated)}>
                {isTruncated ? renderReadMore("Xem thêm") : renderReadMore("Thu gọn")}
            </TouchableOpacity>
        </Text>
    )
}

const Details = ({navigation,route}) => {
    // console.log("route:",route.params)
    // useEffect(() => {
    //     const subscription = AppState.addEventListener('change', ()=>{})
    //     return () => {
    //       subscription.remove()
    //     }
    // }, [])
    return (
        <SafeAreaView style={styles.totalContainer}>
          
            <Image
                source={{uri: bg_image}}
                style={StyleSheet.absoluteFillObject}
                blurRadius={30}
            />
            <CustomHeader title="Chi tiết" isBack={true} navigation={navigation}/>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image 
                            style={styles.image} 
                            source={{uri: route.params.image ? route.params.image 
                                : "https://vanhoadoanhnghiepvn.vn/wp-content/uploads/2020/08/112815953-stock-vector-no-image-available-icon-flat-vector.jpg"
                            }}
                        />    
                    </View>
                 
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{route.params.name}</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <Text style={{fontSize:28, marginTop:10, marginLeft:10,color:fontColor,fontWeight:"700"}}>
                        Mô tả
                    </Text>
                    <Text style={styles.des}>
                        {
                            route.params.info ? <ReadMore children={route.params.info}/>
                            : null
                        }
                  
                    </Text>
                </View>
                <View style={styles.container}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize:20, marginTop:10, marginLeft:10,color:fontColor,fontWeight:"700"}}>
                            Chi
                        </Text>
                        <Text style={[styles.species_info,{marginTop:5,marginLeft:26}]}>
                            {route.params.genus ? route.params.genus : null}
                        </Text>
                    </View>
                    <View style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize:20, marginTop:5, marginLeft:10,color:fontColor,fontWeight:"700"}}>
                            Họ
                        </Text>
                        <Text style={[styles.species_info]}>
                            {route.params.family ? route.params.family : null}
                        </Text>
                    </View>
                    <View style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize:20, marginTop:5, marginLeft:10,color:fontColor,fontWeight:"700"}}>
                            Bộ
                        </Text>
                        <Text style={[styles.species_info]}>
                            {route.params.order ? route.params.order : null}
                        </Text>
                    </View>
                  
                </View>
                <View style={{height:10,width:"100%"}}/>
            </ScrollView>
           
        </SafeAreaView>
 
    );
};

const styles = StyleSheet.create({
    totalContainer: {
        flex: 1,
        // marginTop:StatusBar.currentHeight
    },
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        marginLeft:15,
        marginRight:15,
        marginTop:15,
    },
    imageContainer:{
        alignItems:"center",
    },
    image: {
        resizeMode:'stretch',
        width:(widthScreen-30),
        height:280,
        borderRadius:20,
        borderBottomRightRadius:0,
        borderBottomLeftRadius:0
    },
    name: {
        fontSize:30,
        fontWeight:"600"
        // color:fontColor,
    },
    textDetails: {
        paddingTop:10,
        fontSize: 18
        
    },
    nameContainer: {
        padding:10,
        marginLeft:10
    },
    des: {
        fontSize:20,
        padding:10,
    },
    species_info:{
        fontSize:20,
        padding:5,
        marginLeft:30
    }
});

export default Details;