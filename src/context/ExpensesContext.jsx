import React, { createContext, useContext, useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const ExpensesContext = createContext()

export function useExpenses() {
  return useContext(ExpensesContext)
}

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([])
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setExpenses([])
      return
    }

    const q = query(
      collection(db, `users/${currentUser.uid}/variableExpenses`),
      orderBy('date', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setExpenses(data)
    })

    return unsubscribe
  }, [currentUser])

  const addExpense = async (expense) => {
    if (!currentUser) return
    await addDoc(collection(db, `users/${currentUser.uid}/variableExpenses`), expense)
  }

  const removeExpense = async (id) => {
    if (!currentUser) return
    await deleteDoc(doc(db, `users/${currentUser.uid}/variableExpenses`, id))
  }

  const getExpensesByMonth = (month, year) => {
    return expenses.filter(exp => {
      const d = new Date(exp.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, removeExpense, getExpensesByMonth }}>
      {children}
    </ExpensesContext.Provider>
  )
}
