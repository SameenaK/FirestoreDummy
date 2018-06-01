import React from 'react';
import { FlatList, ScrollView, View, Text, TextInput, Button, StyleSheet, } from 'react-native';
import firebase from 'react-native-firebase';
import Todo from './Todo';

class Todos extends React.Component {
  constructor() {
    super();
    var flag = false;
    this.ref = firebase.firestore().collection('todos').where("complete", '==', flag).where("title", '==', "Clean");
    this.unsubscribe = null;
    this.state = {
        textInput: '',
        loading: true,
        todos: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
}

componentWillUnmount() {
    this.unsubscribe();
}

onCollectionUpdate = (querySnapshot) => {
  const todos = [];
  querySnapshot.forEach((doc) => {
    const { title, complete } = doc.data();
    todos.push({
      key: doc.id,
      doc, // DocumentSnapshot
      title,
      complete,
    });
  });
  this.setState({
    todos,
    loading: false,
 });
}

  updateTextInput(value) {
    this.setState({ textInput: value });
}

addTodo() {
  this.ref.add({
    title: this.state.textInput,
    complete: false,
  });
  this.setState({
    textInput: '',
  });
}

render() {
  if (this.state.loading) {
    return null; // or render a loading icon
  }
  return (
    <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.todos}
          renderItem={({ item }) => <Todo {...item} />}
        />
        <TextInput
            placeholder={'Add TODO'}
            value={this.state.textInput}
            onChangeText={(text) => this.updateTextInput(text)}
        />
        <Button
            title={'Add TODO'}
            disabled={!this.state.textInput.length}
            onPress={() => this.addTodo()}
        />
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    marginTop:30
  }
});
export default Todos;
