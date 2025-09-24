function showNoMessage() {
  const noMessage = document.getElementById('noMessage');
  noMessage.classList.remove('hidden');

  setTimeout(() => {
    noMessage.classList.add('hidden');
  }, 4000);
}

function startChallenge() {
  sessionStorage.setItem('formStartTime', Date.now().toString());

  window.location.href = 'form.html';
}

function initializeSuccessPage() {
  const now = new Date();
  const submissionDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const referenceId = 'APP-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const submissionDateEl = document.getElementById('submissionDate');
  const referenceIdEl = document.getElementById('referenceId');

  if (submissionDateEl) submissionDateEl.textContent = submissionDate;
  if (referenceIdEl) referenceIdEl.textContent = referenceId;

  sessionStorage.setItem('applicationSubmitTime', Date.now().toString());
}

function nextPage() {
  createConfetti();
  setTimeout(() => {
    window.location.href = 'congratulations.html';
  }, 1000);
}

function createConfetti() {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.width = Math.random() * 8 + 6 + 'px';
      confetti.style.height = confetti.style.width;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1000';
      confetti.style.transition = 'all 3s ease-out';

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = window.innerHeight + 100 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 720}deg) translateX(${(Math.random() - 0.5) * 200}px)`;
        confetti.style.opacity = '0';
      }, 100);

      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      }, 3000);
    }, i * 30);
  }
}

function createEnhancedConfetti() {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.width = Math.random() * 8 + 5 + 'px';
      confetti.style.height = confetti.style.width;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '1000';
      confetti.style.transition = 'all 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = window.innerHeight + 100 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 1080}deg) translateX(${(Math.random() - 0.5) * 200}px)`;
        confetti.style.opacity = '0';
      }, 100);

      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      }, 4000);
    }, i * 30);
  }
}

let applicationForm, photoInput, photoPreview, govIdInput, govIdPreview;
let billingInput, billingPreview, signatureInput, signaturePreview;
let childrenList, addChildBtn, sameAsCheckbox, status;
let certifyCheckbox, submitBtn;

function initializeFormElements() {
  applicationForm = document.getElementById('applicationForm');
  photoInput = document.getElementById('photoInput');
  photoPreview = document.getElementById('photoPreview');
  govIdInput = document.getElementById('govIdInput');
  govIdPreview = document.getElementById('govIdPreview');
  billingInput = document.getElementById('billingInput');
  billingPreview = document.getElementById('billingPreview');
  signatureInput = document.getElementById('signatureInput');
  signaturePreview = document.getElementById('signaturePreview');
  childrenList = document.getElementById('childrenList');
  addChildBtn = document.getElementById('addChildBtn');
  sameAsCheckbox = document.getElementById('sameAsCurrent');
  status = document.getElementById('status');
  certifyCheckbox = document.getElementById('certify');
  submitBtn = document.getElementById('submitBtn');

  console.log('Form elements initialized:');
  console.log('- certifyCheckbox:', !!certifyCheckbox);
  console.log('- submitBtn:', !!submitBtn);
}

function toReadableSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function clearPreview(el) {
  el.innerHTML = '';
}

