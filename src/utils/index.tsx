import { Alert, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import { logoutHandler, onLoginSuccess } from '../redux/actions/auth';
import { getItem } from '../cache';
import store from '../redux/store';
import types from '../redux/types';

export const isIos = Platform.OS == "ios";

export const checkTheme = () => {
    getItem("Theme").then((res: any) => {
        const { dispatch } = store;
        dispatch({
            type: types.CHANGE_THEME,
            payload: res,
        });
    }).catch((e) => {
        console.log(e);
    });
}

export const unregister = () => {
    const { dispatch } = store;
    auth().onAuthStateChanged((user) => {
        if (user) {
            firestore().collection('users').doc(user?.uid).update({ status: "online" });
            dispatch({
                type: types.LOGIN,
                payload: user,
            });
        }
    })
}

export let signIn = async (form: {}, setLoading: Function) => {
    let { Email: email, Password: password }: any = form;
    setLoading(true);
    try {
        let userCredentials = await auth().signInWithEmailAndPassword(email, password);
        auth().onAuthStateChanged((user) => {
            if (user) {
                firestore().collection('users').doc(user?.uid).update({ status: "online" });
                onLoginSuccess(user);
            }
        })
        setLoading(false)
    } catch (e: any) {
        Alert.alert('The email address or password is invalid!');
        setLoading(false);
    }
}

export let signOut = (user: any, setLoading: Function) => {
    Alert.alert(
        "Are you Sure ?",
        "you need to Sign Off !",
        [
            {
                text: "YES",
                onPress: () => {
                    setLoading(true);
                    firestore()?.collection('users')?.doc(user?.uid)?.update({ status: "offline" });
                    setTimeout(() => {
                        logoutHandler();
                        setLoading(false);
                    }, 1000);
                },
                style: 'destructive'
            },
            {
                text: "NO",
                onPress: () => { },
                style: "cancel"
            }
        ]
    )
}

export const docId = (uid: any, user: any) => uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

export let getMessages = async (setMessages: Function, docid: string) => {
    const messageRef = firestore()?.collection('chatrooms')
        ?.doc(docid)
        ?.collection('messages')
        ?.orderBy('createdAt', "desc")

    const unSubscribe = messageRef?.onSnapshot((querySnap: any) => {
        const allmsg = querySnap?.docs?.map((docSnap: any) => {
            const data = docSnap?.data()
            if (data?.createdAt) {
                return {
                    ...docSnap?.data(),
                    createdAt: docSnap?.data()?.createdAt?.toDate()
                }
            } else {
                return {
                    ...docSnap?.data(),
                    createdAt: new Date()
                }
            }

        })
        setMessages(allmsg)
    });

    return () => {
        unSubscribe()
    }
}

export const onSend = (messageArray: any, setMessages: Function, uid: any, user: any) => {
    const msg = messageArray[0]
    const mymsg = {
        ...msg,
        sentBy: user.uid,
        sentTo: uid,
        createdAt: new Date()
    }
    setMessages((previousMessages: any) => GiftedChat.append(previousMessages, mymsg));
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

    firestore()?.collection('chatrooms')
        ?.doc(docid)
        ?.collection('messages')
        ?.add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() })
}

export const getUsers = async (setUsers: Function, user: any) => {
    const querySanp = await firestore().collection('users').where('uid', '!=', user?.uid).get()
    const allusers = querySanp.docs.map((docSnap: any) => docSnap.data());
    setUsers(allusers);
}

export const getGroups = async (setGroups: Function) => {
    const querySanp = await firestore().collection('groups').get();
    const allusers = querySanp.docs.map((docSnap: any) => docSnap.data());
    setGroups(allusers);
}

export const getLoginUsers = async (setUsers: Function, user: any) => {
    const querySanp = await firestore().collection('users').where('uid', '==', user?.uid).get();
    const loginUser = querySanp.docs.map((docSnap: any) => docSnap.data());
    setUsers(loginUser);
}

export const titleWords = (str: string | any) => str?.match(/\b(\w)/g);

export const docGroupId = (user: any) => Math.random().toString(36).slice(2) + "-" + user.uid;

export const onSendGroup = (messageArray: any, setMessages: Function, groupid: any, user: any) => {
    const msg = messageArray[0];
    const mymsg = {
        ...msg,
        sentBy: user.uid,
        sentTo: groupid,
        createdAt: new Date()
    }
    setMessages((previousMessages: any) => GiftedChat.append(previousMessages, mymsg));

    firestore()?.collection('groupchatrooms')
        ?.doc(groupid)
        ?.collection('messages')
        ?.add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() })
}

export let getGroupMessages = async (setMessages: Function, docid: string) => {
    const messageRef = firestore()?.collection('groupchatrooms')
        ?.doc(docid)
        ?.collection('messages')
        ?.orderBy('createdAt', "desc")

    const unSubscribe = messageRef?.onSnapshot((querySnap: any) => {
        const allmsg = querySnap?.docs?.map((docSnap: any) => {
            const data = docSnap?.data()
            if (data?.createdAt) {
                return {
                    ...docSnap?.data(),
                    createdAt: docSnap?.data()?.createdAt?.toDate()
                }
            } else {
                return {
                    ...docSnap?.data(),
                    createdAt: new Date()
                }
            }

        })
        setMessages(allmsg)
    });

    return () => {
        unSubscribe()
    }
}

export const searchOptions = {
    isCaseSensitive: false,
    threshold: 0.3,
    keys: [
        "name",
        "uid",
        "status"
    ],
};

export const searchChatOptions = {
    isCaseSensitive: false,
    threshold: 0.3,
    keys: [
        "sentBy",
        "sentTo",
        "text",
        "user._id",
        "createdAt"
    ],
};
