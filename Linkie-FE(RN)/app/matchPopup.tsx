import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface MatchPopupProps {
  userName: string;
  onClose: () => void;
  onSend: (message: string) => void;
}

const MatchPopup: React.FC<MatchPopupProps> = ({ userName, onClose, onSend }) => {
  const [message, setMessage] = React.useState('');

  const emojis = ['👋', '😉', '❤️', '😍'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heartsBackground}>
        {/* 2 avatar rỗng, bạn thay bằng ảnh sau */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
          <View style={styles.avatar} />
        </View>
      </View>

      <Text style={styles.matchText}>IT’S A</Text>
      <Text style={styles.bigMatchText}>Match</Text>
      {/* <Text style={styles.subText}>Bạn đã tương hợp với {userName}</Text> */}
      <Text style={styles.subText}>{userName} đã tương hợp với nhau</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Nói gì đó hay ho đi"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => onSend(message)}>
          <Text style={styles.sendButton}>Gửi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emojiRow}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity key={index} style={styles.emojiButton} onPress={() => onSend(emoji)}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MatchPopup;

const styles = StyleSheet.create({
  // container: {
  //   position: 'absolute',
  //   zIndex: 999, 
  //   flex: 1,
  //   backgroundColor: '#FF99CC',
  //   alignItems: 'center',
  //   flexGrow: 1,
  //   flexShrink: 1,
  //   flexBasis: 0,
  //   paddingTop: 120,
  //   paddingRight: 15,
  //   paddingLeft: 15,
  // },
  container: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
  backgroundColor: '#FF99CC',
  
  justifyContent: 'center', // căn giữa theo chiều dọc
  alignItems: 'center',     // căn giữa theo chiều ngang
  paddingHorizontal: 20,
},
  header: {
    position: 'absolute',
    top: 0,
    left: 20,
    zIndex: 10,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  close: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
    paddingTop: 31,
    
  },
  heartsBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },

  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80, 
    backgroundColor: '#fff',
    marginHorizontal: -10,  
    borderWidth: 5,
    borderColor: '#F8BBD0',  
    shadowColor: '#007AFF',  
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  matchText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 2,
    marginTop: -30,
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  bigMatchText: {
    fontSize: 100,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 4,
    marginTop: -15,
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 6,
  },


  subText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    fontWeight: '500',
    paddingBottom: 50,
  },
  inputRow: {

    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    fontWeight: '700',
    color: '',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
  emojiButton: {
    width: 54,
    height: 54,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 35,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  emojiText: {
    fontSize: 22,
  },
});



// <MatchPopup
//   userName="maddy"
//   onClose={() => setShowPopup(false)}
//   onSend={(msg) => {
//     // Gửi message hoặc emoji
//     console.log('Đã gửi:', msg);
//   }}
// />
