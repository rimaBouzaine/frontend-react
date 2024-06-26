import { Box, useTheme } from '@mui/material';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getWithExpiry } from '../../util/localstorage';
import React, { useEffect, useState } from 'react';

const Templates = () => {
  const navigate = useNavigate();
  const [names, setNames] = useState([]);

  useEffect(() => {
    const baseUrl = `http://34.204.91.115/proxy/apis/templates.gatekeeper.sh/v1/constrainttemplates`;

    axios
      .get(baseUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getWithExpiry('kubeToken')}`,
        },
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const rs = response.data.items;
          setNames(rs);
        }
      });
  }, []);

  const list = names.map((obj) => obj.metadata.name);

  function deleteConstraintTemplate(nameTemplate) {
    const baseUrl = `http://34.204.91.115/proxy/apis/templates.gatekeeper.sh/v1/constrainttemplates/`;
    const deleteUrl = `${baseUrl}${nameTemplate}`;

    axios
      .delete(deleteUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getWithExpiry('kubeToken')}`,
        },
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const updatedItems = names.filter(
            (obj) => obj.metadata.name !== nameTemplate
          );
          setNames(updatedItems);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error details:', error.response.data);
        }
      });
  }

  return (
    <Box>
      <Header title="Templates" />
      <div className="mx-2 my-8">
        <span>List of Templates</span>
        <Button
          color="primary"
          variant="contained"
          className="float-right m-4"
          onClick={() => {
            navigate('/frontend/templates/create');
          }}
        >
          Create Template
        </Button>
      </div>
      {list.length === 0 ? (
        <div className="text-center text-gray-500">No Templates found</div>
      ) : (
        <div className="flex flex-col gap-2">
          {list.map((n) => (
            <Card
              key={n}
              nameT={n}
              deleteConstraintTemplate={() => deleteConstraintTemplate(n)}
              updateConstraintTemplate={() => {
                navigate('/frontend/templates/edit/' + n);
              }}
            ></Card>
          ))}
        </div>
      )}
    </Box>
  );
};

export default Templates;
