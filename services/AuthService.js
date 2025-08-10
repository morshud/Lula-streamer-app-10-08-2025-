import BaseService from './BaseService'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'https://twilio-lula.onrender.com' // 🔗 Twilio backend endpoint

class AuthService extends BaseService {
  #collection
  #confirmation = null
  #phoneNumber = null

  constructor(collectionName) {
    super(collectionName)
    this.#collection = collectionName
  }

  // 📲 Send OTP to phone
  async register(phoneNumber) {
    try {
      // const response = await axios.post(`${API_BASE_URL}/send-otp`, {
      //   phoneNumber,
      // })

      // if (!response.data.error) {
      //   this.#phoneNumber = phoneNumber
      //   return { error: false, confirmation: true }
      // }

      //return { error: true, message: response.data.message }
      // Check if user already exists with the phone number
      const existingUserQuery = await this.db.collection(this.#collection).where('phoneNumber', '==', phoneNumber).where('role', '==', 'STREAMER').limit(1).get();

      if (!existingUserQuery.empty) {
        // User exists, return existing user data
        const existingDoc = existingUserQuery.docs[0];
        const user = this.fromFirestore(existingDoc);

        // Save user ID to AsyncStorage
        await AsyncStorage.setItem('loggedInUserId', user.id);

        return { error: false, user };
      } else {
        // User does not exist, create a new user document
        const userData = {
          phoneNumber: phoneNumber,
          role: 'STREAMER', // Assuming 'STREAMER' is the default role for new users
          status: true,
          isDeleted: false,
          profileCompleted: false, // New users haven't completed their profile
          statusShow: true,
        };

        const addedRef = await this.db.collection(this.#collection).add(this.toFirestore(userData));
        await addedRef.update({ id: addedRef.id });

        const newDoc = await addedRef.get();
        const user = this.fromFirestore(newDoc);

        // Save user ID to AsyncStorage
        await AsyncStorage.setItem('loggedInUserId', user.id);

        return { error: false, user };
      }
    } catch (error) {
      console.error('Error sending OTP:', error.message)
      return this.handleError('Failed to send verification code')
    }
  }
// async verifyOtp(otpCode) {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
//       phoneNumber: this.#phoneNumber,
//       otp: otpCode,
//     })

//     if (response.data.error) {
//       return { error: true, message: response.data.message }
//     }

//     const userData = {
//       phoneNumber: this.#phoneNumber,
//       role: 'STREAMER',
//       status: true,
//       isDeleted: false,
//       profileCompleted: false,
//       statusShow: true,
//     }

//     const addedRef = await this.db.collection(this.#collection).add(this.toFirestore(userData))
//     await addedRef.update({ id: addedRef.id })

//     const newDoc = await addedRef.get()
//     const user = this.fromFirestore(newDoc)

//     // ✅ Save user ID to AsyncStorage
//     await AsyncStorage.setItem('loggedInUserId', user.id)

//     return { error: false, user }
//   } catch (error) {
//     console.error('Error verifying OTP:', error.message)
//     return this.handleError('Failed to verify OTP')
//   }
// }


  // 🔍 Get user by document ID
    
  async verifyOtp(otpCode) {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        phoneNumber: this.#phoneNumber,
        otp: otpCode,
      });

      if (response.data.error) {
        return { error: true, message: response.data.message };
      }

      // Check if user already exists with the phone number
      const existingUserQuery = await this.db.collection(this.#collection).where('phoneNumber', '==', this.#phoneNumber).limit(1).get();

      if (!existingUserQuery.empty) {
        // User exists, return existing user data
        const existingDoc = existingUserQuery.docs[0];
        const user = this.fromFirestore(existingDoc);

        // Save user ID to AsyncStorage
        await AsyncStorage.setItem('loggedInUserId', user.id);

        return { error: false, user };
      } else {
        // User does not exist, create a new user document
        const userData = {
          phoneNumber: this.#phoneNumber,
          role: 'STREAMER', // Assuming 'STREAMER' is the default role for new users
          status: true,
          isDeleted: false,
          profileCompleted: false, // New users haven't completed their profile
          statusShow: true,
        };

        const addedRef = await this.db.collection(this.#collection).add(this.toFirestore(userData));
        await addedRef.update({ id: addedRef.id });

        const newDoc = await addedRef.get();
        const user = this.fromFirestore(newDoc);

        // Save user ID to AsyncStorage
        await AsyncStorage.setItem('loggedInUserId', user.id);

        return { error: false, user };
      }

    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      return this.handleError('Failed to verify OTP');
    }
  }

  async updateUserProfile(userId, updatedData) {
    try {
      const userRef = this.db.collection(this.#collection).doc(userId);
      await userRef.update(updatedData);

      // Optionally fetch and return the updated user object
      const updatedDoc = await userRef.get();
      if (updatedDoc.exists) {
        return { error: false, user: this.fromFirestore(updatedDoc) };
      } else {
        // Should not happen if the update was successful
        return { error: true, message: 'Failed to retrieve updated user data' };
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      return this.handleError('Failed to update user profile');
    }
  }

  async deleteAccount() {
    try {

      const user = auth().currentUser
      if (!user) {
        return { error: true, message: 'User not found' }
      }

      await this.db.collection(this.#collection).doc(user.uid).delete()
      await user.delete()

      return { error: false, message: 'Account deleted permanently' }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        return { error: true, message: 'Please re-authenticate to delete your account' }
      }
      return this.handleError(error.message)
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
