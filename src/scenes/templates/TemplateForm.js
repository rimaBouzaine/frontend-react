import React, { useState } from 'react';
import { getWithExpiry } from '../../util/localstorage';

import axios from 'axios';
import yaml from 'js-yaml';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const TemplateForm = () => {
  const initialYamlTemplate = `
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata:
  name: <NAME_PLACEHOLDER>
  annotations: key:string
  labels: key:string
spec:
  crd: <CRD_PLACEHOLDER>
  targets: <TARGETS_PLACEHOLDER>
`;
  const navigate = useNavigate();

  const [crd, setCrd] = useState('');
  const [name, setName] = useState('');

  const [targets, setTargets] = useState('');

  const handleGenerateTemplate = () => {
    const templateWithUserInput = initialYamlTemplate
      .replace('<CRD_PLACEHOLDER>', crd)
      .replace('<TARGETS_PLACEHOLDER>', targets);

    const parsedYaml = yaml.load(templateWithUserInput);

    const yamlString = yaml.dump(parsedYaml);
    const blob = new Blob([yamlString], { type: 'text/yaml' });
    saveAs(blob, 'new-template.yaml');
  };







  const createTemplate = () => {

console.log(" name ", name );
console.log("crd ", crd);
console.log("targets ", targets);


    const url = `http://52.91.128.116/proxy/apis/templates.gatekeeper.sh/v1beta1/constrainttemplates/`;
    const data = {
      "apiVersion": "templates.gatekeeper.sh/v1beta1",
      "kind": "ConstraintTemplate",
      "metadata": {
        "name": name
      },
      "spec": {
        "crd": {
          "spec": {
            "names": {
              "kind": name
            },
            "validation": {
              "openAPIV3Schema": {
                "properties": {
                  "invalidName": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "targets": [
          {
            "rego": `package ${name}s\nviolation[{\"msg\": msg}] {\n  input.review.object.metadata.name == input.parameters.invalidName\n  msg := sprintf(\"The name %v is not allowed\", [input.parameters.invalidName])\n}\n`,
            "target": "admission.k8s.gatekeeper.sh"
          }
        ]
      }
    };

    // Make the POST request using Axios
    axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getWithExpiry("kubeToken")}`
      }
    })
      .then(response => {

if( response.status >= 200 && response.status < 300)
  {
    navigate("/frontend/templates")
  }
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }



  const renderYamlWithInputs = (yamlString) => {
    return yamlString.split('\n').map((line, index) => {
      if (line.includes('<CRD_PLACEHOLDER>')) {
        return (
          <div key={index} className="flex">
            <span className="w-10 text-right mr-4 text-gray-500">{index + 1}</span>
            <span className="whitespace-pre">
              {line.split('<CRD_PLACEHOLDER>')[0]}
              <input
                type="text"
                value={crd}
                onChange={(e) => setCrd(e.target.value)}
                placeholder='saisir CRD'
                className="ml-2 px-2 py-1  bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {line.split('<CRD_PLACEHOLDER>')[1]}
            </span>
          </div>
        );
      } 
      
        if (line.includes('<NAME_PLACEHOLDER>')) {
          return (
            <div key={index} className="flex">
              <span className="w-10 text-right mr-4 text-gray-500">{index + 1}</span>
              <span className="whitespace-pre">
                {line.split('<NAME_PLACEHOLDER>')[0]}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='saisir name'
                  className="ml-2 px-2 py-1  bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {line.split('<NAME_PLACEHOLDER>')[1]}
              </span>
            </div>
          );
        }
    
      
      
      else if (line.includes('<TARGETS_PLACEHOLDER>')) {
        return (
          <div key={index} className="flex">
            <span className="w-10 text-right mr-4 text-gray-500">{index + 1}</span>
            <span className="whitespace-pre">
              {line.split('<TARGETS_PLACEHOLDER>')[0]}
              <input

                type="text"
                value={targets}
                onChange={(e) => setTargets(e.target.value)}
                placeholder='saisir Targets'

                className="ml-2 px-2 py-1  bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {line.split('<TARGETS_PLACEHOLDER>')[1]}
            </span>
          </div>
        );
   
   
   
      } 
      
    
      
      else {
        return (
          <div key={index} className="flex">
            <span className="w-10 text-right mr-4 text-gray-500">{index + 1}</span>
            <span className="whitespace-pre">{line}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Create new Template</h1>
      <div className="bg-gray-100 border border-gray-300 p-4 rounded mb-4">
        {renderYamlWithInputs(initialYamlTemplate)}
      </div>
      <button
        onClick={handleGenerateTemplate}
        className="px-4 py-2 bg-blue-500 text-white rounded shadow"
      >
        Generate Template
      </button>
      <div className="mx-2 my-8 flex w-full justify-end gap-5">
        <Button color="primary" variant="contained" className="float-right m-4"
          onClick={() => { createTemplate() }} >
          Create </Button>
          <Button variant="contained" color="error" onClick={()=>{
            navigate("/frontend/templates")
          }}>
              Cancel
            </Button>
     
      </div>
    </div>

  );
};


export default TemplateForm;
