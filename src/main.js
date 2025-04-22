import * as ace from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import jsyaml from "js-yaml";

// JSON Editor
const ecsEditor = ace.edit("ecsEditor");
ecsEditor.setTheme("ace/theme/github");
ecsEditor.session.setMode("ace/mode/json");
ecsEditor.setValue('{\n  "containerDefinitions": []\n}', -1);

// YAML Editor
const yamlEditor = ace.edit("yamlEditor");
yamlEditor.setTheme("ace/theme/github");
yamlEditor.session.setMode("ace/mode/yaml");

function convertEcsToDockerCompose(taskDef) {
  const compose = {
    version: "3",
    services: {},
    volumes: {}
  };

  taskDef.containerDefinitions.forEach(container => {
    const envVars = {};

    container.environment?.forEach(env => {
      envVars[env.name] = env.value;
    });

    container.secrets?.forEach(secret => {
      envVars[secret.name] = secret.valueFrom || "REPLACE_WITH_SECRET";
    });

    const service = {
      image: container.image,
      ports: container.portMappings?.map(p => `${p.hostPort || p.containerPort}:${p.containerPort}`),
      environment: envVars,
      volumes: container.mountPoints?.map(mp => `${mp.sourceVolume}:${mp.containerPath}`),
      depends_on: container.dependsOn?.map(d => d.containerName),
    };

    compose.services[container.name] = service;
  });

  taskDef.volumes?.forEach(vol => {
    compose.volumes[vol.name] = {
      driver: "local",
      driver_opts: {
        device: vol.host?.sourcePath || "",
        o: "bind",
        type: "none"
      }
    };
  });

  const yaml = jsyaml.dump(compose, { lineWidth: -1 });
  return { dockerCompose: yaml };
}

document.getElementById("convertBtn").addEventListener("click", () => {
  try {
    const ecsJson = JSON.parse(ecsEditor.getValue());
    const { dockerCompose } = convertEcsToDockerCompose(ecsJson);
    yamlEditor.setValue(dockerCompose, -1);
  } catch (err) {
    alert("Invalid JSON or conversion error: " + err.message);
  }
});
