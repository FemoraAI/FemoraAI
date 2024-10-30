// import React from 'react';

// const PeriodTrackerPage = () => {
//     return (
//         <div>
//             <h1>Period Tracker</h1>
//             <p>Welcome to the Period Tracker Page.</p>
//         </div>
//     );
// };

// export default PeriodTrackerPage;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PeriodTrackerPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Period Tracker</Text>
            <Text style={styles.description}>Welcome to the Period Tracker Page.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default PeriodTrackerPage;