import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyAmaQu_gJqDYYJyFiO2UqsZOH_S1gHTzcE",
  authDomain: "scrapgo-4516f.firebaseapp.com",
  projectId: "scrapgo-4516f",
  storageBucket: "scrapgo-4516f.firebasestorage.app",
  messagingSenderId: "233767090067",
  appId: "1:233767090067:web:5200c24a252132e5099a66",
  measurementId: "G-RHEK47KWTZ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function test() {
  try {
    const data = fs.readFileSync('public/logo.jpeg');
    const listRef = ref(storage, 'logo.jpeg');
    await uploadBytes(listRef, data);
    console.log("Success");
  } catch (err) {
    console.error(err);
  }
}
test();
