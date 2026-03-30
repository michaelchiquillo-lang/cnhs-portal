const defaultData = {
  activeView: 'login',
  gradingRules: {
    quarters: 3,
    passing: 75,
    allowDecimals: true,
  },
  students: [
    {
      id: 1,
      lrn: '123456789012',
      schoolId: 'CNHS-001',
      birthdate: '2013-05-17',
      name: 'Juan Dela Cruz',
      section: 'Grade 7 - Rizal',
      average: 89.5,
      rank: 5,
      honors: 'With Honors',
      attendance: { present: 45, absent: 2, late: 1 },
      grades: [
        { subject: 'English', grade: 89, teacher: 'M. Reyes' },
        { subject: 'Mathematics', grade: 91, teacher: 'A. Santos' },
        { subject: 'Science', grade: 90, teacher: 'J. Dela Cruz' },
        { subject: 'Filipino', grade: 88, teacher: 'L. Mendoza' },
        { subject: 'Araling Panlipunan', grade: 87, teacher: 'P. Ramos' },
        { subject: 'MAPEH', grade: 92, teacher: 'R. Flores' },
      ],
    },
    {
      id: 2,
      lrn: '987654321098',
      schoolId: 'CNHS-002',
      birthdate: '2014-02-11',
      name: 'Ana Marie Cruz',
      section: 'Grade 5 - Hope',
      average: 91.2,
      rank: 2,
      honors: 'With Honors',
      attendance: { present: 46, absent: 1, late: 0 },
      grades: [
        { subject: 'English', grade: 92, teacher: 'B. Salazar' },
        { subject: 'Mathematics', grade: 90, teacher: 'C. Diaz' },
        { subject: 'Science', grade: 91, teacher: 'L. Garcia' },
        { subject: 'Filipino', grade: 90, teacher: 'T. Lopez' },
      ],
    },
  ],
  parent: {
    name: 'Maria Dela Cruz',
    childIds: [1, 2],
  },
  teacherClasses: [
    { section: 'Grade 7 - Rizal', subject: 'Mathematics', quarter: 'Quarter 2', status: 'Draft' },
    { section: 'Grade 7 - Rizal', subject: 'Science', quarter: 'Quarter 2', status: 'Submitted' },
    { section: 'Grade 8 - Bonifacio', subject: 'English', quarter: 'Quarter 2', status: 'Returned' },
  ],
  adviserQueue: [
    { title: 'Grade 7 - Rizal • Mathematics', by: 'A. Santos', status: 'Submitted' },
    { title: 'Grade 7 - Rizal • Science', by: 'J. Dela Cruz', status: 'Submitted' },
  ],
  requestTypes: [
    'Good Moral',
    'Certificate of Enrollment',
    'SF10',
    'Report Card Copy',
    'Certification of Grades',
    'Supply Request',
    'Property Issuance',
    'Asset Request'
  ],
  requests: [
    { id: 'REQ-1023', type: 'Good Moral', office: 'Guidance', requester: 'Juan Dela Cruz', childId: 1, status: 'Processing', purpose: 'Scholarship', notes: '' },
    { id: 'REQ-1011', type: 'Certificate of Enrollment', office: 'Guidance', requester: 'Maria Dela Cruz', childId: 1, status: 'Released', purpose: 'Requirements', notes: '' },
    { id: 'REQ-1008', type: 'SF10', office: 'Records', requester: 'Maria Dela Cruz', childId: 2, status: 'Under Verification', purpose: 'Transfer', notes: '' },
  ]
};

const officeByType = {
  'Good Moral': 'Guidance',
  'Certificate of Enrollment': 'Guidance',
  'SF10': 'Records',
  'Report Card Copy': 'Records',
  'Certification of Grades': 'Records',
  'Supply Request': 'Inventory',
  'Property Issuance': 'Inventory',
  'Asset Request': 'Inventory',
};

function loadData() {
  return JSON.parse(localStorage.getItem('cnhsPortalData') || 'null') || structuredClone(defaultData);
}

function saveData(data) {
  localStorage.setItem('cnhsPortalData', JSON.stringify(data));
}

let data = loadData();

