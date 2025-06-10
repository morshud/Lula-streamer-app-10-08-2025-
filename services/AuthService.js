import BaseService from './BaseService'
import auth from '@react-native-firebase/auth'

class AuthService extends BaseService {
    #collection
    constructor(collectionName) {
        super(collectionName)
        this.#collection = collectionName
    }

    // Method for registering user with phone number
    async register(phoneNumber) {
        try {
            // Send verification code
            const confirmation = await this.auth.signInWithPhoneNumber(phoneNumber)
            return { error: false, confirmation } // Returns the confirmation object that will be used for code verification
        } catch (error) {
            console.error('Error sending OTP:', error)
            return this.handleError('Failed to send verification code')
        }
    }

    // Method for verifying the OTP code entered by the user
    async verifyOtp(verificationCode, confirmation) {
        try {
            // Confirm the verification code and sign the user in
            const userCredential = await confirmation.confirm(verificationCode)
            const user = userCredential.user

            // Check if the user already exists in Firestore
            const userRef = this.db.collection(this.#collection).doc(user.uid)

            const doc = await userRef.get()

            if (doc.exists) {
                // If the user already exists, return the existing document

                const myData = this.fromFirestore(doc)

                if (myData.role !== 'STREAMER') {
                    return { error: true, message: 'This Phone Number is Registered With other Platform' }
                }
                return { error: false, user: this.fromFirestore(doc) } // Return the existing user data
            } else {
                // If the user does not exist, create a new document for the user
                const userData = {
                    phoneNumber: user.phoneNumber,
                    role: 'STREAMER',
                    status: true,
                    isDeleted: false,
                    profileCompleted: false,
                    id: user.uid,
                    statusShow: true,
                }

                // Save user data to Firestore
                await userRef.set(this.toFirestore(userData))
                const data = await userRef.get()
                return { error: false, user: this.fromFirestore(data) }
            }
        } catch (error) {
            console.error('Error verifying OTP:', error)
            return this.handleError('Failed to verify OTP')
        }
    }

    async getUser(id) {
        try {
            const userRef = this.db.collection(this.#collection).doc(id)
            const doc = await userRef.get()
            if (doc.exists) {
                return { error: false, user: this.fromFirestore(doc) }
            } else {
                throw Error('User Not Found')
            }
        } catch (error) {
            return this.handleError(error.message)
        }
    }
    listenUserId(id, callback) {
        const userRef = this.db.collection(this.#collection).doc(id)

        const unsubscribe = userRef.onSnapshot((snapshot) => {
            callback(snapshot.data())
        })

        return unsubscribe
    }

    async updateStatusShow(userId, status) {
        try {
            const userRef = this.db.collection(this.#collection).doc(userId)
            await userRef.update({ statusShow: status })
            return { error: false, message: `User status updated to ${status ? 'online' : 'offline'}` }
        } catch (error) {
            console.error('Error updating status:', error)
            return this.handleError('Failed to update user status')
        }
    }
}

export default new AuthService('user')
