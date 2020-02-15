import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View, Text, BackHandler, Dimensions, DatePickerAndroid, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Dates } from '../handlers/Dates';

const { height, width, fontScale } = Dimensions.get("window");
const GREY_COLOR = '#8e8e8e';
const APP_COLOR = '#304251';

export default function DueDateCalculator(props) {
    // Declare a new state variable, which we'll call "count"
    const [lastMenstrualPeriodToShow, setLastMenstrualPeriodToShow] = useState('Select a date');
    const [lastMenstrualPeriodDate, setLastMenstrualPeriodDate] = useState('');
    const [childBirthToShow, setChildBirthToShow] = useState('');
    const [range, setRange] = useState(null);
    const [close, setClose] = useState(false)



    useEffect(() => {
        console.log('close')
        if (close) {
            setLastMenstrualPeriodToShow('Select a date');
            setLastMenstrualPeriodDate('')
            setChildBirthToShow('')
            setRange(null)
            setClose(false)
            props.handleCloseDueDate()
        }
    }, [close])

    const handleOnPressDatePickerLastMenstrual = async (props) => {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                maxDate: new Date(),
                mode: 'default' // spiner or calender
            });
            if (action === DatePickerAndroid.dateSetAction) {
                setLastMenstrualPeriodToShow(new Date(`${month + 1}/${day}/${year}`).toDateString().split(' ').slice(1).join(' '));
                setLastMenstrualPeriodDate(`${month + 1}/${day}/${year}`);
            }
        } catch ({ code, message }) {
            console.log('Cannot open date picker', message);
        }
    }

    const handleOnPressCalculate = async (props) => {

        // console.log('lastMenstrualPeriodDate=', lastMenstrualPeriodDate)
        const estimateDueDate = Dates.CalculateChildBirthByLastMenstrual(lastMenstrualPeriodDate);
        const newDate = new Date(estimateDueDate).toDateString()
        let newDateSplit = newDate.split(' ')

        setRange(Dates.GetSafeRangeToGiveBirth(estimateDueDate))
        setChildBirthToShow(`${newDateSplit[0]}, ${newDateSplit[1]} ${newDateSplit[2]}, ${newDateSplit[3]}`)

    }

    const renderHeader = () => (
        <View style={styles.headerForModal}>
            <View style={{ flex: 0.2 }}>
                <TouchableOpacity
                    style={{ paddingHorizontal: 20 }}
                    onPress={() => setClose(true)}
                >
                    <Ionicons name="md-arrow-back" color="#FFF" size={28} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={styles.txtHeader}>Due Date Calculator</Text>
            </View>
        </View>
    )

    return (
        <Modal
            visible={props.displayComponent}
            transparent={false}
            animationType={"slide"}
            onRequestClose={() => setClose(true)}
        >
            <View style={{ flex: 1 }}>

                {renderHeader()}

                <View style={styles.body}>
                    {/* header text */}
                    <Text style={styles.txtHeaderStyle}>What was the first day{`\n`}of your last menstrual{`\n`}period?</Text>

                    {/* flex row style for date picker */}
                    <View style={styles.flexRow}>
                        {/* view icon */}
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="md-calendar" size={35} color={APP_COLOR} style={{ top: 7.5 }} />
                        </View>
                        {/* button select a date */}
                        <View style={styles.btnSelectDateView}>
                            {/* select last menstrual for calculate due date */}
                            {
                                (lastMenstrualPeriodDate !== '' &&
                                    <Text
                                        style={{
                                            color: GREY_COLOR,
                                            marginBottom: -20,
                                            fontSize: 12
                                        }}
                                    >
                                        Select a date
                            </Text>
                                )
                            }
                            <TouchableOpacity
                                style={styles.btnSelectDate}
                                onPress={handleOnPressDatePickerLastMenstrual}
                            >
                                <Text
                                    style={[
                                        styles.txtDueDateStyle,
                                        { color: lastMenstrualPeriodDate === '' ? GREY_COLOR : '#000' }
                                    ]}
                                >
                                    {lastMenstrualPeriodToShow}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* button track my baby */}
                    <View style={styles.marginTopBtn}>
                        <TouchableOpacity
                            disabled={lastMenstrualPeriodDate === '' ? true : false}
                            style={[
                                styles.btnStyle,
                                { backgroundColor: lastMenstrualPeriodDate === '' ? GREY_COLOR : APP_COLOR }]}
                            onPress={handleOnPressCalculate}
                        >
                            <Text style={styles.txtBtnStyle}>Calculate</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        childBirthToShow !== '' &&
                        <View style={{ marginTop: 30, alignSelf: 'center' }}>
                            <Text style={{ fontWeight: '400', fontSize: 13 * fontScale, color: APP_COLOR, }}>Your baby's estimated due date is on</Text>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 * fontScale, color: APP_COLOR, textAlign: 'center' }}>{childBirthToShow}</Text>
                            </View>
                        </View>
                    }
                    {
                        range !== null &&
                        <View style={{ marginTop: 30, alignSelf: 'center' }}>
                            <Text style={{ fontWeight: '400', fontSize: 13 * fontScale, color: APP_COLOR }}>Your approximate range to give birth</Text>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 * fontScale, color: APP_COLOR, textAlign: 'center' }}>{range.preTerm}  to  {range.postTerm}</Text>
                            </View>
                        </View>
                    }
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    headerForModal: {
        flex: 0.08,
        backgroundColor: APP_COLOR,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 3
    },
    txtHeader: {
        color: '#FFF',
        fontSize: 12 * fontScale,
        fontWeight: '500'
    },
    body: {
        flex: 0.7,
        width: width - 50,
        alignSelf: 'center'
    },
    txtBtnStyle: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 7.5,
    },
    btnStyle: {
        width: width - 50,
        height: 50,
        borderRadius: 7,
    },
    marginTopBtn: { marginTop: '5%' },
    txtDueDateStyle: { marginTop: 20, fontSize: 15, },
    btnSelectDate: {
        alignSelf: 'flex-start',
        width: width - 100,
        height: 50,
        borderBottomColor: GREY_COLOR,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    btnSelectDateView: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: '3%'
    },
    flexRow: {
        width: width - 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: '5%'
    },
    txtHeaderStyle: {
        fontSize: 25,
        color: APP_COLOR,
        marginTop: '3%'
    },
})