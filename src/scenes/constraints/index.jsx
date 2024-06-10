import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Card from "../../components/Card";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getWithExpiry } from '../../util/localstorage';
import React, { useEffect, useState } from 'react';

const Constraints = () => {
  const navigate = useNavigate();
  const [names, setNames] = useState([]);
  
  useEffect(() => {
    const baseUrl = `http://35.174.184.249/proxy/apis/constraints.gatekeeper.sh/v1beta1/`;

    axios.get(baseUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getWithExpiry("kubeToken")}`,
      }
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          const rs = response.data.items || [];
          console.log('Fetched items:', rs);
          setNames(rs);
        }
      })
      .catch(error => {
        console.error('Error fetching constraints:', error);
      });
  }, []);

  const list = Array.isArray(names) ? names.map(obj => obj.metadata.name) : [];

  const theme = useTheme();
  return (
    <Box>
      <Header title="Constraints" />
      <div className="mx-2 my-8">
        <span>List of Constraints</span>
        <Button 
          color="primary" 
          variant="contained" 
          className="float-right m-4" 
          onClick={() => navigate('/frontend/constraints/create')}
        >
          Create Constraint
        </Button>
      </div>
      {list.length === 0 ? (
        <div className="text-center text-gray-500">No constraints found </div>
      ) : (
        <div className="flex flex-col gap-2">
          {list.map((n) => <Card key={n} nameT={n}></Card>)}
        </div>
      )}
    </Box>
  );
};

export default Constraints;