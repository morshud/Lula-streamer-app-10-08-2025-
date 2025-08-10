import BaseService from "./BaseService";
import firestore from '@react-native-firebase/firestore';

class UserService extends BaseService {
    #collection;

    constructor(collectionName) {
        super(collectionName);
        this.#collection = collectionName; 
    }

    /**
     * Fetch users with the role 'USER' and support pagination for infinite scroll.
     * 
     * @param {number} limit - Number of users to fetch per request (for pagination)
     * @param {DocumentSnapshot} lastVisible - The last document from the previous fetch for pagination
     * @returns {Promise<Object>} - Object containing users data and a reference to the last document
     */
    async getUsers(limit = 20, lastVisible = null) {
        try {
            // Build query without phoneNumber != ""
            let query = this.db.collection(this.#collection)
                .where('role', '==', 'USER')
                .where('isDeleted', '==', false)
                .where('statusShow', '==', true)
                .limit(limit);

            // Pagination if lastVisible provided
            if (lastVisible) {
                query = query.startAfter(lastVisible);
            }

            const snapshot = await query.get();

            if (snapshot.empty) {
                return { users: [], lastVisible: null };
            }

            // Map and filter out users with missing or empty phoneNumber
            const users = snapshot.docs
            .map(doc => this.fromFirestore(doc))
            .filter(user => 
                user.phoneNumber?.trim() && 
                user.name?.trim()
            );


            const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

            return {
                users,
                lastVisible: lastVisibleDoc,
            };
        } catch (error) {
            console.error("Error fetching users:", error);
            return this.handleError("Failed to fetch users.");
        }
    }

    async getOnlineUsers(limit = 20, lastVisible = null) {
        try {
            let query = await this.db.collection(this.#collection)
                .where('role', '==', 'USER')
                .where('statusShow', '==', true)
                .limit(limit);

             if (lastVisible) {
                query = query.startAfter(lastVisible);
            }

            const snapshot = await query.get();
            
            if (snapshot.empty) {
                return { users: [], lastVisible: null }; // No more users to fetch
            }

            // Map the users to a format
            const users = snapshot.docs.map(doc => this.fromFirestore(doc));
            const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

            return {
                users,
                lastVisible: lastVisibleDoc, // Provide the last document for the next page
            };

            // const users = snapshot.docs.map(doc => ({
            //     id: doc.id,
            //     ...doc.data(),
            // }));

            // return { users, lastVisible: null }; // No pagination for online users
        } catch (error) {
            console.error('Error fetching online users:', error);
            throw error; // Or handle error as needed
        }
    }

    async getOfflineUsers(limit, lastVisible) {
        try {
            let query = this.db.collection(this.#collection)
                .where('role', '==', 'USER')
                .where('statusShow', '==', false)
                .orderBy('name'); // You need a field to order offline users for pagination

            if (lastVisible) {
                query = query.startAfter(lastVisible);
            }

            query = query.limit(limit);

            const snapshot = await query.get();

            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Get the last document for the next pagination
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];

            return { users, lastVisible: lastDoc };
        } catch (error) {
            console.error('Error fetching offline users:', error);
            throw error; // Or handle error as needed
        }
    }

    /**
     * Fetches a single user by their document ID.
     * @param {string} userId - The ID of the user document to fetch.
     * @returns {Promise<Object>} - Object containing the user data or an error.
     */
    async getUserById(userId) {
        try {
            const docRef = this.db.collection(this.#collection).doc(userId);
            const docSnapshot = await docRef.get();

            if (!docSnapshot.exists) {
                return this.handleError("User not found.");
            }

            return { error: false, user: this.fromFirestore(docSnapshot) };
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return this.handleError("Failed to fetch user.");
        }
    }

    // Assuming you have a method to transform Firestore document to user object
    fromFirestore(doc) {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Add any necessary data transformations here
        };
    }
}

export default new UserService("user");
