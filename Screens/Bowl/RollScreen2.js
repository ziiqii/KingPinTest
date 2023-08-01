import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import PinDown from "../../Components/Buttons/PinDown";
import PinStand from "../../Components/Buttons/PinStand";
import PinConv from "../../Components/Buttons/PinConv";
import ScoreBoard from "../../Components/Tables/ScoreBoard";
import updateGame from "../../Functions/updateGame";
import Modal from "react-native-modal";
import generateSpare from "../../Functions/generateSpareText";
import { db, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { windowHeight, windowWidth } from "../../utils/Dimensions";
import AppButton from "../../Components/Buttons/AppButton";
import SmallButton from "../../Components/Buttons/SmallButton";

const RollScreen2 = ({ navigation, route }) => {
  const { frameNum, rollNum, pinState, gameId } = route.params;
  const [newPinState, setNewPinState] = useState(pinState);
  const [newFrameState, setNewFrameState] = useState("open");

  // for toggling the instructions modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // for toggling the spare guide modal
  const [isGuideModalVisible, setIsGuideModalVisible] = useState(false);

  const toggleGuideModal = () => {
    setIsGuideModalVisible(!isGuideModalVisible);
  };

  // generates url for spare guide diagram
  const [foundState, setFoundState] = useState(null); // spareFound or spareNotFound
  const [imageUrl, setImageUrl] = useState(null);
  const libRef = ref(storage, "Spare_Library"); // create reference to spare library

  const getImage = async (spareName) => {
    const picRef = ref(libRef, `/${spareName}.png`);
    getDownloadURL(picRef)
      .then((url) => {
        // picture found
        setImageUrl(url);
        setFoundState("spareFound");
      })
      .catch((error) => {
        // picture not found
        setImageUrl(null);
        setFoundState("spareNotFound");
        // console.log("Error getting URL:", error);
      });
  };

  // Initialising commonName state.
  const [commonName, setCommonName] = useState(" ");

  const getSpareName = async (spareName) => {
    // function returns name else null
    const spareRef = doc(db, "spare-library", spareName);
    const spareSnap = await getDoc(spareRef);
    if (spareSnap.exists()) {
      setCommonName("Spare Name: " + spareSnap.data().name);
    } else {
      setCommonName(" ");
    }
  };

  useEffect(() => {
    const spareName = generateSpare(pinState);
    getImage(spareName);
    getSpareName(spareName);
  }, []); // called only once since dependency array is empty

  const togglePinState = (id) => {
    const pinType = {
      standing: "converted",
      down: "down",
      converted: "standing",
    };

    const thisStandingAndOthersConvertedOrDown = Object.keys(newPinState).every(
      (pinId) => {
        if (pinId === id) {
          return newPinState[pinId] === "standing";
        } else {
          return (
            newPinState[pinId] === "converted" || newPinState[pinId] === "down"
          );
        }
      }
    );

    const thisConverted = Object.keys(newPinState).every((pinId) => {
      if (pinId === id) {
        return newPinState[pinId] === "converted";
      } else {
        return true;
      }
    });

    if (thisConverted) {
      setNewFrameState("open");
    }

    if (thisStandingAndOthersConvertedOrDown) {
      setSpare();
      pinType.converted = "converted";
    }

    // Finally set the pin state
    setNewPinState((prevState) => ({
      ...prevState,
      [id]: pinType[prevState[id]],
    }));
  };

  const setSpare = () => {
    // "standing" pins -> "converted"
    const updatedPinState = Object.fromEntries(
      Object.entries(pinState).map(([id, state]) => [
        id,
        state === "standing" ? "converted" : state,
      ])
    );
    setNewPinState(updatedPinState);
    setNewFrameState("spare");
  };

  const resetState = () => {
    setNewPinState(pinState);
    setNewFrameState(null);
  };

  //Check if all pins down OR converted (spare check)
  const spare = Object.values(newPinState).every(
    (state) => state === "down" || state === "converted"
  );

  const confirmPress = () => {
    // frame 10 logic
    if (frameNum == 10) {
      if (rollNum == 2 && spare) {
        // this means that the first roll did not strike
        navigation.replace("RollScreen1", {
          frameNum: frameNum,
          rollNum: 3,
          gameId: gameId,
        });
      } else if (rollNum == 2 && !spare) {
        // rollNum == 2 but open
        navigation.replace("GameOverScreen", { gameId: gameId });
      } else {
        // rollNum == 3 (e.g. X, 6, / or X, 6, 3)
        navigation.replace("GameOverScreen", { gameId: gameId });
      }
      return;
    }
    // frames 1 - 9 logic
    navigation.replace("RollScreen1", {
      frameNum: frameNum + 1,
      rollNum: 1,
      gameId: gameId,
    });
  };

  const invertedTriangle = {
    0: ["7", "8", "9", "10"],
    1: ["4", "5", "6"],
    2: ["2", "3"],
    3: ["1"],
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Scoreboard */}
      <View style={{ alignItems: "stretch" }}>
        <ScoreBoard Id={gameId} />
      </View>

      {/* Buttons row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        {/* Instructions Button */}
        {foundState === "spareFound" && (
          <View style={{ padding: 10, alignSelf: "flex-start" }}>
            <SmallButton
              buttonTitle={"View Spare"}
              onPress={toggleGuideModal}
              color={"#9966ff"}
            ></SmallButton>
          </View>
        )}
        {foundState === "spareNotFound" && (
          <View style={{ padding: 10, alignSelf: "flex-start" }}>
          <SmallButton
            buttonTitle={"No spare found"}
            color={"grey"}
            textColor={"black"}
          ></SmallButton>
        </View>
        )}

        {/* Instructions Button */}
        <View style={{ padding: 10, alignSelf: "flex-end" }}>
          <SmallButton
            buttonTitle={"Instructions"}
            onPress={toggleModal}
            color={"#9966ff"}
          />
        </View>
      </View>

      {/* Pin Display */}
      <View style={{ flexDirection: "column" }}>
        {Object.entries(invertedTriangle).map(([rowIndex, pins]) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              margin: -5,
            }}
          >
            {pins.map((pinId) => {
              const pinType = newPinState[pinId];

              switch (pinType) {
                case "down":
                  return (
                    <PinDown
                      key={pinId}
                      buttonTitle={pinId}
                      onPress={() => togglePinState(pinId)}
                      disabled={true}
                    />
                  );
                case "standing":
                  return (
                    <PinStand
                      key={pinId}
                      buttonTitle={pinId}
                      onPress={() => togglePinState(pinId)}
                    />
                  );
                case "converted":
                  return (
                    <PinConv
                      key={pinId}
                      buttonTitle={pinId}
                      onPress={() => togglePinState(pinId)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </View>
        ))}
      </View>

      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <SmallButton
          buttonTitle={"Reset"}
          onPress={() => resetState()}
          color={"#9966ff"}
          width={"40%"}
        />
        <SmallButton
          buttonTitle={"Spare"}
          onPress={() => {
            setSpare();
          }}
          color={"#ccffdd"}
          width={"40%"}
          textColor={"black"}
        />
      </View>
      <View style={{ alignItems: "center", paddingTop: 10 }}>
        <SmallButton
          buttonTitle={"Confirm"}
          onPress={() => {
            confirmPress();
            updateGame(gameId, frameNum, rollNum, newPinState, newFrameState);
          }}
          color={"white"}
          textColor={"black"}
          width={"40%"}
        />
      </View>

      {/* Guide Modal */}
      <Modal visible={isGuideModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "grey",
          }}
        >
          {/* Display common name if exists in library */}
          <Text style={{ fontSize: 25, color: "#000000" }}>{commonName}</Text>
          <Image
            style={{
              width: windowWidth * 0.8,
              height: windowHeight * 0.65,
              resizeMode: "contain",
            }}
            source={{ uri: imageUrl }}
          />
          <AppButton buttonTitle="Back" onPress={toggleGuideModal} />
        </View>
      </Modal>

      {/* Instructions modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text style={{ fontSize: 16 }}>
              Select the pins that you have knocked down after your throw, or
              "Spare" if all pins were knocked down. Select "Reset" to return
              previously standing pins to the original standing position. Once
              you are ready, select "Confirm" to affirm your choice.
            </Text>
            <TouchableOpacity
              onPress={toggleModal}
              style={{ marginTop: 20, alignSelf: "flex-end" }}
            >
              <Text style={{ fontSize: 16, color: "blue" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RollScreen2;
