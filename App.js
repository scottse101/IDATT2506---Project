import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [lists, setLists] = useState([
    { id: 1, name: 'Dagligvarer', todos: [] },
    { id: 2, name: 'Hytteutstyr', todos: [] },
    { id: 3, name: 'Handle på nett', todos: [] }
  ]);
  const [activeList, setActiveList] = useState(1);
  const [newTodo, setNewTodo] = useState('');
  const [longPressItem, setLongPressItem] = useState(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem('lists');
      if (savedLists) {
        setLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const saveLists = async (updatedLists) => {
    try {
      await AsyncStorage.setItem('lists', JSON.stringify(updatedLists));
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  };

  const addTodo = () => {
    if (newTodo.trim() === '') return;

    const updatedLists = lists.map(list => {
      if (list.id === activeList) {
        return {
          ...list,
          todos: [
            { id: Date.now(), text: newTodo, completed: false },
            ...list.todos
          ]
        };
      }
      return list;
    });

    setLists(updatedLists);
    saveLists(updatedLists);
    setNewTodo('');
    Keyboard.dismiss();
  };

  const toggleTodo = (todoId) => {
    const updatedLists = lists.map(list => {
      if (list.id === activeList) {
        return {
          ...list,
          todos: list.todos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
          )
        };
      }
      return list;
    });

    setLists(updatedLists);
    saveLists(updatedLists);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onLongPress={() => setLongPressItem(item.id)}
      onPress={() => toggleTodo(item.id)}
      style={[
        styles.todoItem,
        longPressItem === item.id && styles.selectedTodo,
        item.completed && styles.completedTodo
      ]}
    >
      <Text style={[styles.todoText, item.completed && styles.completedText]}>
        {item.text}
      </Text>
      <View style={[styles.checkbox, item.completed && styles.checked]} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FlatList
          horizontal
          data={lists}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeList === item.id && styles.activeTab]}
              onPress={() => setActiveList(item.id)}
            >
              <Text style={styles.tabText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Legg til ny oppgave"
          onSubmitEditing={addTodo}
        />
      </View>

      <FlatList
        data={lists.find(l => l.id === activeList)?.todos || []}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#333',
  },
  inputContainer: {
    padding: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  selectedTodo: {
    backgroundColor: '#f0f0f0',
  },
  completedTodo: {
    backgroundColor: '#f8f8f8',
  },
  todoText: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
});

export default App;