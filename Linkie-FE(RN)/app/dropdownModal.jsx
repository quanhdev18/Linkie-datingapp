// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";

// const DropdownModal = ({
//   visible,
//   onClose,
//   title,
//   options,
//   selectedOptions,
//   onSelect,
//   isMulti = true, // ✅ Thêm prop isMulti, mặc định là true
// }) => {
//   const [localSelection, setLocalSelection] = useState([]);

//   useEffect(() => {
//     setLocalSelection(selectedOptions || []);
//   }, [selectedOptions]);

//   const toggleOption = (option) => {
//     const exists = localSelection.some((item) => item.value === option.value);

//     if (!isMulti) {
//       onSelect([option]);
//       onClose();
//     } else {
//       if (exists) {
//         setLocalSelection(
//           localSelection.filter((item) => item.value !== option.value)
//         );
//       } else {
//         setLocalSelection([...localSelection, option]);
//       }
//     }
//   };

//   const handleDone = () => {
//     onSelect(localSelection);
//     onClose();
//   };

//   return (
//     <Modal transparent visible={visible} animationType="slide">
//       <View style={styles.overlay}>
//         <TouchableOpacity
//           style={styles.backgroundOverlay}
//           activeOpacity={1}
//           onPressOut={onClose}
//         />
//         <View style={styles.container}>
//           <Text style={styles.title}>{title}</Text>
//           <ScrollView contentContainerStyle={styles.optionsContainer}>
//             {options.map((option, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.option,
//                   localSelection.some((item) => item.value === option.value) &&
//                     styles.optionSelected,
//                 ]}
//                 onPress={() => toggleOption(option)}
//               >
//                 <Text style={styles.optionText}>{option.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           {isMulti && (
//             <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
//               <Text style={styles.doneText}>XONG</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default DropdownModal;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "#000000AA",
//     justifyContent: "flex-end",
//   },
//   container: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: "80%",
//     alignSelf: "stretch",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 16,
//     alignSelf: "center",
//   },
//   optionsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
//   option: {
//     borderWidth: 1,
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     margin: 5,
//   },
//   optionSelected: {
//     backgroundColor: "green",
//     borderColor: "black",
//   },
//   optionText: {
//     color: "black",
//   },
//   doneButton: {
//     marginTop: 16,
//     borderRadius: 30,
//     paddingVertical: 12,
//     alignItems: "center",
//   },
//   doneText: {
//     color: "",
//     fontWeight: "bold",
//   },
// });
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const DropdownModal = ({
  visible,
  onClose,
  title,
  options = [],
  selectedOptions = [],
  onSelect,
  isMulti = true,
}) => {
  const [localSelection, setLocalSelection] = useState([]);

  useEffect(() => {
    setLocalSelection(selectedOptions || []);
  }, [selectedOptions]);

  const isSelected = (option) => {
    return localSelection.some((item) => item.value === option.value);
  };

  const toggleOption = (option) => {
    if (!isMulti) {
      onSelect([option]);
      onClose();
    } else {
      if (isSelected(option)) {
        setLocalSelection((prev) =>
          prev.filter((item) => item.value !== option.value)
        );
      } else {
        setLocalSelection((prev) => [...prev, option]);
      }
    }
  };

  const handleDone = () => {
    onSelect(localSelection);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backgroundOverlay}
          activeOpacity={1}
          onPressOut={onClose}
        />
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView contentContainerStyle={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  isSelected(option) && styles.optionSelected,
                ]}
                onPress={() => toggleOption(option)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {isMulti && (
            <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
              <Text style={styles.doneText}>XONG</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default DropdownModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "flex-end",
  },
  backgroundOverlay: {
    flex: 1,
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  option: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  optionSelected: {
    backgroundColor: "green",
    borderColor: "black",
  },
  optionText: {
    color: "black",
  },
  doneButton: {
    marginTop: 16,
    borderRadius: 30,
    paddingVertical: 12,
    backgroundColor: "black",
    alignItems: "center",
  },
  doneText: {
    color: "white",
    fontWeight: "bold",
  },
});
