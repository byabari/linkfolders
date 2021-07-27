import {
  Box,
  Button,
  Heading,
  IconButton,
  Flex,
  Avatar
} from '@chakra-ui/react';
import { HamburgerIcon, ArrowBackIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

import { useAuth } from '@/lib/auth';
import { LinkfoldersIcon } from '@/styles/icons';
import AccountMenu from '@/components/Account/AccountMenu';

const ProfileShell = ({ children }) => {
  const auth = useAuth();

  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      w="100vw"
      minH="100vh"
      bg=""
    >
      <Box w="100%">
        <Flex bg="" align="center" w="100%" h="4.6rem" px={2}>
          <Flex align="center" w="100%"></Flex>
          {auth?.user?.profile && (
            <NextLink href={`/${auth?.user?.profile?.username}`} passHref>
              <IconButton
                as="a"
                variant="ghost"
                borderRadius="full"
                aria-label="Profile"
                p={1}
                size="xl"
                icon={
                  <Avatar
                    size="md"
                    bg="gray.200"
                    name={auth?.user?.profile?.name}
                    src={auth?.user?.profile?.photoUrl}
                  />
                }
              />
            </NextLink>
          )}
          <AccountMenu />
        </Flex>
        <Flex direction="column" align="center">
          <Flex
            direction="column"
            align="center"
            justify="flex-start"
            w="100%"
            maxW="570px"
            px={3}
            pb={7}
          >
            {children}
          </Flex>
        </Flex>
      </Box>
      {!auth.user && (
        <NextLink href="/" passHref>
          <Button
            as="a"
            variant="ghost"
            mt={8}
            mb={2}
            leftIcon={<LinkfoldersIcon width="8" height="8" mb={2} />}
          >
            <Heading size="sm">Linkfolders</Heading>
          </Button>
        </NextLink>
      )}
    </Flex>
  );
};

export default ProfileShell;
