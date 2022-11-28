import React from "react";
import { useState,useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View,
    Text,
    StyleSheet, 
    FlatList,
    TextInput,
    Image, 
    Animated,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    LogBox,
    Dimensions,
    AppState,
    EventEmitter,
    StatusBar
} from "react-native";
import host from "../../assets/host";
import CustomHeader from "../components/CustomHeader";
import Loading from "../components/Loading";
import {getDatabase,ref,onValue,get,push,set,child,querySnapshot} from "firebase/database"
import {initializeApp} from "firebase/app"
import firebaseConfig from "../components/firebase";
initializeApp(firebaseConfig)
// LogBox.ignoreLogs(["EventEmitter.removeListener"]);
const bg_image = 'https://s2.best-wallpaper.net/wallpaper/iphone/1807/Red-rose-green-leaves-water-drops_iphone_1080x1920.jpg';

const spacing = 20;
const avatar_size = 100;
const item_margin_bottom = spacing / 2
const item_size = avatar_size + spacing + item_margin_bottom;
const heightSceen = Dimensions.get("window").height


const Find = ({navigation}) => {

    const scrollY = React.useRef(new Animated.Value(0)).current;
   
    const [filteredData,setfilteredData] = useState([]);    
    const [data, setdata] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [search,setSearch] = useState('');

    const reference = ref(getDatabase(), 'PlantSolver/Plants');

    useEffect(() => {
       
        onValue(reference, (snapshot) => {
            let array = []
            snapshot.forEach(function(childSnapshot) {
                let key = childSnapshot.key;
                // console.log(key)
                let childData = childSnapshot.val();
                let finalData = Object.assign(childData, {key: key});
                // console.log(finalData)
                array.push(finalData);
            //   console.log(array)
            });
            setdata(array)
            setfilteredData(array)
        })
        setisLoading(false)
    }, [])

    // useEffect(() => {
    //     readData();
    // }, [])

    const readData = () => {
        const apiURL = `${host}/get`;
        fetch(apiURL,{
            method: 'GET'
        })
        .then((res) => res.json())
        .then((resJson) => {
            // console.log(typeof(resJson))
            setdata(resJson)
            setfilteredData(resJson)
        }).catch((error) => {
            console.log('Request API error: ', error);
        }).finally(() => setisLoading(false))
            // console.log(data)
    }
    const searchFilter = (text) => {
        if(text){
            const newData = data.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setfilteredData(newData);
        }else{
            setfilteredData(data);
        }
        setSearch(text);
    }
    
    renderItem = ({item, index}) => {
      const scale = scrollY.interpolate({
        inputRange:[
          -1, 0,
          item_size * index,
          item_size * (index + 2)
        ],
        outputRange: [1, 1, 1, 0]
      })
      const opacity = scrollY.interpolate({
        inputRange:[
          -1, 0,
          item_size * index,
          item_size * (index + .6)
        ],
        outputRange: [1, 1, 1, 0]
      })
        return (
          <TouchableOpacity 
            onPress={() =>{
                // console.log("item:",typeof(item))
                navigation.navigate("Chi tiết", {
                    id: item.id,
                    name: item.name,
                    info: item.info, 
                    genus: item.genus,
                    family: item.family,
                    order: item.order, 
                    image: item.image,
                })
            } }
          >
            <Animated.View style={{
                flexDirection:'row',
                padding: spacing/2,
                marginBottom: item_margin_bottom,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 12,
                shadowColor:"#000",
                shadowOffset:{width:0, height:10},
                shadowOpacity:.3,
                shadowRadius:20,
                transform: [{scale}], opacity
                }}
            >
                <Image 
                  style={styles.image}
                  source={{uri: item.image ? item.image : "https://vanhoadoanhnghiepvn.vn/wp-content/uploads/2020/08/112815953-stock-vector-no-image-available-icon-flat-vector.jpg"}}
                  resizeMode='cover'
                />
                <View style={styles.wrapText}>
                    <Text style={styles.fontSize}>
                        {index + '. ' + item.name}
                    </Text> 
                </View>
            </Animated.View>
          </TouchableOpacity>
          
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Loading loading={isLoading}/>
            <CustomHeader title="Tìm kiếm" isBack={false} navigation={navigation}/>
            <View style={styles.headerContainer}>
            
                <View style={styles.inputContainer}>
                
                    <Icon style={{marginRight:5}}name="search" size={30}/>
                    <TextInput style={{fontSize:20, flex:1}}
                        placeholder="Nhập tên cây"
                        value={search}
                        onChangeText={text => searchFilter(text)}
                    />
                </View>
            </View>
            <View style={{flex:1}}>
              
                <View style={styles.itemContainer}>
                    <Image
                        source={{uri: bg_image}}
                        style={StyleSheet.absoluteFill}
                        blurRadius={20}
                    />
                    <Animated.FlatList
                        data={filteredData}
                        renderItem={renderItem}
                        // keyExtractor={item => `key-${item.id}`}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: scrollY}}}],
                            {useNativeDriver: true}
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    headerContainer:{
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#337954'
    },
    inputContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    container: {
        flex: 1,
        marginTop:StatusBar.currentHeight
    },
      text: {
        fontSize: 42,
    },
    listItemContainer: {
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 42,
    },
    itemContainer: {
        padding: spacing/2,
        height: heightSceen-160
    },
    image: {
        width: avatar_size,
        height: avatar_size,
        borderRadius:50
    },
    wrapText: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    fontSize: {
        fontSize: 22,
    },
});

export default Find;