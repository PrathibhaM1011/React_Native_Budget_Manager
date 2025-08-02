import { StyleSheet, Text, TouchableOpacity, View,TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Practice = () => {

    const [selectedCategory, setSelectedCategory] = useState('')
    const [expenseList, setExpenseList] = useState([]);
    const [budget, setBudget] = useState(0);


    const expenseSchema = Yup.object().shape({
        amount : Yup.number().required("Enter amount").positive(),
        category : Yup.string().required(),
        subcategory : Yup.string().required()
    });

    const handleSave = async (values, {resetForm})=>{
        const newExpense = {
            id : Date.now(),
            ...values,
            date : new Date().toLocaleDateString()
        };

        const existing = await AsyncStorage.getItem('dailyExpenses');
        const expenseList = existing ? JSON.parse(existing):[];

        const updated = [...expenseList, newExpense];
        await AsyncStorage.setItem('dailyExpenses', JSON.stringify(updated))

        resetForm();
        setSelectedCategory('');

    }


    useEffect(()=>{
        const loadData = async ()=>{
            const b = await AsyncStorage.getItem('userBudget');
            const exp = await AsyncStorage.getItem('dailyExpenses');
            setBudget(b ? JSON.parse(b).budget : 0);
            setExpenseList(exp ? JSON.parse(exp) : [])
        }

        loadData();
    },[]);

    const totalSpent = expenseList.reduce((acc, curr)=> acc + Number(curr.amount), 0)

    const categories = {
  Food: ['Groceries', 'Restaurant', 'Meat', 'Fruits/Vegetables', 'Dairy'],
  Shopping: ['Beauty', 'Clothes', 'Footwear', 'MakeUp', 'HomeDecor', 'Jewels', 'Kitchen Essentials'],
  Travel: ['Private (Petrol)', 'Public (Ticket Price)'],
  'Future Plans': ['SIP', 'Mutual Funds', 'Share Market', 'Chits', 'Savings'],
  Personal: ['Health', 'Fitness', 'Entertainment'],
  Parents: ['Medicine', 'Gifts', 'Groceries']
};


  return (
    <>
    <View>
    <Formik initialValues={{amount : '', category:'', subcategory:''}} onSubmit={handleSave} validationSchema={expenseSchema}>
    {({ handleChange, handleSubmit, values, setFieldValue, errors, touched }) => (
            <>
      <TextInput placeholder='Enter Amount' value={values.amount} onChangeText={handleChange('amount')} keyboardType='numeric'/>
      <Picker selectedValue={values.category}
      onValueChange={(itemValue)=>{
        setSelectedCategory(itemValue);
        setFieldValue('category',itemValue);
        setFieldValue('subcategory', '');
      }}
      >
        {Object.keys(categories).map((cat)=>(<Picker.Item key={cat} label={cat} value={cat} > </Picker.Item>))}
      
        </Picker>  
        <Picker selectedValue={values.subcategory}
            onValueChange={(itemValue)=>setFieldValue('subcategory', itemValue)}>
            {categories[selectedCategory]?.map((sub)=>(<Picker.Item key={sub} label={sub} value={sub}></Picker.Item>))} 
            
            </Picker>   
      <TouchableOpacity>
        <Text>Add Expenses</Text>
      </TouchableOpacity>
         </>)}
      </Formik>
      <Text>Expense History</Text>
      <Text>Total Budget: {budget}</Text>
      <Text>Total Expenses : {totalSpent}</Text>
      <Text>Remaining Budget:{budget - totalSpent}</Text>
      {expenseList.map((item)=>(
        <Text>{item.amount} - {item.category} and {item.subcategory}</Text>
      ))}
    </View>
    </>
  )
}

export default Practice

const styles = StyleSheet.create({})