import React, { useState } from 'react'
import {
	Box,
	Button,
	Flex,
	Icon,
	Input,
	Stack,
	Textarea,
	Image,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	CloseButton,
	Text,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import TabItem from './TabItem'
import TextInputs from './postForm/TextInputs'
import ImageUpload from './postForm/ImageUpload'
import { Post } from '@/src/atoms/postsAtom'
import { firestore, storage } from '@/src/firebase/clientApp'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import useSelectFile from '@/src/hooks/useSelectFile'

type NewPostFormProps = {
	user: User
	communityImageURL?: string
}

const formTabs: ITabItems[] = [
	{
		title: 'Post',
		icon: IoDocumentText,
	},
	{
		title: 'Images & Video',
		icon: IoImageOutline,
	},
	{
		title: 'Link',
		icon: BsLink45Deg,
	},
	{
		title: 'Poll',
		icon: BiPoll,
	},
	{
		title: 'Talk',
		icon: BsMic,
	},
]

export type ITabItems = {
	title: string
	icon: typeof Icon.arguments
}

const NewPostForm: React.FC<NewPostFormProps> = ({
	user,
	communityImageURL,
}) => {
	const router = useRouter()
	const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
	const [textInputs, setTextInputs] = useState({
		title: '',
		body: '',
	})
	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const handleCreatePost = async () => {
		const { communityId } = router.query

		const newPost: Post = {
			communityId: communityId as string,
			communityImageURL: communityImageURL || '',
			creatorId: user?.uid,
			creatorDisplayName: user.email!.split('@')[0],
			title: textInputs.title,
			body: textInputs.body,
			numberOfComments: 0,
			voteStatus: 0,
			createdAt: serverTimestamp() as Timestamp,
		}
		setLoading(true)
		try {
			const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)

			if (selectedFile) {
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
				await uploadString(imageRef, selectedFile, 'data_url')
				const downloadURL = await getDownloadURL(imageRef)

				await updateDoc(postDocRef, {
					imageURL: downloadURL,
				})
			}
			router.back()
		} catch (error: any) {
			console.log('handleCreatePost error', error.message)
			setError(true)
		}
		setLoading(false)
	}

	const onTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {
			target: { name, value },
		} = event
		setTextInputs(prev => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<Flex direction='column' bg='white' borderRadius={4} mt={2}>
			<Flex width='100%'>
				{formTabs.map(item => (
					<TabItem
						key={item.title}
						item={item}
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}
					/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === 'Post' && (
					<TextInputs
						textInputs={textInputs}
						handleCreatePost={handleCreatePost}
						onChange={onTextChange}
						loading={loading}
					/>
				)}
				{selectedTab === 'Images & Video' && (
					<ImageUpload
						selectedFile={selectedFile}
						setSelectedFile={setSelectedFile}
						setSelectedTab={setSelectedTab}
						onSelectImage={onSelectFile}
					/>
				)}
			</Flex>
			{error && (
				<Alert status='error'>
					<AlertIcon />
					<Text mr={2}>Error creating post</Text>
				</Alert>
			)}
		</Flex>
	)
}
export default NewPostForm
