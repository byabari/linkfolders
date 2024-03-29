import { Menu, MenuButton, IconButton } from '@chakra-ui/react';
import { DragHandleIcon } from '@chakra-ui/icons';

import LinkMenuList from '@/components/Folder/LinkMenuList';
import FolderMenuList from '@/components/Folder/FolderMenuList';

const ItemMenu = ({ item, renameMode, setRenameMode }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Item menu"
        icon={<DragHandleIcon />}
        variant="ghost"
        size="sm"
        color="gray"
        _hover={{ bg: 'gray.200' }}
      />
      {item?.type === 'link' ? (
        <LinkMenuList
          link={item}
          renameMode={renameMode}
          setRenameMode={setRenameMode}
        />
      ) : item?.type === 'folder' ? (
        <FolderMenuList
          folder={item}
          renameMode={renameMode}
          setRenameMode={setRenameMode}
        />
      ) : null}
    </Menu>
  );
};

export default ItemMenu;
