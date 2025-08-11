import { StyleSheet, Text, View, TextInput, Button, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import PostService from '../services/PostService'
import showToast from '../utils/toast'
import { handleError } from '../utils/function'
import SubmitButton from '../components/ui/SubmitButton'
import { useSelector } from 'react-redux'

const CreatePost = ({ navigation }) => {
    const { user } = useSelector((state) => state.auth)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [caption, setCaption] = useState('')
    const [media, setMedia] = useState(null)
    const [type, setType] = useState('FEED')

    const pickMedia = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        })
        if (!result.canceled) {
            const asset = result.assets[0]
            setMedia({ uri: asset.uri, width: asset.width, height: asset.height })
            setType(asset.type.includes('video') ? 'VIDEO' : 'FEED')
        }
    }

    const handlePost = async () => {
        try {
            if (!media) {
                showToast('Please select an image or video')
                return
            }
            setIsSubmitting(true)
            const mediaUrl = await PostService.uploadFiles(media.uri, '/lula/streamer/post')
            const response = await PostService.createPost(user.id, type, mediaUrl, caption)
            if (!response.error) {
                showToast('Post Created!', 'success')
                navigation.goBack()
            } else {
                showToast('Error creating post!')
            }
        } catch (error) {
            handleError(error)
        }finally{
            setIsSubmitting(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Post</Text>
            <TextInput style={styles.input} placeholder="Write a caption..." value={caption} onChangeText={setCaption} />
            <TouchableOpacity style={[styles.mediaPicker, !media && styles.mediaPlaceholder]} onPress={pickMedia}>
                {media ? (
                    type === 'VIDEO' ? (
                        <Video
                            source={{ uri: media.uri }}
                            style={styles.mediaPreview}
                            useNativeControls
                            resizeMode="contain"
                            isLooping
                        />
                    ) : (
                        <Image
                            source={{ uri: media.uri }}
                            style={[styles.mediaPreview, { aspectRatio: media.width / media.height }]}
                            resizeMode="contain"
                        />
                    )
                ) : (
                    <Text>Select Image/Video</Text>
                )}
            </TouchableOpacity>
            <SubmitButton loading={isSubmitting} title={'Create Post'} onPress={handlePost}/>
        </View>
    )
}

export default CreatePost

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
    mediaPicker: { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    mediaPlaceholder: { height: 200, width: '100%' },
    mediaPreview: { width: '100%' },
})
