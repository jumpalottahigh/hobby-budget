import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDJJAuimDWqUJJCrSAUexG95PwoXSuCahw',
  authDomain: 'boiling-heat-4669.firebaseapp.com',
  databaseURL: 'https://boiling-heat-4669.firebaseio.com',
  projectId: 'boiling-heat-4669',
  storageBucket: 'boiling-heat-4669.appspot.com',
  messagingSenderId: '925713084446'
}

firebase.initializeApp(config)

export default firebase
