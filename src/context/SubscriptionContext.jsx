import React, { createContext, useContext, useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from './AuthContext'

const SubscriptionContext = createContext()

export function useSubscriptions() {
  return useContext(SubscriptionContext)
}

export function SubscriptionProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([])
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setSubscriptions([])
      return
    }

    const q = query(collection(db, `users/${currentUser.uid}/subscriptions`))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSubscriptions(subs)
    })

    return unsubscribe
  }, [currentUser])

  const addSubscription = async (subscription) => {
    if (!currentUser) return
    await addDoc(collection(db, `users/${currentUser.uid}/subscriptions`), subscription)
  }

  const updateSubscription = async (id, updatedSubscription) => {
    if (!currentUser) return
    const subRef = doc(db, `users/${currentUser.uid}/subscriptions`, id)
    await updateDoc(subRef, updatedSubscription)
  }

  const removeSubscription = async (id) => {
    if (!currentUser) return
    await deleteDoc(doc(db, `users/${currentUser.uid}/subscriptions`, id))
  }

  const totalCost = subscriptions.reduce((acc, sub) => acc + Number(sub.cost), 0)

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription, updateSubscription, removeSubscription, totalCost }}>
      {children}
    </SubscriptionContext.Provider>
  )
}
