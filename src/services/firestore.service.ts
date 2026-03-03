import { addDoc, collection, serverTimestamp, getDocs  } from "firebase/firestore";
import { db } from "./firebase";

export const saveAttachment = async (fileUrl: string) => {
  await addDoc(collection(db, "attachments"), {
    fileUrl,
    createdAt: serverTimestamp(),
  });
};

export const getAttachments = async () => {
  const snapshot = await getDocs(collection(db, "attachments"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};