const pageTitle = document.getElementById('pageTitle');
const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
const views = Array.from(document.querySelectorAll('.view'));
const openViewButtons = Array.from(document.querySelectorAll('[data-open-view]'));
const sidebar = document.getElementById('sidebar');
const mobileToggleBtn = document.getElementById('mobileToggleBtn');
const resetDataBtn = document.getElementById('resetDataBtn');
const studentGradesList = document.getElementById('studentGradesList');
const parentGradesList = document.getElementById('parentGradesList');
const parentRequestList = document.getElementById('parentRequestList');
const teacherClassesList = document.getElementById('teacherClassesList');
const adviserQueueList = document.getElementById('adviserQueueList');
const requestsList = document.getElementById('requestsList');
const requestTypeList = document.getElementById('requestTypeList');
const childSelect = document.getElementById('childSelect');
const requestChildInput = document.getElementById('requestChildInput');
const requestTypeInput = document.getElementById('requestTypeInput');
const studentNameHeading = document.getElementById('studentNameHeading');
const studentSectionHeading = document.getElementById('studentSectionHeading');
const studentAverage = document.getElementById('studentAverage');
const requestSubmittedCount = document.getElementById('requestSubmittedCount');
const requestProcessingCount = document.getElementById('requestProcessingCount');
const requestReleasedCount = document.getElementById('requestReleasedCount');

function setView(viewName) {
  data.activeView = viewName;
  saveData(data);
  views.forEach(v => v.classList.toggle('active', v.id === `view-${viewName}`));
  navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewName));
  pageTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
  if (window.innerWidth <= 900) sidebar.classList.remove('open');
}

function statusClass(status) {
  const s = status.toLowerCase();
  if (s.includes('released') || s.includes('ready')) return 'released';
  if (s.includes('verification')) return 'verification';
  if (s.includes('returned')) return 'returned';
  if (s.includes('processing') || s.includes('submitted')) return 'processing';
  if (s.includes('draft')) return 'draft';
  return 'draft';
}

function renderStudent(studentId = 1) {
  const student = data.students.find(s => s.id === studentId) || data.students[0];
  studentNameHeading.textContent = student.name;
  studentSectionHeading.textContent = student.section;
  studentAverage.textContent = student.average;
  studentGradesList.innerHTML = student.grades.map(g => `
    <div class="list-row">
      <div>
        <strong>${g.subject}</strong>
        <div class="meta">Teacher: ${g.teacher}</div>
      </div>
      <div class="badge neutral">${g.grade}</div>
    </div>
  `).join('');
}

function renderParent(selectedChildId) {
  childSelect.innerHTML = data.parent.childIds.map(id => {
    const child = data.students.find(s => s.id === id);
    return `<option value="${id}">${child.name}</option>`;
  }).join('');
  requestChildInput.innerHTML = data.parent.childIds.map(id => {
    const child = data.students.find(s => s.id === id);
    return `<option value="${id}">${child.name}</option>`;
  }).join('');

  const activeId = selectedChildId || Number(childSelect.value) || data.parent.childIds[0];
  childSelect.value = activeId;
  const child = data.students.find(s => s.id === Number(activeId));

  parentGradesList.innerHTML = child.grades.map(g => `
    <div class="list-row">
      <div>
        <strong>${g.subject}</strong>
        <div class="meta">Teacher: ${g.teacher}</div>
      </div>
      <div class="badge neutral">${g.grade}</div>
    </div>
  `).join('');

  const childRequests = data.requests.filter(r => r.childId === child.id);
  parentRequestList.innerHTML = childRequests.map(r => `
    <div class="list-row">
      <div>
        <strong>${r.type}</strong>
        <div class="meta">${r.id} • ${r.office}</div>
      </div>
      <span class="status ${statusClass(r.status)}">${r.status}</span>
    </div>
  `).join('') || '<div class="list-row"><div>No requests yet.</div></div>';
}

function renderTeacher() {
  teacherClassesList.innerHTML = data.teacherClasses.map(item => `
    <div class="list-row">
      <div>
        <strong>${item.section}</strong>
        <div class="meta">${item.subject} • ${item.quarter}</div>
      </div>
      <div class="actions">
        <span class="status ${statusClass(item.status)}">${item.status}</span>
        <button class="action-btn">Open</button>
        <button class="action-btn">Edit</button>
      </div>
    </div>
  `).join('');
}

function renderAdviser() {
  adviserQueueList.innerHTML = data.adviserQueue.map(item => `
    <div class="list-row">
      <div>
        <strong>${item.title}</strong>
        <div class="meta">Submitted by ${item.by}</div>
      </div>
      <div class="actions">
        <span class="status ${statusClass(item.status)}">${item.status}</span>
        <button class="action-btn">Approve</button>
        <button class="action-btn">Return</button>
      </div>
    </div>
  `).join('');
}

