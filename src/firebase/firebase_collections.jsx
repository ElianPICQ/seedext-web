import { collection } from 'firebase/firestore';
import { db } from './init_firebase';

// ref to user collection
const usersCollectionRef = collection(db, 'users');
const questionsCollectionRef = collection(db, 'questions');
const responsesCollectionRef = collection(db, 'responses');
const matchCollectionRef = collection(db, 'match');

export { usersCollectionRef, questionsCollectionRef, responsesCollectionRef, matchCollectionRef };