function previewFile(file, container, inputElement) {
  clearPreview(container);
  if (!file) return;

  const wrap = document.createElement('div');
  wrap.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-md border';

  const fileInfo = document.createElement('div');
  fileInfo.className = 'flex items-center space-x-3';

  const icon = document.createElement('div');
  icon.className = 'w-8 h-8 bg-blue-100 rounded flex items-center justify-center';
  icon.innerHTML = `<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
  </svg>`;

  const details = document.createElement('div');
  details.className = 'text-sm';
  details.innerHTML = `<div class="font-medium text-gray-900">${file.name}</div><div class="text-gray-500">${toReadableSize(file.size)}</div>`;

  fileInfo.appendChild(icon);
  fileInfo.appendChild(details);

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors';
  deleteBtn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
  </svg>`;
  deleteBtn.onclick = () => {
    inputElement.value = '';
    clearPreview(container);
    if (status) status.textContent = 'File removed';
  };

  wrap.appendChild(fileInfo);
  wrap.appendChild(deleteBtn);
  container.appendChild(wrap);
}

function previewImage(file, container) {
  previewFile(file, container, null);
}

function createChildRow(name = '', age = '') {
  const row = document.createElement('div');
  row.className = 'grid grid-cols-1 md:grid-cols-12 gap-2 items-center';

  const nameDiv = document.createElement('div');
  nameDiv.className = 'md:col-span-6';
  const nameLabel = document.createElement('label');
  nameLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
  nameLabel.textContent = 'Child Name';
  const nameIn = document.createElement('input');
  nameIn.type = 'text';
  nameIn.name = 'child_name[]';
  nameIn.placeholder = 'Enter child name';
  nameIn.value = name;
  nameIn.className = 'w-full';

  const inputStyle = {
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    lineHeight: '1.25rem',
    color: '#111827',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px rgba(16,24,40,0.03)',
    transition: 'border-color .15s ease, box-shadow .15s ease, transform .05s ease'
  };

  Object.assign(nameIn.style, inputStyle);

  nameIn.addEventListener('focus', function() {
    this.style.outline = 'none';
    this.style.borderColor = '#2563eb';
    this.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.08)';
    this.style.transform = 'translateY(-1px)';
  });
  nameIn.addEventListener('blur', function() {
    this.style.borderColor = '#e5e7eb';
    this.style.boxShadow = '0 1px 2px rgba(16,24,40,0.03)';
    this.style.transform = 'translateY(0)';
  });

  nameDiv.appendChild(nameLabel);
  nameDiv.appendChild(nameIn);

  const ageDiv = document.createElement('div');
  ageDiv.className = 'md:col-span-4';
  const ageLabel = document.createElement('label');
  ageLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
  ageLabel.textContent = 'Age';
  const ageIn = document.createElement('input');
  ageIn.type = 'number';
  ageIn.name = 'child_age[]';
  ageIn.placeholder = 'Age';
  ageIn.value = age;
  ageIn.className = 'w-full';

  Object.assign(ageIn.style, inputStyle);

  ageIn.addEventListener('focus', function() {
    this.style.outline = 'none';
    this.style.borderColor = '#2563eb';
    this.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.08)';
    this.style.transform = 'translateY(-1px)';
  });
  ageIn.addEventListener('blur', function() {
    this.style.borderColor = '#e5e7eb';
    this.style.boxShadow = '0 1px 2px rgba(16,24,40,0.03)';
    this.style.transform = 'translateY(0)';
  });

  ageDiv.appendChild(ageLabel);
  ageDiv.appendChild(ageIn);

  const removeDiv = document.createElement('div');
  removeDiv.className = 'md:col-span-2';

  const invisibleLabel = document.createElement('div');
  invisibleLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
  invisibleLabel.style.visibility = 'hidden';
  invisibleLabel.textContent = 'Action';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'inline-flex px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors w-full justify-center';
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => row.remove());

  removeDiv.appendChild(invisibleLabel);
  removeDiv.appendChild(removeBtn);

  row.appendChild(nameDiv);
  row.appendChild(ageDiv);
  row.appendChild(removeDiv);
  return row;
}

function showModal() {
  const confirmationModal = document.getElementById('confirmationModal');
  if (confirmationModal) {
    confirmationModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function hideModal() {
  const confirmationModal = document.getElementById('confirmationModal');
  if (confirmationModal) {
    confirmationModal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function submitApplication() {
  if (!applicationForm) return;

  const fd = new FormData(applicationForm);
  if (photoInput && photoInput.files[0]) fd.append('photo', photoInput.files[0]);
  if (govIdInput && govIdInput.files[0]) fd.append('govId', govIdInput.files[0]);
  if (billingInput && billingInput.files[0]) fd.append('billing', billingInput.files[0]);
  if (signatureInput && signatureInput.files[0]) fd.append('signature', signatureInput.files[0]);

  const entries = [];
  for (const [k,v] of fd.entries()) {
    if (v instanceof File) entries.push(`${k}=${v.name}`);
    else entries.push(`${k}=${v}`);
  }

  hideModal();

  if (status) {
    status.textContent = 'Submitting application...';
    status.className = 'text-sm text-blue-600';
  }

  console.log('Application submitted:', entries);

  setTimeout(() => {
    window.location.href = 'success.html';
  }, 1000);
}

function setupDropArea(dropEl, inputEl, previewEl, label) {
  if (!dropEl || !inputEl) return;
  ;['dragenter','dragover'].forEach(evt => dropEl.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); dropEl.classList.add('drag-over');
  }));
  ;['dragleave','drop'].forEach(evt => dropEl.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); dropEl.classList.remove('drag-over');
  }));
  dropEl.addEventListener('drop', (e) => {
    e.preventDefault(); e.stopPropagation();
    const dt = e.dataTransfer; if (!dt) return; const files = dt.files; if (!files || files.length === 0) return;
    try { inputEl.files = files } catch (err) { }
    const f = files[0];
    previewFile(f, previewEl, inputEl);
    if (status) status.textContent = f ? `${label} selected: ${f.name}` : '';
  });
}

function initializePageAnimation() {
  const elements = document.querySelectorAll('main > div > *');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

function initializeCongratulationsAnimation() {
  const elements = document.querySelectorAll('.bg-white > *');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 150);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  switch(currentPage) {
    case 'success.html':
      initializeSuccessPage();
      break;
    case 'form.html':
      initializeFormElements();
      setupFormEventListeners();
      break;
  }
});

function setupFormEventListeners() {
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      previewFile(f, photoPreview, photoInput);
      if (status) status.textContent = f ? `Photo selected: ${f.name}` : '';
    });
  }

  if (govIdInput) {
    govIdInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      previewFile(f, govIdPreview, govIdInput);
      if (status) status.textContent = f ? `Gov ID selected: ${f.name}` : '';
    });
  }

  if (billingInput) {
    billingInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      previewFile(f, billingPreview, billingInput);
      if (status) status.textContent = f ? `Billing proof selected: ${f.name}` : '';
    });
  }

  if (signatureInput) {
    signatureInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      previewFile(f, signaturePreview, signatureInput);
      if (status) status.textContent = f ? `Signature selected: ${f.name}` : '';
    });
  }

  if (addChildBtn && childrenList) {
    addChildBtn.addEventListener('click', () => {
      childrenList.appendChild(createChildRow());
    });
  }

  if (sameAsCheckbox) {
    sameAsCheckbox.addEventListener('change', (e) => {
      const checked = e.target.checked;
      const fields = [
        'region', 'province', 'city', 'barangay',
        'lot', 'house', 'street', 'zip'
      ];

      const additionalFields = [
        { curr: 'houseNumber', perm: 'perm_houseNumber' },
        { curr: 'unitBuilding', perm: 'perm_unitBuilding' },
        { curr: 'subdivision', perm: 'perm_subdivision' }
      ];

      fields.forEach((f) => {
        const curr = document.querySelector(`[name=curr_${f}]`);
        const perm = document.querySelector(`[name=perm_${f}]`);
        if (!curr || !perm) return;
        if (checked) {
          perm.value = curr.value;
          perm.disabled = true;
        } else {
          perm.disabled = false;
        }
      });

      additionalFields.forEach(({ curr, perm }) => {
        const currEl = document.querySelector(`[name=${curr}]`);
        const permEl = document.querySelector(`[name=${perm}]`);
        if (!currEl || !permEl) return;
        if (checked) {
          permEl.value = currEl.value;
          permEl.disabled = true;
        } else {
          permEl.disabled = false;
        }
      });

      const naCheckboxes = [
        'lotNotApplicable', 'blockNotApplicable', 'houseNotApplicable',
        'unitNotApplicable', 'subdivisionNotApplicable'
      ];

      naCheckboxes.forEach((cbName) => {
        const currCb = document.getElementById(cbName);
        const permCb = document.getElementById(`perm_${cbName}`);
        if (!currCb || !permCb) return;
        if (checked) {
          permCb.checked = currCb.checked;
          permCb.disabled = true;
        } else {
          permCb.disabled = false;
        }
      });
    });
  }

  if (certifyCheckbox && submitBtn) {
    console.log('Checkbox and submit button found, adding event listener');
    certifyCheckbox.addEventListener('change', (e) => {
      console.log('Checkbox changed, checked:', e.target.checked);
      if (e.target.checked) {
        submitBtn.disabled = false;
        submitBtn.className = 'inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer';
        console.log('Button enabled');
      } else {
        submitBtn.disabled = true;
        submitBtn.className = 'inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed';
        console.log('Button disabled');
      }
    });
  } else {
    console.log('Missing elements - certifyCheckbox:', !!certifyCheckbox, 'submitBtn:', !!submitBtn);
  }

  if (applicationForm) {
    applicationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showModal();
    });
  }

  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');
  const confirmationModal = document.getElementById('confirmationModal');

  if (confirmYes) confirmYes.addEventListener('click', submitApplication);
  if (confirmNo) confirmNo.addEventListener('click', hideModal);

  if (confirmationModal) {
    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) {
        hideModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && confirmationModal && confirmationModal.classList.contains('show')) {
      hideModal();
    }
  });

  const photoDrop = document.getElementById('photoDrop');
  const govIdDrop = document.getElementById('govIdDrop');
  const billingDrop = document.getElementById('billingDrop');
  const signatureDrop = document.getElementById('signatureDrop');

  setupDropArea(photoDrop, photoInput, photoPreview, 'Photo');
  setupDropArea(govIdDrop, govIdInput, govIdPreview, 'Gov ID');
  setupDropArea(billingDrop, billingInput, billingPreview, 'Billing');
  setupDropArea(signatureDrop, signatureInput, signaturePreview, 'Signature');
}

window.addEventListener('load', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  switch(currentPage) {
    case 'congratulations.html':
      setTimeout(createEnhancedConfetti, 800);
      initializeCongratulationsAnimation();
      break;
    default:
      initializePageAnimation();
      break;
  }
});
