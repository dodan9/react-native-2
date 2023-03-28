import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsnyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { Fontisto } from "@expo/vector-icons";

const modes = {
  work: "work",
  travel: "travel",
};
const STORAGE_KEY = "@toDos";

export default function App() {
  const [mode, setMode] = useState(modes.work);
  const [userText, setUserText] = useState("");
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(true);

  const saveToDos = async (toSave) => {
    try {
      await AsnyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      alert("fail to save todos...");
    }
  };
  const loadToDos = async () => {
    try {
      const loadString = await AsnyncStorage.getItem(STORAGE_KEY);
      loadString !== null && setToDos(JSON.parse(loadString));
    } catch (e) {
      alert("can't load todos...");
    }
  };

  const travel = () => setMode(modes.travel);
  const work = () => setMode(modes.work);

  const onChangeInputText = (payload) => {
    setUserText(payload);
  };

  const addToDo = async () => {
    if (userText === "") return;

    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text: userText, mode },
    });
    // or
    // const newToDos = {...toDos, [Date.now()]: { userText, mode },}

    setToDos(newToDos);
    await saveToDos(newToDos);
    setUserText("");
  };

  const deleteToDo = async (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };

  useEffect(() => {
    loadToDos();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={work}>
          <Text
            style={{
              ...styles.btnText,
              color: mode === modes.work ? "white" : theme.grey,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: mode === modes.travel ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onChangeText={onChangeInputText}
          onSubmitEditing={addToDo}
          value={userText}
          placeholderTextColor={theme.grey}
          placeholder={
            mode === modes.work ? "add to do" : "where you want to go?"
          }
          style={styles.input}
        />
        <ScrollView>
          {Object.keys(toDos).map(
            (key) =>
              toDos[key].mode === mode && (
                <View style={styles.toDo} key={key}>
                  <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  <TouchableOpacity onPress={() => deleteToDo(key)}>
                    <Fontisto name='trash' size={18} color={theme.todoBG} />
                  </TouchableOpacity>
                </View>
              )
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 100,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnText: {
    color: "white",
    fontSize: 44,
    fontWeight: 600,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },

  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: { color: "white", fontSize: 18, fontWeight: 500 },
});
