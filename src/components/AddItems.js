import React from 'react'
import { Button, TextField } from '@material-ui/core'

function AddItems() {
  return (
    <form
      name="add-items"
      autoComplete="off"
      noValidate
      // onSubmit={}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <h4 style={{ textAlign: 'center', marginBottom: 0 }}>Add items</h4>
      <TextField
        required
        id="name"
        label="name"
        // value={this.state.form.title}
        // onChange={this.handleChange('title')}
        margin="normal"
        variant="outlined"
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        style={{ marginTop: '1rem' }}
      >
        Submit
      </Button>
    </form>
  )
}

export default AddItems
