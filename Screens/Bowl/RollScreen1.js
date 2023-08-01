import { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import PinInit from "../../Components/Buttons/PinInit";
import PinDown from "../../Components/Buttons/PinDown";
import PinStand from "../../Components/Buttons/PinStand";
import ScoreBoard from "../../Components/Tables/ScoreBoard";
import updateGame from "../../Functions/updateGame";
import Modal from "react-native-modal";
import SmallButton from "../../Components/Buttons/SmallButton";

const RollScreen1 = ({ navigation, route }) => {
  // First, obtain the current game from the database
  const { frameNum, rollNum, gameId } = route.params;
  const [frameState, setFrameState] = useState(null);

  // for the fading out of "confirm" button before "strike" is pressed or pins are toggled
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  // for the fading out of "strike" button once it has been pressed once
  const [isStrikeDisabled, setIsStrikeDisabled] = useState(false);

  // for toggling the instructions modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Initialisation of pinState
  const [pinState, setPinState] = useState(
    // {1: "down", 2: "standing", ...,}
    Object.fromEntries(
      Array.from({ length: 10 }, (_, index) => [index + 1, "initial"])
    )
  );

  // Check if all pins down
  const allPinsDown = Object.values(pinState).every(
    (state) => state === "down"
  );

  // This toggles the state of the pins
  const togglePinState = (id) => {
    const pinType = {
      initial: "standing",
      standing: "initial",
      down: "standing",
    };

    if (allPinsDown) {
      resetState();
    }

    // Check if this pin standing and all other pins are in initial state
    // If so, call setStrike
    const thisStandingAndOthersInitial = Object.keys(pinState).every(
      (pinId) => {
        if (pinId === id) {
          return pinState[pinId] === "standing";
        } else {
          return pinState[pinId] === "initial";
        }
      }
    );
    // Pls stay down
    if (thisStandingAndOthersInitial) {
      // setStrike();
      // setIsStrikeDisabled(true);
      setIsConfirmDisabled(true);
    } else {
      setIsConfirmDisabled(false);
    }

    // Finally set the pin state
    setPinState((prevState) => ({
      ...prevState,
      [id]: pinType[prevState[id]],
    }));
  };

  const setStrike = () => {
    setPinState(
      Object.fromEntries(Object.keys(pinState).map((id) => [id, "down"]))
    );
    setIsConfirmDisabled(false);
    setFrameState("strike");
  };

  // TODO: Consider adding a "Gutter" button -> all pins become standing

  const resetState = () => {
    setPinState(
      Object.fromEntries(Object.keys(pinState).map((id) => [id, "initial"]))
    );
    setFrameState(null);
    setIsConfirmDisabled(true);
  };

  // convert all "initial" pins into "down" pins
  const updatedPinState = Object.fromEntries(
    Object.entries(pinState).map(([id, state]) => [
      id,
      state === "initial" ? "down" : state,
    ])
  );

  const confirmPress = () => {
    // if there is a strike, then navigate back to RollScreen1 but with updated frameNum
    if (allPinsDown) {
      if (frameNum == 10) {
        // frame 10 strike logic
        navigation.replace("RollScreen1", {
          frameNum: frameNum,
          rollNum: rollNum + 1,
          gameId: gameId,
        });
      } else {
        // frames 1 - 9 strike logic
        navigation.replace("RollScreen1", {
          frameNum: frameNum + 1,
          rollNum: 1,
          gameId: gameId,
        });
      }
    } else {
      navigation.replace("RollScreen2", {
        pinState: updatedPinState,
        frameNum: frameNum,
        rollNum: rollNum + 1,
        gameId: gameId,
      });
    }

    if (rollNum == 3) {
      navigation.replace("GameOverScreen", { gameId: gameId });
    }
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

      {/* Instructions Button */}
      <View style={{ padding: 10, alignSelf: "flex-end" }}>
        <SmallButton
          buttonTitle={"Instructions"}
          onPress={toggleModal}
          color={"#9966ff"}
        />
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
              const pinType = pinState[pinId];

              switch (pinType) {
                case "initial":
                  return (
                    <PinInit
                      key={pinId}
                      buttonTitle={pinId}
                      onPress={() => togglePinState(pinId)}
                    />
                  );
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
          onPress={() => {
            resetState();
            setIsStrikeDisabled(false);
          }}
          color={"#9966ff"}
          width={"40%"}
        />
        <SmallButton
          buttonTitle={"Strike"}
          onPress={() => {
            if (!isStrikeDisabled) {
              setStrike();
              setIsStrikeDisabled(true);
            }
          }}
          color={"#ff9966"}
          width={"40%"}
          disabled={isStrikeDisabled}
        />
      </View>
      <View style={{ alignItems: "center", paddingTop: 10 }}>
        <SmallButton
          buttonTitle={"Confirm"}
          onPress={() => {
            if (!isConfirmDisabled) {
              confirmPress();
              updateGame(
                gameId,
                frameNum,
                rollNum,
                updatedPinState,
                frameState
              );
            }
          }}
          color={"white"}
          textColor={"black"}
          width={"40%"}
          disabled={isConfirmDisabled}
        />
      </View>

      {/* Instructions modal */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text style={{ fontSize: 16 }}>
              Select the pins that remain standing after your throw, or "Strike"
              if all pins were knocked down. Select "Reset" to return all pins
              to the original standing position. Once you are ready, select
              "Confirm" to affirm your choice.
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

export default RollScreen1;
