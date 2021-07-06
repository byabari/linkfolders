import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  InputGroup
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const FileUpload = (props) => {
  const { register, accept, multiple, children } = props;
  const inputRef = React.useRef(null);
  const { ref, ...rest } = register;

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick}>
      <input
        type={'file'}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
      />
      <>{children}</>
    </InputGroup>
  );
};

const SettingsPhoto = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = handleSubmit((data) => console.log('On Submit: ', data));

  const validateFiles = (value) => {
    if (value.length < 1) {
      return 'Files is required';
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return 'Max file size 10mb';
      }
    }
    return true;
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <FormControl isInvalid={!!errors.file_} isRequired>
          <FormLabel>{'File input'}</FormLabel>

          {/* <InputGroup>
            <input
              hidden
              type="file"
              ref={(e) => {
                ref(e);
                inputRef.current = e;
              }}
              register={register('file_', { validate: validateFiles })}
            />
            <Button>Upload</Button>
          </InputGroup> */}
          <FileUpload
            accept={'image/*'}
            multiple
            register={register('file_', { validate: validateFiles })}
          >
            <Button>Upload</Button>
          </FileUpload>

          <FormErrorMessage>
            {errors.file_ && errors?.file_.message}
          </FormErrorMessage>
        </FormControl>

        <button>Submit</button>
      </form>
    </>
  );
};

export default SettingsPhoto;
