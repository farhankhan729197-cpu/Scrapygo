import { initializeApp } from "firebase/app";
import { getStorage, listAll, ref, getDownloadURL } from "firebase/storage";

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
    const listRef = ref(storage, '/');
    const res = await listAll(listRef);
    console.log("Items:");
    res.items.forEach((itemRef) => {
      console.log(itemRef.fullPath);
    });
    console.log("Prefixes:");
    res.prefixes.forEach((itemRef) => {
      console.log(itemRef.fullPath);
    });
  } catch (err) {
    console.error(err);
  }
}
test();
