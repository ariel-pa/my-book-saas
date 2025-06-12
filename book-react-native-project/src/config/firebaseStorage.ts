import { initializeApp } from 'firebase/app';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const emulatorConfig = {
  apiKey: 'fake-api-key',
  authDomain: 'localhost',
  projectId: 'demo-storage',
  storageBucket: 'demo-storage.appspot.com',
  messagingSenderId: 'fake-id',
  appId: 'fake-id',
};

// Usamos una instancia alternativa llamada "storageApp"
const storageApp = initializeApp(emulatorConfig, 'storageApp');

const storage = getStorage(storageApp);

if (__DEV__) {
  connectStorageEmulator(storage, '192.168.100.23', 9199);
}

export { storage };
