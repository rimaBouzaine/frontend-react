import React, { useEffect, useState } from 'react';
import { getWithExpiry } from '../../util/localstorage';
import axios from 'axios';
import yaml from 'js-yaml';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const TemplateForm = () => {
  const defaultYamlTemplate = `
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
  const [errors, setErrors] = useState({});
  const [yamlTemplate, setYamlTemplate] = useState(defaultYamlTemplate);

  const validateFields = () => {
    const newErrors = {};
    if (!name || name.length == 0) newErrors.name = 'Name is required';
    if (!crd || crd.length == 0) newErrors.crd = 'CRD is required';
    if (!targets || targets.length == 0)
      newErrors.targets = 'Targets are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateTemplate = () => {
    //if (!validateFields()) return;

    const templateWithUserInput = yamlTemplate
      .replace('<NAME_PLACEHOLDER>', name)
      .replace('<CRD_PLACEHOLDER>', crd)
      .replace('<TARGETS_PLACEHOLDER>', targets);

    const parsedYaml = yaml.load(templateWithUserInput);

    const yamlString = yaml.dump(parsedYaml);

    const blob = new Blob([yamlString], { type: 'text/yaml' });
    saveAs(blob, 'new-template.yaml');
  };

  const createTemplate = () => {
    if (!validateFields()) return;

    const url = `http://34.201.165.156/proxy/apis/templates.gatekeeper.sh/v1/constrainttemplates/`;
    /*const data = {
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
    };*/

    // chnoma 7ejet eli bedelhom ?
    //hadha exemple ta3 gatekeeper kima fama limit fama request donc
    //de facon auto 
    //kahaw
    //nnjareb
    const data = 
      {
        "apiVersion": "templates.gatekeeper.sh/v1",
        "kind": "ConstraintTemplate",
        "metadata": {
          "name": name,  
          "annotations": {
            "metadata.gatekeeper.sh/title": "Container Limits",
            "metadata.gatekeeper.sh/version": "1.0.1",
            "description": "Requires containers to have memory and CPU limits set and constrains limits to be within the specified maximum values.\n\nhttps://kubernetes.io/docs/concepts/configuration/manage-resources-containers/"
          }
        },
        "spec": {
          "crd": {
            "spec": {
              "names": {
                "kind": name
              },
              "validation": {
                "openAPIV3Schema": {
                  "type": "object",
                  "properties": {
                    "exemptImages": {
                      "description": "Any container that uses an image that matches an entry in this list will be excluded from enforcement. Prefix-matching can be signified with `*`. For example: `my-image-*`.\n\nIt is recommended that users use the fully-qualified Docker image name (e.g. start with a domain name) in order to avoid unexpectedly exempting images from an untrusted repository.",
                      "type": "array",
                      "items": {
                        "type": "string"
                      }
                    },
                    "cpu": {
                      "description": "The maximum allowed cpu limit on a Pod, exclusive.",
                      "type": "string"
                    },
                    "memory": {
                      "description": "The maximum allowed memory limit on a Pod, exclusive.",
                      "type": "string"
                    }
                  }
                }
              }
            }
          },
          "targets": [
            {
              "target": "admission.k8s.gatekeeper.sh",
              "rego": "package "+name+ "\n\nimport data.lib.exempt_container.is_exempt\n\nmissing(obj, field) = true {\n  not obj[field]\n}\n\nmissing(obj, field) = true {\n  obj[field] == \"\"\n}\n\ncanonify_cpu(orig) = new {\n  is_number(orig)\n  new := orig * 1000\n}\n\ncanonify_cpu(orig) = new {\n  not is_number(orig)\n  endswith(orig, \"m\")\n  new := to_number(replace(orig, \"m\", \"\"))\n}\n\ncanonify_cpu(orig) = new {\n  not is_number(orig)\n  not endswith(orig, \"m\")\n  regex.match(\"^[0-9]+(\\.[0-9]+)?$\", orig)\n  new := to_number(orig) * 1000\n}\n\n# 10 ** 21\nmem_multiple(\"E\") = 1000000000000000000000 { true }\n\n# 10 ** 18\nmem_multiple(\"P\") = 1000000000000000000 { true }\n\n# 10 ** 15\nmem_multiple(\"T\") = 1000000000000000 { true }\n\n# 10 ** 12\nmem_multiple(\"G\") = 1000000000000 { true }\n\n# 10 ** 9\nmem_multiple(\"M\") = 1000000000 { true }\n\n# 10 ** 6\nmem_multiple(\"k\") = 1000000 { true }\n\n# 10 ** 3\nmem_multiple(\"\") = 1000 { true }\n\n# Kubernetes accepts millibyte precision when it probably shouldn't.\n# https://github.com/kubernetes/kubernetes/issues/28741\n# 10 ** 0\nmem_multiple(\"m\") = 1 { true }\n\n# 1000 * 2 ** 10\nmem_multiple(\"Ki\") = 1024000 { true }\n\n# 1000 * 2 ** 20\nmem_multiple(\"Mi\") = 1048576000 { true }\n\n# 1000 * 2 ** 30\nmem_multiple(\"Gi\") = 1073741824000 { true }\n\n# 1000 * 2 ** 40\nmem_multiple(\"Ti\") = 1099511627776000 { true }\n\n# 1000 * 2 ** 50\nmem_multiple(\"Pi\") = 1125899906842624000 { true }\n\n# 1000 * 2 ** 60\nmem_multiple(\"Ei\") = 1152921504606846976000 { true }\n\nget_suffix(mem) = suffix {\n  not is_string(mem)\n  suffix := \"\"\n}\n\nget_suffix(mem) = suffix {\n  is_string(mem)\n  count(mem) > 0\n  suffix := substring(mem, count(mem) - 1, -1)\n  mem_multiple(suffix)\n}\n\nget_suffix(mem) = suffix {\n  is_string(mem)\n  count(mem) > 1\n  suffix := substring(mem, count(mem) - 2, -1)\n  mem_multiple(suffix)\n}\n\nget_suffix(mem) = suffix {\n  is_string(mem)\n  count(mem) > 1\n  not mem_multiple(substring(mem, count(mem) - 1, -1))\n  not mem_multiple(substring(mem, count(mem) - 2, -1))\n  suffix := \"\"\n}\n\nget_suffix(mem) = suffix {\n  is_string(mem)\n  count(mem) == 1\n  not mem_multiple(substring(mem, count(mem) - 1, -1))\n  suffix := \"\"\n}\n\nget_suffix(mem) = suffix {\n  is_string(mem)\n  count(mem) == 0\n  suffix := \"\"\n}\n\ncanonify_mem(orig) = new {\n  is_number(orig)\n  new := orig * 1000\n}\n\ncanonify_mem(orig) = new {\n  not is_number(orig)\n  suffix := get_suffix(orig)\n  raw := replace(orig, suffix, \"\")\n  regex.match(\"^[0-9]+(\\.[0-9]+)?$\", raw)\n  new := to_number(raw) * mem_multiple(suffix)\n}\n\nviolation[{\"msg\": msg}] {\n  general_violation[{\"msg\": msg, \"field\": \"containers\"}]\n}\n\nviolation[{\"msg\": msg}] {\n  general_violation[{\"msg\": msg, \"field\": \"initContainers\"}]\n}\n\n# Ephemeral containers not checked as it is not possible to set field.\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  cpu_orig := container.resources.limits.cpu\n  not canonify_cpu(cpu_orig)\n  msg := sprintf(\"container <%v> cpu limit <%v> could not be parsed\", [container.name, cpu_orig])\n}\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  mem_orig := container.resources.limits.memory\n  not canonify_mem(mem_orig)\n  msg := sprintf(\"container <%v> memory limit <%v> could not be parsed\", [container.name, mem_orig])\n}\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  not container.resources\n  msg := sprintf(\"container <%v> has no resource limits\", [container.name])\n}\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  not container.resources.limits\n  msg := sprintf(\"container <%v> has no resource limits\", [container.name])\n}\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  missing(container.resources.limits, \"cpu\")\n  msg := sprintf(\"container <%v> has no cpu limit\", [container.name])\n}\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  missing(container.resources.limits, \"memory\")\n  msg := sprintf(\"container <%v> has no memory limit\", [container.name])\n}\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  cpu_orig := container.resources.limits.cpu\n  cpu := canonify_cpu(cpu_orig)\n  max_cpu_orig := input.parameters.cpu\n  max_cpu := canonify_cpu(max_cpu_orig)\n  cpu > max_cpu\n  msg := sprintf(\"container <%v> cpu limit <%v> is higher than the maximum allowed of <%v>\", [container.name, cpu_orig, max_cpu_orig])\n}\n\ngeneral_violation[{\"msg\": msg, \"field\": field}] {\n  container := input.review.object.spec[field][_]\n  not is_exempt(container)\n  mem_orig := container.resources.limits.memory\n  mem := canonify_mem(mem_orig)\n  max_mem_orig := input.parameters.memory\n  max_mem := canonify_mem(max_mem_orig)\n  mem > max_mem\n  msg := sprintf(\"container <%v> memory limit <%v> is higher than the maximum allowed of <%v>\", [container.name, mem_orig, max_mem_orig])\n}"
            }
          ],
          "libs": [
            "package lib.exempt_container\n\nis_exempt(container) {\n    exempt_images := object.get(object.get(input, \"parameters\", {}), \"exemptImages\", [])\n    img := container.image\n    exemption := exempt_images[_]\n    _matches_exemption(img, exemption)\n}\n\n_matches_exemption(img, exemption) {\n    not endswith(exemption, \"*\")\n    exemption == img\n}\n\n_matches_exemption(img, exemption) {\n    endswith(exemption, \"*\")\n    prefix := trim_suffix(exemption, \"*\")\n    startswith(img, prefix)\n}"
          ]
        }
      }
      
    
    axios
      .post(url, data, {
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

  const ymlchanged = (e) => {
    const value = e.target.value;
    setYamlTemplate(value);
    const parsedYaml = yaml.load(value);

    const n = parsedYaml.metadata.name;
    const c = parsedYaml.spec.crd;
    const t = parsedYaml.spec.targets;

    setName(n);
    setTargets(t);
    setCrd(c);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Create new Template</h1>
      <textarea
        value={yamlTemplate}
        onChange={(e) => ymlchanged(e)}
        rows="10"
        className="w-full  bg-gray-100 border border-gray-300 p-4 rounded mb-4"
      />
      {/*   <div className="bg-gray-100 border border-gray-300 p-4 rounded mb-4 hidden">
        {renderYamlWithInputs(yamlTemplate)}
      </div> */}
      {errors.name && <div className="text-red-500 mb-4">{errors.name}</div>}
      {errors.crd && <div className="text-red-500 mb-4">{errors.crd}</div>}
      {errors.targets && (
        <div className="text-red-500 mb-4">{errors.targets}</div>
      )}

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
          onClick={createTemplate}
        >
          Create
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

export default TemplateForm;