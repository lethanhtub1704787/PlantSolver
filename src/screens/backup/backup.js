const addComment = async (cmtInputText) => {
    let thisTime = moment().format()
    const commentPostRef = ref(getDatabase(), 'PlantSolver/Comments/'+postId);
    const newCommentKey = push(commentPostRef).key;
    const data_to_Update = {
        uid: userInfo.userId,
        name: userInfo.name,
        avatar: userInfo.avatar,
        message: cmtInputText,
        timeStamp: thisTime,
        key: newCommentKey,
    }
    updateComment(data_to_Update)
   
    const commentData = {
        uid: userInfo.userId,
        message: cmtInputText,
        timeStamp: thisTime
    };
    const updates = {};
    updates[newCommentKey] = commentData;       
    // updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    await update(commentPostRef, updates)
    
    const post_ref = ref(getDatabase(), 'PlantSolver/Posts/'+ postId); // get post ref
    get(child(post_ref,"/cmtCount")).then((snapshot) => {
        let cmtCount = Number(snapshot.val())
        cmtCount++
        const updates = {};
        updates['cmtCount'] = cmtCount
        // listRemove(item)
        return update(post_ref,updates);
        // console.log(value)
    })
}

async function getUserInfo(id){ // using Firebase querry
    var obj = {
        name:"",
        avatar:""
    }
    const target_ref = ref(getDatabase(), 'PlantSolver/Users');
    // console.log("id to finddd:",id)
    const name = query(target_ref, orderByChild('email'),equalTo(id));
    let snapshot = await get(name).catch((error) => {console.error(error)});
    if (snapshot.exists()) {
        // console.log("user snapshot:",snapshot.val())
        let data
        if(snapshot.val()[0]!=undefined){
            data = snapshot.val()[0]
        }else{
            data = snapshot.val()[1]
        }
        // console.log("snapshot.val()[1]",snapshot.val()[1])
        let username = data['info']['name']
        let avatar = data['info']['avatar']
        obj.name = username
        obj.avatar = avatar
        
    } else {
        console.log("No data available");
    }
    return obj
}

async function getCmtData(array){
    let data = []
    console.log("getting user info")
    for(const item of array){
        let userInfo = await getUserInfo(item.uid)
        let toPush = Object.assign(item, { avatar: userInfo.avatar, name: userInfo.name})
        data.push(toPush)
        // console.log(data)
    }
    return data
}

async function getNameById(uid){
    const target_ref = ref(getDatabase(), 'PlantSolver/Users');
    const name = query(target_ref, orderByChild('email'),equalTo(uid));
    let snapshot = await get(name).catch((error) => {console.error(error)});
    console.log(snapshot.val())
    let data
    if(snapshot.val()[0]!=undefined){
        data = snapshot.val()[0]
    }else{
        data = snapshot.val()[1]
    }
    // console.log("snapshot.val()[1]",snapshot.val()[1])
    let username = data['info']['name']
    return username
}

       // let objIndex = data.findIndex((obj => obj.key == postID))
        // if(!data[objIndex]['liked']){
        //     console.log("no liked found")
        //     return 0
        // }
        // let likecount = data[objIndex]['liked']
        // return Object.keys(likecount).length



            // const updateLike = useCallback((key) => {
    //     let uid = userInfo.userId
    //     let data = [...postData]
    //     // console.log("before update:",data)
    //     let objIndex = data.findIndex((obj => obj.key == key));
    //     if(! data[objIndex]['liked']){
    //         // console.log("no liked found")
    //         let assignData = Object.assign(data[objIndex], {'liked':{[uid]: true}});
    //         data[objIndex] = assignData
    //         setpostData(data)
    //         return
    //     }
    //     let isLiked = data[objIndex]['liked'][uid]
    //     // console.log("isliked: ",isLiked)
    //     let assignData = Object.assign(data[objIndex]['liked'], {[uid]: true}); // add user id to liked list

    //     isLiked ? delete data[objIndex]['liked'][uid] // remove user liked
    //     : data[objIndex]['liked'] = assignData //  insert new user like

    //     console.log(data[objIndex]['liked'])
    //     setpostData(data)
    // },[postData])