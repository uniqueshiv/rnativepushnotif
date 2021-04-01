import { StatusBar } from 'expo-status-bar';
import React,{useEffect} from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

// import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

import NotifService from './NotifService';



export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }

  
// const app = () => {
 componentDidMount(){

  this.createNotificationListeners();


    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token)
      },
// (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('REMOTE NOTIFICATION ==>', notification)
// process the notification here
      },
      // Android only: GCM or FCM Sender ID
      senderID: '256218572662',
      popInitialNotification: true,
      requestPermissions: true
    })
  }

  async createNotificationListeners() {

    // This listener triggered when notification has been received in foreground
    this.notificationListener = PushNotification.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.displayNotification(title, body);
    });

    // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
    this.notificationOpenedListener = PushNotification.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.displayNotification(title, body);
    });

    // This listener triggered when app is closed and we click,tapped and opened notification 
    const notificationOpen = await PushNotification.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.displayNotification(title, body);
    }
  }


  displayNotification(title, body) {
    // we display notification in alert box with title and body
    Alert.alert(
      title, body,
      [
        { text: 'Ok', onPress: () => console.log('ok pressed') },
      ],
      { cancelable: false },
    );
  }


 render(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Example app react-native-push-notification
        </Text>
        <View style={styles.spacer}></View>
        <TextInput
          style={styles.textField}
          value={this.state.registerToken}
          placeholder="Register token"
        />
        <View style={styles.spacer}></View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.localNotif();
          }}>
          <Text>Local Notification (now)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.localNotif('sample.mp3');
          }}>
          <Text>Local Notification with sound (now)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.scheduleNotif();
          }}>
          <Text>Schedule Notification in 30s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.scheduleNotif('sample.mp3');
          }}>
          <Text>Schedule Notification with sound in 30s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.cancelNotif();
          }}>
          <Text>Cancel last notification (if any)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.cancelAll();
          }}>
          <Text>Cancel all notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.checkPermission(this.handlePerm.bind(this));
          }}>
          <Text>Check Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.requestPermissions();
          }}>
          <Text>Request Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.abandonPermissions();
          }}>
          <Text>Abandon Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.getScheduledLocalNotifications(notifs => console.log(notifs));
          }}>
          <Text>Console.Log Scheduled Local Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.getDeliveredNotifications(notifs => console.log(notifs));
          }}>
          <Text>Console.Log Delivered Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.createOrUpdateChannel();
          }}>
          <Text>Create or update a channel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.notif.popInitialNotification();
          }}>
          <Text>popInitialNotification</Text>
        </TouchableOpacity>

        <View style={styles.spacer}></View>

        {this.state.fcmRegistered && <Text>FCM Configured !</Text>}

        <View style={styles.spacer}></View>
      </View>
  );
}


onRegister(token) {
  this.setState({registerToken: token.token, fcmRegistered: true});
}

onNotif(notif) {
  Alert.alert(notif.title, notif.message);
}

handlePerm(perms) {
  Alert.alert('Permissions', JSON.stringify(perms));
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
