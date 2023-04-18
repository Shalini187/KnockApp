// Import the functions you need from the SDKs you need
import * as firebaseApp from '@react-native-firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    appId: '1:869234386607:ios:987a2a8c70e85fdbbf965a',
    messagingSenderId: '869234386607',
    clientId: '869234386607-jg9mrkp6eqtql1iu79h150qdijof6vo6.apps.googleusercontent.com',
    apiKey: 'AIzaSyD3PjEmLg2SSAVmCF2mJp3RVZDuMmycqpk',
    projectId: 'sensehawk-3b375',
    storageBucket: 'sensehawk-3b375.appspot.com'
};
// Initialize Firebase
let app;

if (firebaseApp.default.apps.length == 0) {
    app = firebaseApp.default.initializeApp(firebaseConfig);
} else {
    app = firebaseApp.default.app
}

export { app };