import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import { serverTimestamp } from '@react-native-firebase/firestore'

class BaseService {
    db = firestore()
    auth = auth()
    storage = storage()
    #collection

    constructor(collectionName) {
        this.#collection = collectionName
    }

    handleError(message) {
        console.error(message)
        return { error: true, message }
    }

    toFirestore(data) {
        return {
            ...data,
            createdAt: serverTimestamp(),
        }
    }

    fromFirestore(doc) {
        const data = doc.data()
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt.toDate().toString(),
        }
    }

    async update(docId, data) {
        try {
            await this.db.collection(this.#collection).doc(docId).update(data)
            return { success: true, message: 'Document updated successfully' }
        } catch (error) {
            return { success: false, message: 'Failed to update document' }
        }
    }

    async delete(docId) {
        try {
            await this.db.collection(this.#collection).doc(docId).delete()
            return { success: true, message: 'Document deleted successfully' }
        } catch (error) {
            return { success: false, message: 'Failed to delete document' }
        }
    }

    async getAsMap() {
        try {
            const snapshot = await this.db.collection(this.#collection).get()
            const map = new Map()

            snapshot.forEach((doc) => {
                map.set(doc.id, doc.data())
            })

            return map
        } catch (error) {
            return this.handleError('Failed to fetch documents')
        }
    }

    async uploadFiles(file, path) {
        try {
            const filename = file.substring(file.lastIndexOf('/') + 1)
            const storageRef = this.storage.ref(`${path}/${Date.now()}-${filename.replaceAll(' ', '-')}`)
            const uploadTask = storageRef.putFile(file) 

            await uploadTask
            const downloadURL = await storageRef.getDownloadURL()
            return downloadURL
        } catch (error) {
            return this.handleError('Failed to upload file')
        }
    }
}

export default BaseService
