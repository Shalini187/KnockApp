import { Icon, Layout, Text } from "@ui-kitten/components";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Keyboard, RefreshControl, TouchableOpacity } from "react-native";
import { HeaderBar, Loader, SystemSearch, ThemeProvider, WrapperContainer } from "../../components";
import { COLORS, fontFamily, hitSlop, moderateScale } from "../../constants";
import { getGroups, getLoginUsers, getUsers, searchOptions, signOut, titleWords } from "../../utils";
import { chatStyles } from '../../styles';
import { useSelector } from "react-redux";
import navigationString from "../../utils/navigationString";
import { onChangeTheme } from "../../redux/actions/auth";
import { useFocusEffect } from "@react-navigation/native";
import Fuse from "fuse.js";

let _ = require("lodash");

let { text, mycard, subText } = chatStyles || {};

const ChatScreen = ({ navigation, route }: any) => {
    const { userData, theme } = useSelector((state: any) => state.auth);
    let fontColor = (theme != "dark") ? "#002885" : "#F2F8FF";

    const [search, setSearch] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [users, setUsers] = useState<any>(null);
    const [groups, setGroups] = useState<any>(null);
    const [backData, setBackup] = useState<any>({ groups: [], users: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loginUser, setLoginUser] = useState<any>('');
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            init();
        }, [])
    );

    useEffect(() => {
        getLoginUsers(setLoginUser, userData);
    }, [refresh]);

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

    const onUpdate = (data: any) => {
        setBackup((state: any) => ({ ...state, ...data }));
    };

    const init = () => {
        getUsers((v: any) => {
            setUsers(v);
            onUpdate({ users: v });
        }, userData);
        getGroups((v: any) => {
            setGroups(v);
            onUpdate({ groups: v });
        });
        setRefresh(false);
    }

    const onChange = (searchText: string) => {
        const { users = [], groups = [] } = backData || {};
        setSearch(searchText);

        const fuseCategory_ = new Fuse(users, searchOptions);
        const fuseCategory = new Fuse(groups, searchOptions);

        var temp = fuseCategory?.search(searchText);
        var temp_ = fuseCategory_?.search(searchText);

        let dummyArray: any = [], dummyArray_: any = [];
        temp?.forEach((item) => { dummyArray?.push(item?.item) });

        temp_?.forEach((item) => { dummyArray_?.push(item?.item) });

        setUsers(dummyArray_);
        setGroups(dummyArray);

        if (!searchText && !dummyArray.length) {
            setGroups(groups);
        }

        if (!searchText && !dummyArray_.length) {
            setUsers(users);
        }
    };

    const RenderCard = ({ item, index }: any) => {
        let { name, uid, status } = item || {};

        return (
            <TouchableOpacity key={index} onPress={() => {
                navigation.navigate(navigationString.DETAILSCREEN, {
                    name, uid,
                    status: typeof (status) == "string" ? status : status?.toDate().toString() ?? ""
                });
            }}>
                <Layout style={mycard} level="2">
                    <Layout level={"4"} style={{ height: 40, width: 40, borderRadius: 100, marginRight: 16 }}>
                        <Text style={{ fontFamily: fontFamily.helveticaBold, fontSize: moderateScale(12), alignSelf: "center", paddingVertical: moderateScale(12), textTransform: "capitalize" }}>{titleWords(name)}</Text>
                    </Layout>
                    <Layout level="2">
                        <Text style={{ ...text, fontFamily: fontFamily.helveticaMedium }}>{name}</Text>
                        {status ?
                            <Text style={{ ...subText, fontFamily: fontFamily.helveticaRegular, fontSize: 12, color: (status == 'online') ? COLORS.darkGreen : COLORS.red }}>{status}</Text>
                            :
                            <Text style={{ ...subText, fontFamily: fontFamily.helveticaRegular, fontSize: 12, color: COLORS.lightGray4 }}>{'Press here to check the group activity'}</Text>
                        }
                    </Layout>
                </Layout>
            </TouchableOpacity>
        )
    }

    return (
        <ThemeProvider
            children={
                <WrapperContainer
                    isLoading={loading}
                    children={
                        <>
                            <Layout style={{ flex: 1 }}>
                                <HeaderBar isBack={false} isSearch={() => {
                                    if (show) {
                                        return (
                                            <SystemSearch
                                                value={search}
                                                setValue={onChange}
                                            />
                                        )
                                    } else return;
                                }} headerText={show ? false : loginUser?.[0]?.name} extraProps={{ status: loginUser?.[0]?.status }} rightProps={() => (
                                    <>
                                        <Layout style={{ flexDirection: "row" }}>
                                            {!show ?
                                                <>
                                                    <TouchableOpacity hitSlop={hitSlop} onPress={() => signOut(userData, setLoading)}>
                                                        <Icon
                                                            pack={'feather'}
                                                            name={'log-out'}
                                                            style={{ height: 22, width: 22, tintColor: COLORS.red }}
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity hitSlop={hitSlop} onPress={() => onChangeTheme(theme == "dark" ? "light" : "dark")}>
                                                        <Icon
                                                            pack={'feather'}
                                                            name={theme == "dark" ? 'sun' : "moon"}
                                                            style={{ height: 22, width: 22, tintColor: fontColor, marginLeft: moderateScale(16) }}
                                                        />
                                                    </TouchableOpacity>
                                                </>
                                                : <></>}
                                            <TouchableOpacity hitSlop={hitSlop} onPress={() => setShow(c => !c)}>
                                                <Icon
                                                    pack={'feather'}
                                                    name={show ? 'x-circle' : "search"}
                                                    style={{ height: 22, width: 22, tintColor: fontColor, marginLeft: moderateScale(16) }}
                                                />
                                            </TouchableOpacity>
                                        </Layout>
                                    </>
                                )} />
                            </Layout>
                            <Layout style={{ flex: isKeyboardOpen ? 2 : show ? 6 : 8 }}>
                                <FlatList
                                    data={_.concat(groups, users)}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refresh}
                                            onRefresh={() => {
                                                setTimeout(() => setRefresh((r) => !r), 1000);
                                            }}
                                        />
                                    }
                                    ListEmptyComponent={() => {
                                        return (
                                            <Loader />
                                        )
                                    }}
                                    contentContainerStyle={{ paddingBottom: 30, margin: moderateScale(8) }}
                                    renderItem={({ item, index }) => { return <RenderCard item={item} index={index} /> }}
                                    keyExtractor={(item) => item?.uid}
                                />
                            </Layout>
                            <Layout level={'4'} style={{ borderRadius: moderateScale(100), alignSelf: "flex-end", margin: moderateScale(16) }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate(navigationString.CONTACTSCREEN);
                                    }}
                                    style={{ padding: moderateScale(8), alignSelf: "center", width: moderateScale(50), height: moderateScale(50) }}>
                                    <Icon
                                        pack={'feather'}
                                        name={"users"}
                                        style={{ height: 22, width: 22, tintColor: fontColor, marginHorizontal: moderateScale(4), alignSelf: "center" }}
                                    />
                                </TouchableOpacity>
                            </Layout>
                        </>
                    }
                />
            }
        />
    )
}

export default ChatScreen;