import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Contact, requestPermissionsAsync, ContactsSortOrder, ContactField } from 'expo-contacts';
import { useState } from 'react';
import type { PartialContactDetails } from 'expo-contacts'
import {
  SafeAreaView,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

export default function App() {

  type ContactItem = {
    first: string,
    last: string,
    number: string
  }

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [contact, setContact] = useState<PartialContactDetails<[ContactField.FULL_NAME | ContactField.PHONES]> | undefined>()

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const data = await Contact.getAllDetails([ContactField.GIVEN_NAME, ContactField.FAMILY_NAME, ContactField.PHONES], {
        limit: 10,
        sortOrder: ContactsSortOrder.FamilyName
      });

      if (data.length > 0) {
        const contactList: ContactItem[] = data.map(c => ({
          first: c.givenName ?? '',
          last: c.familyName ?? '',
          number: c.phones?.[0]?.number ?? '',
        }));

        setContacts(contactList);
      }
      else {
        Alert.alert("Warning", "No contacts found.");
      }
    }
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={contacts}
          renderItem={({ item }) =>
            <View>
              <Text>{item.first} {item.last} {item.number}</Text>
            </View>
          }
        />
        <Pressable onPress={getContacts} style={styles.button}>
          <Text style={styles.buttonText}>GET CONTACTS</Text>
        </Pressable>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white'
  },
});
