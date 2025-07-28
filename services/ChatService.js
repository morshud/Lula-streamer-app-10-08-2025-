import { serverTimestamp } from '@react-native-firebase/firestore'
import BaseService from './BaseService'

class ChatService extends BaseService {
    #collection
    constructor(collectionName) {
        super(collectionName)
        this.#collection = collectionName
    }
    // Create a chat session between a user and a streamer
    async createChat(userId, streamerId) {
        try {
            const chatId = this.getChatId(userId, streamerId)
            const chatDocRef = this.db.collection(this.#collection).doc(chatId)
            // Create chat if it doesn't exist
            let chatDoc = await chatDocRef.get()
            if (!chatDoc.exists) {
                chatDoc = await chatDocRef.set(
                    this.toFirestore(
                        {
                            userId,
                            streamerId,
                            lastMessage: '',
                            id: chatId,
                        },
                        true
                    )
                )
            }
            return { error: false, data: chatId }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    async getChatList(limit = 10, lastVisible = null, streamerId) {
        try {
            console.log(lastVisible)

            // Build the query to get chats for the given streamerId
            let query = this.db.collection(this.#collection).where('streamerId', '==', streamerId).limit(limit)

            // Add pagination if lastVisible exists
            if (lastVisible) {
                query = query.startAfter(lastVisible)
            }

            // Fetch the chat documents
            const snapshot = await query.get()
            if (snapshot.empty) {
                return { chats: [], lastVisible: null }
            }

            // Get the last document to use for pagination
            const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1]

            // Get all unique userIds for this batch of chats
            const userIds = snapshot.docs.map((doc) => doc.data().userId)
            const uniqueUserIds = [...new Set(userIds)] // Ensure unique userIds

            // Fetch the users in a single query
            const userSnapshot = await this.db.collection('user').where('id', 'in', uniqueUserIds).get()

            // Create a map of users for fast lookup
            const users = new Map()
            userSnapshot.docs.forEach((doc) => {
                users.set(doc.id, this.fromFirestore(doc))
            })

            // Map the chat data with the user details
            const chats = snapshot.docs.map((doc) => {
                const chat = this.fromFirestore(doc)
                chat.user = users.has(chat.userId) ? users.get(chat.userId) : null
                return chat
            })

            // Return the result with the chats and lastVisible for pagination
            return {
                chats,
                lastVisible: lastVisibleDoc, // Provide the last document for the next page
            }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    // Send a message from user to streamer or streamer to user
    async sendMessage(chatId, body) {
        try {
            // Create a chat session if it doesn't exist
            await this.db.collection(this.#collection).doc(chatId).collection('messages').add(this.toFirestore(body, true))
            this.update(chatId, { lastMessage: body.content, updatedAt: serverTimestamp() })
            return { error: false, message: 'Message sent successfully' }
        } catch (error) {
            console.error('Error sending message:', error)
            return { error: true, message: 'Failed to send message' }
        }
    }

    // Listen for real-time updates on new messages
    listenToMessages(chatId, callback) {
        // Listen for changes in the messages subcollection
        return this.db
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .orderBy('createdAt')
            .onSnapshot((snapshot) => {
                const newMessages = snapshot.docs.map((doc) => {
                    return this.fromFirestore(doc)
                })
                callback(newMessages)
            })
    }

    // Utility to generate a chat ID based on user and streamer IDs
    getChatId(userId, streamerId) {
        return userId < streamerId ? `${userId}_${streamerId}` : `${streamerId}_${userId}`
    }
}

export default new ChatService('chats')
