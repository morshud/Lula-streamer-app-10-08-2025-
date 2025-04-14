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
    async getUsers(limit = 10, lastVisible = null) {
        try {
            let query = this.db.collection(this.#collection)
                .where('role', '==', 'USER')
                .where('isDeleted', '==', false)
                .limit(limit);

            // If we have a lastVisible document, use startAfter for pagination
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
        } catch (error) {
            console.error("Error fetching users:", error);
            return this.handleError("Failed to fetch users.");
        }
    }
}

export default new UserService("user");
