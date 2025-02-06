import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../Component/context/UserContext';

const db = getFirestore();

// Helper function to format the date as "January 2nd, 2024"
const formatDate = (date) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    const year = parts.find(part => part.type === 'year').value;

    // Add ordinal suffix to the day
    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // Handle 11th, 12th, 13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

const DOSAGE_UNITS = [
    'tablets',
    'capsules',
    'ml',
    'mg',
    'drops',
    'puffs',
    'patches',
    'sachets'
];
const DURATIONS = Array.from({ length: 30 }, (_, i) => `${i + 1} days`);
const FREQUENCIES = [
    'Once daily',
    'Twice daily',
    'Thrice daily',
    'Four times daily',
    'Every morning',
    'Every night',
    'Every 8 hours',
    'Every 12 hours',
    'Before breakfast',
    'After breakfast',
    'Before lunch',
    'After lunch',
    'Before dinner',
    'After dinner',
    'As needed'
];

const SelectModal = ({ visible, onClose, options, onSelect, title }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={{ color: '#E91E63', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.optionItem}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

const CustomSelector = ({ value, onSelect, options, placeholder, title }) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={value ? styles.selectorText : styles.selectorPlaceholder}>
                    {value || placeholder}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>
            <SelectModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                options={options}
                onSelect={onSelect}
                title={title}
            />
        </>
    );
};

const AddPrescriptionPage = () => {
    const navigation = useNavigation();
    const { userData } = useUser();

    const generatePrescriptionId = () => {
        const today = new Date();
        const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
        const userPrefix = userData?.name ? userData.name.slice(0, 3).toUpperCase() : 'XXX';
        return `RX${dateStr}${userPrefix}`;
    };

    const [prescriptionData, setPrescriptionData] = useState({
        doctorId: userData?.uid || '',
        specialty: userData?.specialty || '',
        date: formatDate(new Date()), // Format the date here
        prescriptionId: generatePrescriptionId(),
        status: 'Pending',
        notes: '',
        medications: [],
        userId: userData?.uid || '',
        userName: '' // Initialize as empty
    });

    const [currentMedication, setCurrentMedication] = useState({
        name: '', // Initialize as empty
        dosageValue: '', // Initialize as empty
        dosageUnit: '', // Initialize as empty
        frequency: '', // Initialize as empty
        duration: '', // Initialize as empty
        price: '' // Initialize as empty
    });

    const addMedication = () => {
        if (currentMedication.name && currentMedication.dosageValue) {
            setPrescriptionData(prev => ({
                ...prev,
                medications: [
                    ...prev.medications,
                    {
                        ...currentMedication,
                        dosage: `${currentMedication.dosageValue} ${currentMedication.dosageUnit}`,
                        price: parseFloat(currentMedication.price) || 0
                    }
                ]
            }));
            setCurrentMedication({
                name: '',
                dosageValue: '',
                dosageUnit: '',
                frequency: '',
                duration: '',
                price: ''
            });
        } else {
            alert('Please fill in all medication details before adding.');
        }
    };
    
    const handleSubmit = async () => {
        try {
            if (!prescriptionData.doctorId) {
                alert('Doctor id is required.');
                return;
            }
            if (!prescriptionData.userName) {
                alert('Patient name is required.');
                return;
            }
            if (prescriptionData.medications.length === 0) {
                alert('At least one medication must be added.');
                return;
            }
    
            const prescriptionToSave = {
                ...prescriptionData,
                timestamp: Date.now(),
                doctorId: userData.uid,
                userId: userData.uid,
                isDoctor: userData.isDoctor
            };
            await addDoc(collection(db, 'prescriptions'), prescriptionToSave);
            navigation.goBack();
        } catch (error) {
            console.error('Error adding prescription:', error);
            alert('Error saving prescription. Please try again.');
        }
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Add New Prescription</Text>

                {/* Patient Name Field */}
                <Text style={styles.label}>Patient Name</Text>
                <TextInput
                    style={styles.input}
                    value={prescriptionData.userName}
                    onChangeText={(text) => setPrescriptionData(prev => ({ ...prev, userName: text }))}
                    placeholder="Enter patient name"
                />

                {userData.isDoctor && (
                    <>
                        <Text style={styles.sectionTitle}>Add Medications*</Text>
                        <TextInput
                            style={styles.input}
                            value={currentMedication.name}
                            onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, name: text }))}
                            placeholder="Enter medication name"
                        />
                        <TextInput
                            style={styles.input}
                            value={currentMedication.dosageValue}
                            onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, dosageValue: text }))}
                            placeholder="Enter dosage value"
                            keyboardType="numeric"
                        />
                        <CustomSelector
                            value={currentMedication.dosageUnit}
                            onSelect={(value) => setCurrentMedication(prev => ({ ...prev, dosageUnit: value }))}
                            options={DOSAGE_UNITS}
                            placeholder="Select dosage unit"
                            title="Select Dosage Unit"
                        />
                        <CustomSelector
                            value={currentMedication.frequency}
                            onSelect={(value) => setCurrentMedication(prev => ({ ...prev, frequency: value }))}
                            options={FREQUENCIES}
                            placeholder="Select frequency"
                            title="Select Frequency"
                        />
                        <CustomSelector
                            value={currentMedication.duration}
                            onSelect={(value) => setCurrentMedication(prev => ({ ...prev, duration: value }))}
                            options={DURATIONS}
                            placeholder="Select duration"
                            title="Select Duration"
                        />
                        <TextInput
                            style={styles.input}
                            value={currentMedication.price}
                            onChangeText={(text) => setCurrentMedication(prev => ({ ...prev, price: text }))}
                            placeholder="Enter price"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={styles.addMedicationButton}
                            onPress={addMedication}
                        >
                            <Text style={styles.addMedicationButtonText}>Add Medication</Text>
                        </TouchableOpacity>
                        {prescriptionData.medications.map((med, index) => (
                            <View key={index} style={styles.medicationItem}>
                                <View style={styles.medicationInfo}>
                                    <Text style={styles.medicationName}>{med.name}</Text>
                                    <Text style={styles.medicationDetails}>
                                        {med.dosage} • {med.frequency} • {med.duration}
                                    </Text>
                                    <Text style={styles.medicationPrice}>
                                        ${parseFloat(med.price).toFixed(2)}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => removeMedication(index)}>
                                    <Ionicons name="trash-outline" size={24} color="#E91E63" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </>
                )}

                {/* Notes Field */}
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={prescriptionData.notes}
                    onChangeText={(text) => setPrescriptionData(prev => ({ ...prev, notes: text }))}
                    placeholder="Enter additional notes"
                    multiline
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        !userData.isDoctor && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={!userData.isDoctor}
                >
                    <Text style={styles.submitButtonText}>
                        {userData.isDoctor ? 'Save Prescription' : 'Only Doctors Can Add Prescriptions'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    optionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    selectorText: {
        fontSize: 16,
        color: '#333',
    },
    selectorPlaceholder: {
        fontSize: 16,
        color: '#999',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    medicationSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addMedicationButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addMedicationButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    medicationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginTop: 10,
    },
    medicationInfo: {
        flex: 1,
        marginRight: 10,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    medicationDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    medicationPrice: {
        fontSize: 14,
        color: '#E91E63',
        fontWeight: '600',
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: '#E91E63',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    }
});

export default AddPrescriptionPage;