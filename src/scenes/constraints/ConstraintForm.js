import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { TextField, MenuItem, Button } from "@mui/material";
import * as Yup from "yup";
import { DeveloperBoard } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";

import { FormControl, InputLabel, Select, Box } from "@mui/material";

const templates = [
  { value: "gatekeeper-system", label: "Gatekeeper System" },
  { value: "ingress-nginx", label: "Ingress Nginx" },
  { value: "kubernetes", label: "Kubernetes" },
];

const initialValues = {
  name: "",
  description: "",
  template: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  template: Yup.string().required("Template is required"),
});

const ConstraintForm = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [scope, setScope] = useState("");
  const [name, setName] = useState("");
  const [api, setApi] = useState("");
  const [kind, setKind] = useState("");

  const [disabledApi, setDisabledApi] = useState(true);
  const [disabledKind, setDisabledKind] = useState(true);

  const [excludedtemplates, setExcludedtemplates] = useState("");

  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const handleScopeChange = (event) => {
    setScope(event.target.value);
  };

  const handleApiChange = (event) => {
    setApi(event.target.value);
  };

  const handleKindChange = (event) => {
    setKind(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleExcludedtemplatesChange = (event) => {
    setExcludedtemplates(event.target.value);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ values, errors, touched, handleChange }) => (
        <Form className="w-5/6">
          <h1 className="text-3xl font-bold text-center my-8">
            {" "}
            Create new Constraint
          </h1>
          <div className="w-full   flex  pl-4 gap-5">
            <div className="flex" style={{ flex: 1 }}>
              <Field
                as={TextField}
                type="text"
                name="name"
                label="Name"
                variant="outlined"
                margin="normal"
                fullWidth
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex" style={{ flex: 2 }}>
              <Field
                as={TextField}
                type="text"
                name="description"
                label="Description"
                variant="outlined"
                margin="normal"
                fullWidth
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full   flex  pl-4 gap-5">
            <Field
              as={TextField}
              select
              name="template"
              label="Template"
              variant="outlined"
              margin="normal"
              fullWidth
              value={values.template}
              error={touched.template && !!errors.template}
              helperText={touched.template && errors.template}
              onChange={handleChange}
              required
            >
              {templates.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          </div>
          <div className="flex w-full">
            <div className=" w-2/6">
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}
                  >
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Namespaces" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedIndex === 1}
                    onClick={(event) => handleListItemClick(event, 1)}
                  >
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Role" />
                  </ListItemButton>
                </ListItem>
              </List>
            </div>
            {selectedIndex == 0 && (
              <div className=" flex flex-col pl-4 gap-4 w-full py-4">
                <FormControl fullWidth>
                  <InputLabel id="scope-label">Scope</InputLabel>
                  <Select
                    labelId="scope-label"
                    id="scope"
                    value={scope}
                    label="Scope"
                    onChange={handleScopeChange}
                  >
                    <MenuItem value="cluster">Cluster</MenuItem>
                    <MenuItem value="namespace">Namespace</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  id="name"
                  label="Name"
                  value={name}
                  onChange={handleNameChange}
                  fullWidth
                />

                <TextField
                  id="Excludedtemplates"
                  label="Excluded templates"
                  value={excludedtemplates}
                  onChange={handleExcludedtemplatesChange}
                  fullWidth
                />
              </div>
            )}

            {selectedIndex == 1 && (
              <div className="w-full flex flex-col gap-4 py-4">
                <div className="w-full   flex  pl-4 ">
                  <div className="flex  w-full">
                    <div className="h-full  ">
                      <div
                        className="w-16 h-full text-center items-center flex flex-col justify-center cursor-pointer bg-blue-400"
                        onClick={() => setDisabledApi(false)}
                      >
                        add api
                      </div>
                    </div>

                    <TextField
                      id="Api"
                      label="Api"
                      value={api}
                      onChange={handleApiChange}
                      disabled={disabledApi}
                      variant="filled" 
                      fullWidth
                    />

                    <div className="">
                      <div
                        className="w-16 h-full text-center items-center flex flex-col justify-center cursor-pointer bg-blue-400"

                        onClick={() => setDisabledKind(false)}
                      >
                        Add Kind
                      </div>
                    </div>

                    <TextField
                      id="Kind"
                      label="Kind"
                      value={kind}
                      onChange={handleKindChange}
                      disabled={disabledKind}
                      fullWidth
                      variant="filled" 

                    />
                  </div>
                </div>

                <div className="ml-4 mt-4">
                  <Button
                    type="submit"
                    className="m-4"
                    variant="contained"
                    color="primary"
                  >
                    Add role
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full  gap-4 my-4 justify-end">
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
            <Button variant="contained" color="error">
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ConstraintForm;
