import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = {
  Food: ['Groceries', 'Restaurant', 'Meat', 'Fruits/Vegetables', 'Dairy'],
  Shopping: ['Beauty', 'Clothes', 'Footwear', 'MakeUp', 'HomeDecor', 'Jewels', 'Kitchen Essentials'],
  Travel: ['Private (Petrol)', 'Public (Ticket Price)'],
  'Future Plans': ['SIP', 'Mutual Funds', 'Share Market', 'Chits', 'Savings'],
  Personal: ['Health', 'Fitness', 'Entertainment'],
  Parents: ['Medicine', 'Gifts', 'Groceries']
};

const DailyExpenseForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expenseList, setExpenseList] = useState([]);
  const [budget, setBudget] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  const expenseSchema = Yup.object().shape({
    amount: Yup.number().required('Amount required').positive(),
    category: Yup.string().required(),
    subcategory: Yup.string().required()
  });

  //  Save new expense with userEmail attached
const handleSave = async (values, { resetForm }) => {
  try {
    const loggedInUserData = await AsyncStorage.getItem('loggedInUser');
    const user = loggedInUserData ? JSON.parse(loggedInUserData) : null;

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...values,
      date: new Date().toLocaleDateString(),
      email: user.email //  Track owner
    };

    //  Save to dailyExpenses (global)
    const existing = await AsyncStorage.getItem('dailyExpenses');
    const allExpenses = existing ? JSON.parse(existing) : [];
    const updatedExpenses = [...allExpenses, newExpense];
    await AsyncStorage.setItem('dailyExpenses', JSON.stringify(updatedExpenses));

    //  Update in loggedInUser
    const updatedUser = {
      ...user,
      expenses: [...(user.expenses || []), newExpense]
    };
    await AsyncStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

    // Update in users list
    const usersData = await AsyncStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];

    const updatedUsers = users.map(u =>
      u.email === updatedUser.email
        ? { ...u, expenses: [...(u.expenses || []), newExpense] }
        : u
    );

    await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

    //  Update state and UI
    Alert.alert('Expense Added', `${values.amount} for ${values.subcategory}`);
    setExpenseList(prev => [...prev, newExpense]);
    resetForm();
    setSelectedCategory('');
  } catch (error) {
    console.error('Error saving expense:', error);
    Alert.alert('Error', 'Something went wrong while saving the expense.');
  }
};


  useEffect(() => {
    const loadData = async () => {
      const userData = await AsyncStorage.getItem('loggedInUser');
      const user = userData ? JSON.parse(userData) : null;

      if (user) {
        setUserEmail(user.email);
        setBudget(Number(user.budget));

        const allExpenses = await AsyncStorage.getItem('dailyExpenses');
        const parsed = allExpenses ? JSON.parse(allExpenses) : [];

        //  Only load this user's expenses
        const userExpenses = parsed.filter(item => item.email === user.email);
        setExpenseList(userExpenses);
      }
    };

    loadData();
  }, []);

  const totalSpent = expenseList.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Add Daily Expense</Text>

      <Formik
        initialValues={{ amount: '', category: '', subcategory: '' }}
        validationSchema={expenseSchema}
        onSubmit={handleSave}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter Amount (₹)"
              keyboardType="numeric"
              value={values.amount}
              onChangeText={handleChange('amount')}
            />
            {errors.amount && touched.amount && <Text style={styles.error}>{errors.amount}</Text>}

            <Picker
              selectedValue={values.category}
              onValueChange={(itemValue) => {
                setSelectedCategory(itemValue);
                setFieldValue('category', itemValue);
                setFieldValue('subcategory', '');
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              {Object.keys(categories).map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
            {errors.category && touched.category && <Text style={styles.error}>{errors.category}</Text>}

            {selectedCategory ? (
              <Picker
                selectedValue={values.subcategory}
                onValueChange={(itemValue) => setFieldValue('subcategory', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Subcategory" value="" />
                {categories[selectedCategory].map((sub) => (
                  <Picker.Item key={sub} label={sub} value={sub} />
                ))}
              </Picker>
            ) : null}
            {errors.subcategory && touched.subcategory && <Text style={styles.error}>{errors.subcategory}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add Expense</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>📊 Summary</Text>
        <Text style={styles.summaryItem}>💰 Total Budget: ₹{budget}</Text>
        <Text style={styles.summaryItem}>🧾 Spent: ₹{totalSpent}</Text>
        <Text style={styles.summaryItem}>💸 Remaining: ₹{budget - totalSpent}</Text>
      </View>

      <Text style={styles.historyTitle}>📜 Expense History</Text>
      {expenseList.length === 0 ? (
        <Text style={{ color: '#888', marginBottom: 10 }}>No expenses yet.</Text>
      ) : (
        expenseList.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.historyText}>
              • ₹{item.amount} - {item.category} → {item.subcategory} ({item.date})
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

export default DailyExpenseForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    color: '#2f3e75',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d9e6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d9e6',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    padding: 10,
    elevation: 2,
  },
  button: {
    backgroundColor: '#4b7bec',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#4b7bec',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  error: {
    fontSize: 13,
    color: '#d63031',
    marginBottom: 6,
    marginLeft: 4,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2f3e75',
  },
  summaryItem: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2f3e75',
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  historyText: {
    fontSize: 15,
    color: '#333',
  },
});

