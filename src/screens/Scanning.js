import React from "react";
import { useState,useEffect } from 'react';
import { Button, StyleSheet,Text,View} from 'react-native';
import Loading from "../components/Loading";
export default Scanning = () => {
    const [isLoading, setisLoading] = useState(false);
    return (
        <>
        <Loading/>
        {/* {
            !isLoading 
            ?
            <Button title="Scan" onPress={() => setisLoading(!isLoading)}/>
            :
            null
        }
       
        {
            isLoading 
            ? 
            <Loading/>
            :
            <Text style={{fontSize:30}}>Result</Text>
            // isLoading ? setTimeout(() => {
            //     <Loading/>
            // }, 2000) : 
            // <Text style={{fontSize:30}}>Result</Text>
     
        } */}

        </>
    );

};

const styles = StyleSheet.create({
    container:{
    //   justifyContent: 'center',
    //   alignContent: 'center',
    //   alignItems:'center'
    }
})