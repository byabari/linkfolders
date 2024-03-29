import firebase from '@/lib/firebase';

const storage = firebase.storage();

export async function uploadProfilePhoto(id, photo) {
  const storageRef = storage.ref();
  const photoRef = storageRef.child(`avatars/${id}`);
  await photoRef.put(photo);
  return await photoRef.getDownloadURL();
}
