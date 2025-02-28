import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Analytics() {
    const navigation = useNavigation();

    // Growth metrics data
    const growthData = [
        { title: 'Followers', value: 1234, growth: 12.5, positive: true },
        { title: 'Following', value: 567, growth: -3.2, positive: false },
        { title: 'Streams', value: 98, growth: 24.7, positive: true },
        { title: 'Chats', value: 87, growth: 5.3, positive: true },
    ];


    // Pie chart data
    const pieChartData = [
        {
            name: 'Mobile',
            population: 65,
            color: 'rgba(97, 86, 226, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        },
        {
            name: 'Desktop',
            population: 25,
            color: 'rgba(171, 73, 161, 0.8)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        },
        {
            name: 'Tablet',
            population: 10,
            color: '#F1B5CB',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
        },
    ];

    // Audience demographics data
    const audienceData = [
        { age: '18-24', percentage: 35 },
        { age: '25-34', percentage: 45 },
        { age: '35-44', percentage: 15 },
        { age: '45+', percentage: 5 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['rgba(171, 73, 161, 0.9)', 'rgba(97, 86, 226, 0.9)']}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.navigate('StreamerProfile')}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80' }}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Growth metrics */}
                    <View style={styles.metricsContainer}>
                        {growthData.map((item, index) => (
                            <View key={index} style={styles.metricCard}>
                                <View style={styles.metricHeader}>
                                    <Text style={styles.metricTitle}>{item.title}</Text>
                                    {item.positive ? (
                                        <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
                                    ) : (
                                        <MaterialIcons name="arrow-downward" size={16} color="#F44336" />
                                    )}
                                </View>
                                <Text style={styles.metricValue}>{item.value}</Text>
                                <View style={styles.metricGrowth}>
                                    <Text
                                        style={[
                                            styles.metricGrowthText,
                                            { color: item.positive ? '#4CAF50' : '#F44336' },
                                        ]}
                                    >
                                        {item.positive ? '+' : ''}{item.growth}%
                                    </Text>
                                    <Text style={styles.metricPeriod}>vs last period</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Device distribution */}
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <View>
                                <Text style={styles.chartTitle}>Device Distribution</Text>
                                <Text style={styles.chartSubtitle}>Where your audience watches from</Text>
                            </View>
                        </View>
                        <View style={styles.pieChartContainer}>
                            <PieChart
                                data={pieChartData}
                                width={width - 50}
                                height={200}
                                chartConfig={{
                                    backgroundColor: '#fff',
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                paddingLeft="15"
                                absolute
                            />
                        </View>
                    </View>

                    {/* Age demographics */}
                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <View>
                                <Text style={styles.chartTitle}>Age Demographics</Text>
                                <Text style={styles.chartSubtitle}>Age distribution of your audience</Text>
                            </View>
                            <View style={styles.chartIcon}>
                                <FontAwesome name="users" size={20} color="#6156e2" />
                            </View>
                        </View>
                        <View style={styles.demographicsContainer}>
                            {audienceData.map((item, index) => (
                                <View key={index} style={styles.demographicItem}>
                                    <Text style={styles.demographicAge}>{item.age}</Text>
                                    <View style={styles.demographicBarContainer}>
                                        <View
                                            style={[
                                                styles.demographicBar,
                                                { width: `${item.percentage}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.demographicPercentage}>{item.percentage}%</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Top content */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Top Performing Content</Text>
                    </View>

                    {/* Bottom spacing */}
                    <View style={{ height: 30 }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
    },
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 15,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    content: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 25,
        paddingHorizontal: 20,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    periodButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    periodButtonActive: {
        backgroundColor: '#6156e2',
    },
    periodButtonText: {
        color: '#666',
        fontWeight: '500',
        fontSize: 13,
    },
    periodButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        width: '48%',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    metricTitle: {
        color: '#666',
        fontSize: 14,
    },
    metricValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    metricGrowth: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metricGrowthText: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 5,
    },
    metricPeriod: {
        fontSize: 12,
        color: '#999',
    },
    chartCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    chartSubtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    chartIcon: {
        backgroundColor: 'rgba(97, 86, 226, 0.1)',
        padding: 8,
        borderRadius: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    sectionHeader: {
        marginTop: 10,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    pieChartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    demographicsContainer: {
        marginTop: 10,
    },
    demographicItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    demographicAge: {
        width: 50,
        fontSize: 14,
        color: '#666',
    },
    demographicBarContainer: {
        flex: 1,
        height: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginHorizontal: 10,
    },
    demographicBar: {
        height: 10,
        backgroundColor: '#6156e2',
        borderRadius: 5,
    },
    demographicPercentage: {
        width: 40,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        textAlign: 'right',
    },
    contentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contentInfo: {
        flex: 1,
    },
    contentTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    contentViews: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentIcon: {
        marginRight: 5,
    },
    contentViewsText: {
        fontSize: 13,
        color: '#888',
    },
    contentGrowth: {
        marginLeft: 10,
    },
    contentGrowthText: {
        fontSize: 14,
        fontWeight: '600',
    },
    recommendationsCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    recommendation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    recommendationIcon: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 10,
        marginRight: 12,
    },
    recommendationText: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});