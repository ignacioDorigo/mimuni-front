import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Button, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const GenerarServicio = ({ route, navigation }) => {
  const [formType, setFormType] = useState('comercio');
  const [direccion, setDireccion] = useState('');
  const [medioContacto, setMedioContacto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotos, setFotos] = useState([]);

  const { mail } = route.params || {};

  // seleccionar imágenes desde la galería
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Resultado del selector de imágenes:', result);

    if (!result.canceled) {
      const newImages = [...fotos, result.assets[0]];
      setFotos(newImages);
    }
  };

  //  subir el formulario de comercio o profesional
  const submitForm = async () => {
    try {
      const formData = new FormData();
      formData.append('mail', mail);
      formData.append('descripcion', descripcion);

      if (formType === 'comercio') {
        formData.append('direccion', direccion);
        formData.append('contacto', medioContacto);
      } else if (formType === 'profesional') {
        formData.append('medioContacto', medioContacto);
        formData.append('horario', medioContacto); 
        formData.append('rubro', 'EjemploRubro'); 
      }

      fotos.forEach((image, index) => {
        formData.append('files', {
          uri: image.uri,
          name: `foto_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const url = formType === 'comercio' ? 'http://localhost:8080/inicio/crearServicioComercio' : 'http://localhost:8080/inicio/crearServicioProfesional';
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta de subida:', response.data);
      Alert.alert('Éxito', "El servicio se ha creado, la habilitación puede demorar hasta 15 días hábiles");

    } catch (error) {
      console.error('Error al subir el formulario:', error);
      Alert.alert('Error', 'Error al subir el formulario: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado y botones de navegación */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mimuni</Text>
        <View style={{ width: 20 }}></View>
      </View>

      {/* Botones para seleccionar tipo de formulario */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity style={[styles.toggleButton, formType === 'comercio' && styles.activeButton]} onPress={() => setFormType('comercio')}>
          <Text style={formType === 'comercio' ? styles.activeButtonText : styles.buttonText}>Servicio Comercio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleButton, formType === 'profesional' && styles.activeButton]} onPress={() => setFormType('profesional')}>
          <Text style={formType === 'profesional' ? styles.activeButtonText : styles.buttonText}>Servicio Profesional</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario de servicio seleccionado */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Dirección" value={direccion} onChangeText={setDireccion} />
          {formType === 'profesional' && (
            <TextInput style={styles.input} placeholder="Horario" value={medioContacto} onChangeText={setMedioContacto} />
          )}
          <TextInput style={styles.input} placeholder="Medio de contacto" value={medioContacto} onChangeText={setMedioContacto} />
          <TextInput style={styles.input} placeholder="Descripción" multiline={true} maxLength={1000} value={descripcion} onChangeText={setDescripcion} />
          <Button title="Seleccionar imágenes" onPress={pickImage} />
          
          <Button title="Generar servicio" onPress={submitForm} />
        </View>
      </ScrollView>

      {/* Navegación inferior */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ServiciosVecino', { mail })}>
          <Image source={require('./assets/servicios.png')} style={styles.icon} />
          <Text style={styles.navText}>Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ReclamosVecino', { mail })}>
          <Image source={require('./assets/reclamos.png')} style={styles.icon} />
          <Text style={styles.navText}>Reclamos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Image source={require('./assets/denuncias.png')} style={styles.icon} />
          <Text style={styles.navText}>Denuncias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('PerfilVecino', { mail })}>
          <Image source={require('./assets/perfil.png')} style={styles.icon} />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E9E4',
  },
  header: {
    backgroundColor: '#4A4E69',
    paddingTop: 70,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4A4E69',
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#6D6D6D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  activeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    backgroundColor: '#4A4E69',
    paddingHorizontal: 10, 
    paddingVertical: 20, 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});

export default GenerarServicio;