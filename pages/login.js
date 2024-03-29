import {
  Stack,
  Flex,
  Heading,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Divider,
  Text,
  Link
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/lib/auth';
import Page from '@/components/Page';
import SignupShell from '@/components/Signup/SignupShell';

const Login = () => {
  const auth = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm();

  const onSubmit = (values) => {
    auth.loginWithEmail(values.email, values.password);
  };

  return (
    <SignupShell>
      <Heading as="h1" size="2xl">
        Log in
      </Heading>
      <Flex mt={16} w="100%" direction="column">
        <Stack spacing={5} as="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email}>
            <Input
              type="email"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <Input
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 5,
                  message: 'Password must be at least 5 characters long'
                }
              })}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          <Button colorScheme="yellow" type="submit">
            Log in with Email
          </Button>
        </Stack>

        <Divider my={10} />
        <Flex w="100%" direction="column">
          <Button onClick={(e) => auth.loginWithGoogle()}>
            Log in with Google
          </Button>
        </Flex>
        <Text mt={14} align="center">
          Already have an account?{' '}
          <NextLink href="/signup" passHref>
            <Link color="yellow.500">Sign up</Link>
          </NextLink>
        </Text>
      </Flex>
    </SignupShell>
  );
};

const LoginPage = () => (
  <Page name="Login" path="/login">
    <Login />
  </Page>
);

export default LoginPage;
