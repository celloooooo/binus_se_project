import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const MapViewComponent = forwardRef((props: any, ref) => {
  useImperativeHandle(ref, () => ({
    animateCamera: (config: any) => {
      console.log('animateCamera called on web mock map with config:', config);
    }
  }));

  // Render a mock map background using a stylish dark/light theme navigation map style image
  return (
    <View style={[styles.container, props.style]}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200' }} 
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>🗺️ Web Map Preview (Mock)</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    position: 'absolute',
    bottom: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlayText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default MapViewComponent;
