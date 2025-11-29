import { styled } from '@mui/material/styles';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

const TextFieldStyled = styled(TextField)`
  input {
    text-align: center;
  }
`;

const TextFieldBox = (props: TextFieldProps) => <TextFieldStyled {...props} />;

export default TextFieldBox;
