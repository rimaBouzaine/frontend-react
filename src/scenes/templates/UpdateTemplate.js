import React, { useState, useEffect } from 'react';
import { getWithExpiry } from '../../util/localstorage';
import axios from 'axios';
import yaml from 'js-yaml';
import { saveAs } from 'file-saver';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';

const UpdateTemplateForm = () => {
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
  const { id } = useParams(); // Assuming the template ID is passed as a route parameter
  const [crd, setCrd] = useState('');
  const [name, setName] = useState('');
  const [targets, setTargets] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(
        `http://34.204.91.115/proxy/apis/templates.gatekeeper.sh/v1/constrainttemplates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getWithExpiry('kubeToken')}`,
          },
        }
      );

      const template = response.data;
      setName(template.metadata.name);
      setCrd(template.metadata.name);

      setTargets(template.metadata.name);

      //    setCrd(yaml.dump(template.spec.crd));
      //  setTargets(template.spec.targets.map((target) => target.rego).join('\n'));
    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!crd) newErrors.crd = 'CRD is required';
    if (!targets) newErrors.targets = 'Targets are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateTemplate = () => {
    if (!validateFields()) return;

    const templateWithUserInput = initialYamlTemplate
      .replace('<NAME_PLACEHOLDER>', name)
      .replace('<CRD_PLACEHOLDER>', crd)
      .replace('<TARGETS_PLACEHOLDER>', targets);

    const parsedYaml = yaml.load(templateWithUserInput);
    const yamlString = yaml.dump(parsedYaml);
    const blob = new Blob([yamlString], { type: 'text/yaml' });
    saveAs(blob, 'edited-template.yaml');
  };

  const updateTemplate = () => {
    if (!validateFields()) return;

    const url = `http://34.204.91.115/proxy/apis/templates.gatekeeper.sh/v1/constrainttemplates/k8scontainerlimits`;
    /*  const data = {
      apiVersion: 'templates.gatekeeper.sh/v1',
      kind: 'ConstraintTemplate',
      metadata: {
        name: name,
      },
      spec: {
        crd: yaml.load(crd),
        targets: targets.split('\n').map((target) => ({
          rego: target,
          target: 'admission.k8s.gatekeeper.sh',
        })),
      },
    };
*/

    // TODO: it return error  422 ;
    const data = {
      apiVersion: 'templates.gatekeeper.sh/v1',
      kind: 'ConstraintTemplate',
      metadata: {
        name: name,
      },
      spec: {
        crd: {
          spec: {
            names: {
              kind: name,
            },
            validation: {
              openAPIV3Schema: {
                properties: {
                  invalidName: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        targets: [
          {
            rego: `package ${name}s\nviolation[{"msg": msg}] {\n  input.review.object.metadata.name == input.parameters.invalidName\n  msg := sprintf("The name %v is not allowed", [input.parameters.invalidName])\n}\n`,
            target: 'admission.k8s.gatekeeper.sh',
          },
        ],
      },
    };
    axios
      .put(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getWithExpiry('kubeToken')}`,
        },
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          navigate('/frontend/templates');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const renderYamlWithInputs = (yamlString) => {
    return yamlString.split('\n').map((line, index) => {
      if (line.includes('<CRD_PLACEHOLDER>')) {
        return (
          <div key={index} className="flex">
            <span className="w-10 text-right mr-4 text-gray-500">
              {index + 1}
            </span>
            <span className="whitespace-pre">
              {line.split('<CRD_PLACEHOLDER>')[0]}
              <input
                type="text"
                value={crd}
                onChange={(e) => setCrd(e.target.value)}
                placeholder="Enter CRD"
                className="ml-2 px-2 py-1 bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {line.split('<CRD_PLACEHOLDER>')[1]}
            </span>
            {errors.crd && (
              <span className="text-red-500 ml-2">{errors.crd}</span>
            )}
          </div>
        );
      }
      if (line.includes('<NAME_PLACEHOLDER>')) {
        return (
          <div key={index} className="flex">
            <span className="w-10 text-right mr-4 text-gray-500">
              {index + 1}
            </span>
            <span className="whitespace-pre">
              {line.split('<NAME_PLACEHOLDER>')[0]}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="ml-2 px-2 py-1 bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {line.split('<NAME_PLACEHOLDER>')[1]}
            </span>
            {errors.name && (
              <span className="text-red-500 ml-2">{errors.name}</span>
            )}
          </div>
        );
      }
      if (line.includes('<TARGETS_PLACEHOLDER>')) {
        return (
          <div key={index} className="flex">
            <span className="w-10 text-right mr-4 text-gray-500">
              {index + 1}
            </span>
            <span className="whitespace-pre">
              {line.split('<TARGETS_PLACEHOLDER>')[0]}
              <input
                type="text"
                value={targets}
                onChange={(e) => setTargets(e.target.value)}
                placeholder="Enter targets"
                className="ml-2 px-2 py-1 bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {line.split('<TARGETS_PLACEHOLDER>')[1]}
            </span>
            {errors.targets && (
              <span className="text-red-500 ml-2">{errors.targets}</span>
            )}
          </div>
        );
      }
      return (
        <div key={index} className="flex">
          <span className="w-10 text-right mr-4 text-gray-500">
            {index + 1}
          </span>
          <span className="whitespace-pre">{line}</span>
        </div>
      );
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Edit Template</h1>
      <div className="bg-gray-100 border border-gray-300 p-4 rounded mb-4">
        {renderYamlWithInputs(initialYamlTemplate)}
      </div>
      {errors.match && <div className="text-red-500 mb-4">{errors.match}</div>}
      <button
        onClick={handleGenerateTemplate}
        className="px-4 py-2 bg-blue-500 text-white rounded shadow"
      >
        Generate Template
      </button>
      <div className="mx-2 my-8 flex w-full justify-end gap-5">
        <Button
          color="primary"
          variant="contained"
          className="float-right m-4"
          onClick={updateTemplate}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate('/frontend/templates')}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UpdateTemplateForm;
