import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, HelperText } from 'react-native-paper';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  unit,
  error,
  helperText,
  keyboardType = 'numeric',
  placeholder,
  disabled = false,
  suffix,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        disabled={disabled}
        error={!!error}
        style={styles.input}
        textColor="#FFFFFF"
        outlineColor="#444444"
        activeOutlineColor="#F59E0B"
        right={
          unit || suffix ? (
            <TextInput.Affix text={unit || suffix} textStyle={styles.affix} />
          ) : null
        }
      />
      {(error || helperText) && (
        <HelperText type={error ? 'error' : 'info'} visible={true} style={styles.helper}>
          {error || helperText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1E1E1E',
    fontSize: 16,
  },
  affix: {
    color: '#F59E0B',
    fontWeight: 'bold',
    fontSize: 15,
  },
  helper: {
    fontSize: 12,
  },
});
