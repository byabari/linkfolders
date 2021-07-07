import {
  Box,
  Stack,
  Heading,
  Button,
  IconButton,
  Text,
  Avatar,
  AvatarBadge,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/lib/auth';
import SettingsShell from '@/components/Settings/SettingsShell';
import SettingsHeader from '@/components/Settings/SettingsHeader';
import SettingsPhoto from '@/components/Settings/SettingsPhoto';
import SettingsUsername from '@/components/Settings/SettingsUsername';
import {
  handleUpdateProfile,
  handleUpdateProfileAndUsername
} from '@/lib/handlers';
import { uploadProfilePhoto } from '@/lib/storage';
import { updateProfile, updateProfileAndUsername } from '@/lib/db';

const ProfileEditPage = () => {
  const auth = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: auth?.user?.profile?.name,
      username: auth?.user?.profile?.username
    }
  });

  const onSubmit = async (values) => {
    console.log(
      'values: ',
      values.photo[0],
      values.name,
      values.username.toLowerCase()
    );

    const newProfileHeader = {
      photoUrl: auth?.user?.profile?.photoUrl,
      name: auth?.user?.profile?.name,
      username: auth?.user?.profile?.username
    };

    if (!values.photo[0]) {
      if (
        values.name === auth?.user?.profile?.name &&
        values.username === auth?.user?.profile?.username
      )
        return;
    } else {
      const photoUrl = await uploadProfilePhoto(
        auth?.user?.profile?.id,
        !values.photo[0]
      );
      if (photoUrl) newProfileHeader.photoUrl = photoUrl;
    }
    newProfileHeader.name = values.name;
    newProfileHeader.username = values.username.toLowerCase();

    console.log('new profile: ', newProfileHeader);
    if (values.username === auth?.user?.profile?.username) {
      // handleUpdateProfile(auth?.user?.profile?.id, newProfileHeader);
      updateProfile(auth?.user?.profile?.id, newProfileHeader);
    } else {
      // handleUpdateProfileAndUsername(auth?.user?.profile?.id, newProfileHeader);
      updateProfileAndUsername(auth?.user?.profile?.id, newProfileHeader);
    }
  };

  return (
    <SettingsShell>
      <Box w="100%">
        <SettingsHeader name={'Edit profile'} />
        <Text minH="15px" mb={10}></Text>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={8} mb={12}>
            <SettingsPhoto register={register} errors={errors} />
            {/* <FormControl isInvalid={errors.photoUrl}>
              <FormLabel>Photo</FormLabel>
              <Avatar
                bg="gray.200"
                size="xl"
                name={auth?.user?.profile?.name}
                src={auth?.user?.profile?.photoUrl}
              >
                <AvatarBadge border="none" p={4}>
                  <IconButton size="sm" color="gray.700" icon={<EditIcon />} />
                </AvatarBadge>
              </Avatar>
              {errors.name && (
                <FormErrorMessage>{errors.photoUrl.message}</FormErrorMessage>
              )}
            </FormControl> */}
            <FormControl isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Name"
                defaultValue={auth?.user?.profile?.name}
                {...register('name', {
                  required: 'Name is required'
                })}
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <SettingsUsername register={register} errors={errors} />
          </Stack>
          <Button colorScheme="yellow" type="submit">
            Save
          </Button>
          <Button ml={3}>Cancel</Button>
        </Box>
      </Box>
    </SettingsShell>
  );
};

export default ProfileEditPage;
