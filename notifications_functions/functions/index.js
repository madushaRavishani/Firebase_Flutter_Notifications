const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var msgData;

exports.notificationTrigger = functions.firestore.document(
    'notifications/{notificationId}'
).onCreate((snapshot, context)=>{
    msgData = snapshot.data();

    admin.firestore().collection('pushtokens').get().then((snapshots)=>{
        var tokens = [];
        if (snapshots.empty){
            console.log('No Devices');
        }
        else{
            for (var token of snapshots.docs){
                tokens.push(token.data().devtoken);
            }

            var payload = {
                "notification":{
                    "title": "From" + msgData.name,
                    "body": "age" + msgData.age,
                    "sound": "default"
                },
                "data":{
                    "sendername": msgData.name,
                    "message":msgData.age
                }
            }
            return admin.messaging().sendToDevice(tokens,payload).then((response)=>{
                console.log('pushed them all');
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
})

