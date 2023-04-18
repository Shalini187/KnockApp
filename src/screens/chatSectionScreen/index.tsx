import { Icon, Layout, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import moment from "moment";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { HeaderBar, SystemSearch, ThemeProvider, WrapperContainer } from "../../components";
import { COLORS, fontFamily, hitSlop, moderateScale, textScale } from "../../constants";
import { docId, getGroupMessages, getMessages, onSend, onSendGroup, searchChatOptions } from "../../utils";
import { useSelector } from "react-redux";
import Fuse from "fuse.js";


const ChatSectionScreen = ({ navigation, route }: any) => {
    const { userData, theme } = useSelector((state: any) => state.auth);

    let colorStyle = (theme == "dark") ? "#F2F8FF" : "#002885";
    let fontColor = (theme == "dark") ? "#002885" : "#F2F8FF";

    const [messages, setMessages] = useState([]);
    const [backData, setBackup] = useState<any>([]);
    const [show, setShow] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

    const { uid, name, status } = route?.params || {};

    useEffect(() => {
        if (status) {
            const docid = docId(uid, userData);
            getMessages((v: any) => {
                setMessages(v);
                setBackup(v);
            }, docid);
        } else {
            getGroupMessages((v: any) => {
                setMessages(v);
                setBackup(v);
            }, uid)
        }
    }, []);

    useEffect(() => {
        const showKey = Keyboard.addListener("keyboardDidShow", (val) => {
            setIsKeyboardOpen(true);
        });
        const hideKey = Keyboard.addListener("keyboardDidHide", (val) => {
            setIsKeyboardOpen(false);
        });

        return () => {
            showKey.remove();
            hideKey.remove();
        };
    }, []);

    const onChange = (searchText: string) => {
        setSearch(searchText);
        const fuseCategory = new Fuse(messages, searchChatOptions);
        var temp = fuseCategory?.search(searchText);
        let dummyArray: any = [], dummyArray_: any = [];
        temp?.forEach((item) => { dummyArray?.push(item?.item) });
        setMessages(dummyArray);

        if (!searchText && !dummyArray.length) {
            setMessages(backData);
        }
    };

    return (
        <ThemeProvider
            children={
                <WrapperContainer
                    children={
                        <>
                            <Layout style={{ flexGrow: 1, margin: moderateScale(8) }}>
                                <HeaderBar isBack={false} isSearch={() => {
                                    if (show) {
                                        return (
                                            <SystemSearch
                                                value={search}
                                                setValue={onChange}
                                            />
                                        )
                                    } else return;
                                }} headerText={show ? false : name} extraProps={{ status }} onTitleCallback={() => navigation.goBack()}
                                    rightProps={() => (
                                        <Layout style={{ flexDirection: "row" }}>
                                            <TouchableOpacity hitSlop={hitSlop} onPress={() => setShow((c) => !c)}>
                                                <Icon
                                                    pack={'feather'}
                                                    name={show ? "x-circle" : 'search'}
                                                    style={{ height: 22, width: 22, tintColor: colorStyle }}
                                                />
                                            </TouchableOpacity>
                                        </Layout>
                                    )}
                                />

                                <Layout style={{ flex: isKeyboardOpen ? 2 : 6 }}>
                                    <GiftedChat
                                        messages={messages}
                                        onSend={text => {
                                            !!status ? onSend(text, setMessages, uid, userData) : onSendGroup(text, setMessages, uid, userData)
                                        }}
                                        user={{
                                            _id: userData?.uid,
                                        }}
                                        showUserAvatar={false}
                                        showAvatarForEveryMessage={false}
                                        renderAvatar={(props) => <></>}
                                        renderSend={(props) => {
                                            const { text, messageIdGenerator, user, onSend }: any = props
                                            return (
                                                <TouchableOpacity
                                                    disabled={!(text && onSend)}
                                                    hitSlop={hitSlop}
                                                    onPress={
                                                        () => {
                                                            if (text && onSend) {
                                                                onSend({ text: text.trim(), user: user, _id: messageIdGenerator() }, true);
                                                            }
                                                        }
                                                    } style={{ marginHorizontal: 16 }}>
                                                    <Icon {...props} name={'send'} pack={'ionic'} style={{ height: 28, width: 28, color: "#002885", marginVertical: moderateScale(8) }} />
                                                </TouchableOpacity>
                                            )
                                        }}
                                        renderBubble={(props) => {
                                            return <Bubble
                                                {...props}
                                                wrapperStyle={{
                                                    right: {
                                                        backgroundColor: colorStyle,
                                                    },
                                                    left: {
                                                        backgroundColor: fontColor,
                                                    },
                                                }}
                                                textStyle={{
                                                    right: {
                                                        color: fontColor,
                                                        fontFamily: fontFamily.proximaMedium,
                                                        fontSize: textScale(14)
                                                    },
                                                    left: {
                                                        color: (theme == "dark" ? COLORS.white : COLORS.black),
                                                        fontFamily: fontFamily.helveticaMedium,
                                                        fontSize: textScale(14)
                                                    }
                                                }}
                                                renderTime={(timeProps) => {
                                                    return (
                                                        <Text style={{ fontFamily: fontFamily.proximaMedium, color: COLORS.lightGray3, fontSize: textScale(10), paddingHorizontal: moderateScale(8), paddingBottom: moderateScale(4) }}>{moment(timeProps?.currentMessage?.createdAt)?.format("hh:mm A")}</Text>
                                                    )
                                                }}
                                            />
                                        }}
                                        renderInputToolbar={(props) => {
                                            return <InputToolbar {...props}
                                                containerStyle={{ borderTopWidth: 1.5, borderTopColor: fontColor }}
                                                textInputStyle={{ color: COLORS.black }}
                                            />
                                        }}
                                    />
                                </Layout>
                            </Layout>
                        </>
                    }
                />
            }
        />
    )
}

export default ChatSectionScreen;