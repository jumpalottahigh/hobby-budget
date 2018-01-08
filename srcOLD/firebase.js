import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDCMODJqnwMKRwS2xI1OVugW-G5PzzNraA",
  authDomain: "hobby-budget.firebaseapp.com",
  databaseURL: "https://hobby-budget.firebaseio.com",
  projectId: 'hobby-budget',
  storageBucket: "hobby-budget.appspot.com",
  messagingSenderId: '816727543154'
}

firebase.initializeApp(config)

export default firebase
