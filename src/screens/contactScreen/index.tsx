import { Icon, Layout, Text } from "@ui-kitten/components";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { BottomUpRawSheet, HeaderBar, Loader, SystemModal, ThemeProvider, WrapperContainer } from "../../components";
import { COLORS, fontFamily, moderateScale } from "../../constants";
import { docGroupId, getGroups, getLoginUsers, getUsers, titleWords } from "../../utils";
import { chatStyles } from '../../styles';
import { useSelector } from "react-redux";
import firestore from '@react-native-firebase/firestore';

let { text, mycard, subText } = chatStyles || {};

const ContactScreen = ({ navigation, route }: any) => {
    const { userData, theme } = useSelector((state: any) => state.auth);

    const sheetRef: any = useRef();

    const [users, setUsers] = useState<any>(null);
    const [backupGroups, setBackupGroups] = useState<any>(null);
    const [groups, setGroups] = useState<any>(null);
    const [groupName, setGroupName] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);
    const [isModal, setModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loginUser, setLoginUser] = useState<any>('');

    const [checkItems, setCheckItems] = useState<any>([]);
    const [checkGroupItems, setCheckGroupItems] = useState<any>([]);

    useEffect(() => {
        init();
        getLoginUsers(setLoginUser, userData);
        setTimeout(() => setLoading(false), 1000);
    }, [refresh]);

    useMemo(() => {
        const filterGroup = backupGroups?.filter((i: any) => {
            const val = (i?.usersList?.find((v: any) => checkItems?.includes(v)));
            if (val) return;
            else return i;
        });

        setGroups(filterGroup);
    }, [checkItems]);

    const init = () => {
        getUsers(setUsers, userData);
        getGroups((val: any) => {
            setGroups(val);
            setBackupGroups(val);
        });
        setRefresh(false);
    }

    const isChecked = (item: any, checkItems: any) => {
        return checkItems?.includes(item);
    }

    const addClickItems = (item: any, setCheckItems: any) => {
        setCheckItems((check: any) => [...check, item]);
    }

    const removeClickItems = (item: any, checkItems: any, setCheckItems: any) => {
        let temp = [...checkItems];
        const index = checkItems?.indexOf(item);
        if (index > -1) { // only splice array when item is found
            temp.splice(index, 1); // 2nd parameter means remove one item only
        }
        setCheckItems(temp);
    }

    const onClick = useCallback((i: any, checkItems: any, setCheckItems: any) => {
        if (!!isChecked(i, checkItems)) {
            return removeClickItems(i, checkItems, setCheckItems);
        } else {
            return addClickItems(i, setCheckItems);
        }
    }, []);

    const onVisible = () => {
        if (checkItems?.length <= 1) return Alert.alert("Select more then one contacts to create a group");
        const groupId = docGroupId(userData);
        setLoading(true);
        try {
            let payload = {
                name: `${groupName}`,
                usersList: checkItems,
                uid: groupId
            }
            firestore().collection('groups').doc(groupId).set({ ...payload });
        } catch (error: any) {
            console.error(error);
        }
        setTimeout(() => {
            setLoading(false);
            navigation.goBack();
            setVisible(false);
        }, 2000);
    }

    const updateGroup = () => {
        setLoading(true);
        groups?.map((i: any) => {
            if (checkGroupItems?.includes(i?.uid)) {
                try {
                    let payload = {
                        name: i?.name,
                        usersList: [...new Set([...i?.usersList, ...checkItems])],
                        uid: i?.uid
                    };
                    firestore().collection('groups').doc(i?.uid).update({ ...i, ...payload });
                } catch (error: any) {
                    console.error(error);
                }
            } else return;
        });
        setTimeout(() => {
            setLoading(false);
            navigation.goBack();
            setVisible(false);
        }, 1000);
    }

    const onAddExistingGroup = () => {
        if (!checkItems?.length) return Alert.alert("Select more then one contacts to create a group");
        sheetRef?.current?.open();
        setVisible(false);
    }

    const RenderCard = ({ item, index }: any) => {
        let { name, uid, status } = item || {};
        const color = (theme == "dark") ? COLORS.white : COLORS.black;

        return (
            <TouchableOpacity key={index} onPress={() => onClick(uid, checkItems, setCheckItems)}>
                <Layout style={mycard} level="2">
                    {
                        isChecked(uid, checkItems) ?
                            <Icon
                                pack={'feather'}
                                name={'check-square'}
                                style={{ height: 24, width: 24, tintColor: color, alignSelf: "center", marginRight: moderateScale(16), marginTop: moderateScale(8) }}
                            />
                            :
                            <Icon
                                pack={'feather'}
                                name={'square'}
                                style={{ height: 24, width: 24, tintColor: color, alignSelf: "center", marginRight: moderateScale(16), marginTop: moderateScale(8) }}
                            />
                    }

                    <Layout level={"4"} style={{ height: 40, width: 40, borderRadius: 100, marginRight: 16 }}>
                        <Text style={{ fontFamily: fontFamily.helveticaBold, fontSize: moderateScale(12), alignSelf: "center", paddingVertical: moderateScale(12), textTransform: "capitalize" }}>{titleWords(name)}</Text>
                    </Layout>
                    <Layout level="2">
                        <Text style={{ ...text, fontFamily: fontFamily.helveticaMedium }}>{name}</Text>
                        <Text style={{ ...subText, fontFamily: fontFamily.helveticaRegular, fontSize: 12, color: (status == 'online') ? COLORS.darkGreen : COLORS.red }}>{status}</Text>
                    </Layout>
                </Layout>
            </TouchableOpacity>
        )
    }

    const RenderGroupCard = ({ item, index }: any) => {
        let { name, uid, status } = item || {};
        const color = (theme == "dark") ? COLORS.white : COLORS.black;

        return (
            <TouchableOpacity key={index} onPress={() => {
                onClick(uid, checkGroupItems, setCheckGroupItems);
            }}>
                <Layout style={mycard} level="2">
                    {
                        isChecked(uid, checkGroupItems) ?
                            <Icon
                                pack={'feather'}
                                name={'check-square'}
                                style={{ height: 24, width: 24, tintColor: color, alignSelf: "center", marginRight: moderateScale(16), marginTop: moderateScale(8) }}
                            />
                            :
                            <Icon
                                pack={'feather'}
                                name={'square'}
                                style={{ height: 24, width: 24, tintColor: color, alignSelf: "center", marginRight: moderateScale(16), marginTop: moderateScale(8) }}
                            />
                    }

                    <Layout level={"4"} style={{ height: 40, width: 40, borderRadius: 100, marginRight: 16 }}>
                        <Text style={{ fontFamily: fontFamily.helveticaBold, fontSize: moderateScale(12), alignSelf: "center", paddingVertical: moderateScale(12), textTransform: "capitalize" }}>{titleWords(name)}</Text>
                    </Layout>
                    <Layout level="2">
                        <Text style={{ ...text, fontFamily: fontFamily.helveticaMedium }}>{name}</Text>
                        {
                            status ?
                                <Text style={{ ...subText, fontFamily: fontFamily.helveticaRegular, fontSize: 12, color: (status == 'online') ? COLORS.darkGreen : COLORS.red }}>{status}</Text>
                                :
                                <Text style={{ ...subText, fontFamily: fontFamily.helveticaRegular, fontSize: 12, color: COLORS.lightGray4 }}>{'Select to join!!'}</Text>
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
                                <HeaderBar extraProps={{ status: loginUser?.[0]?.status }}
                                    onTap={() => navigation.goBack()}
                                    leftString={"Contacts"}
                                    rightProps={() => (
                                        <TouchableOpacity onPress={() => setVisible(true)}>
                                            <Icon
                                                pack={'feather'}
                                                name={'user-plus'}
                                                style={{ height: 24, width: 24, tintColor: (theme == "dark") ? COLORS.white : COLORS.black }}
                                            />
                                        </TouchableOpacity>
                                    )} />
                            </Layout>
                            <Layout style={{ flex: 8 }}>
                                <FlatList
                                    data={users}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refresh}
                                            onRefresh={() => {
                                                setRefresh((r) => !r)
                                            }}
                                        />
                                    }
                                    ListEmptyComponent={() => {
                                        return (
                                            <Loader />
                                        )
                                    }}
                                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: moderateScale(8) }}
                                    renderItem={({ item, index }) => { return <RenderCard item={item} index={index} /> }}
                                    keyExtractor={(item) => item.uid}
                                />
                            </Layout>
                            <SystemModal
                                modalVisible={visible}
                                setModalVisible={setVisible}
                                onCreate={() => {
                                    setVisible(false);
                                    setModal(true);
                                }}
                                onAddExisting={onAddExistingGroup}
                            />
                            <SystemModal
                                modalVisible={isModal}
                                setModalVisible={setModal}
                                onCreate={onVisible}
                                children={<></>}
                                setGroupName = {setGroupName}
                                groupName = {groupName}
                            />
                            <BottomUpRawSheet
                                sheetRef={sheetRef}
                                sheetHeight={moderateScale(368)}
                                children={
                                    <Layout style={{ flex: 1 }}>
                                        <Layout style={{ padding: moderateScale(16) }}>
                                            <Text style={{ fontFamily: fontFamily.proximaMedium }}>{'List of Groups'}</Text>
                                        </Layout>
                                        <FlatList
                                            data={groups}
                                            keyExtractor={(item) => item.uid}
                                            renderItem={RenderGroupCard}
                                            ListEmptyComponent={() => {
                                                return (
                                                    <Layout style={{ flex: 1 }}>
                                                        <Text style={{ fontFamily: fontFamily.proximaBold }}>{'No Groups to Select!!!'}</Text>
                                                    </Layout>
                                                )
                                            }}
                                            contentContainerStyle={{ paddingHorizontal: moderateScale(16), paddingBottom: moderateScale(30) }}
                                        />
                                        <Layout style={{ flexDirection: "row", alignSelf: "center" }}>
                                            {
                                                groups?.length > 0 ?
                                                    <TouchableOpacity
                                                        onPress={() => updateGroup()}>
                                                        <Layout level={'4'} style={{ padding: moderateScale(16), borderRadius: moderateScale(16), margin: moderateScale(16) }}>
                                                            <Text style={{
                                                                fontFamily: fontFamily.proximaMedium,
                                                                textAlign: 'center',
                                                            }}>{'CREATE'}</Text>
                                                        </Layout>
                                                    </TouchableOpacity>
                                                    :
                                                    <></>
                                            }
                                            <TouchableOpacity
                                                onPress={() => {
                                                    sheetRef?.current?.close();
                                                    setCheckGroupItems([]);
                                                }}>
                                                <Layout style={{ backgroundColor: COLORS.red, padding: moderateScale(16), borderRadius: moderateScale(16), margin: moderateScale(16) }}>
                                                    <Text style={{
                                                        color: COLORS.white,
                                                        fontFamily: fontFamily.proximaMedium,
                                                        textAlign: 'center',
                                                    }}>{'CLOSE'}</Text>
                                                </Layout>
                                            </TouchableOpacity>
                                        </Layout>
                                    </Layout>
                                }
                                sheetHeight={moderateScale(368)}
                            />
                        </>
                    }
                />
            }
        />
    )
}

export default ContactScreen;