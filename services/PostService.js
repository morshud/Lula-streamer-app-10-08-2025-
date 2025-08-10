import { arrayUnion, arrayRemove } from '@react-native-firebase/firestore'
import BaseService from './BaseService'

class PostService extends BaseService {
    #collection
    constructor(collectionName) {
        super(collectionName)
        this.#collection = collectionName
    }

    // Create a new post (image or video)
    async createPost(userId, type, mediaUrl, caption = '') {
        try {
            if (!['FEED', 'VIDEO'].includes(type)) {
                throw new Error('Invalid post type')
            }

            const postData = this.toFirestore(
                {
                    userId,
                    type,
                    mediaUrl,
                    caption,
                    likes: [],
                    comments: [],
                },
                true
            )

            const postRef = await this.db.collection(this.#collection).add(postData)
            return { error: false, data: postRef.id }
        } catch (error) {
            return this.handleError(error.message)
        }
    }
    
    // Delete a post
    async deletePost(postId) {
        try {
            await this.db.collection(this.#collection).doc(postId).delete()
            return { error: false, message: 'Post deleted successfully' }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    // Update an existing post
    async updatePost(post) {
        try {
            const postRef = this.db.collection(this.#collection).doc(post.id);
            // Prepare data to update, excluding the ID and any fields that shouldn't be changed this way
            const updateData = { ...post };
            delete updateData.id; // Don't try to update the document ID
            delete updateData.createdAt; // Don't try to update the document ID
            await postRef.update(updateData);
            return { error: false, message: 'Post updated successfully' };
        } catch (error) {
            return this.handleError(error.message);
        }
    }

    // Get posts with pagination
    async getPosts(id) {
        try {
            let snapshot = await this.db.collection(this.#collection).where('userId', '==', id).orderBy('createdAt', 'desc').get()

            if (snapshot.empty) {
                return { error: false, data: [] }
            }

            const posts = snapshot.docs.map((doc) => this.fromFirestore(doc))

            return { error: false, data: posts }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    // Like a post
    async likePost(postId, userId) {
        try {
            const postRef = this.db.collection(this.#collection).doc(postId)
            await postRef.update({ likes: arrayUnion(userId) })
            return { error: false, message: 'Post liked' }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    // Unlike a post
    async unlikePost(postId, userId) {
        try {
            const postRef = this.db.collection(this.#collection).doc(postId)
            await postRef.update({ likes: arrayRemove(userId) })
            return { error: false, message: 'Post unliked' }
        } catch (error) {
            return this.handleError(error.message)
        }
    }

    // Add a comment to a post
    async addComment(postId, userId, comment) {
        try {
            const commentData = this.toFirestore({
                userId,
                comment,
            })

            const postRef = this.db.collection(this.#collection).doc(postId)
            await postRef.update({ comments: arrayUnion(commentData) })
            return { error: false, message: 'Comment added' }
        } catch (error) {
            return this.handleError(error.message)
        }
    }
}

export default new PostService('posts')
