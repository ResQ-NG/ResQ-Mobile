import { StyleSheet, TextInput, View, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import React, { useState } from 'react';

interface ITextMainComponentProps {
    controlArea?: React.JSX.Element;
}

export default function TextMainComponent({ controlArea }: ITextMainComponentProps) {
    const [text, setText] = useState('');

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        multiline
                        autoFocus
                        maxLength={10000}
                    />
                    <Text style={styles.characterCount}>
                        {text.length}/10000
                    </Text>
                </View>

                {controlArea}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    inputContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        fontSize: 18,
        textAlignVertical: 'top',
        padding: 15,
        borderRadius: 12,
        backgroundColor: 'rgba(128,128,128,0.1)',
        minHeight: 250,
        maxHeight: 300,
        borderWidth: 1,
        borderColor: 'rgba(128,128,128,0.2)',
        color: '#ffffff'
    },
    characterCount: {
        textAlign: 'right',
        marginTop: 8,
        fontSize: 12,
        opacity: 0.6,
        color: '#ffffff'
    }
});
