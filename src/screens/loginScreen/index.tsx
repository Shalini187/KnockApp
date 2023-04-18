import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Icon, Input, Layout, Text } from '@ui-kitten/components';
import { loginStyles } from "../../styles";
import { COLORS, fontFamily, moderateScale, textScale } from '../../constants';
import { ThemeProvider, WrapperContainer } from '../../components';
import { signIn } from '../../utils';
import navigationString from '../../utils/navigationString';


interface IUser {
    [x: string]: string | undefined;
    Email: string;
    Password: string;
}

const LoginScreen = ({ navigation }: any) => {
    const { theme } = useSelector((state: any) => state.auth);

    let colorStyle = (theme == "dark") ? "#F2F8FF" : "#002885";
    let fontColor = (theme == "dark") ? "#002885" : "#F2F8FF";

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<IUser>({ Email: '', Password: '' });
    const [hidePassword, togglePassword] = useState<boolean>(true);

    let { box1, text, img, box2 } = loginStyles || {};

    return (
        <ThemeProvider
            children={
                <WrapperContainer
                    isLoading={loading}
                    children={
                        <Layout style={{ flex: 1, top: "8%" }}>
                            <KeyboardAvoidingView behavior={"position"}>
                                <Layout style={box1}>
                                    <Text style={{ ...text, fontFamily: fontFamily.proximaExtraBold }}>Welcome to Knock!</Text>
                                    <Image resizeMode={"cover"} style={img} source={require('../../assets/images/logo.webp')} />
                                </Layout>
                                <Layout style={box2}>
                                    {Object.keys(form)?.map((item: any, index: number) => (
                                        <Input
                                            key={index}
                                            autoCapitalize={'none'}
                                            testID={item}
                                            textStyle={{ fontFamily: fontFamily.proximaMedium, fontSize: textScale(13) }}
                                            style={{ borderRadius: moderateScale(16) }}
                                            placeholder={item}
                                            value={form?.item}
                                            onChangeText={(nextValue: any) => {
                                                setForm({ ...form, [item]: nextValue });
                                            }}
                                            accessoryRight={(props: any) => {
                                                return (
                                                    (item == 'Password') ? <Icon name={!hidePassword ? 'eye-off' : 'eye'} {...props} color={COLORS.black} size={24} pack={'eva'} onPress={() => togglePassword(!hidePassword)} /> : <></>
                                                )
                                            }}
                                            secureTextEntry={(item == 'Password') && hidePassword}
                                        />
                                    ))}
                                    <Button
                                        disabled={!(form?.Email && form?.Password)}
                                        appearance={'filled'}
                                        status={"primary"}
                                        style={{ borderRadius: moderateScale(16) }}
                                        onPress={() => signIn(form, setLoading)}>
                                        {(eva) => <Text {...eva} style={{ color: !(form?.Email && form?.Password) ? COLORS.lightGray4 : fontColor, fontFamily: fontFamily.proximaSemiBold }}>{"LOGIN"}</Text>}
                                    </Button>
                                    <TouchableOpacity onPress={() => navigation.navigate(navigationString.SIGNUP)}>
                                        <Text style={{ textAlign: "center", fontFamily: fontFamily.proximaMedium }}>Dont have an account ?
                                            <Text style={{ textAlign: "center", color: COLORS.darkGreen, fontFamily: fontFamily.helveticaMedium }}>{" "}SignUp</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </Layout>
                            </KeyboardAvoidingView>
                        </Layout>
                    }
                />
            }
        />
    )
}

export default LoginScreen;