import firebase from './firebase';
import getStripe from './stripe';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  18
);

const firestore = firebase.firestore();
const app = firebase.app();

export function createUser(uid, data) {
  const batch = firestore.batch();

  const usernameRef = firestore
    .collection('usernames')
    .doc(data.username.toLowerCase());
  batch.set(
    usernameRef,
    {
      uid
    },
    { merge: true }
  );

  const profileRef = firestore.collection('items').doc(uid);
  batch.set(
    profileRef,
    {
      type: 'profile',
      photoUrl: data.photoUrl,
      name: data.name,
      username: data.username,
      children: []
    },
    { merge: true }
  );

  const articlesFolderId = nanoid();
  const podcastsFolderId = nanoid();

  const rootFolderRef = firestore.collection('items').doc(`root-${uid}`);
  batch.set(
    rootFolderRef,
    {
      type: 'folder',
      parent: '',
      name: '',
      userId: uid,
      children: [articlesFolderId, podcastsFolderId]
    },
    { merge: true }
  );

  const articlesFolderRef = firestore.collection('items').doc(articlesFolderId);
  batch.set(
    articlesFolderRef,
    {
      type: 'folder',
      parent: `root-${uid}`,
      name: 'Articles',
      userId: uid,
      children: []
    },
    { merge: true }
  );

  const podcastsFolderRef = firestore.collection('items').doc(podcastsFolderId);
  batch.set(
    podcastsFolderRef,
    {
      type: 'folder',
      parent: `root-${uid}`,
      name: 'Podcasts',
      userId: uid,
      children: []
    },
    { merge: true }
  );

  const userRef = firestore.collection('users').doc(uid);
  batch.set(
    userRef,
    { email: data.email, username: data.username, provider: data.provider },
    { merge: true }
  );

  return batch.commit();
}

export function updateProfile(id, data) {
  return firestore.collection('items').doc(id).update(data);
}

export function updateProfileAndUsername(id, data, oldUsername) {
  const batch = firestore.batch();

  const usernameRef = firestore
    .collection('usernames')
    .doc(data.username.toLowerCase());
  batch.set(
    usernameRef,
    {
      uid: id
    },
    { merge: true }
  );

  const oldUsernameRef = firestore
    .collection('usernames')
    .doc(oldUsername.toLowerCase());
  batch.delete(oldUsernameRef);

  const profileRef = firestore.collection('items').doc(id);
  batch.update(profileRef, data);

  return batch.commit();
}

export async function createItem(id, data) {
  const batch = firestore.batch();

  const itemRef = firestore.collection('items').doc(id);
  batch.set(itemRef, data);

  if (data.parent) {
    const parentRef = firestore.collection('items').doc(data.parent);
    batch.update(parentRef, {
      children: firebase.firestore.FieldValue.arrayUnion(id)
    });
  }

  return batch.commit();
}

export function updateItem(id, data) {
  return firestore.collection('items').doc(id).update(data);
}

export function updateChildrenOrder(id, data) {
  return firestore.collection('items').doc(id).update({
    children: data
  });
}

export async function deleteItem(itemId, parentId) {
  const batch = firestore.batch();

  const itemRef = firestore.collection('items').doc(itemId);
  batch.delete(itemRef);

  const parentRef = firestore.collection('items').doc(parentId);
  batch.update(parentRef, {
    children: firebase.firestore.FieldValue.arrayRemove(itemId)
  });

  return batch.commit();
}

export async function deleteFolder(folderId, parentId) {
  const snapshot = await firestore
    .collection('items')
    .where('parent', '==', folderId)
    .get();

  const batch = firestore.batch();

  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  const itemRef = firestore.collection('items').doc(folderId);
  batch.delete(itemRef);

  const parentRef = firestore.collection('items').doc(parentId);
  batch.update(parentRef, {
    children: firebase.firestore.FieldValue.arrayRemove(folderId)
  });

  return batch.commit();
}

export async function createCheckoutSession(uid) {
  const checkoutSessionRef = await firestore
    .collection('users')
    .doc(uid)
    .collection('checkout_sessions')
    .add({
      price: process.env.NEXT_PUBLIC_PRICE_ID,
      success_url: window.location.origin,
      cancel_url: window.location.origin
    });

  checkoutSessionRef.onSnapshot(async (snap) => {
    const { sessionId } = snap.data();

    if (sessionId) {
      const stripe = await getStripe();

      stripe.redirectToCheckout({ sessionId });
    }
  });
}

export async function goToBillingPortal() {
  const functionRef = app
    .functions('europe-west1')
    .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');

  const { data } = await functionRef({
    returnUrl: `${window.location.origin}/settings/plan`
  });

  window.location.assign(data.url);
}
