import React, { useState } from 'react'
import { Text, Image, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { loginStyles } from '../../styles';
import { Button, Icon, Input, Layout } from '@ui-kitten/components';
import { COLORS, fontFamily, moderateScale, textScale } from '../../constants';
import { Loader, ThemeProvider, WrapperContainer } from '../../components';
import { onLoginSuccess } from '../../redux/actions/auth';


interface IUser {
    [x: string]: string | undefined;
    Email: string | any;
    Password: string | undefined | any;
    Name: string | undefined | any;
}

const SignupScreen = ({ navigation }: any) => {
    const { theme } = useSelector((state: any) => state.auth);

    let { box1, text, img, box2 } = loginStyles || {};

    let colorStyle = (theme == "dark") ? "#F2F8FF" : "#002885";
    let fontColor = (theme == "dark") ? "#002885" : "#F2F8FF";

    const [form, setForm] = useState<IUser>({ Email: '', Password: '', Name: '' });
    const [hidePassword, togglePassword] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);

    let { Email: email, Password: password, Name: name } = form || {};

    if (loading) {
        return (
            <Loader />
        )
    }

    const userSignup = async () => {
        setLoading(true);
        try {
            const result = await auth().createUserWithEmailAndPassword(email, password);
            let payload = {
                name: name,
                email: result.user.email,
                uid: result.user.uid,
                password: password,
                status: "online",
            }
            onLoginSuccess(payload);
            firestore().collection('users').doc(result.user.uid).set(payload);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('The email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                Alert.alert('The email address is invalid!');
            }

            if (error.code === 'auth/weak-password') {
                Alert.alert('Must be a string with at least six characters');
            }
            console.error(error);
        }
        setTimeout(() => setLoading(false), 2000);
    }


    return (
        <ThemeProvider
            children={
                <WrapperContainer
                    isLoading={loading}
                    children={
                        <Layout style={{ flex: 1, top: "8%" }}>
                            <KeyboardAvoidingView behavior={"position"}>
                                <Layout style={box1}>
                                    <Text style={{ ...text, fontFamily: fontFamily.proximaExtraBold, color: (theme == "dark") ? COLORS.white : COLORS.black }}>Welcome to Knock!</Text>
                                    <Image resizeMode={"cover"} style={img} source={require('../../assets/images/logo.webp')} />
                                </Layout>
                                <Layout style={box2}>
                                    {Object.keys(form)?.map((item: any, index: number) => (
                                        <Input
                                            key={index}
                                            style={{ marginVertical: 12, borderRadius: moderateScale(16) }}
                                            autoCapitalize={'none'}
                                            testID={item}
                                            textStyle={{ fontFamily: fontFamily.proximaMedium, fontSize: textScale(13) }}
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
                                        disabled={!(email && password && name)}
                                        style={{ top: '5%', borderRadius: moderateScale(16) }}
                                        appearance={'filled'}
                                        onPress={userSignup}>
                                        {(eva) => <Text {...eva} style={{ color: !(email && password && name) ? COLORS.lightGray4 : fontColor, fontFamily: fontFamily.proximaSemiBold }}>{"SIGNUP"}</Text>}
                                    </Button>
                                    <TouchableOpacity style={{ top: '18%' }} onPress={() => navigation.goBack()}>
                                        <Text style={{ textAlign: "center", fontFamily: fontFamily.proximaMedium, color: (theme == "dark") ? COLORS.white : COLORS.black }}>Already have an account ?
                                            <Text style={{ textAlign: "center", color: COLORS.darkGreen, fontFamily: fontFamily.helveticaMedium }}>{" "}Login
                                            </Text>
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


export default SignupScreen;