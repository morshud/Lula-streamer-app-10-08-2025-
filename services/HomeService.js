import BaseService from './BaseService'
import moment from 'moment'
import firestore from '@react-native-firebase/firestore'

class HomeService extends BaseService {
    constructor() {
        super('asd')
    }

    /**
     * Fetches total earnings in the last 4 weeks
     * @param {string} userId - The ID of the user
     * @returns {Promise<Array>} - Total coins earned
     */
    async getLastFourWeeksEarnings(userId) {
        try {
            const fourWeeksAgo = firestore.Timestamp.fromDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)) // 4 weeks ago

            const snapshot = await this.db.collection('transactions').where('userId', '==', userId).where('type', '==', 'earn').where('createdAt', '>=', fourWeeksAgo).get()

            // Get last 4 weeks' data
            const weeks = {}
            for (let i = 0; i < 4; i++) {
                const weekStart = moment().subtract(i, 'weeks').startOf('week').format('YYYY-MM-DD')
                weeks[weekStart] = 0 // Initialize week-wise earnings
            }

            // Process earnings data
            snapshot.docs.forEach((doc) => {
                const tx = this.fromFirestore(doc)

                // Convert Firestore Timestamp to JS Date and then to moment
                const createdAt = moment(new Date(tx.createdAt).toDateString()).startOf('week').format('YYYY-MM-DD')

                if (tx.type === 'earn' && weeks.hasOwnProperty(createdAt)) {
                    weeks[createdAt] += tx.coins
                }
            })
            // Convert to pie chart format
            const pieChartData = Object.entries(weeks).map(([week, totalEarnings], index) => ({
                name: `Week ${4 - index}`, // Labels as Week 4, Week 3, etc.
                population: parseFloat(totalEarnings?.toFixed(2)),
                color: ['#F1B5CB', 'rgba(171, 73, 161, 0.8)', 'rgba(97, 86, 226, 1)', '#FFD700'][index], // Assign colors
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
            }))

            return pieChartData
        } catch (error) {
            console.error('Error fetching earnings:', error)
            return []
        }
    }

    async getHomeCounts(userId) {
        try {
            const userRef = this.db.collection('user').doc(userId)
            const doc = await userRef.get()
            if (!doc.exists) {
                throw Error('User Not Found')
            }

            const data = this.fromFirestore(doc)

            const snapshot = await this.db.collection('chats').where('streamerId', '==', userId).get()

            const transactionSnapshot = await this.db.collection('transactions').where('userId', '==', userId).where('type', '==', 'earn').get()

            const totalEarnings = transactionSnapshot.docs.reduce((sum, doc) => sum + (doc.data().coins || 0), 0);


            const body = {
                followers: data?.followers?.length || 0,
                following: data?.following?.length || 0,
                chats: snapshot.size,
                totalEarnings:parseFloat(totalEarnings).toFixed(2),
            }

            return { error: false, data: body }
        } catch (error) {
            this.handleError(error.message)
        }
    }
}

export default new HomeService()