function renderRequests() {
  requestTypeInput.innerHTML = data.requestTypes.map(type => `<option value="${type}">${type}</option>`).join('');

  requestsList.innerHTML = data.requests.map(r => `
    <div class="list-row">
      <div>
        <strong>${r.type}</strong>
        <div class="meta">${r.id} • ${r.office} • Requested by ${r.requester}</div>
      </div>
      <div class="actions">
        <span class="status ${statusClass(r.status)}">${r.status}</span>
        <button class="action-btn" onclick="advanceRequest('${r.id}')">Update Status</button>
      </div>
    </div>
  `).join('');

  requestSubmittedCount.textContent = data.requests.filter(r => r.status === 'Submitted').length;
  requestProcessingCount.textContent = data.requests.filter(r => ['Processing', 'Under Verification'].includes(r.status)).length;
  requestReleasedCount.textContent = data.requests.filter(r => ['Ready for Release', 'Released'].includes(r.status)).length;
}

function renderAdmin() {
  document.getElementById('adminQuartersInput').value = data.gradingRules.quarters;
  document.getElementById('adminPassingInput').value = data.gradingRules.passing;
  document.getElementById('adminDecimalsInput').value = String(data.gradingRules.allowDecimals);

  requestTypeList.innerHTML = data.requestTypes.map(type => `
    <div class="list-row">
      <div>
        <strong>${type}</strong>
        <div class="meta">Office: ${officeByType[type] || 'Unassigned'}</div>
      </div>
    </div>
  `).join('');
}

function renderAll() {
  renderStudent();
  renderParent();
  renderTeacher();
  renderAdviser();
  renderRequests();
  renderAdmin();
  setView(data.activeView || 'login');
}

window.advanceRequest = function(id) {
  const steps = ['Submitted', 'Under Verification', 'Processing', 'Ready for Release', 'Released'];
  const req = data.requests.find(r => r.id === id);
  if (!req) return;
  const idx = steps.indexOf(req.status);
  req.status = steps[Math.min(idx + 1, steps.length - 1)] || 'Submitted';
  saveData(data);
  renderAll();
};

navButtons.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
openViewButtons.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.openView)));
mobileToggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
resetDataBtn.addEventListener('click', () => {
  localStorage.removeItem('cnhsPortalData');
  data = loadData();
  renderAll();
});

childSelect.addEventListener('change', e => renderParent(Number(e.target.value)));

document.getElementById('studentLoginBtn').addEventListener('click', () => {
  const id = document.getElementById('studentIdInput').value.trim();
  const birthdate = document.getElementById('studentBirthdateInput').value;
  const student = data.students.find(s => (s.lrn === id || s.schoolId === id) && s.birthdate === birthdate);
  if (!student) {
    alert('Sample login not found. Use CNHS-001 and 2013-05-17, or CNHS-002 and 2014-02-11.');
    return;
  }
  renderStudent(student.id);
  setView('student');
});

document.getElementById('createRequestBtn').addEventListener('click', () => {
  const type = requestTypeInput.value;
  const childId = Number(requestChildInput.value);
  const purpose = document.getElementById('requestPurposeInput').value.trim();
  const notes = document.getElementById('requestNotesInput').value.trim();
  const child = data.students.find(s => s.id === childId);
  if (!type || !child || !purpose) {
    alert('Please choose request type, child, and purpose.');
    return;
  }
  const nextNum = data.requests.length + 1009;
  data.requests.unshift({
    id: `REQ-${nextNum}`,
    type,
    office: officeByType[type] || 'Office',
    requester: data.parent.name,
    childId,
    status: 'Submitted',
    purpose,
    notes,
  });
  document.getElementById('requestPurposeInput').value = '';
  document.getElementById('requestNotesInput').value = '';
  saveData(data);
  renderAll();
  alert('Request submitted successfully.');
});

document.getElementById('saveRulesBtn').addEventListener('click', () => {
  data.gradingRules.quarters = Number(document.getElementById('adminQuartersInput').value || 3);
  data.gradingRules.passing = Number(document.getElementById('adminPassingInput').value || 75);
  data.gradingRules.allowDecimals = document.getElementById('adminDecimalsInput').value === 'true';
  saveData(data);
  alert('Grading rules saved in this browser.');
});

renderAll();
