function createLogForms() {
  const forms = document.forms

  let log = [];

  for (let iforms = 0; iforms < forms.length; iforms++) {
    const formElements = forms[iforms].elements;

    log.push({
      form: {
        id: forms[iforms].id,
        name: forms[iforms].name,
        action: forms[iforms].action,
        method: forms[iforms].method,
        target: forms[iforms].target,
        nodes: []
      }
    });

    for (let ielem = 0; ielem < formElements.length; ielem++) {
      let value = formElements[ielem].value;

      if (formElements[ielem].type === 'checkbox' || formElements[ielem].type === 'radio') {
        value = formElements[ielem].checked;
      }

      if (formElements[ielem].type === 'select-multiple') {
        let valuesMultipleSelect = [];

        for (let iselects = 0; iselects < formElements[ielem].selectedOptions.length; iselects++) {
          const multipleSelects = formElements[ielem].selectedOptions[iselects];
          valuesMultipleSelect.push({
            value: multipleSelects.value,
            innerHtml: multipleSelects.text
          });
        }

        value = valuesMultipleSelect;
      }

      let labels = [];

      if (formElements[ielem].labels !== null) {
        for (let ilabel = 0; ilabel < formElements[ielem].labels.length; ilabel++) {
          labels.push({
            innerHtml: formElements[ielem].labels[ilabel].innerHTML,
            class: formElements[ielem].labels[ilabel].className,
            id: formElements[ielem].labels[ilabel].id,
            htmlFor: formElements[ielem].labels[ilabel].htmlFor
          })
        }
      }

      log[iforms].form.nodes.push({
        label: labels,
        tagName: formElements[ielem].tagName.toLowerCase(),
        type: formElements[ielem].type,
        name: formElements[ielem].name,
        id: formElements[ielem].id,
        class: formElements[ielem].className,
        value: value
      });
    }
  }

  const parsedLog = log.map(log => {
    return ({
      ...log.form,
      nodes: log.form.nodes.filter(node => {
        if (node.type === 'submit' || node.type === 'button') {
          return false;
        }

        return true;
      })
    })
  });

  return JSON.stringify(parsedLog);
}

function showLogFormsInHtml(id_container, log) {
  const container = document.getElementById(id_container);
  const jsonLog = JSON.parse(log);

  jsonLog.map(data => {
    const form = document.createElement('div');

    form.id = data.id;
    form.style.maxWidth = '600px';
    form.style.margin = '0 auto';

    data.nodes.map(node => {
      const inputBox = document.createElement('div');
      inputBox.style.marginTop = '15px';
      inputBox.style.display = 'flex';
      inputBox.style.justifyContent = 'center';
      inputBox.style.flexDirection = 'column';

      form.appendChild(inputBox);

      node.label.map(label => {
        const labelHtml = document.createElement('label');
        labelHtml.innerHTML = label.innerHtml;
        labelHtml.htmlFor = label.htmlFor;
        labelHtml.id = label.id;
        labelHtml.className = label.class;
        labelHtml.style.marginBottom = '5px';

        inputBox.appendChild(labelHtml);
      });

      const input = document.createElement(node.tagName);
      input.type = node.type;
      input.value = node.value;
      input.id = node.id;
      input.className = node.class;
      input.disabled = true;

      if (node.type === 'select-one') {
        const option = document.createElement('option');
        option.innerHTML = node.value;
        option.selected = true;

        input.appendChild(option);
      }

      if (node.type === 'select-multiple') {
        input.multiple = true;

        node.value.map(multiple => {
          const option = document.createElement('option');
          option.value = multiple.value;
          option.innerHTML = multiple.innerHtml;
          option.selected = true;

          input.appendChild(option);
        });
      }

      if (node.type === 'checkbox' || node.type === 'radio') {
        input.checked = node.value;
      }

      inputBox.appendChild(input);
    });

    container.appendChild(form);
  });
}
