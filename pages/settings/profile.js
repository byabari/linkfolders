import {
  Box,
  Stack,
  Button,
  Text,
  Input,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useAuth } from '@/lib/auth';
import SettingsShell from '@/components/Settings/SettingsShell';
import SettingsHeader from '@/components/Settings/SettingsHeader';
import SettingsPhoto from '@/components/Settings/SettingsPhoto';
import SettingsUsername from '@/components/Settings/SettingsUsername';
import { uploadProfilePhoto } from '@/lib/storage';
import { updateProfile, updateProfileAndUsername } from '@/lib/db';

const ProfileEditPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = async (values) => {
    let photoUrl = null;
    if (!values.photo[0]) {
      if (
        (!values.name && !values.username) ||
        (values.name === auth?.user?.profile?.name &&
          values.username === auth?.user?.profile?.username)
      )
        router.push(`/${auth?.user?.profile?.username}`);
    } else {
      photoUrl = await uploadProfilePhoto(
        auth?.user?.profile?.id,
        values.photo[0]
      );
    }

    const newProfileHeader = {
      photoUrl: photoUrl ? photoUrl : auth?.user?.profile?.photoUrl,
      name: values.name ? values.name : auth?.user?.profile?.name,
      username: values.username
        ? values.username.toLowerCase()
        : auth?.user?.profile?.username
    };
    if (values.username === auth?.user?.profile?.username) {
      await updateProfile(auth?.user?.profile?.id, newProfileHeader);
    } else {
      await updateProfileAndUsername(
        auth?.user?.profile?.id,
        newProfileHeader,
        auth?.user?.profile?.username
      );
    }
    auth.updateProfileHeader(newProfileHeader);
    router.push(`/${newProfileHeader.username}`);
  };

  if (auth?.loading) {
    return (
      <SettingsShell>
        <Box mt={14}>
          <Spinner />
        </Box>
      </SettingsShell>
    );
  }

  if (!auth?.user) {
    router.push('/');
    return (
      <SettingsShell>
        <Box mt={14}>
          <Spinner />
        </Box>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell>
      <SettingsHeader name={'Edit profile'} />
      <Text minH="15px" mb={10}></Text>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={8} mb={12}>
          <SettingsPhoto register={register} errors={errors} />
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              defaultValue={auth?.user?.profile?.name}
              {...register('name')}
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
        <Button
          variant="ghost"
          ml={3}
          onClick={() => router.push(`/${auth?.user?.profile?.username}`)}
        >
          Cancel
        </Button>
      </Box>
    </SettingsShell>
  );
};

export default ProfileEditPage;
