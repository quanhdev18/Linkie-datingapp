import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Slider } from "@rneui/themed";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import DropdownModal from "./dropdownModal";

export default function FilterModal({ visible, onClose, onApply }) {
  const [distance, setDistance] = useState(10);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(25);
  const screenWidth = Dimensions.get("window").width;

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [genderOptions] = useState([
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Giới tính khác", value: "other" },
  ]);
  const [selectedGender, setSelectedGender] = useState([]);

  const [showOrientationModal, setShowOrientationModal] = useState(false);
  const [orientationOptions] = useState([
    { label: "Dị tính", value: "heterosexual" },
    { label: "Đồng tính", value: "homosexual" },
    { label: "Song tính", value: "bisexual" },
    { label: "Chưa rõ", value: "unknown" },
  ]);
  const [selectedOrientation, setSelectedOrientation] = useState([]);

  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const relationshipOptions = [
    { label: "Người yêu", value: "relationship" },
    { label: "Một người bạn đời ", value: "lifepartner" },
    { label: "Quan hệ không ràng buộc", value: "casual" },
    { label: "Những người bạn mới", value: "friends" },
    { label: "Mình cũng chưa rõ lắm", value: "unsure" },
  ];
  const [selectedTags, setSelectedTags] = useState([]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Bộ lọc</Text>
            <TouchableOpacity onPress={() => onClose(false)}>
              <Text style={styles.closeText}>Xong</Text>
            </TouchableOpacity>
          </View>

          {/* Khoảng cách */}
          <View style={styles.section}>
            <Text style={styles.label}>Khoảng cách: 0 - {distance} km</Text>

            <Slider
              value={distance}
              onValueChange={setDistance}
              minimumValue={0}
              maximumValue={100}
              step={1}
              minimumTrackTintColor="black"
              maximumTrackTintColor="lightgray"
              thumbTintColor="black"
              trackStyle={{ height: 3 }}
              thumbStyle={{ width: 16, height: 16, backgroundColor: "black" }}
            />
          </View>

          {/* Độ tuổi */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Độ tuổi: {minAge} - {maxAge}
            </Text>

            <View style={{ width: "100%" }}>
              <MultiSlider
                values={[minAge, maxAge]}
                onValuesChange={(values) => {
                  setMinAge(values[0]);
                  setMaxAge(values[1]);
                }}
                min={0}
                max={80}
                step={1}
                selectedStyle={{ backgroundColor: "black" }}
                unselectedStyle={{ backgroundColor: "lightgray" }}
                markerStyle={{
                  backgroundColor: "black",
                  width: 16,
                  height: 16,
                  borderRadius: 10,
                }}
                containerStyle={{ width: "90%" }}
                trackStyle={{ height: 3 }}
                sliderLength={screenWidth - 75}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={styles.dropdownText}>Giới tính</Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowOrientationModal(true)}
          >
            <Text style={styles.dropdownText}>Khuynh hướng tính dục</Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowRelationshipModal(true)}
          >
            <Text style={styles.dropdownText}>Mối quan hệ</Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          <DropdownModal
            visible={showGenderModal}
            onClose={() => setShowGenderModal(false)}
            title="Bạn muốn tìm người có giới tính?"
            options={genderOptions}
            selectedOptions={selectedGender}
            onSelect={setSelectedGender}
          />

          <DropdownModal
            visible={showOrientationModal}
            onClose={() => setShowOrientationModal(false)}
            title="Nguời đó có huynh hướng tính dục?"
            options={orientationOptions}
            selectedOptions={selectedOrientation}
            onSelect={setSelectedOrientation}
          />

          <DropdownModal
            visible={showRelationshipModal}
            onClose={() => setShowRelationshipModal(false)}
            title="Bạn đang tìm mối quan hệ?"
            options={relationshipOptions}
            selectedOptions={selectedTags}
            onSelect={setSelectedTags}
          />

          {/* Apply button */}
          {/* <TouchableOpacity
            style={styles.applyButton}
            onPress={() =>
              onApply({
                distance,
                minAge,
                maxAge,
                gender: selectedGender,
                orientation: selectedOrientation,
                relationship: selectedTags,
              })
            }
          >
            <Text style={styles.applyText}>Áp dụng</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() =>
              onApply({
                distance,
                minAge,
                maxAge,
                gender: selectedGender.map((item) => item.value),
                orientation: selectedOrientation.map((item) => item.value),
                relationship: selectedTags.map((item) => item.value),
              })
            }
          >
            <Text style={styles.applyText}>Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.5)",
    // justifyContent: "flex-end",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeText: {
    fontSize: 16,
    color: "green",
    position: "absolute",
    left: 116,
  },
  // section: {
  //   marginVertical: 10,
  //   width: "100%",

  // },
  // label: {
  //   fontSize: 16,
  //   marginBottom: 5,
  // },
  section: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: "#333",
  },

  applyButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    backgroundColor: "green",
    width: 200,
    alignSelf: "center",
  },
  applyText: {
    fontSize: 16,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  dropdownText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 14,
    alignSelf: "center",
  },

  relationshipModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  relationshipModal: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  relationshipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },

  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },

  tagSelected: {
    backgroundColor: "green",
  },

  tagText: {},

  tagTextSelected: {
    fontWeight: "bold",
  },

  doneButton: {
    backgroundColor: "linear-gradient(90deg, #FF5C5C, #FF9A9E)", // Dùng LinearGradient nếu cần
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
  },

  doneButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

const pickerStyle = {
  inputIOS: {
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  placeholder: {
    color: "#ccc",
  },
};
