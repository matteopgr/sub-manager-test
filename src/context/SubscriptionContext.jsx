import React, { createContext, useContext, useState, useEffect } from 'react'

const SubscriptionContext = createContext()

export function useSubscriptions() {
  return useContext(SubscriptionContext)
}

export function SubscriptionProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

  const addSubscription = (subscription) => {
    setSubscriptions(prev => [...prev, { ...subscription, id: crypto.randomUUID() }])
  }

  const removeSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id))
  }

  const totalCost = subscriptions.reduce((acc, sub) => acc + Number(sub.cost), 0)

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription, removeSubscription, totalCost }}>
      {children}
    </SubscriptionContext.Provider>
  )
}
