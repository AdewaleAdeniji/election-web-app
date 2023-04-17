import React, { useState } from 'react';

import {
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
} from '@mui/material';


const FormModal = ({ open, handleClose }) => {

  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');

  const handleField1Change = (event) => {
    setField1(event.target.value);
  };

  const handleField2Change = (event) => {
    setField2(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted!', field1, field2);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div >
          <form onSubmit={handleSubmit}>
            <TextField
              label="Field 1"
              value={field1}
              onChange={handleField1Change}
              variant="outlined"
              required
            />
            <TextField
              label="Field 2"
              value={field2}
              onChange={handleField2Change}
              variant="outlined"
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default FormModal;
