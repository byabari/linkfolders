import { mutate } from 'swr';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  18
);

import {
  createItem,
  updateItem,
  deleteItem,
  deleteFolder,
  updateChildrenOrder
} from '@/lib/db';

const getUrlTitle = (url) => {
  const title = fetch(`https://cors.bridged.cc/${url}`, {
    headers: {
      'Content-Type': 'application/json',
      origin: 'https://app.cors.bridged.cc'
    }
  })
    .then((response) => {
      if (response.ok) return response.text();
      throw new Error("Can't read url title");
    })
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const titleHtml = doc.querySelectorAll('title')[0];
      if (titleHtml) return titleHtml.innerText;
      return null;
    })
    .catch(() => {
      return null;
    });
  return title;
};

export async function handleCreateLink(userId, folderId, url, username) {
  let newItem = {
    userId,
    parent: folderId,
    type: 'link',
    name: 'Loading...',
    url
  };
  const id = nanoid();
  mutate(
    `/api/folders/${newItem.parent}/children`,
    async (data) => ({
      children: [...data?.children, { id, ...newItem }]
    }),
    false
  );
  if (!username || userId !== folderId) {
    mutate(
      `/api/folders/${newItem.parent}`,
      async (data) => ({
        folder: {
          ...data?.folder,
          children: [...data?.folder?.children, id]
        }
      }),
      false
    );
  } else {
    mutate(
      `/api/profiles/username/${username}`,
      async (data) => ({
        profile: {
          ...data?.profile,
          children: [...data?.profile?.children, id]
        }
      }),
      false
    );
  }
  const title = await getUrlTitle(url);
  newItem.name = title
    ? title
    : url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
  mutate(
    `/api/folders/${newItem.parent}/children`,
    async (data) => ({
      children: [
        ...data?.children.filter((item) => item.id !== id),
        { id, ...newItem }
      ]
    }),
    false
  );
  createItem(id, newItem);
}

export async function handleCreateFolder(name, userId, folderId, username) {
  const newItem = {
    userId,
    parent: folderId,
    type: 'folder',
    name: name,
    children: []
  };
  const id = nanoid();
  mutate(
    `/api/folders/${newItem.parent}/children`,
    async (data) => ({
      children: [...data?.children, { id, ...newItem }]
    }),
    false
  );
  if (!username || userId !== folderId) {
    mutate(
      `/api/folders/${newItem.parent}`,
      async (data) => ({
        folder: {
          ...data?.folder,
          children: [...data?.folder?.children, id]
        }
      }),
      false
    );
  } else {
    mutate(
      `/api/profiles/username/${username}`,
      async (data) => ({
        profile: {
          ...data?.profile,
          children: [...data?.profile?.children, id]
        }
      }),
      false
    );
  }
  createItem(id, newItem);
}

export function handleUpdateItem(id, newItem) {
  mutate(
    `/api/folders/${newItem.parent}/children`,
    async (data) => ({
      children: [
        ...data?.children.filter((item) => item.id !== id),
        { id, ...newItem }
      ]
    }),
    false
  );
  updateItem(id, newItem);
}

export function handleUpdateChildrenOrder(
  result,
  folderId,
  childrenOrder,
  username
) {
  const { destination, source, draggableId } = result;
  if (!destination) return;
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return;
  const newChildrenOrder = Array.from(childrenOrder);
  newChildrenOrder.splice(source.index, 1);
  newChildrenOrder.splice(destination.index, 0, draggableId);
  if (!username) {
    mutate(
      `/api/folders/${folderId}`,
      async (data) => ({
        folder: {
          ...data?.folder,
          children: [...newChildrenOrder]
        }
      }),
      false
    );
  } else {
    mutate(
      `/api/profiles/username/${username}`,
      async (data) => ({
        profile: {
          ...data?.profile,
          children: [...newChildrenOrder]
        }
      }),
      false
    );
  }
  updateChildrenOrder(folderId, newChildrenOrder);
}

export function handleDeleteLink(itemId, parentId) {
  mutate(
    `/api/folders/${parentId}/children`,
    async (data) => ({
      children: data?.children.filter((item) => item.id !== itemId)
    }),
    false
  );
  deleteItem(itemId, parentId);
}

export function handleDeleteFolder(itemId, parentId) {
  mutate(
    `/api/folders/${parentId}/children`,
    async (data) => ({
      children: data?.children.filter((item) => item.id !== itemId)
    }),
    false
  );
  deleteFolder(itemId, parentId);
}
