import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import Modal from "react-native-modal";
import {
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import CreateBall from "../../Components/BallCollection/CreateBall";
import DeleteBall from "../../Components/BallCollection/DeleteBall";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import _ from "lodash";
import filter from "lodash.filter";

const BallsScreen = () => {
  const auth = getAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [balls, setBalls] = useState([]);
  const [filteredBalls, setFilteredBalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const userRef = doc(db, "users", auth.currentUser?.email); // Reference to this user's document
    const ballRef = collection(userRef, "balls"); // Reference to this user's ball collection
    const ballQuery = query(ballRef, orderBy("name", "asc")); // Sorted by name
    const unsubscribeBallListener = onSnapshot(ballQuery, (snapshot) => {
      try {
        let ballList = [];
        snapshot.docs.map((doc) =>
          ballList.push({ ...doc.data(), id: doc.id })
        );
        setBalls(ballList);
        setFilteredBalls(ballList);
      } catch (error) {
        setError(error);
        console.error("Error fetching balls: ", error);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribeBallListener();
  }, []);

  // For searchbar
  const [searchQuery, setSearchQuery] = useState("");

  const handlSearch = (query) => {
    setSearchQuery(query);
    const filteredData = filter(filteredBalls, (user) => {
      return contains(user, query);
    });
    setBalls(filteredData);
  };

  const contains = ({ name }, query) => {
    const lowerCaseName = name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  };

  // The following is for the tableView
  const [columns, setColumns] = useState([
    "Name",
    "Weight",
    "Differential",
    "Radius of Gyration",
    "Oil Condition",
    "", // empty column for delete button
  ]);
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  // to help match up the headers of the table with the field names in the firestore
  const mapColumnName = (column) => {
    switch (column) {
      case "Name":
        return "name";
      case "Weight":
        return "weight";
      case "Differential":
        return "differential";
      case "Radius of Gyration":
        return "radiusOfGyration";
      case "Oil Condition":
        return "oilCondition";
    }
  };

  // sorting function for table (ascending or descending)
  const sortTable = (column) => {
    const newDirection = direction === "desc" ? "asc" : "desc";
    const mappedColumn = mapColumnName(column);
    if (mappedColumn === "oilCondition") {
      const oilConditions = [
        "Light",
        "Light-Medium",
        "Medium",
        "Medium-Heavy",
        "Heavy",
      ];
      const sortedData = _.orderBy(
        balls,
        (ball) => {
          const index = ball[mappedColumn]
            ? oilConditions.indexOf(ball[mappedColumn])
            : -1;
          return index === -1 ? -Infinity : index;
        },
        [newDirection]
      );

      setBalls(sortedData);
    } else {
      const sortedData = _.orderBy(balls, [mappedColumn], [newDirection]);

      setBalls(sortedData);
    }
    setSelectedColumn(column);
    setDirection(newDirection);
  };

  const tableHeader = () => (
    <View style={styles.tableHeader}>
      {columns.map((column, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.columnHeader,
            index === columns.length - 1 && { width: "10%" }, // adjust width of the empty column for delete space
          ]}
          onPress={() => sortTable(column)}
        >
          <Text style={styles.columnHeaderTxt}>
            {column + " "}
            {selectedColumn === column && (
              <Icon name={direction === "desc" ? "sort-desc" : "sort-asc"} />
            )}
          </Text>
        </TouchableOpacity>
      ))}
      <View style={{ margin: 10 }}></View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.columnRowTxt}>{item.name}</Text>
      <Text style={styles.columnRowTxt}>{item.weight}</Text>
      <Text style={styles.columnRowTxt}>{item.differential}</Text>
      <Text style={styles.columnRowTxt}>{item.radiusOfGyration}</Text>
      <Text style={styles.columnRowTxt}>{item.oilCondition}</Text>

      <DeleteBall id={item.id} />
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error handling
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>
          Error in fetching data... Please check your internet connection.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "#ffffff",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <SearchBar
            placeholder="Looking for your ball?"
            platform="android"
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={(query) => handlSearch(query)}
          />
        </View>

        {/* <Button title="Add a new ball" onPress={toggleModal} /> */}
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="plus-circle" color="#89CFF0" size={40} />
        </TouchableOpacity>
      </SafeAreaView>

      <FlatList
        data={balls}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={tableHeader}
        stickyHeaderIndices={[0]}
      />
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        backdropColor="white"
        backdropOpacity={1}
        coverScreen={false}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <CreateBall toggleModal={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

export default BallsScreen;

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#9966ff",
    height: 50,
    width: "100%",
    textAlign: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#23232e",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
    alignItems: "center",
    backgroundColor: "#9966ff",
    borderColor: "2323e",
    borderBottomWidth: 1,
    textAlign: "center",
  },
  columnHeader: {
    width: "18%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  columnHeaderTxt: {
    color: "white",
    fontWeight: "500",
    fontSize: 12,
    padding: "1%",
  },
  columnRowTxt: {
    width: "20%",
    textAlign: "center",
    color: "white",
    fontWeight: "300",
    fontSize: 12,
    padding: "1%",
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexShrink: 1,
  },
});
