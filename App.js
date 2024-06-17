import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import BluetoothPrinter from '@linvix-sistemas/react-native-bluetooth-printer';
import {
  Printer,
  Style,
  Align,
  Model,
  InMemory,
} from '@linvix-sistemas/react-native-escpos-buffer';
export default function App() {

  const [Devices, setDevices] = useState([]);


  const goScanDevices = async () => {
    console.log('SCAN')
    try {
      setDevices([]);
      const devices = await BluetoothPrinter.scanDevices();

      (devices?.paired ?? []).map((device) => {
        setDevices((old) => {
          if (!old.some((d) => d.address === device.address)) {

            old.push(device);
          }

          return [...old];
        });
      });

      (devices?.found ?? []).map((device) => {
        setDevices((old) => {
          if (!old.some((d) => d.address === device.address)) {
            old.push(device);
          }

          return [...old];
        });
      });

      console.log(devices);
    } catch (error) {
      Alert.alert(error.message);
      console.log(error)
    }
  };

  const goConnect = async () => {
    console.log('DEVICES', Devices.toString())
    try {
      const connect = await BluetoothPrinter.connect( "DC:0D:51:D6:D2:20");
      console.log(connect);
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const convertBufferToBytes = (buffer) => {
    const bytes = [];
    Array.from(buffer).map((byte) => {
      bytes.push(byte);
    });
    return bytes;
  };
  const goPrint = async () => {
    /**
     * Classe de geração do Impresso.
     */
    const connection = new InMemory();
    const printer = await Printer.CONNECT('TM-T20', connection);

    const capability = Model.EXPAND(Model.FIND('TM-T20'));
    const { feed } = capability;

    // printer.setColumns(48);
 
    await printer.writeln('ESTAI MUCHACHO', Style.DoubleWidth, Align.Center);
   
    await printer.cutter();

    if (feed) {
      await printer.feed(feed);
    }

    const buffer = connection.buffer();

    const bytes = convertBufferToBytes(buffer);

    try {
      const print = await BluetoothPrinter.printRaw(bytes);
      console.log(print);
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app4!</Text>
       <Button title='SCAN' onPress={goScanDevices} ></Button>
       <Text>{Devices[0]?.name ? Devices.find( device => device.name = "FRM-5809").name:null}</Text>
       {Devices[0]?  <Button title='conectar' onPress={goConnect} ></Button> :null}
      <StatusBar style="auto" />
  
      {Devices[0] ?  <Button title='imprimir' onPress={goPrint} ></Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
