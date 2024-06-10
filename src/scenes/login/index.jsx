import { Button, TextField, Link, Box } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { setWithExpiry } from '../../util/localstorage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const validationSchema = yup.object({
  username: yup
    .string('Enter your username')
    .required('Username is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required'),
});


const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlePasswordLogin(values);
    },
  });

  const handlePasswordLogin = async (values) => {
    try {
      const { username, password } = values;
      const response = await axios.post(`http://52.87.154.156/login`, {
        username,
        password
      });
      console.log(" response ", response)

      if (response.status ==200) {
        setWithExpiry('userToken', response.data.userToken);
        setWithExpiry('kubeToken', response.data.kubeToken);

        navigate('/frontend');
      } else {
        throw Error(await response.text());
      }
    } catch (error) {

      alert('Login failed. Please check your credentials.', error);

    }
  };





  return (
    <div className="flex h-full w-full  ">
      <div className="w-2/6 m-auto h-full flex flex-col justify-center ">
        <h1 className='text-center font-bold text-4xl mb-12' > Welcome</h1>
        <form
          onSubmit={formik.handleSubmit}
          className=" flex flex-col justify-between h-40 ml-5 gap-2"
        >
          <TextField
            fullWidth
            id="username"
            name="username"
            label="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean (formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button color="primary" variant="contained" fullWidth type="submit"
          >
            Submit
          </Button>
          
        </form>

      </div>
    </div>
  );
};

export default Login;