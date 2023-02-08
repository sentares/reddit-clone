import {
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	writeBatch,
} from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { authModalState } from '../atoms/authModalAtoms'
import {
	Community,
	CommunitySnippet,
	communityState,
} from '../atoms/communitiesAtom'
import { auth, firestore } from '../firebase/clientApp'

const useCommunityData = () => {
	const router = useRouter()
	const [user] = useAuthState(auth)
	const [communityStateValue, setCommuityStateValue] =
		useRecoilState(communityState)
	const setAuthModalState = useSetRecoilState(authModalState)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const onJoinOrLeaveCommunity = (
		communityData: Community,
		isJoined: boolean
	) => {
		if (!user) {
			setAuthModalState({ open: true, view: 'login' })
			return
		}

		setLoading(true)
		if (isJoined) {
			leaveCommunity(communityData.id)
			return
		}
		joinCommunity(communityData)
	}

	const getMySnippets = async () => {
		setLoading(true)
		try {
			const snippetDocs = await getDocs(
				collection(firestore, `users/${user?.uid}/communitySnippets`)
			)
			const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() }))
			setCommuityStateValue(prev => ({
				...prev,
				mySnippets: snippets as CommunitySnippet[],
				snippetsFetched: true,
			}))
		} catch (error: any) {
			console.log('getMySnippetError', error)
		}
		setLoading(false)
	}

	// Join Community
	const joinCommunity = async (communityData: Community) => {
		setLoading(true)
		try {
			const batch = writeBatch(firestore)
			const newSnippet: CommunitySnippet = {
				communityId: communityData.id,
				imageURL: communityData.imageURL || '',
				isModerator: user?.uid === communityData.creatorId,
			}
			batch.set(
				doc(
					firestore,
					`users/${user?.uid}/communitySnippets`,
					communityData.id
				),
				newSnippet
			)
			batch.update(doc(firestore, 'communities', communityData.id), {
				numberOfMembers: increment(1),
			})
			await batch.commit()

			setCommuityStateValue(prev => ({
				...prev,
				mySnippets: [...prev.mySnippets, newSnippet],
			}))
		} catch (error: any) {
			console.log('joinCommError', error)
			setError(error.message)
		}
		setLoading(false)
	}

	// Leave Community
	const leaveCommunity = async (communityId: string) => {
		setLoading(true)
		try {
			const batch = writeBatch(firestore)
			batch.delete(
				doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
			)
			batch.update(doc(firestore, 'communities', communityId), {
				numberOfMembers: increment(-1),
			})
			await batch.commit()
			setCommuityStateValue(prev => ({
				...prev,
				mySnippets: prev.mySnippets.filter(
					item => item.communityId !== communityId
				),
			}))
		} catch (error: any) {
			console.log('leaveCommunityError', error.message)
			setError(error.message)
		}
		setLoading(false)
	}

	const getCommunityData = async (communityId: string) => {
		try {
			const communityDocRef = doc(firestore, 'communities', communityId)
			const communityDoc = await getDoc(communityDocRef)

			setCommuityStateValue(prev => ({
				...prev,
				currentCommunity: {
					id: communityDoc.id,
					...communityDoc.data(),
				} as Community,
			}))
		} catch (error) {
			console.log('getCommunityData Error', error)
		}
	}

	useEffect(() => {
		if (!user) {
			setCommuityStateValue(prev => ({
				...prev,
				mySnippets: [],
				snippetsFetched: false,
			}))
			return
		}
		getMySnippets()
	}, [user])

	useEffect(() => {
		const { communityId } = router.query

		if (communityId && !communityStateValue.currentCommunity) {
			getCommunityData(communityId as string)
		}
	}, [router.query, communityStateValue.currentCommunity])

	return {
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	}
}
export default useCommunityData
