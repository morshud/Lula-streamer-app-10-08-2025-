import BaseService from './BaseService'

class WithdrawService extends BaseService {
    #collection
    constructor(collectionName) {
        super(collectionName)
        this.#collection = collectionName
    }

    // Create a new withdrawal request
    async createWithdrawal(userId, bankName, accountNumber, ifsc, upiId, amount) {
        try {
            if (!bankName && !upiId) {
                throw new Error('Either Bank Name or UPI ID is required')
            }
            if (amount <= 0) {
                throw new Error('Amount must be greater than zero')
            }

            const withdrawalData = this.toFirestore(
                {
                    userId,
                    bankName: bankName || '',
                    accountNumber: accountNumber || '',
                    ifsc: ifsc || '',
                    upiId: upiId || '',
                    amount,
                    status: 'pending',
                    createdAt: new Date(),
                },
                true
            )

            const withdrawalRef = await this.db.collection(this.#collection).add(withdrawalData)
            return { error: false, data: withdrawalRef.id }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    // Get withdrawal requests for a user
    async getWithdrawals(userId) {
        try {
            let snapshot = await this.db.collection(this.#collection)
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get()

            if (snapshot.empty) {
                return { error: false, data: [] }
            }

            const withdrawals = snapshot.docs.map((doc) => this.fromFirestore(doc))
            return { error: false, data: withdrawals }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    async getTotalWithdrawnAmount(userId) {
        try {
            const snapshot = await this.db.collection('withdrawals').where('userId', '==', userId).where('status', '==', 'completed').get()
            const totalWithdrawn = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0)
            return parseFloat(totalWithdrawn.toFixed(2))
        } catch (error) {
            console.error('Error fetching withdrawn amount:', error)
            return 0
        }
    }
}

export default new WithdrawService('withdrawals')